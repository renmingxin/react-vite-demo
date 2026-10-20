import { useCallback, useRef, useSyncExternalStore } from "react";
import type { ApprovalState } from "../types";
import { useApprovalStore } from "./useApprovalStore";
import { shallowEqual, type EqualityFn } from "./equal";

interface Cache<T> {
  state: ApprovalState;
  selector: (state: ApprovalState) => T;
  value: T;
}

/**
 * 细粒度订阅：`useSyncExternalStore` + selector + 等值比较。
 *
 * 为什么不直接用 `useSyncExternalStore(store.subscribe, store.getState)`？
 * - 那样拿到的是整棵状态树，任意字段变化都会重渲染，等于把 Context 的问题换了个壳；
 * - 这里在 getSnapshot 内部做「快照缓存」：
 *   1. state 引用没变 → 直接返回上次的 derived 值（React 的比较也走不到这里）；
 *   2. state 变了但 selector 结果等价（默认浅比较 / 可传 deepEqual）→ 返回上一次的引用，
 *      React 侧 Object.is 判定相等，组件不会重渲染；
 *   3. 真正变了才返回新值。
 *
 * 关键点：`getSnapshot` 必须是同步且稳定的，否则 React 会抛
 * "The result of getSnapshot should be cached to avoid an infinite loop"。
 */
export function useStoreData<T>(
  selector: (state: ApprovalState) => T,
  isEqual: EqualityFn<T> = shallowEqual
): T {
  const store = useApprovalStore();

  const selectorRef = useRef(selector);
  const isEqualRef = useRef(isEqual);
  selectorRef.current = selector;
  isEqualRef.current = isEqual;

  const cacheRef = useRef<Cache<T> | null>(null);

  const getSnapshot = useCallback((): T => {
    const state = store.getState();
    const cached = cacheRef.current;

    // 1. 同一份快照 + 同一个 selector：直接命中
    if (cached && cached.state === state && cached.selector === selectorRef.current) {
      return cached.value;
    }

    const nextValue = selectorRef.current(state);

    // 2. 快照变了，但派生值等价：返回旧引用，阻断无效渲染
    if (cached && isEqualRef.current(cached.value, nextValue)) {
      cacheRef.current = { state, selector: selectorRef.current, value: cached.value };
      return cached.value;
    }

    cacheRef.current = { state, selector: selectorRef.current, value: nextValue };
    return nextValue;
  }, [store]);

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
