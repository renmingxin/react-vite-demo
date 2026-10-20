import { useMemo } from "react";
import { Button, Dropdown, Space, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { groupActions, getVisibleActions, useActionLauncher } from "../core";
import {
  selectPending,
  selectPermission,
  shallowEqual,
  useStoreData,
} from "../store";
import type { ActionKey } from "../types";
import styles from "../index.module.less";
import { RenderCounter } from "./RenderCounter";
import { useRenderCount } from "./useRenderCount";

/**
 * 工具栏只做两件事：
 * 1. 按 permission 过滤来自注册表的动作；
 * 2. 把点击翻译成 `launch(actionKey)`。
 *
 * 新增一个审批按钮，这个文件不需要任何改动。
 */
export default function ApprovalToolbar() {
  const permission = useStoreData(selectPermission, shallowEqual);
  const pending = useStoreData(selectPending);
  const launch = useActionLauncher();
  const count = useRenderCount();

  const { primary, secondary, danger } = useMemo(
    () => groupActions(getVisibleActions(permission)),
    [permission]
  );

  return (
    <div className={styles.toolbar}>
      <Space wrap size={8}>
        {primary.map((action) => (
          <Button
            key={action.key}
            type={action.key === "agree" ? "primary" : "default"}
            icon={action.icon}
            danger={action.key === "disagree"}
            disabled={pending}
            onClick={() => launch(action.key)}
          >
            {action.label}
          </Button>
        ))}

        <Dropdown
          disabled={pending}
          menu={{
            items: secondary.map((action) => ({
              key: action.key,
              icon: action.icon,
              label: action.label,
            })),
            onClick: ({ key }) => launch(key as ActionKey),
          }}
        >
          <Button disabled={pending}>
            更多动作（{secondary.length}） <DownOutlined />
          </Button>
        </Dropdown>

        <span className={styles.toolbarDivider} />

        {danger.map((action) => (
          <Button
            key={action.key}
            danger
            type="text"
            icon={action.icon}
            disabled={pending}
            onClick={() => launch(action.key)}
          >
            {action.label}
          </Button>
        ))}
      </Space>

      <div className={styles.toolbarStatus}>
        {pending && <Spin size="small" />}
        <span>
          当前可用动作 {primary.length + secondary.length + danger.length} 个（按权限过滤）
        </span>
        <RenderCounter count={count} />
      </div>
    </div>
  );
}
