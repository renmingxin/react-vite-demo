import { Button, Space, Tag, Typography } from "antd";
import styles from "../index.module.less";
import { counterStore } from "../stores";
import { useStore } from "../useStore";
import { useRenderCount } from "../useRenderCount";

const { Text } = Typography;

/**
 * 一个订阅者。
 *
 * 注意这里「没有任何 props 传 count」：
 * 数据直接从 React 组件树之外的 store 里读，
 * 既不需要 Provider，也不需要一层层传 props。
 */
function CounterPanel({ title, accent }: { title: string; accent?: boolean }) {
  // 一行接入外部数据源：store 变化 → 组件重渲染
  const { count } = useStore(counterStore);
  const renders = useRenderCount();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>{title}</Text>
        <Tag color={accent ? "geekblue" : "default"}>渲染 {renders} 次</Tag>
      </div>

      <div className={styles.number}>{count}</div>

      <Space wrap>
        <Button
          size="small"
          type="primary"
          onClick={() =>
            // 函数式更新，和 useState 的用法完全一致
            counterStore.setState((state) => ({ count: state.count + 1 }))
          }
        >
          +1
        </Button>
        <Button
          size="small"
          onClick={() =>
            counterStore.setState((state) => ({ count: state.count - 1 }))
          }
        >
          -1
        </Button>
        <Button
          size="small"
          type="text"
          onClick={() => counterStore.setState({ count: 0 })}
        >
          重置
        </Button>
      </Space>
    </div>
  );
}

/**
 * ① 基础用法
 *
 * 两个互不相干的组件订阅同一个 store：
 * 点 A 的按钮，B 会立刻跟着变 —— 因为它们读的是同一份 React 之外的数据。
 *
 * 这一节的重点只有一个：接入成本极低。
 * 「读一份外部数据」这件事，不需要任何框架、任何 Provider。
 */
export default function BasicCounter() {
  return (
    <div className={styles.panelGrid}>
      <CounterPanel title="订阅者 A" accent />
      <CounterPanel title="订阅者 B" />
    </div>
  );
}
