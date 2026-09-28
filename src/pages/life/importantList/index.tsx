import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, message, Tooltip } from "antd";
import {
  PlusOutlined,
  NotificationOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./index.module.less";

import {
  tasksState,
  tasksByQuadrantSelector,
  taskStatsSelector,
} from "./store";
import type {
  QuadrantKey,
  TaskFormValues,
  TaskItem,
} from "./types";
import { QUADRANTS } from "./constants";
import { genId } from "./utils/storage";
import { useReminderWatcher, ensureNotificationPermission } from "./hooks/useReminder";
import TaskFormModal from "./components/TaskFormModal";
import QuadrantColumn from "./components/QuadrantColumn";

const ImportantList: React.FC = () => {
  // 全局任务状态
  const [, setTasks] = useRecoilState(tasksState);
  const grouped = useRecoilValue(tasksByQuadrantSelector);
  const stats = useRecoilValue(taskStatsSelector);

  // 启动后台提醒巡检
  useReminderWatcher();

  // 编辑/新增模态
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | undefined>(undefined);
  const [defaultQuadrant, setDefaultQuadrant] = useState<
    QuadrantKey | undefined
  >(undefined);

  // 提醒弹窗队列
  const [reminderQueue, setReminderQueue] = useState<TaskItem[]>([]);

  // 监听 reminder 事件
  useEffect(() => {
    const onReminder = (e: Event) => {
      const detail = (e as CustomEvent<TaskItem>).detail;
      setReminderQueue((q) => [...q, detail]);
    };
    const onMarkNotified = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, notified: true, updatedAt: new Date().toISOString() } : t,
        ),
      );
    };
    window.addEventListener("importantList:reminder", onReminder);
    window.addEventListener("importantList:markNotified", onMarkNotified);
    return () => {
      window.removeEventListener("importantList:reminder", onReminder);
      window.removeEventListener("importantList:markNotified", onMarkNotified);
    };
  }, [setTasks]);

  // 当前正在展示的提醒弹窗
  const currentReminder = reminderQueue[0];

  // 新增
  const handleAdd = useCallback((q?: QuadrantKey) => {
    setEditing(undefined);
    setDefaultQuadrant(q);
    setModalOpen(true);
  }, []);

  // 编辑
  const handleEdit = useCallback((task: TaskItem) => {
    setEditing(task);
    setDefaultQuadrant(undefined);
    setModalOpen(true);
  }, []);

  // 删除
  const handleDelete = useCallback(
    (task: TaskItem) => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      message.success("已删除");
    },
    [setTasks],
  );

  // 切换完成
  const handleToggleComplete = useCallback(
    (task: TaskItem) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                completed: !t.completed,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
    },
    [setTasks],
  );

  // 拖拽跨象限
  const handleMoveTask = useCallback(
    (taskId: string, _from: QuadrantKey, to: QuadrantKey) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                quadrant: to,
                // 切换象限后，允许再次提醒
                notified: false,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
      message.success("已转移到新象限");
    },
    [setTasks],
  );

  // 提交表单
  const handleSubmit = useCallback(
    (values: TaskFormValues, editingId?: string) => {
      const now = new Date().toISOString();
      if (editingId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  ...values,
                  // 如果修改了提醒时间，认为应重新通知
                  notified: false,
                  updatedAt: now,
                }
              : t,
          ),
        );
        message.success("已保存修改");
      } else {
        const item: TaskItem = {
          id: genId(),
          title: values.title,
          description: values.description,
          quadrant: values.quadrant,
          remindAt: values.remindAt,
          notified: false,
          completed: false,
          createdAt: now,
          updatedAt: now,
        };
        setTasks((prev) => [item, ...prev]);
        message.success("已新增");
      }
      setModalOpen(false);
      setEditing(undefined);
    },
    [setTasks],
  );

  // 清空已完成
  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    message.success("已清除已完成事项");
  }, [setTasks]);

  // 请求通知权限
  const handleRequestNotification = useCallback(async () => {
    const res = await ensureNotificationPermission();
    if (res === "granted") message.success("已开启浏览器通知");
    else if (res === "denied")
      message.warning("通知权限被拒绝，请到浏览器站点设置中开启");
    else if (res === "unsupported")
      message.warning("当前浏览器不支持系统通知");
  }, []);

  // 排序象限展示：左下、右下、左上、右上（视觉上紧急的放上面）
  const orderedQuadrants = useMemo(() => {
    const order: QuadrantKey[] = [
      "urgentImportant",
      "urgentNotImportant",
      "importantNotUrgent",
      "notUrgentNotImportant",
    ];
    return QUADRANTS.filter((q) => order.includes(q.key)).sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.title}>📋 四象限事项列表</h2>
            <div className={styles.desc}>
              基于艾森豪威尔矩阵：先做重要且紧急的事，把时间投资在重要不紧急的事上。
            </div>
          </div>
          <div className={styles.stats}>
            <span className={styles.statItem}>总计 {stats.total}</span>
            <span className={styles.statItem}>待办 {stats.pending}</span>
            <span className={styles.statItem}>已完成 {stats.completed}</span>
            <span className={styles.statItem}>待提醒 {stats.remind}</span>
          </div>
          <div className={styles.actions}>
            <Tooltip title="开启浏览器系统通知">
              <Button
                icon={<NotificationOutlined />}
                onClick={handleRequestNotification}
              >
                通知权限
              </Button>
            </Tooltip>
            <Tooltip title="清除所有已完成的事项">
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearCompleted}
                disabled={stats.completed === 0}
              >
                清除已完成
              </Button>
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd()}
            >
              新增事项
            </Button>
          </div>
        </div>

        <div className={styles.matrix}>
          {orderedQuadrants.map((q) => (
            <QuadrantColumn
              key={q.key}
              quadrantKey={q.key}
              tasks={grouped[q.key]}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>

        <TaskFormModal
          open={modalOpen}
          editing={editing}
          defaultQuadrant={defaultQuadrant}
          onCancel={() => {
            setModalOpen(false);
            setEditing(undefined);
          }}
          onSubmit={handleSubmit}
        />

        <Modal
          open={!!currentReminder}
          title="⏰ 事项提醒"
          okText="知道了"
          cancelText="推迟 5 分钟"
          onCancel={() => {
            if (!currentReminder) return;
            const next = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            setTasks((prev) =>
              prev.map((t) =>
                t.id === currentReminder.id
                  ? {
                      ...t,
                      remindAt: next,
                      notified: false,
                      updatedAt: new Date().toISOString(),
                    }
                  : t,
              ),
            );
            setReminderQueue((q) => q.slice(1));
            message.success("已推迟 5 分钟");
          }}
          onOk={() => setReminderQueue((q) => q.slice(1))}
        >
          {currentReminder && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {currentReminder.title}
              </div>
              {currentReminder.description && (
                <div style={{ marginTop: 8, color: "#595959" }}>
                  {currentReminder.description}
                </div>
              )}
              <div style={{ marginTop: 12, color: "#8c8c8c", fontSize: 12 }}>
                原定时间：
                {currentReminder.remindAt &&
                  new Date(currentReminder.remindAt).toLocaleString()}
              </div>
              {reminderQueue.length > 1 && (
                <div style={{ marginTop: 8, color: "#faad14", fontSize: 12 }}>
                  还有 {reminderQueue.length - 1} 条提醒待查看
                </div>
              )}
            </div>
          )}
        </Modal>

      </div>
    </DndProvider>
  );
};

export default ImportantList;
