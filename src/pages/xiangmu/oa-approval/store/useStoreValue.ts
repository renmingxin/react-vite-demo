import { useRef } from "react";
import type { ApprovalState } from "../types";
import { useApprovalStore } from "./useApprovalStore";
import type { Store } from "./createStore";

/**
 * 用 Proxy 代理读取/写入，得到「永远读到最新值」的视图对象。
 *
 * 场景：点击事件、setTimeout、接口回调里读状态，不受闭包快照影响。
 *
 * ⚠️ 使用约束（团队规范，Code Review 必查）：
 * 1. 禁止在渲染顶层解构：`const { form } = useStoreValue()` 会把动态读取变成一次性快照；
 *    正确写法是在回调里 `value.form.amount`。
 * 2. 不要在渲染期间依赖它做 UI —— 它不订阅，值变了不会触发重渲染，
 *    需要驱动 UI 请用 `useStoreData(selector)`。
 */
export function useStoreValue(): ApprovalState {
  const store = useApprovalStore();
  const proxyRef = useRef<ApprovalState | null>(null);

  if (!proxyRef.current) {
    proxyRef.current = createStateProxy(store);
  }

  return proxyRef.current;
}

/**
 * 非 React 环境同样可用：bridge、事件回调、定时器里直接读最新状态。
 */
export function createStateProxy(store: Store<ApprovalState>): ApprovalState {
  return new Proxy({} as ApprovalState, {
    get(_target, prop) {
      return (store.getState() as unknown as Record<PropertyKey, unknown>)[prop];
    },
    set(_target, prop, value) {
      store.setState({ [prop as keyof ApprovalState]: value } as Partial<ApprovalState>);
      return true;
    },
    has(_target, prop) {
      return prop in store.getState();
    },
    ownKeys() {
      return Reflect.ownKeys(store.getState());
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (!(prop in store.getState())) return undefined;
      return {
        configurable: true,
        enumerable: true,
        get: () =>
          (store.getState() as unknown as Record<PropertyKey, unknown>)[prop],
      };
    },
  });
}
