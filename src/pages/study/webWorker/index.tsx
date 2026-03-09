import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [inputValue, setInputValue] = useState("100000000");
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isWorkerSupported, setIsWorkerSupported] = useState(true);
  const workerRef = useRef(null);

  // 检查浏览器是否支持 Web Worker
  useEffect(() => {
    if (!window.Worker) {
      setIsWorkerSupported(false);
      return;
    }

    // 创建 Worker 实例
    workerRef.current = new Worker(
      new URL("./worker.js", import.meta.url)
    );

    // 监听 Worker 发送的消息
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setIsCalculating(false);
    };

    // 监听错误
    workerRef.current.onerror = (error) => {
      console.error(`Worker 错误: ${error.message}`);
      setIsCalculating(false);
    };

    // 组件卸载时终止 Worker
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // 处理计算请求
  const handleCalculate = () => {
    if (!isWorkerSupported || isCalculating) return;

    const number = parseInt(inputValue, 10);
    if (isNaN(number) || number <= 0) {
      alert("请输入有效的正整数");
      return;
    }

    setIsCalculating(true);
    setResult(null);

    // 向 Worker 发送消息
    workerRef.current.postMessage(number);
  };

  if (!isWorkerSupported) {
    return <div>您的浏览器不支持 Web Worker，无法运行此示例。</div>;
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>React Web Worker 示例</h1>
      <p>
        这个示例展示了如何在 React 中使用 Web Worker
        进行后台计算，避免阻塞主线程。只能用于计算，不能用于dom操作
      </p>

      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="numberInput">输入一个大数字:</label>
        <input
          id="numberInput"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isCalculating}
          style={{ marginLeft: "0.5rem", padding: "0.5rem", width: "150px" }}
        />
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isCalculating ? "计算中..." : "计算总和"}
        </button>
      </div>

      {isCalculating && (
        <div style={{ color: "#666" }}>正在计算，请稍候...</div>
      )}

      {result !== null && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f0f0f0",
          }}
        >
          <h3>计算结果:</h3>
          <p>
            1 到 {inputValue} 的总和是: <strong>{result}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
