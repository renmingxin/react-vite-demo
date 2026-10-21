import { useCallback, useSyncExternalStore } from "react";

/**
 * ==========================================================================
 *  订阅「浏览器 API」—— useState + useEffect 的最佳替代品
 * ==========================================================================
 *
 *  像 navigator.onLine、window.innerWidth、matchMedia 这类值，
 *  它们的「真相」在 React 之外，React 只是一个消费者。
 *
 *  传统写法：
 *      const [online, setOnline] = useState(navigator.onLine);
 *      useEffect(() => {
 *        const handler = () => setOnline(navigator.onLine);
 *        window.addEventListener("online", handler);
 *        return () => window.removeEventListener("online", handler);
 *      }, []);
 *
 *  问题：
 *    1. 服务端渲染时访问 navigator 会报错，需要额外判断；
 *    2. 首帧用 useState 的初始值，与真实值之间可能不一致；
 *    3. 每次使用都要重复写一遍事件绑定；
 *    4. 并发渲染下，事件回调里的 setState 与渲染不同步，可能出现 tearing。
 *
 *  用 useSyncExternalStore 写，就是一个「可复用的、纯读取的」hook。
 */

/* ------------------------------------------------------------------
 * 1. 网络在线状态
 * ------------------------------------------------------------------ */

// 订阅逻辑和读取逻辑都放在模块作用域 → 引用天然稳定，不会重复订阅
const subscribeOnline = (onStoreChange: () => void) => {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
};

// 返回布尔值（原始类型）→ 天然满足「快照引用稳定」的要求
const getOnlineSnapshot = () => navigator.onLine;

// SSR 时没有 navigator，给一个保守的默认值
const getOnlineServerSnapshot = () => true;

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  );
}

/* ------------------------------------------------------------------
 * 2. 窗口尺寸
 *    这个例子专门用来演示「引用稳定」：getSnapshot 返回的是对象，
 *    必须自己缓存，否则每次都会创建新对象 → 无限重渲染。
 * ------------------------------------------------------------------ */

export interface WindowSize {
  width: number;
  height: number;
}

// 模块级缓存：只在尺寸真的变化时创建新对象
let cachedWindowSize: WindowSize | null = null;

const EMPTY_WINDOW_SIZE: WindowSize = { width: 0, height: 0 };

const getWindowSizeSnapshot = (): WindowSize => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (
    cachedWindowSize === null ||
    cachedWindowSize.width !== width ||
    cachedWindowSize.height !== height
  ) {
    cachedWindowSize = { width, height };
  }

  // ★ 尺寸没变时返回的是「同一个对象」，React 才不会误判
  return cachedWindowSize;
};

const getWindowSizeServerSnapshot = () => EMPTY_WINDOW_SIZE;

const subscribeResize = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => {
    window.removeEventListener("resize", onStoreChange);
  };
};

export function useWindowSize(): WindowSize {
  return useSyncExternalStore(
    subscribeResize,
    getWindowSizeSnapshot,
    getWindowSizeServerSnapshot
  );
}

/* ------------------------------------------------------------------
 * 3. 媒体查询（响应式断点、暗色模式偏好）
 *
 *    这里的 subscribe / getSnapshot 依赖 query 参数，
 *    所以用 useCallback 包一层，保证 query 不变时引用也不变。
 * ------------------------------------------------------------------ */

const getMediaServerSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => {
        mediaQueryList.removeEventListener("change", onStoreChange);
      };
    },
    [query]
  );

  // 返回布尔值，无需额外缓存
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [
    query,
  ]);

  return useSyncExternalStore(subscribe, getSnapshot, getMediaServerSnapshot);
}
