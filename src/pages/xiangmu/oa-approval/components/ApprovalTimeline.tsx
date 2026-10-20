import { Empty, Timeline, Tag } from "antd";
import { deepEqual, selectTimeline, useStoreData } from "../store";
import type { TimelineStatus } from "../types";
import Card from "./Card";
import { useRenderCount } from "./useRenderCount";

const STATUS_MAP: Record<TimelineStatus, { color: string; text: string }> = {
  done: { color: "green", text: "已完成" },
  current: { color: "blue", text: "进行中" },
  pending: { color: "gray", text: "待处理" },
  rejected: { color: "red", text: "驳回" },
};

export default function ApprovalTimeline() {
  const timeline = useStoreData(selectTimeline, deepEqual);
  const count = useRenderCount();

  return (
    <Card title="流程轨迹" counter={count}>
      {timeline.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无轨迹" />
      ) : (
        <Timeline
          items={timeline.map((node) => ({
            color: STATUS_MAP[node.status].color,
            children: (
              <div>
                <div>
                  <strong>{node.title}</strong>{" "}
                  <Tag color={STATUS_MAP[node.status].color}>
                    {STATUS_MAP[node.status].text}
                  </Tag>
                </div>
                <div style={{ color: "#8c8c8c", fontSize: 12 }}>
                  {node.operator}
                  {node.time ? ` · ${node.time}` : ""}
                </div>
                {node.comment ? (
                  <div style={{ color: "#595959", fontSize: 12, marginTop: 2 }}>
                    意见：{node.comment}
                  </div>
                ) : null}
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
}
