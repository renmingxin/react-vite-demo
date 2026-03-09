import React, { useState, useRef } from "react";

// 极简版 requestIdleCallback 示例组件
const MinimalIdleExample = () => {
  // 存储任务处理日志
  const [log, setLog] = useState([]);
  // 标记是否正在处理任务
  const [isRunning, setIsRunning] = useState(false);

  // 用ref存储任务队列，避免因状态更新导致的重新渲染
  const tasksRef = useRef(["处理数据A", "处理数据B", "处理数据C", "处理数据D"]);

  // 存储requestIdleCallback返回的ID，用于取消操作
  const callbackIdRef = useRef(null);

  // 添加日志到界面
  const addLog = (message) => {
    // 记录当前时间并添加到日志
    setLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  // 任务处理函数，会在浏览器空闲时被调用
  const handleTasks = (deadline) => {
    // deadline包含两个属性：
    // timeRemaining() - 返回当前空闲周期剩余的毫秒数
    // didTimeout - 表示回调是否因超时而执行

    // 只要还有剩余时间且有任务，就继续处理
    while (deadline.timeRemaining() > 0 && tasksRef.current.length > 0) {
      // 取出一个任务
      const task = tasksRef.current.shift();
      // 记录任务完成
      addLog(`完成: ${task}`);
    }

    // 如果还有未完成的任务，继续请求下一次空闲时间
    if (tasksRef.current.length > 0) {
      callbackIdRef.current = requestIdleCallback(handleTasks);
    } else {
      // 所有任务完成
      addLog("所有任务处理完毕！");
      setIsRunning(false);
    }
  };

  // 开始处理任务
  const startTasks = () => {
    // 如果已经在运行，直接返回
    if (isRunning) return;

    // 重置状态
    setIsRunning(true);
    setLog([]);
    addLog("开始处理任务...");

    // 请求浏览器在空闲时执行任务处理函数
    // requestIdleCallback会在浏览器有空闲时间时调用我们的函数
    callbackIdRef.current = requestIdleCallback(handleTasks);
  };

  // 取消任务处理
  const cancelTasks = () => {
    // 如果有正在进行的回调，取消它
    if (callbackIdRef.current) {
      cancelIdleCallback(callbackIdRef.current);
      addLog("任务已取消");
      setIsRunning(false);
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h3>requestIdleCallback 极简示例</h3>

      {/* 控制按钮 */}
      <div>
        <button
          onClick={startTasks}
          disabled={isRunning}
          style={{ marginRight: 10 }}
        >
          开始
        </button>
        <button onClick={cancelTasks} disabled={!isRunning}>
          取消
        </button>
      </div>

      {/* 日志显示区域 */}
      <div
        style={{
          marginTop: 15,
          padding: 10,
          border: "1px solid #ccc",
          minHeight: 150,
        }}
      >
        {log.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default MinimalIdleExample;
