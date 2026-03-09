import React, { useState, useRef, useEffect } from "react";

function RefCom() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef<any>(0);

  useEffect(() => {
    prevCountRef.current = count; // 渲染完成后更新 ref
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      当前值: {count}，上一次值: {prevCountRef.current}
    </div>
  );
}

export default RefCom;
