import React, { useMemo } from "react";
import { Checkbox, Tooltip, Tag, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  BellOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useDrag } from "react-dnd";
import type { TaskItem as TaskItemType } from "../types";
import { DRAG_MIME, QUADRANT_MAP } from "../constants";
import styles from "../index.module.less";

interface Props {
  task: TaskItemType;
  onToggleComplete: (task: TaskItemType) => void;
  onEdit: (task: TaskItemType) => void;
  onDelete: (task: TaskItemType) => void;
}

const formatRemind = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const remindStatus = (iso?: string) => {
  if (!iso) return "none";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "none";
  const diff = t - Date.now();
  if (diff <= 0) return "overdue";
  if (diff <= 60 * 60 * 1000) return "soon";
  return "future";
};

// CSS Module 不支持动态拼接类名，用映射表
const remindClassMap: Record<string, string> = {
  none: "",
  future: "",
  soon: styles.remindSoon,
  overdue: styles.remindOverdue,
};

const TaskItem: React.FC<Props> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const status = useMemo(() => remindStatus(task.remindAt), [task.remindAt]);
  const quadrantMeta = QUADRANT_MAP[task.quadrant];

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DRAG_MIME,
      item: { id: task.id, fromQuadrant: task.quadrant },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [task.id, task.quadrant],
  );

  const rootClass = [
    styles.taskItem,
    task.completed ? styles.isCompleted : "",
    isDragging ? styles.isDragging : "",
    remindClassMap[status] || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={dragPreviewRef as unknown as React.LegacyRef<HTMLDivElement>}
      className={rootClass}
      style={
        {
          borderLeftColor: quadrantMeta.color,
          // 卡片背景跟随象限，拖动到新象限后背景色立即变化
          "--quadrant-bg": quadrantMeta.cardBg,
        } as React.CSSProperties
      }
    >
      {/* 复选框与标题同行 */}
      <Checkbox
        checked={!!task.completed}
        onChange={() => onToggleComplete(task)}
        className={styles.taskCheck}
      />

      {/* 内容区：标题行 + 描述 */}
      <div className={styles.taskContent}>
        <div className={styles.taskTopline}>
          <span className={styles.taskTitle} title={task.title}>
            {task.title}
          </span>
          {(task.remindAt || task.notified) && (
            <span className={styles.taskTags}>
              {task.remindAt && (
                <Tooltip
                  title={
                    status === "overdue"
                      ? "已到点"
                      : status === "soon"
                        ? "1 小时内提醒"
                        : "将在指定时间提醒"
                  }
                >
                  <Tag
                    icon={<BellOutlined />}
                    color={
                      status === "overdue"
                        ? "red"
                        : status === "soon"
                          ? "orange"
                          : "blue"
                    }
                    bordered={false}
                    className={styles.remindTag}
                  >
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {formatRemind(task.remindAt)}
                  </Tag>
                </Tooltip>
              )}
              {task.notified && !task.completed && (
                <Tag
                  color="processing"
                  bordered={false}
                  className={styles.remindTag}
                >
                  已提醒
                </Tag>
              )}
            </span>
          )}
        </div>

        {task.description && (
          <div className={styles.taskDesc} title={task.description}>
            {task.description}
          </div>
        )}
      </div>

      {/* 操作区 */}
      <div className={styles.taskActions}>
        {/* dragRef 绑在 Tooltip 外层，避免被 Tooltip cloneElement 覆盖 ref 导致拖拽失效 */}
        <span
          ref={dragRef as unknown as React.LegacyRef<HTMLSpanElement>}
          className={styles.dragHandle}
          role="button"
          aria-label="拖动"
        >
          <Tooltip title="按住拖拽到其他象限重新分类" placement="top">
            <HolderOutlined />
          </Tooltip>
        </span>
        <Tooltip title="编辑" placement="top">
          <Button
            type="text"
            className={styles.actionBtn}
            icon={<EditOutlined />}
            onClick={() => onEdit(task)}
          />
        </Tooltip>
        <Popconfirm
          title="确定删除该事项？"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(task)}
          placement="top"
        >
          <Button
            type="text"
            danger
            className={styles.actionBtn}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </div>
    </div>
  );
};

export default TaskItem;
