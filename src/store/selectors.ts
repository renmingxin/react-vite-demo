import { selector } from "recoil";
import { countState } from "./atoms";
import { delay } from "@/utils/tools";

// 基于 countState 计算双倍值
export const doubleCountState = selector({
  key: "doubleCountState", // 唯一标识
  get: ({ get }) => {
    const count = get(countState); // 获取依赖的原子状态
    return count * 2;
  },
});

// 异步获取数据的选择器
export const fetchDataState = selector({
  key: "fetchDataState",
  get: async ({ get }) => {
    const data = await delay(2000);
    return data;
  },
});
