import React from "react";
import { RecoilRoot } from "recoil";

import ComA from "./ComA";
import ComB from "./ComB";
import styles from "./index.module.less";

function RecoilDemo() {
  return (
    <div className={styles.container}>
      <ComA />
      <ComB />
    </div>
  );
}

export default RecoilDemo;
