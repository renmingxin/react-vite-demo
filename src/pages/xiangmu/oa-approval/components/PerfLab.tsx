import { useState } from "react";
import { Button, Space, Switch, Tag, Typography } from "antd";
import {
  selectAmount,
  selectSimulateFailure,
  useApprovalStore,
  useDispatch,
  useStoreData,
  useStoreValue,
} from "../store";
import Card from "./Card";
import { useRenderCount } from "./useRenderCount";
import styles from "../index.module.less";

/**
 * 性能 / 取值层实验台：把 tips 里的结论做成可点出来的证据。
 */
export default function PerfLab() {
  const store = useApprovalStore();
  const dispatch = useDispatch();
  const value = useStoreValue(); // 非响应式：只读最新值，不订阅
  const amount = useStoreData(selectAmount); // 响应式：用于对照闭包陷阱
  const simulateFailure = useStoreData(selectSimulateFailure);
  const [proxyResult, setProxyResult] = useState("—");
  const [closureResult, setClosureResult] = useState("—");
  const [listeners, setListeners] = useState<number | null>(null);
  const count = useRenderCount();

  const writeNoise = () => {
    dispatch.transaction(() => {
      for (let i = 0; i < 100; i += 1) {
        dispatch.patch({ perf: { noise: store.getState().perf.noise + 1 } });
      }
    });
  };

  const writeForm = () => {
    dispatch.transaction(() => {
      for (let i = 1; i <= 100; i += 1) {
        dispatch.form.patch({ amount: 100000 + i });
      }
    });
  };

  const replaceSummary = () => {
    // 模拟后端整包下发：业务层直接 replace，不做逐字段合并
    const { summaryDetail } = store.getState();
    dispatch.summaryDetail.replace({
      updatedAt: new Date().toLocaleTimeString("zh-CN"),
      groups: summaryDetail.groups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.key === "amount"
            ? { ...item, value: `¥${value.form.amount.toLocaleString()}` }
            : item
        ),
      })),
    });
  };

  const upsertSummary = () => {
    // 局部更新：只在 flow 分组里 upsert「最近操作」这一项
    dispatch.summaryDetail.upsertItem("flow", {
      key: "operator",
      label: "最近操作",
      value: `李响 · ${new Date().toLocaleTimeString("zh-CN")}`,
    });
  };

  const readFresh = () => {
    setProxyResult("读取中…");
    // 1s 后通过 Proxy 读最新状态：即使组件没有重渲染，拿到的也是新值
    setTimeout(() => setProxyResult(`¥${value.form.amount.toLocaleString()}`), 1000);
  };

  const readClosure = () => {
    const captured = amount; // 闭包快照
    setClosureResult("读取中…");
    setTimeout(() => setClosureResult(`¥${captured.toLocaleString()}`), 1000);
  };

  return (
    <Card title="性能与取值层实验台" extra={<Tag color="blue">可点验证</Tag>} counter={count}>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        先点「写无关字段 100 次」，观察上方各卡片的 <code>render ×N</code> 是否变化；
        再点「写表单字段 100 次」，只有表单区（和本实验台，因为它订阅了 amount 做对照）
        会变化，其余卡片计数保持不动。
      </Typography.Paragraph>

      <Space wrap size={8}>
        <Button onClick={writeNoise}>写无关字段 100 次（perf.noise）</Button>
        <Button onClick={writeForm}>写表单字段 100 次（form.amount）</Button>
        <Button onClick={replaceSummary}>全量替换 summaryDetail</Button>
        <Button onClick={upsertSummary}>局部 upsert 摘要项</Button>
        <Button onClick={() => setListeners(store.listenerCount())}>查看订阅者数量</Button>
        <span className={styles.labInline}>
          模拟接口失败
          <Switch
            size="small"
            checked={simulateFailure}
            onChange={(checked) => dispatch.ui.setSimulateFailure(checked)}
          />
        </span>
        {listeners !== null && <Tag>当前订阅者：{listeners} 个</Tag>}
      </Space>

      <div className={styles.labGrid}>
        <div className={styles.labBox}>
          <div className={styles.labTitle}>Proxy 取值层（useStoreValue，不订阅）</div>
          <Space size={8} wrap>
            <Button size="small" onClick={readFresh}>
              1s 后读取
            </Button>
            <span className={styles.labResult}>{proxyResult}</span>
          </Space>
        </div>

        <div className={styles.labBox}>
          <div className={styles.labTitle}>闭包快照（错误示范）</div>
          <Space size={8} wrap>
            <Button size="small" danger onClick={readClosure}>
              1s 后读取
            </Button>
            <span className={styles.labResult}>{closureResult}</span>
          </Space>
        </div>
      </div>

      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        对照实验：点击后 1s 内修改「报销金额」，Proxy 读到新值，闭包读到旧值 —— 这就是历史版本里
        提交参数错乱的根因。
      </Typography.Text>
    </Card>
  );
}
