import React from "react";
import { useSetRecoilState } from "recoil";
import ComAA from "./ComAA";
import { textState } from "../../../../store/atoms";
import styles from "../index.module.less";

function ComA() {
  console.log("ComA");
  // 仅写 userState
  const setText = useSetRecoilState(textState);
  const onChange = (event) => {
    setText(event.target.value);
  };
  return (
    <div className={styles.container}>
      <div>ComA</div>
      <input type="text" onChange={onChange} />

      <ComAA />
    </div>
  );
}

export default ComA;
