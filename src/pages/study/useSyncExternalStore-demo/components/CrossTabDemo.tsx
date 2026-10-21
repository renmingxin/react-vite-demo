import { Alert, Button, Space, Tag, Typography } from "antd";
import styles from "../index.module.less";
import { sharedCounterStore } from "../stores";
import { useStore } from "../useStore";
import { useRenderCount } from "../useRenderCount";

const { Text } = Typography;

/**
 * ④ 跨标签页同步
 *
 * 这是个「useState 做不到、而 useSyncExternalStore 天然擅长」的场景：
 * 数据的真相在 localStorage 里，另一个标签页随时可能改它。
 *
 * 关键点（都实现在 createLocalStorageStore.ts 里）：
 *   1. storage 事件只在「其它标签页」写入时触发，自己写要手动通知；
 *   2. localStorage 读出来是字符串，解析结果必须缓存，否则每次都是新引用。
 */
export default function CrossTabDemo() {
  const { count } = useStore(sharedCounterStore);
  const renders = useRenderCount();

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div className={styles.panelHeader}>
        <Text strong>
          共享计数（localStorage） <Tag color="blue">渲染 {renders} 次</Tag>
        </Text>
        <Text type="secondary">刷新页面后数据依然保留</Text>
      </div>

      <div className={styles.number}>{count}</div>

      <Space wrap>
        <Button
          size="small"
          type="primary"
          onClick={() =>
            sharedCounterStore.setState((state) => ({ count: state.count + 1 }))
          }
        >
          +1
        </Button>
        <Button
          size="small"
          onClick={() =>
            sharedCounterStore.setState((state) => ({ count: state.count - 1 }))
          }
        >
          -1
        </Button>
        <Button
          size="small"
          type="text"
          onClick={() => sharedCounterStore.setState({ count: 0 })}
        >
          重置
        </Button>
      </Space>

      <Alert
        type="info"
        showIcon
        message="验证方法"
        description="把当前页面地址在第二个标签页打开，在一个标签页点 +1，另一个会自动同步。"
      />
    </Space>
  );
}
