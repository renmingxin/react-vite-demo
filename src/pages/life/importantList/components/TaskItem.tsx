import React, { useEffect, useMemo, useRef } from "react";
import { Checkbox, Tooltip, Tag, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  BellOutlined,
  HolderOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import { useDrag, useDrop } from "react-dnd";
import { useRecoilState } from "recoil";
import type { QuadrantKey, TaskItem as TaskItemType } from "../types";
import { DRAG_MIME, QUADRANT_MAP } from "../constants";
import { draggingTaskIdState } from "../store";
import styles from "../index.module.less";

interface DragItem {
  id: string;
  fromQuadrant: QuadrantKey;
  completed: boolean;
  index: number;
}

interface Props {
  task: TaskItemType;
  index: number; // 在当前象限列表中的序号
  onToggleComplete: (task: TaskItemType) => void;
  onEdit: (task: TaskItemType) => void;
  onDelete: (task: TaskItemType) => void;
  onMoveToTop: (task: TaskItemType) => void;
  onMoveToBottom: (task: TaskItemType) => void;
  onReorder: (
    dragIndex: number,
    hoverIndex: number,
    quadrant: QuadrantKey,
  ) => void;
  onMoveTask: (taskId: string, from: QuadrantKey, to: QuadrantKey) => void;
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
  index,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToTop,
  onMoveToBottom,
  onReorder,
  onMoveTask,
}) => {
  const status = useMemo(() => remindStatus(task.remindAt), [task.remindAt]);
  const quadrantMeta = QUADRANT_MAP[task.quadrant];
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [draggingId, setDraggingId] = useRecoilState(draggingTaskIdState);

  // —— 拖拽源：只有按住手柄才能拖 ——
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DRAG_MIME,
      item: {
        id: task.id,
        fromQuadrant: task.quadrant,
        completed: !!task.completed,
        index,
      },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [task.id, task.quadrant, task.completed, index],
  );

  // —— 放置目标：同象限内实时排序，跨象限则换分类 ——
  const [, dropRef] = useDrop(
    () => ({
      accept: DRAG_MIME,
      hover: (item: DragItem, monitor) => {
        if (!cardRef.current) return;
        if (item.id === task.id) return;
        // 跨象限不排序（换象限交给下面的 drop）
        if (item.fromQuadrant !== task.quadrant) return;
        // 完成状态不同不参与排序（已完成始终沉底）
        if (item.completed !== !!task.completed) return;

        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        // 以卡片垂直中线为界，避免临界点抖动
        const rect = cardRef.current.getBoundingClientRect();
        const middleY = (rect.bottom - rect.top) / 2;
        const offset = monitor.getClientOffset();
        if (!offset) return;
        const clientY = offset.y - rect.top;

        // 向下拖：鼠标越过中线才交换
        if (dragIndex < hoverIndex && clientY < middleY) return;
        // 向上拖：鼠标越过中线才交换
        if (dragIndex > hoverIndex && clientY > middleY) return;

        onReorder(dragIndex, hoverIndex, task.quadrant);
        item.index = hoverIndex; // 同步最新序号，避免来回抖动
      },
      drop: (item: DragItem) => {
        if (item.id === task.id) return;
        if (item.fromQuadrant !== task.quadrant) {
          // 跨象限：换分类
          onMoveTask(item.id, item.fromQuadrant, task.quadrant);
          return;
        }
        // 同象限排序已在 hover 中实时完成
      },
    }),
    [task.id, task.quadrant, task.completed, index, onReorder, onMoveTask],
  );

  // 把拖拽状态同步到全局，供所有卡片判断「是否正在拖拽」
  useEffect(() => {
    if (isDragging) {
      setDraggingId(task.id);
    } else if (draggingId === task.id) {
      setDraggingId(null);
    }
  }, [isDragging, draggingId, task.id, setDraggingId]);

  // 拖拽期间强制隐藏所有气泡（undefined 表示交还给 Tooltip 自己控制）
  const tipOpen = draggingId !== null ? false : undefined;

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
      ref={(node) => {
        cardRef.current = node;
        dragPreviewRef(node);
        dropRef(node);
      }}
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
                  placement="top"
                  open={tipOpen}
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
        {/* dragRef 绑在 Tooltip 外层，避免被 Tooltip cloneElement 覆盖 ref */}
        <span
          ref={dragRef as unknown as React.LegacyRef<HTMLSpanElement>}
          className={styles.dragHandle}
          role="button"
          aria-label="拖动"
        >
          <Tooltip
            title="按住拖拽：上下调整顺序，拖到其他象限可换分类"
            placement="top"
            open={tipOpen}
          >
            <HolderOutlined />
          </Tooltip>
        </span>
        <Tooltip title="置顶" placement="top" open={tipOpen}>
          <Button
            type="text"
            className={styles.actionBtn}
            icon={<VerticalAlignTopOutlined />}
            onClick={() => onMoveToTop(task)}
          />
        </Tooltip>
        <Tooltip title="置底" placement="top" open={tipOpen}>
          <Button
            type="text"
            className={styles.actionBtn}
            icon={<VerticalAlignBottomOutlined />}
            onClick={() => onMoveToBottom(task)}
          />
        </Tooltip>
        <Tooltip title="编辑" placement="top" open={tipOpen}>
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
