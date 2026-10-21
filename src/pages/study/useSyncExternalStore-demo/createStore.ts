/**
 * ==========================================================================
 *  极简外部 store —— useSyncExternalStore 的「数据源」
 * ==========================================================================
 *
 *  useSyncExternalStore 只关心三件事，这三件事就是它全部的契约：
 *
 *    1. subscribe(listener)  → 订阅数据变化，并返回「取消订阅」函数
 *    2. getSnapshot()        → 读取当前快照，返回值必须「引用稳定」
 *    3. getServerSnapshot()  → 可选，SSR / 水合时使用（本文件不涉及）
 *
 *  只要你的数据源同时满足上面三点，React 就能安全地消费它。
 *  反过来说：useSyncExternalStore 并不要求你接入 React 的调度器，
 *  它只是给「React 之外的世界」开了一个标准的、只读的窗口。
 *
 *  所以本文件的意义是：先把「数据源」写好，React 那边才能用得舒服。
 *  —— 这跟 Redux / Zustand 内部做的其实是同一件事，只是它们做得更全。
 */

export type Listener = () => void;

/** setState 既支持直接给新值，也支持函数式更新（和 useState 一致） */
export type Updater<T> = T | ((prevState: T) => T);

export interface Store<T> {
  /** 读取当前快照：必须是纯函数，且在不变化时返回同一个引用 */
  getState: () => T;
  /** 写入新状态：值没变就不要通知订阅者 */
  setState: (updater: Updater<T>) => void;
  /** 订阅：返回取消订阅函数 */
  subscribe: (listener: Listener) => () => void;
}

/**
 * 创建一个最小可用的外部 store。
 *
 * 为什么不用 class / 不用发布订阅库？
 * 因为这里要突出 useSyncExternalStore 的契约本身，代码越短越好读。
 */
export function createStore<T>(initialState: T): Store<T> {
  // 状态保存在闭包里，完全脱离 React 的生命周期：
  // 组件卸载不会丢数据，多个组件可以共享同一份数据。
  let state = initialState;

  // 用 Set 存订阅者：天然去重，删除也是 O(1)
  const listeners = new Set<Listener>();

  const getState = (): T => state;

  const setState = (updater: Updater<T>): void => {
    const nextState =
      typeof updater === "function"
        ? (updater as (prevState: T) => T)(state)
        : updater;

    // ★ 关键细节 1：引用相等就当作「没有变化」，直接返回。
    //   如果每次 setState 都无脑通知，订阅者会被无意义地重渲染。
    if (Object.is(nextState, state)) return;

    state = nextState;

    // 这里故意用最简单的广播：
    // 不做「按订阅者 selector 做差分」，那是 useStoreSelector 的职责，
    // 数据源只负责「变了就喊一嗓子」。
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);

    // ★ 关键细节 2：必须返回「取消订阅」函数。
    //   React 会在组件卸载时、以及 subscribe 函数引用发生变化时调用它。
    //   如果忘了返回，就会造成订阅泄漏（内存泄漏 + 幽灵更新）。
    return () => {
      listeners.delete(listener);
    };
  };

  // 注意：getState / subscribe 在创建时就固定下来了，
  // 所以它们的引用永远不变 —— 这正是 useSyncExternalStore 最喜欢的形态。
  return { getState, setState, subscribe };
}
