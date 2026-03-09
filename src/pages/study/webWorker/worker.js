// calculationWorker.js
// 这个文件会作为一个独立的 Worker 线程运行

// 监听主线程发送的消息
self.onmessage = (e) => {
  const number = e.data;

  // 执行一个耗时的计算任务
  // 计算 1 到 number 的总和
  let sum = 0;
  for (let i = 1; i <= number; i++) {
    sum += i;

    // 每计算 100 万次，稍微暂停一下，避免完全阻塞 Worker
    if (i % 1000000 === 0) {
      // 使用 setTimeout 让出一点时间，但对于真正的大计算可能效果有限
      // 更好的方式是分块计算
      const currentI = i;
      setTimeout(() => {
        continueCalculation(currentI, number, sum);
      }, 0);
      return;
    }
  }

  // 将结果发送回主线程
  self.postMessage(sum);
};

// 继续计算（用于分块处理）
function continueCalculation(start, end, currentSum) {
  let sum = currentSum;
  for (let i = start + 1; i <= end; i++) {
    sum += i;

    if (i % 1000000 === 0) {
      const currentI = i;
      setTimeout(() => {
        continueCalculation(currentI, end, sum);
      }, 0);
      return;
    }
  }

  self.postMessage(sum);
}
