// lazyLoadComponent.js
import React, { lazy, Suspense, forwardRef } from "react";

// 创建一个公共方法来懒加载组件
const LazyLoadComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  fallback = <div>loading...</div>
) => {
  const LazyComponent = lazy(importFunc);
  // 使用forwardRef来转发ref
  const ForwardedComponent = forwardRef((props: any, ref) => (
    <Suspense fallback={fallback}>
      <LazyComponent ref={ref} {...props} />
    </Suspense>
  ));

  return ForwardedComponent;
};

export default LazyLoadComponent;
