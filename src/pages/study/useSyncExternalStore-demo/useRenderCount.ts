import { useRef } from "react";

/**
 * 统计组件被渲染了多少次（仅用于教学演示，业务代码不要用）。
 *
 * 注意：本项目开启了 <StrictMode>，开发环境组件会被额外调用一次，
 * 所以首次挂载时看到的是 2 而不是 1。这是 React 故意暴露副作用问题的机制，
 * 订阅/取消订阅也会被执行两次，正好可以用来验证 subscribe 是否写对了。
 */
export function useRenderCount(): number {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
}
