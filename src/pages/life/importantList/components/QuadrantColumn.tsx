import React from "react";
import { Badge, Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDrop } from "react-dnd";
import type { QuadrantKey, TaskItem as TaskItemType } from "../types";
import { DRAG_MIME, QUADRANT_MAP } from "../constants";
import TaskItem from "./TaskItem";
import styles from "../index.module.less";

interface Props {
  quadrantKey: QuadrantKey;
  tasks: TaskItemType[];
  onAdd: (q: QuadrantKey) => void;
  onEdit: (task: TaskItemType) => void;
  onDelete: (task: TaskItemType) => void;
  onToggleComplete: (task: TaskItemType) => void;
  onMoveTask: (taskId: string, from: QuadrantKey, to: QuadrantKey) => void;
  onReorder: (
    dragIndex: number,
    hoverIndex: number,
    quadrant: QuadrantKey,
  ) => void;
  onMoveToTop: (task: TaskItemType) => void;
  onMoveToBottom: (task: TaskItemType) => void;
}

const QuadrantColumn: React.FC<Props> = ({
  quadrantKey,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveTask,
  onReorder,
  onMoveToTop,
  onMoveToBottom,
}) => {
  const meta = QUADRANT_MAP[quadrantKey];

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: DRAG_MIME,
      canDrop: (item: { id: string; fromQuadrant: QuadrantKey }) =>
        item.fromQuadrant !== quadrantKey,
      drop: (item: { id: string; fromQuadrant: QuadrantKey }) => {
        onMoveTask(item.id, item.fromQuadrant, quadrantKey);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [quadrantKey, onMoveTask],
  );

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      className={`${styles.quadrantColumn} ${
        isOver && canDrop ? styles.dropActive : ""
      }`}
      style={{ background: meta.bgColor, borderColor: meta.color }}
      ref={dropRef as unknown as React.LegacyRef<HTMLDivElement>}
    >
      <div className={styles.quadrantHeader}>
        <div className={styles.quadrantTitle}>
          <span
            className={styles.quadrantIcon}
            style={{ background: meta.color, borderColor: meta.color }}
          >
            {meta.icon}
          </span>
          <div className={styles.quadrantText}>
            <div className={styles.quadrantName}>{meta.title}</div>
            <div className={styles.quadrantSubtitle}>{meta.subtitle}</div>
          </div>
          <Badge
            count={pendingCount}
            showZero
            color={meta.color}
            overflowCount={99}
            className={styles.quadrantBadge}
          />
        </div>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          style={{ background: meta.color, borderColor: meta.color }}
          onClick={() => onAdd(quadrantKey)}
        >
          新增
        </Button>
      </div>

      <div className={styles.quadrantList}>
        {tasks.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="拖入或新增事项"
            style={{ opacity: 0.6, marginTop: 24 }}
          />
        ) : (
          tasks.map((t, idx) => (
            <TaskItem
              key={t.id}
              task={t}
              index={idx}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onMoveTask={onMoveTask}
              onReorder={onReorder}
              onMoveToTop={onMoveToTop}
              onMoveToBottom={onMoveToBottom}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuadrantColumn;
