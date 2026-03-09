import React from "react";
import { textState } from "../../../../../store/atoms";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import styles from "../../index.module.less";
import ComAAB from "./ComAAB";

function ComAA() {
  console.log("ComAA");

  const text = useRecoilValue(textState);
  return (
    <div className={styles.container}>
      <div>ComAA1111:{text}</div>
      <ComAAB />
    </div>
  );
}

export default ComAA;
