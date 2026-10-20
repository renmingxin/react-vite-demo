export type BusHandler = (payload: unknown) => void;
export type AnyHandler = (event: string, payload: unknown) => void;

export interface ApprovalEventBus {
  on: (event: string, handler: BusHandler) => () => void;
  once: (event: string, handler: BusHandler) => () => void;
  onAny: (handler: AnyHandler) => () => void;
  emit: (event: string, payload?: unknown) => void;
  clear: () => void;
}

export const APPROVAL_EVENTS = {
  actionOpen: "action:open",
  actionBefore: "action:before",
  actionSuccess: "action:success",
  actionFail: "action:fail",
  actionClose: "action:close",
} as const;

/**
 * 跨团队解耦的关键：外部系统（BPM 老页面、埋点、微前端宿主）只订阅事件，
 * 不需要 import 我们的任何 hook / 组件，也就不需要跟着我们一起发版。
 */
export function createEventBus(): ApprovalEventBus {
  const handlers = new Map<string, Set<BusHandler>>();
  const anyHandlers = new Set<AnyHandler>();

  const off = (event: string, handler: BusHandler) => {
    handlers.get(event)?.delete(handler);
  };

  const on = (event: string, handler: BusHandler) => {
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event)!.add(handler);
    return () => off(event, handler);
  };

  return {
    on,
    once(event, handler) {
      const wrapper: BusHandler = (payload) => {
        off(event, wrapper);
        handler(payload);
      };
      return on(event, wrapper);
    },
    onAny(handler) {
      anyHandlers.add(handler);
      return () => {
        anyHandlers.delete(handler);
      };
    },
    emit(event, payload) {
      // 拷贝一份，允许在回调里 off，避免遍历时集合被修改
      [...(handlers.get(event) ?? [])].forEach((handler) => handler(payload));
      [...anyHandlers].forEach((handler) => handler(event, payload));
    },
    clear() {
      handlers.clear();
      anyHandlers.clear();
    },
  };
}

/** 全局单例：一个工作台实例对应一条总线 */
export const approvalBus = createEventBus();
