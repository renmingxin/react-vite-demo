import { useRef } from "react";

/**
 * 渲染计数器：面试演示用。
 * 订阅无关字段时，这个数字应该原地不动（StrictMode 下初次挂载会渲染两次）。
 */
export function useRenderCount(): number {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
}
