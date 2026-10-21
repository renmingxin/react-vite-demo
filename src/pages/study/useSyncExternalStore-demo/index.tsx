import { Alert, Card, Space, Tag, Typography } from "antd";
import styles from "./index.module.less";

import BasicCounter from "./components/BasicCounter";
import SelectorDemo from "./components/SelectorDemo";
import BrowserApiDemo from "./components/BrowserApiDemo";
import CrossTabDemo from "./components/CrossTabDemo";
import SubscribePitfallDemo from "./components/SubscribePitfallDemo";

const { Title, Paragraph, Text } = Typography;

/**
 * ==========================================================================
 *  useSyncExternalStore 最佳实践
 * ==========================================================================
 *
 *  一句话：当「数据的真相」不在 React 里时，用它把数据接进组件。
 *
 *  它替我们解决了两代方案的老毛病：
 *    - useState + useEffect 订阅：首帧不一致、容易漏取消订阅、并发渲染下会撕裂
 *    - 全局变量 + forceUpdate：根本不可控
 *
 *  目录结构（建议配合阅读源码）：
 *    createStore.ts            极简外部 store，演示三件套契约
 *    useStore.ts               useStore / useStoreSelector / shallowEqual
 *    useBrowserState.ts        订阅浏览器 API 的三个现成 hook
 *    createLocalStorageStore.ts 跨标签页同步
 *    stores.ts                 本页用到的所有数据源
 *    components/*              五个演示
 */
export default function UseSyncExternalStoreDemo() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.badge}>React 18 · 官方 API</span>
        <Title level={3} style={{ margin: "4px 0 8px" }}>
          useSyncExternalStore 最佳实践
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          当数据的真相在 React 之外（第三方库、浏览器 API、localStorage、
          WebSocket、SDK 内部状态……），用它把数据「同步」地读进组件。
          它是 <Text code>useSelector</Text>、{" "}
          <Text code>useSyncExternalStoreWithSelector</Text>、Zustand 的底层实现。
        </Paragraph>

        <div className={styles.contract}>
          <div className={styles.contractItem}>
            <Text code>subscribe(callback)</Text>
            <Text type="secondary">
              订阅变化，必须返回「取消订阅」函数
            </Text>
          </div>
          <div className={styles.contractItem}>
            <Text code>getSnapshot()</Text>
            <Text type="secondary">读取快照，不变化时必须返回同一引用</Text>
          </div>
          <div className={styles.contractItem}>
            <Text code>getServerSnapshot()</Text>
            <Text type="secondary">可选，SSR / 水合时使用</Text>
          </div>
        </div>
      </header>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card
          className={styles.section}
          title={
            <Space>
              <Tag color="blue">①</Tag>
              基础用法：把外部 store 接进 React
            </Space>
          }
          extra={<Text type="secondary">3 行代码换一个全局 store</Text>}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <BasicCounter />
            <Alert
              type="success"
              showIcon
              message="点 A 的按钮，B 会同步变化"
              description="两个组件之间没有任何 props 传递，也没有 Provider：它们读的是同一个模块级的 store。这就是「外部数据源」的意义。"
            />
          </Space>
        </Card>

        <Card
          className={styles.section}
          title={
            <Space>
              <Tag color="green">②</Tag>
              精确订阅：selector 与 isEqual
            </Space>
          }
          extra={<Text type="secondary">看渲染次数，不看动画</Text>}
        >
          <SelectorDemo />
        </Card>

        <Card
          className={styles.section}
          title={
            <Space>
              <Tag color="cyan">③</Tag>
              订阅浏览器 API：useState + useEffect 的正统替代
            </Space>
          }
        >
          <BrowserApiDemo />
        </Card>

        <Card
          className={styles.section}
          title={
            <Space>
              <Tag color="purple">④</Tag>
              跨标签页同步：localStorage 作为数据源
            </Space>
          }
        >
          <CrossTabDemo />
        </Card>

        <Card
          className={styles.section}
          title={
            <Space>
              <Tag color="red">⑤</Tag>
              两个必踩的坑
            </Space>
          }
          extra={<Text type="secondary">getSnapshot 必须幂等</Text>}
        >
          <SubscribePitfallDemo />
        </Card>
      </Space>

      <div className={styles.footer}>
        更完整的场景清单、与 Redux / Zustand / Recoil 的取舍，见同目录下的
        README.md。
      </div>
    </div>
  );
}
