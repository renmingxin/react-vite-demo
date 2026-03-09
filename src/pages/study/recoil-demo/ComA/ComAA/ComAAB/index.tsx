import React from "react";
import { useRecoilValue } from "recoil";
import { doubleCountState } from "@/store/selectors";
import styles from "../../../index.module.less";
function ComAAB() {
  console.log("ComAAB");

  const count = useRecoilValue(doubleCountState);

  return <div className={styles.container}>ComAAB:{count}</div>;
}

export default ComAAB;
