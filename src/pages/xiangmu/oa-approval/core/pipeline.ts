import type { ActionContext, Middleware } from "../types";

/** 校验不通过：只提示，不进失败回调（属于「用户可修正」的异常） */
export class ActionBlocked extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionBlocked";
  }
}

/** 业务/接口失败：走失败回调 + 事件上报 */
export class ActionFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionFailed";
  }
}

/**
 * koa 风格中间件组合：每个动作的执行链路都是「可拔插」的。
 * 公共能力（权限、校验、防重、失败兜底）在中间件里，动作文件只写业务。
 */
export function compose(middlewares: Middleware[]) {
  return async function run(ctx: ActionContext): Promise<void> {
    let lastIndex = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= lastIndex) {
        throw new Error("next() 被重复调用：中间件必须保证只调用一次");
      }
      lastIndex = index;

      const middleware = middlewares[index];
      if (!middleware) return;

      await middleware(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);
  };
}
