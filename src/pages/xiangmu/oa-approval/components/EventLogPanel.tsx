import { useEffect, useState } from "react";
import { App as AntdApp, Button, Empty, Space, Tag } from "antd";
import { approvalBus, createApprovalBridge } from "../core";
import { useApprovalStore } from "../store";
import Card from "./Card";
import styles from "../index.module.less";

interface LogItem {
  event: string;
  time: string;
  payload: string;
}

/**
 * 事件总线监听面板：证明「动作触发与 UI 解耦」——
 * 上下游只订阅事件，不依赖我们的组件与 hook。
 */
export default function EventLogPanel() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const store = useApprovalStore();
  const { message } = AntdApp.useApp();

  useEffect(() => {
    return approvalBus.onAny((event, payload) => {
      setLogs((prev) =>
        [
          {
            event,
            time: new Date().toLocaleTimeString("zh-CN"),
            payload: payload ? JSON.stringify(payload) : "",
          },
          ...prev,
        ].slice(0, 8)
      );
    });
  }, []);

  const invokeBridge = () => {
    // 模拟「老 BPM 页面 / 微前端宿主」通过桥接协议触发动作
    const bridge = window.__OA_APPROVAL_BRIDGE__ ?? createApprovalBridge(store);
    const opened = bridge.openAction("rollback");
    message[opened ? "success" : "warning"](
      opened
        ? `外部系统已通过桥接协议（v${bridge.version}）打开「回退」`
        : "外部系统调用被拒绝：缺少权限或动作未注册"
    );
  };

  return (
    <Card
      title="事件总线 / 跨团队对接"
      extra={
        <Button size="small" onClick={invokeBridge}>
          模拟外部系统调用
        </Button>
      }
    >
      <Space size={4} wrap style={{ marginBottom: 8 }}>
        <Tag>action:open</Tag>
        <Tag>action:before</Tag>
        <Tag>action:success</Tag>
        <Tag>action:fail</Tag>
      </Space>

      {logs.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="触发任意审批动作后查看事件流" />
      ) : (
        <div className={styles.logList}>
          {logs.map((log, index) => (
            <div key={`${log.event}-${log.time}-${index}`} className={styles.logItem}>
              <span className={styles.logTime}>{log.time}</span>
              <span className={styles.logEvent}>{log.event}</span>
              <span className={styles.logPayload}>{log.payload}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
