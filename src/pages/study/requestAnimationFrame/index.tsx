import React, { useRef, useEffect, useState } from "react";

/**
 * 
 * `requestAnimationFrame` 主要用于解决 JavaScript 中动画绘制的效率和同步问题，具体来说，它解决了以下核心问题：

  1. **与浏览器刷新频率同步**  
   传统的 `setTimeout` 或 `setInterval` 动画，时间间隔是固定的（如 16ms），但实际执行时会受 JavaScript 线程阻塞、浏览器渲染时机等影响，导致动画卡顿或跳帧。  
   而 `requestAnimationFrame` 由浏览器主动调用，会与显示器的刷新频率（通常 60Hz，即每 16.7ms 一次）保持同步，确保每次绘制都在最佳时机执行，减少无效渲染。

  2. **优化性能与资源占用**  
   当页面处于后台（如切换标签页）时，`requestAnimationFrame` 会自动暂停，避免在用户不可见时浪费 CPU/GPU 资源。而 `setTimeout` 即使在后台仍会继续执行，造成不必要的性能消耗。

  3. **减少布局抖动（Layout Thrashing）**  
   浏览器渲染流程包含“布局（Layout）→ 绘制（Paint）→ 合成（Composite）”三个阶段。`requestAnimationFrame` 会将所有DOM操作集中在一次重绘周期内执行，避免频繁触发布局计算，提升动画流畅度。

  4. **简化动画逻辑**  
   它会自动传递一个时间戳参数（当前帧的绘制时间），方便开发者基于时间差计算动画进度（而非依赖固定间隔），尤其适合需要匀速运动、缓动效果的场景。

  比如在之前的移动方块示例中，使用 `requestAnimationFrame` 能确保方块的移动速度在不同设备上保持一致，且不会因浏览器繁忙而出现“卡顿跳步”的情况。这也是现代前端动画（如CSS动画、Canvas动画）优先采用的底层机制。
 */
const MovingBox = () => {
  // 用于存储动画帧ID的ref
  const animationFrameRef = useRef(null);

  // 方块的位置状态
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 移动方向和速度
  const speed = 2;
  const direction = { x: 1, y: 1 };

  // 动画函数
  const animate = (timestamp) => {
    // 如果是第一次运行，记录初始时间戳
    if (!timestamp) {
      timestamp = Date.now();
    }

    // 计算新位置
    setPosition((prev) => {
      // 获取容器尺寸
      const container = document.getElementById("animation-container");
      if (!container) return prev;

      const containerWidth = container.clientWidth - 50; // 减去方块宽度
      const containerHeight = container.clientHeight - 50; // 减去方块高度

      // 计算新的x坐标，如果到达边界则反向
      let newX = prev.x + direction.x * speed;
      if (newX <= 0 || newX >= containerWidth) {
        direction.x = -direction.x;
        newX = prev.x + direction.x * speed;
      }

      // 计算新的y坐标，如果到达边界则反向
      let newY = prev.y + direction.y * speed;
      if (newY <= 0 || newY >= containerHeight) {
        direction.y = -direction.y;
        newY = prev.y + direction.y * speed;
      }

      return { x: newX, y: newY };
    });

    // 请求下一帧动画
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 组件挂载时开始动画
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);

    // 组件卸载时取消动画
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      id="animation-container"
      style={{
        width: "100%",
        height: "400px",
        border: "2px solid #333",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "#4a90e2",
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          color: "#666",
        }}
      >
        使用requestAnimationFrame实现的动画
      </div>
    </div>
  );
};

export default MovingBox;
