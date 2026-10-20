import { Tag } from "antd";
import { selectCurrentNode, selectDocumentCode, selectStatus, selectTitle, useStoreData } from "../store";
import type { DocumentStatus } from "../types";
import styles from "../index.module.less";
import { RenderCounter } from "./RenderCounter";
import { useRenderCount } from "./useRenderCount";

const STATUS_COLOR: Record<DocumentStatus, string> = {
  草稿: "default",
  审批中: "processing",
  已通过: "success",
  已驳回: "error",
  已终止: "error",
};

export default function ApprovalHeader() {
  // 4 个独立 selector：任一不相关字段变化都不会让 header 重渲染
  const title = useStoreData(selectTitle);
  const status = useStoreData(selectStatus);
  const code = useStoreData(selectDocumentCode);
  const currentNode = useStoreData(selectCurrentNode);
  const count = useRenderCount();

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.titleRow}>
          <span className={styles.docTitle}>{title}</span>
          <Tag color={STATUS_COLOR[status]}>{status}</Tag>
          <RenderCounter count={count} />
        </div>
        <div className={styles.metaRow}>
          单号 {code} · 当前节点「{currentNode}」· 处理人 李响（部门负责人）
        </div>
      </div>
      <div className={styles.headerHint}>
        运行态 · 审批工作台
        <br />
        动作由注册表驱动，工具栏不含任何业务 if/else
      </div>
    </div>
  );
}
