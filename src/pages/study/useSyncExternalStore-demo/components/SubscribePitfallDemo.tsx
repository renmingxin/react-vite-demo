import { useEffect, useState, useSyncExternalStore } from "react";
import { Alert, Button, Switch, Space, Tag, Typography } from "antd";
import styles from "../index.module.less";
import { churnStore } from "../stores";

const { Text } = Typography;

/* ------------------------------------------------------------------
 * 两个最经典的坑（第一个能跑，第二个只能看代码）
 * ------------------------------------------------------------------ */

const SNAPSHOT_SNIPPET = `// ❌ 坑 1：getSnapshot 每次都返回新对象
function getSnapshot() {
  return { width: window.innerWidth, height: window.innerHeight };
}

// React 开发环境会直接报错：
// "The result of getSnapshot should be cached to avoid an infinite loop"
// 因为每次读取都是新引用，React 认为数据永远在变，于是一直重渲染。

// ✅ 正确做法：变化时才创建新对象
let cached = null;
function getSnapshot() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!cached || cached.width !== width || cached.height !== height) {
    cached = { width, height };
  }
  return cached;
}`;

const SUBSCRIBE_SNIPPET = `// ❌ 坑 2：每次渲染都传入新的 subscribe 函数
function Parent() {
  const subscribe = (cb) => store.subscribe(cb); // 新函数
  return <Child subscribe={subscribe} />;
}

// React 的 effect 依赖是 [subscribe]，引用一变就
// 「先取消订阅、再重新订阅」——组件每渲染一次，订阅就抖一次。

// ✅ 正确做法：让 subscribe 引用恒定
const subscribe = store.subscribe;
function Parent() {
  return <Child subscribe={subscribe} />;
}`;

type SubscribeFn = (listener: () => void) => () => void;

/** 一个普通的订阅者组件，subscribe 由外部传进来 */
function StoreConsumer({ subscribe }: { subscribe: SubscribeFn }) {
  const { count } = useSyncExternalStore(subscribe, churnStore.getState);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>订阅者</Text>
        <Tag color="geekblue">count = {count}</Tag>
      </div>
      <Space wrap>
        <Button
          size="small"
          type="primary"
          onClick={() => churnStore.setState(count + 1)}
        >
          +1
        </Button>
        <Button size="small" onClick={() => churnStore.setState(count - 1)}>
          -1
        </Button>
      </Space>
    </div>
  );
}

/**
 * ⑤ 反例
 *
 * 「订阅抖动」是一个不会报错、但会悄悄拖慢应用的坑。
 * 打开下面的开关，然后反复点「强制重新渲染」，
 * 你会看到 subscribe 的调用次数一路飙升。
 *
 * 真实危害：
 *   - subscribe 里如果做了重活（建 WebSocket、注册全局监听、发请求），
 *     每次渲染都会重来一遍；
 *   - 订阅和取消订阅之间的空档期，可能漏掉一次状态更新。
 */
export default function SubscribePitfallDemo() {
  const [unstable, setUnstable] = useState(true);
  const [version, setVersion] = useState(0);

  // 订阅发生在 commit 之后，所以首帧读到的计数一定是 0。
  // 挂载完成后主动刷一次，让数字反映真实情况（依赖数组为空，只会跑一次，不会循环）。
  useEffect(() => {
    setVersion((v) => v + 1);
  }, []);

  // 开关打开时：每次渲染都是一个全新的函数 → 每次渲染都重新订阅
  const subscribe: SubscribeFn = unstable
    ? (listener) => churnStore.subscribe(listener)
    : churnStore.subscribe;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div className={styles.statRow}>
        <Text strong>subscribe 函数是否稳定</Text>
        <Switch
          checked={unstable}
          onChange={setUnstable}
          checkedChildren="不稳定"
          unCheckedChildren="稳定"
        />
        <Button size="small" onClick={() => setVersion((v) => v + 1)}>
          强制重新渲染
        </Button>
        <Button
          size="small"
          type="text"
          onClick={() => {
            churnStore.resetStats();
            setVersion((v) => v + 1);
          }}
        >
          重置统计
        </Button>
      </div>

      <div className={styles.statRow}>
        <Text>
          subscribe 被调用：
          <Text code>{churnStore.getSubscribeCallCount()}</Text> 次
        </Text>
        <Text>
          当前存活订阅者：
          <Text code>{churnStore.getListenerCount()}</Text> 个
        </Text>
        <Text type="secondary">（本组件已渲染 {version + 1} 次）</Text>
      </div>

      <StoreConsumer subscribe={subscribe} />

      <Alert
        type="warning"
        showIcon
        message="为什么数字不是从 1 开始？"
        description="StrictMode 下开发环境会故意执行两次「订阅 → 取消订阅」，用来暴露清理逻辑的 bug。数字会滞后一拍，因为订阅发生在 commit 之后。"
      />

      <div>
        <Text strong>坑 1：getSnapshot 返回新对象</Text>
        <pre className={styles.code}>{SNAPSHOT_SNIPPET}</pre>
      </div>

      <div>
        <Text strong>坑 2：subscribe 引用不稳定</Text>
        <pre className={styles.code}>{SUBSCRIBE_SNIPPET}</pre>
      </div>
    </Space>
  );
}
