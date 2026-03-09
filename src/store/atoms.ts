import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

const countState = atom({
  key: "countState", // 唯一标识（全局唯一）
  default: 0, // 初始值
});

export { textState, countState };
