import React from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import { Input, InputNumber, Button } from "antd";

import { textState, countState } from "@/store/atoms";
import { useCounterActions } from "@/store/set";

import styles from "../index.module.less";

function ComB() {
  console.log("ComB");

  const [text, setText] = useRecoilState(textState);
  const [count, setCount] = useRecoilState(countState);
  const { increment, reset } = useCounterActions();
  const onChange = (event) => {
    setText(event.target.value);
  };
  return (
    <div className={styles.container}>
      <div>ComB</div>
      <div>textState:{text}</div>
      <div>count:{count}</div>

      <div>
        <span>textState:</span>
        <Input value={text} onChange={onChange} />
      </div>
      <div>
        <span>textState:</span>
        <InputNumber
          onChange={(num) => {
            setCount(num);
          }}
        />
        <Button
          onClick={() => {
            increment(5);
          }}
        >
          +5
        </Button>
        <Button onClick={() => {
            reset();
        }}>重置</Button>
      </div>
    </div>
  );
}

export default ComB;
