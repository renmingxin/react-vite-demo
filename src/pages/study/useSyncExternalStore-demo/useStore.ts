import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import type { Store } from "./createStore";

/**
 * ==========================================================================
 *  把「外部 store」接入 React 的两个 hook
 * ==========================================================================
 *
 *  第 1 个：全量订阅（简单、够用，但粒度粗）
 *  第 2 个：带 selector 的精确订阅（真实项目里最常用的形态）
 */

/**
 * 全量订阅：store 里任何一个字段变了，组件都会重渲染。
 *
 * 三个参数里：
 *   - subscribe、getSnapshot 本身就来自 store，引用天然稳定；
 *   - 第三个参数 getServerSnapshot 只有 SSR 才用得到，但传上不会有副作用，
 *     反而能让这个 hook 在 SSR 环境里直接可用（本 demo 是 CSR，可以省略）。
 *
 * 为什么不用 useState + useEffect 手动订阅？
 *   因为 useEffect 的订阅发生在「渲染提交之后」，中间存在一个时间窗口：
 *   如果 store 在这期间变化，组件会先用旧数据渲染一次（闪烁 / 撕裂）。
 *   useSyncExternalStore 会在渲染阶段就对齐快照，React 也专门为它做了
 *   并发渲染下的 tearing 保护。
 */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

interface SelectionCache<T, S> {
  state: T;
  selected: S;
  selector: (state: T) => S;
  isEqual: (a: S, b: S) => boolean;
}

/**
 * 带 selector 的精确订阅：只有「选出来的那一片」变了才重渲染。
 *
 * 这是 useSyncExternalStore 最容易写错的地方，核心难点只有一个：
 *   ★ getSnapshot 必须幂等 —— 同样的数据，多次调用要返回同一个引用。
 *
 * 举例：selector 写成 (s) => ({ name: s.user.name }) 时，每次调用都会
 * 产生一个新对象，React 会认为「快照一直在变」，于是无限重渲染。
 * 官方给的解法就是 useSyncExternalStoreWithSelector 里的缓存 + isEqual，
 * 下面这段就是它的简化版实现（理解了它，你就理解了 Zustand/Redux 的 selector）。
 */
export function useStoreSelector<T, S>(
  store: Store<T>,
  selector: (state: T) => S,
  isEqual: (a: S, b: S) => boolean = Object.is
): S {
  // 缓存「上一次的快照 + 上一次选出来的值」。
  // 用 ref 而不是 state：缓存是渲染的副产品，不应该触发渲染。
  const cacheRef = useRef<SelectionCache<T, S> | null>(null);

  const getSnapshot = useMemo(() => {
    return (): S => {
      const state = store.getState();
      const cache = cacheRef.current;
      // selector 也要参与比较：万一这次渲染换了 selector，
      // 旧缓存就不能再用了（否则会返回类型/含义都不对的值）。
      const sameSelector =
        cache?.selector === selector && cache?.isEqual === isEqual;

      // ① 数据源快照没变 → 直接复用上次结果，保证幂等
      if (cache && sameSelector && Object.is(cache.state, state)) {
        return cache.selected;
      }

      const nextSelected = selector(state);

      // ② selector 返回了新对象，但「逻辑相等」→ 复用旧引用，
      //    React 用 Object.is 比较，看到引用没变就不会重渲染。
      if (cache && sameSelector && isEqual(cache.selected, nextSelected)) {
        cacheRef.current = {
          state,
          selected: cache.selected,
          selector,
          isEqual,
        };
        return cache.selected;
      }

      cacheRef.current = { state, selected: nextSelected, selector, isEqual };
      return nextSelected;
    };
  }, [store, selector, isEqual]);

  // SSR 首屏没有真实数据源，用同样的 selector 算一遍即可
  const getServerSnapshot = useCallback(
    () => selector(store.getState()),
    [store, selector]
  );

  return useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 浅比较：对象/数组 selector 的标配。
 *
 * 什么时候需要它？
 *   selector 返回的是「新对象」时，例如 (s) => ({ name: s.user.name })。
 *   这时 Object.is 永远为 false，必须靠浅比较来「压住」重渲染。
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    Object.is(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}
