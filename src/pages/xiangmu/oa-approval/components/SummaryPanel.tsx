import { Descriptions, Empty } from "antd";
import {
  deepEqual,
  selectCurrentNode,
  selectDocumentCode,
  selectHandler,
  selectStatus,
  selectSubmitter,
  selectSummaryGroups,
  selectSummaryUpdatedAt,
  useStoreData,
} from "../store";
import Card from "./Card";
import { useRenderCount } from "./useRenderCount";
import styles from "../index.module.less";

/**
 * 摘要详情：BPM 下发的整包数据（groups[].items[]），用 deepEqual 做等值判断。
 * 后端每次返回新数组，但内容没变时这里不会重渲染。
 */
export default function SummaryPanel() {
  const groups = useStoreData(selectSummaryGroups, deepEqual);
  const updatedAt = useStoreData(selectSummaryUpdatedAt);
  const code = useStoreData(selectDocumentCode);
  const submitter = useStoreData(selectSubmitter);
  const handler = useStoreData(selectHandler);
  const status = useStoreData(selectStatus);
  const currentNode = useStoreData(selectCurrentNode);
  const count = useRenderCount();

  return (
    <Card title="摘要详情（summaryDetail.groups）" counter={count}>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="单号">{code}</Descriptions.Item>
        <Descriptions.Item label="发起人">{submitter}</Descriptions.Item>
        <Descriptions.Item label="当前处理人">{handler}</Descriptions.Item>
        <Descriptions.Item label="状态">{status}</Descriptions.Item>
        <Descriptions.Item label="当前节点">{currentNode}</Descriptions.Item>
      </Descriptions>

      {groups.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无摘要" />
      ) : (
        groups.map((group) => (
          <div key={group.key} className={styles.summaryGroup}>
            <div className={styles.summaryGroupTitle}>{group.title}</div>
            <Descriptions size="small" column={1}>
              {group.items.map((item) => (
                <Descriptions.Item key={item.key} label={item.label}>
                  {item.highlight ? (
                    <span className={styles.summaryHighlight}>{item.value}</span>
                  ) : (
                    item.value
                  )}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        ))
      )}

      <div className={styles.summaryUpdated}>摘要同步时间：{updatedAt}</div>
    </Card>
  );
}
