type Listener = () => void;

export interface Store<S> {
  getState: () => S;
  setState: (patch: Partial<S> | ((prev: S) => Partial<S>)) => void;
  subscribe: (listener: Listener) => () => void;
  /** 批量提交：N 次写入只通知一次，等价于 React 的自动批处理 */
  transaction: (fn: () => void) => void;
  listenerCount: () => number;
}

/**
 * 极简发布订阅内核：
 * - 状态放在闭包里（配合 Provider 的 useState 惰性初始化，等价于 useRef）
 * - 订阅者用 Set 存储，天然去重
 * - 不做任何字段级 diff，diff 交给 useSyncExternalStore + selector 完成
 *
 * 这样这层是完全框架无关的，单测里可以直接 new 出来跑。
 */
export function createStore<S extends object>(initialState: S): Store<S> {
  let state = initialState;
  const listeners = new Set<Listener>();

  let batchDepth = 0;
  let dirty = false;

  const flush = () => {
    listeners.forEach((listener) => listener());
  };

  const notify = () => {
    if (batchDepth > 0) {
      dirty = true;
      return;
    }
    flush();
  };

  return {
    getState: () => state,
    setState(patch) {
      const next =
        typeof patch === "function" ? patch(state) : patch;
      if (!next) return;
      state = { ...state, ...next };
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    transaction(fn) {
      batchDepth += 1;
      try {
        fn();
      } finally {
        batchDepth -= 1;
        if (batchDepth === 0 && dirty) {
          dirty = false;
          flush();
        }
      }
    },
    listenerCount: () => listeners.size,
  };
}
