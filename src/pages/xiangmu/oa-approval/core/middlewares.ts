import { detectSensitiveWords } from "../constants";
import type { ApprovalAction, Middleware } from "../types";
import { APPROVAL_EVENTS } from "./eventBus";
import { ActionBlocked, ActionFailed } from "./pipeline";

/* ------------------------------------------------------------------ *
 * 公共能力抽象：提交前 / 提交后 / 表单校验 / 意见校验 / 敏感词 /
 * 成功回调 / 失败回调 —— 动作文件里一行都不用写。
 * ------------------------------------------------------------------ */

/** 兜底：任何未捕获异常都不会让按钮卡在 loading */
export const withErrorBoundary: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ActionBlocked) {
      ctx.notify("warning", error.message);
      return;
    }

    const message =
      error instanceof ActionFailed
        ? error.message
        : error instanceof Error
          ? error.message
          : "未知异常，请稍后重试";

    ctx.dispatch.ui.setLastMessage(message);
    ctx.notify("error", message);
    ctx.emit(APPROVAL_EVENTS.actionFail, { action: ctx.action.key, message });
    ctx.action.onError?.(ctx, error);
    // 失败时保留弹窗，用户可以直接修改意见后重试；
    // 无弹窗动作没有可停留的视图，直接复位命令，避免无法重试
    if (ctx.action.view.type === "none") {
      ctx.dispatch.ui.setActiveAction(null);
    }
  }
};

/** 防重复点击 + 全局 loading（按钮 disabled 只是体验，这里才是真正的并发闸门） */
export const withPending: Middleware = async (ctx, next) => {
  if (ctx.getState().ui.pending) {
    throw new ActionBlocked("上一个操作还未完成，请稍候");
  }
  ctx.dispatch.ui.setPending(true);
  try {
    await next();
  } finally {
    ctx.dispatch.ui.setPending(false);
  }
};

/** 权限兜底：UI 过滤只是「不给看」，这里才是「不给做」 */
export const withPermission: Middleware = async (ctx, next) => {
  const permissionKey = ctx.action.permission ?? ctx.action.key;
  if (ctx.getState().permission[permissionKey] !== true) {
    throw new ActionBlocked(`没有「${ctx.action.label}」的操作权限`);
  }
  await next();
};

/** 表单校验：校验器由视图层注入（antd form.validateFields），动作层不感知表单实现 */
export const withFormValidation = (
  validate?: () => Promise<void>
): Middleware => async (_ctx, next) => {
  if (!validate) return next();
  try {
    await validate();
  } catch {
    throw new ActionBlocked("表单校验未通过，请检查必填项");
  }
  await next();
};

/** 意见必填校验：从 view 配置里推导，动作层无需重复声明 */
export const withRequiredFields: Middleware = async (ctx, next) => {
  const { view } = ctx.action;
  if (view.type === "modal") {
    for (const field of view.fields) {
      if (!field.required) continue;
      const value = ctx.payload[field.name];
      const empty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (empty) {
        throw new ActionBlocked(`「${field.label}」不能为空`);
      }
    }
  }
  await next();
};

/** 敏感词校验：合规要求，命中直接拦截（真实场景可改成「提示 + 人工复核」） */
export const withSensitiveWords: Middleware = async (ctx, next) => {
  const words = [
    ...detectSensitiveWords(ctx.payload.opinion),
    ...detectSensitiveWords(ctx.payload.reason),
  ];
  if (words.length > 0) {
    throw new ActionBlocked(`意见包含敏感词：${words.join("、")}，请修改后再提交`);
  }
  await next();
};

/** 提交前钩子：埋点、补上下文、二次确认都在这里，动作实现保持干净 */
export const withBeforeSubmit: Middleware = async (ctx, next) => {
  await ctx.action.beforeSubmit?.(ctx);
  await next();
};

/** 链路终点：执行业务逻辑，统一收敛结果 */
export const withHandler: Middleware = async (ctx) => {
  const result = await ctx.action.handler(ctx);

  if (result && result.success === false) {
    throw new ActionFailed(result.message);
  }

  await ctx.action.afterSubmit?.(ctx);

  const resultPayload = result as { message?: string } | undefined;
  const message = resultPayload?.message ?? "操作成功";
  ctx.dispatch.ui.setLastMessage(message);
  ctx.emit(APPROVAL_EVENTS.actionSuccess, { action: ctx.action.key, message });
  ctx.notify("success", message);
  await ctx.action.onSuccess?.(ctx, result);

  // 成功才关闭视图；关闭动作同样走命令，UI 层无本地状态
  ctx.dispatch.ui.setActiveAction(null);
};

export interface PipelineOptions {
  validate?: () => Promise<void>;
}

/**
 * 顺序即语义：错误兜底 → 并发闸门 → 权限 → 表单 → 必填 → 敏感词
 * → 动作私有中间件 → 提交前 → 业务实现。
 */
export function buildMiddlewares(
  action: ApprovalAction,
  options: PipelineOptions = {}
): Middleware[] {
  return [
    withErrorBoundary,
    withPending,
    withPermission,
    withFormValidation(options.validate),
    withRequiredFields,
    withSensitiveWords,
    ...(action.middlewares ?? []),
    withBeforeSubmit,
    withHandler,
  ];
}
