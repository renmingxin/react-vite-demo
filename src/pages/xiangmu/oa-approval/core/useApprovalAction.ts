import { useCallback } from "react";
import { App as AntdApp } from "antd";
import { approvalApi } from "../services/approvalApi";
import { selectPending } from "../store/selectors";
import { useApprovalStore } from "../store/useApprovalStore";
import { useDispatch } from "../store/useDispatch";
import { useStoreData } from "../store/useStoreData";
import { useStoreValue } from "../store/useStoreValue";
import type {
  ActionContext,
  ActionKey,
  ActionPayload,
  ApprovalAction,
  NotifyFn,
} from "../types";
import { approvalBus, APPROVAL_EVENTS } from "./eventBus";
import { buildMiddlewares } from "./middlewares";
import { compose } from "./pipeline";
import { getAction } from "./registry";

export interface RunOptions {
  /** 表单校验器由视图注入，公共中间件负责拦截与提示 */
  validate?: () => Promise<void>;
}

/**
 * 动作执行器：把「一个动作」需要的公共能力全部组装好。
 * 动作文件只写 handler，视图层只拿到 run / pending。
 */
export function useApprovalAction(action: ApprovalAction | null) {
  const store = useApprovalStore();
  const dispatch = useDispatch();
  const pending = useStoreData(selectPending);
  const { message } = AntdApp.useApp();

  const notify = useCallback<NotifyFn>(
    (type, content) => {
      message[type](content);
    },
    [message]
  );

  const run = useCallback(
    async (payload: ActionPayload = {}, options: RunOptions = {}) => {
      if (!action) return;

      const ctx: ActionContext = {
        action,
        payload,
        // 注意：这里传的是函数而不是快照，handler 里读到的永远是最新值
        getState: store.getState,
        dispatch,
        api: approvalApi,
        notify,
        emit: approvalBus.emit,
      };

      ctx.emit(APPROVAL_EVENTS.actionBefore, { action: action.key });

      await compose(buildMiddlewares(action, options))(ctx);
    },
    [action, store, dispatch, notify]
  );

  return { run, pending };
}

/**
 * 工具栏只做一件事：把用户意图翻译成「激活哪个动作」。
 * 具体是开弹窗还是直接执行，由动作自己的 view 决定。
 */
export function useActionLauncher() {
  const dispatch = useDispatch();
  const store = useApprovalStore();
  // 非响应式读取：点击回调里判断权限，不需要让工具栏订阅权限字段
  const state = useStoreValue();
  const { message } = AntdApp.useApp();

  return useCallback(
    (key: ActionKey) => {
      const action = getAction(key);
      if (!action) {
        message.error(`动作 ${key} 未注册`);
        return;
      }

      if (state.permission[action.permission ?? action.key] !== true) {
        message.warning(`没有「${action.label}」的操作权限`);
        return;
      }

      dispatch.ui.setActiveAction(key);
      approvalBus.emit(APPROVAL_EVENTS.actionOpen, {
        action: key,
        view: action.view.type,
        handlerCount: store.listenerCount(),
      });
    },
    [dispatch, message, state, store]
  );
}
