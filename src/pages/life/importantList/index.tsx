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
  categoriesState,
  activeCategoryIdState,
  tasksByQuadrantSelector,
  taskStatsSelector,
  categoryCountsSelector,
} from "./store";
import type {
  Category,
  CategoryFormValues,
  QuadrantKey,
  TaskFormValues,
  TaskItem,
} from "./types";
import { QUADRANTS } from "./constants";
import { genId } from "./utils/storage";
import { reorderQuadrant, reorderByIndex } from "./utils/reorder";
import {
  useReminderWatcher,
  ensureNotificationPermission,
} from "./hooks/useReminder";
import TaskFormModal from "./components/TaskFormModal";
import QuadrantColumn from "./components/QuadrantColumn";
import CategoryBar from "./components/CategoryBar";
import CategoryModal from "./components/CategoryModal";

const ImportantList: React.FC = () => {
  // 全局状态
  const [, setTasks] = useRecoilState(tasksState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [activeCategoryId, setActiveCategoryId] = useRecoilState(
    activeCategoryIdState,
  );
  const grouped = useRecoilValue(tasksByQuadrantSelector);
  const stats = useRecoilValue(taskStatsSelector);
  const counts = useRecoilValue(categoryCountsSelector);

  // 启动后台提醒巡检（扫描所有分类，切到其他分类也能收到提醒）
  useReminderWatcher();

  // 编辑/新增事项模态
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | undefined>(undefined);
  const [defaultQuadrant, setDefaultQuadrant] = useState<
    QuadrantKey | undefined
  >(undefined);

  // 分类新建/编辑模态
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );

  // 提醒弹窗队列
  const [reminderQueue, setReminderQueue] = useState<TaskItem[]>([]);

  // 当前分类被删除/失效时，回退到第一个可用分类
  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId, setActiveCategoryId]);

  // 监听提醒事件
  useEffect(() => {
    const onReminder = (e: Event) => {
      const detail = (e as CustomEvent<TaskItem>).detail;
      setReminderQueue((q) => [...q, detail]);
    };
    const onMarkNotified = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, notified: true, updatedAt: new Date().toISOString() }
            : t,
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

  const currentReminder = reminderQueue[0];
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  // ---------------- 事项操作 ----------------
  const handleAdd = useCallback((q?: QuadrantKey) => {
    setEditing(undefined);
    setDefaultQuadrant(q);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((task: TaskItem) => {
    setEditing(task);
    setDefaultQuadrant(undefined);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (task: TaskItem) => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      message.success("已删除");
    },
    [setTasks],
  );

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

  const handleMoveTask = useCallback(
    (taskId: string, _from: QuadrantKey, to: QuadrantKey) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                quadrant: to,
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

  const handleReorder = useCallback(
    (dragIndex: number, hoverIndex: number, quadrant: QuadrantKey) => {
      setTasks((prev) =>
        reorderByIndex(prev, activeCategoryId, quadrant, dragIndex, hoverIndex),
      );
    },
    [setTasks, activeCategoryId],
  );

  const handleMoveToTop = useCallback(
    (task: TaskItem) => {
      setTasks((prev) => reorderQuadrant(prev, task.id, "top"));
      message.success("已置顶");
    },
    [setTasks],
  );

  const handleMoveToBottom = useCallback(
    (task: TaskItem) => {
      setTasks((prev) => reorderQuadrant(prev, task.id, "bottom"));
      message.success("已置底");
    },
    [setTasks],
  );

  const handleSubmit = useCallback(
    (values: TaskFormValues, editingId?: string) => {
      const now = new Date().toISOString();
      if (editingId) {
        let movedToName: string | undefined;
        setTasks((prev) => {
          const target = prev.find((t) => t.id === editingId);
          if (!target) return prev;

          const nextCategoryId = values.categoryId || target.categoryId;
          const categoryChanged = nextCategoryId !== target.categoryId;

          // 换了分类：序号要按新分类重新算，排到新分类该象限最前
          let nextOrder = target.order;
          if (categoryChanged) {
            const peers = prev.filter(
              (t) =>
                t.categoryId === nextCategoryId &&
                t.quadrant === target.quadrant,
            );
            nextOrder =
              peers.reduce((min, t) => Math.min(min, t.order ?? 0), 0) - 1;
            movedToName = categories.find((c) => c.id === nextCategoryId)?.name;
          }

          return prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  title: values.title,
                  description: values.description,
                  categoryId: nextCategoryId,
                  // 象限保持锁定，不随表单变化
                  quadrant: t.quadrant,
                  remindAt: values.remindAt,
                  order: nextOrder,
                  notified: false,
                  updatedAt: now,
                }
              : t,
          );
        });
        message.success(
          movedToName ? `已移动到「${movedToName}」分类` : "已保存修改",
        );
      } else {
        setTasks((prev) => {
          // 排在当前分类当前象限最前
          const peers = prev.filter(
            (t) =>
              t.categoryId === activeCategoryId &&
              t.quadrant === values.quadrant,
          );
          const minOrder = peers.reduce(
            (min, t) => Math.min(min, t.order ?? 0),
            0,
          );
          const item: TaskItem = {
            id: genId("t"),
            title: values.title,
            description: values.description,
            categoryId: activeCategoryId,
            quadrant: values.quadrant,
            remindAt: values.remindAt,
            notified: false,
            completed: false,
            order: minOrder - 1,
            createdAt: now,
            updatedAt: now,
          };
          return [item, ...prev];
        });
        message.success("已新增");
      }
      setModalOpen(false);
      setEditing(undefined);
    },
    [setTasks, activeCategoryId, categories],
  );

  // 只清除「当前分类」的已完成事项
  const handleClearCompleted = useCallback(() => {
    setTasks((prev) =>
      prev.filter((t) => !(t.categoryId === activeCategoryId && t.completed)),
    );
    message.success("已清除本分类的已完成事项");
  }, [setTasks, activeCategoryId]);

  const handleRequestNotification = useCallback(async () => {
    const res = await ensureNotificationPermission();
    if (res === "granted") message.success("已开启浏览器通知");
    else if (res === "denied")
      message.warning("通知权限被拒绝，请到浏览器站点设置中开启");
    else if (res === "unsupported")
      message.warning("当前浏览器不支持系统通知");
  }, []);

  // ---------------- 分类操作 ----------------
  const handleSelectCategory = useCallback(
    (id: string) => setActiveCategoryId(id),
    [setActiveCategoryId],
  );

  const handleCreateCategory = useCallback(() => {
    setEditingCategory(undefined);
    setCatModalOpen(true);
  }, []);

  const handleRenameCategory = useCallback((cat: Category) => {
    setEditingCategory(cat);
    setCatModalOpen(true);
  }, []);

  const handleSubmitCategory = useCallback(
    (values: CategoryFormValues, editingId?: string) => {
      if (editingId) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? { ...c, name: values.name, color: values.color }
              : c,
          ),
        );
        message.success("已保存分类");
      } else {
        const item: Category = {
          id: genId("cat"),
          name: values.name,
          color: values.color,
          createdAt: new Date().toISOString(),
        };
        setCategories((prev) => [...prev, item]);
        setActiveCategoryId(item.id);
        message.success("已创建分类");
      }
      setCatModalOpen(false);
      setEditingCategory(undefined);
    },
    [setCategories, setActiveCategoryId],
  );

  const handleDeleteCategory = useCallback(
    (cat: Category) => {
      if (categories.length <= 1) {
        message.warning("至少需要保留一个分类");
        return;
      }
      const count = counts[cat.id] || 0;
      Modal.confirm({
        title: `删除分类「${cat.name}」？`,
        content:
          count > 0
            ? `该分类下的 ${count} 个事项也会一并删除，且不可恢复。`
            : "该分类下暂无事项。",
        okText: "删除",
        okButtonProps: { danger: true },
        cancelText: "取消",
        onOk: () => {
          setCategories((prev) => prev.filter((c) => c.id !== cat.id));
          setTasks((prev) => prev.filter((t) => t.categoryId !== cat.id));
          if (activeCategoryId === cat.id) {
            const rest = categories.filter((c) => c.id !== cat.id);
            if (rest.length) setActiveCategoryId(rest[0].id);
          }
          message.success("已删除分类");
        },
      });
    },
    [
      categories,
      counts,
      activeCategoryId,
      setCategories,
      setTasks,
      setActiveCategoryId,
    ],
  );

  // 象限展示顺序：紧急的放上面
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
            <Tooltip title="清除当前分类已完成的事项">
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

        {/* 分类切换栏 */}
        <CategoryBar
          categories={categories}
          activeId={activeCategoryId}
          counts={counts}
          onSelect={handleSelectCategory}
          onCreate={handleCreateCategory}
          onRename={handleRenameCategory}
          onDelete={handleDeleteCategory}
        />

        {/* 当前分类提示 */}
        {activeCategory && (
          <div className={styles.currentCategoryHint}>
            <span
              className={styles.hintDot}
              style={{ background: activeCategory.color }}
            />
            当前分类：<b>{activeCategory.name}</b>
            <span className={styles.hintSub}>
              （共 {counts[activeCategory.id] || 0} 个事项）
            </span>
          </div>
        )}

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
              onReorder={handleReorder}
              onMoveToTop={handleMoveToTop}
              onMoveToBottom={handleMoveToBottom}
            />
          ))}
        </div>

        <TaskFormModal
          open={modalOpen}
          editing={editing}
          defaultQuadrant={defaultQuadrant}
          categories={categories}
          onCancel={() => {
            setModalOpen(false);
            setEditing(undefined);
          }}
          onSubmit={handleSubmit}
        />

        <CategoryModal
          open={catModalOpen}
          editing={editingCategory}
          onCancel={() => {
            setCatModalOpen(false);
            setEditingCategory(undefined);
          }}
          onSubmit={handleSubmitCategory}
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
