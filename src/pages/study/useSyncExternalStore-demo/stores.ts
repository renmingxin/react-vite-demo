import { createStore } from "./createStore";
import { createLocalStorageStore } from "./createLocalStorageStore";

/**
 * ==========================================================================
 *  演示用的数据源（全部放在 React 之外）
 * ==========================================================================
 *
 *  模块级单例：不依赖 Provider，组件 import 进来就能用。
 *  这也是 useSyncExternalStore 相对 Context 方案的一大优势：
 *  不需要在组件树里包一层 Provider，天然就是「全局」的。
 */

/* ---------------------------------------------------------------
 * ① 基础示例：一个极简计数器
 * --------------------------------------------------------------- */
export interface CounterState {
  count: number;
}

export const counterStore = createStore<CounterState>({ count: 0 });

/* ---------------------------------------------------------------
 * ② selector 示例：一个「多切片」的状态
 *    用来对比「全量订阅」与「精确订阅」的渲染差异
 * --------------------------------------------------------------- */
export interface ProfileState {
  user: {
    name: string;
    level: number;
  };
  todos: string[];
}

export const profileStore = createStore<ProfileState>({
  user: { name: "小明", level: 1 },
  todos: ["先读懂 getSnapshot 的缓存要求"],
});

/* ---------------------------------------------------------------
 * ③ 跨标签页示例：计数写在 localStorage 里
 * --------------------------------------------------------------- */
export const sharedCounterStore = createLocalStorageStore<CounterState>(
  "useSyncExternalStore-demo:shared-counter",
  { count: 0 }
);

/* ---------------------------------------------------------------
 * ④ 反例示例：带「订阅次数统计」的 store
 *    用来观察 subscribe 引用不稳定会造成什么后果
 * --------------------------------------------------------------- */
export interface InstrumentedStore {
  getState: () => CounterState;
  setState: (count: number) => void;
  subscribe: (listener: () => void) => () => void;
  /** 一共被调用过多少次 subscribe */
  getSubscribeCallCount: () => number;
  /** 当前存活的订阅者数量 */
  getListenerCount: () => number;
  /** 重置统计（不影响存活的订阅者） */
  resetStats: () => void;
}

export function createInstrumentedStore(): InstrumentedStore {
  let state: CounterState = { count: 0 };
  let subscribeCallCount = 0;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (count: number) => {
    if (count === state.count) return;
    state = { count };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    subscribeCallCount += 1;
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    setState,
    subscribe,
    getSubscribeCallCount: () => subscribeCallCount,
    getListenerCount: () => listeners.size,
    resetStats: () => {
      subscribeCallCount = listeners.size;
    },
  };
}

export const churnStore = createInstrumentedStore();
