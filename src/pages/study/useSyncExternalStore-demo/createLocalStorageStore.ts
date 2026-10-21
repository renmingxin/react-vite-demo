import type { Listener, Store, Updater } from "./createStore";

/**
 * ==========================================================================
 *  基于 localStorage 的 store —— 「跨标签页」同步
 * ==========================================================================
 *
 *  这是 useSyncExternalStore 最典型的真实场景之一：
 *  React 之外存在一份数据（localStorage），而且它会被「别的标签页」修改。
 *
 *  两个知识点：
 *    1. storage 事件只在「其它标签页」写入时触发，当前标签页写入不会触发。
 *       所以当前标签页写入后要自己手动 notify 一次。
 *    2. 读取 localStorage 得到的是字符串，JSON.parse 每次都产生新对象。
 *       必须自己缓存，否则 getSnapshot 每次返回新引用 → 无限重渲染。
 */
export function createLocalStorageStore<T>(
  key: string,
  defaultValue: T
): Store<T> {
  const listeners = new Set<Listener>();

  // 缓存原始字符串 + 解析后的对象。
  // 判断「有没有变化」用字符串比较，比对象比较更便宜也更可靠。
  let hasCache = false;
  let cachedRaw: string | null = null;
  let cachedValue: T = defaultValue;

  const read = (): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      // 隐私模式 / 存储被禁用时，localStorage 访问会抛异常
      raw = null;
    }

    // ★ 原始字符串没变 → 直接返回缓存值，引用保持不变
    if (hasCache && raw === cachedRaw) return cachedValue;

    hasCache = true;
    cachedRaw = raw;

    if (raw === null) {
      cachedValue = defaultValue;
    } else {
      try {
        cachedValue = JSON.parse(raw) as T;
      } catch {
        cachedValue = defaultValue;
      }
    }

    return cachedValue;
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);

    const onStorage = (event: StorageEvent) => {
      // event.key === null 表示 localStorage.clear()
      if (event.key === key || event.key === null) {
        listener();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const setState = (updater: Updater<T>): void => {
    const prev = read();
    const next =
      typeof updater === "function"
        ? (updater as (prevState: T) => T)(prev)
        : updater;

    const raw = JSON.stringify(next);
    if (raw === cachedRaw) return;

    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // 写入失败（超出配额等）时不做处理，演示场景够用了
    }

    // 当前标签页不会收到 storage 事件，这里手动同步缓存并广播
    hasCache = true;
    cachedRaw = raw;
    cachedValue = next;
    listeners.forEach((listener) => listener());
  };

  return { getState: read, setState, subscribe };
}
