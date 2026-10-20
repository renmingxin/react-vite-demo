import { createStateProxy } from "../store/useStoreValue";
import type { Store } from "../store/createStore";
import type { ActionKey, ApprovalState } from "../types";
import { approvalBus, APPROVAL_EVENTS } from "./eventBus";
import { getAction } from "./registry";

/**
 * 对外开放的桥接协议。
 *
 * 背景：审批动作的触发方式不能依赖 UI 层 —— 老 BPM 页面、微前端宿主、
 * 甚至是另一个 iframe 里的系统，都应该能通过「命令 + 事件」驱动审批动作，
 * 而不是复制一套按钮代码，或依赖我们的内部 Context。
 */
export interface ApprovalBridge {
  version: string;
  /** 外部系统发起一个审批动作（等价于点击工具栏按钮） */
  openAction: (key: ActionKey) => boolean;
  /** 只读快照（非响应式） */
  getSnapshot: () => ApprovalState;
  /** 订阅状态变更，返回取消订阅函数 */
  onChange: (listener: () => void) => () => void;
}

export function createApprovalBridge(store: Store<ApprovalState>): ApprovalBridge {
  // 用 Proxy 取值：外部回调里拿到的永远是最新数据，不受创建时闭包影响
  const state = createStateProxy(store);

  return {
    version: "1.0.0",
    openAction(key) {
      const action = getAction(key);
      if (!action) return false;
      if (state.permission[action.permission ?? action.key] !== true) return false;

      store.setState((prev) => ({ ui: { ...prev.ui, activeAction: key } }));
      approvalBus.emit(APPROVAL_EVENTS.actionOpen, { action: key, from: "bridge" });
      return true;
    },
    getSnapshot: store.getState,
    onChange: (listener) => store.subscribe(listener),
  };
}

declare global {
  interface Window {
    __OA_APPROVAL_BRIDGE__?: ApprovalBridge;
  }
}
