import { useRecoilCallback } from "recoil";
import { countState } from "./atoms";
// 在组件中使用的自定义 Hook
function useCounterActions() {
  const increment = useRecoilCallback(
    ({ set }) =>
      (amount: number) => {
        set(countState, (prevCount) => prevCount + amount);
      },
    []
  );

  const reset = useRecoilCallback(
    ({ set }) =>
      () => {
        set(countState, 0);
      },
    []
  );

  return { increment, reset };
}
export { useCounterActions };
