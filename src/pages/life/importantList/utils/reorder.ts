import type { Category, QuadrantKey, TaskItem } from "../types";

/** 分类展示顺序：有 order 按 order 升序，否则按创建时间升序 */
export const sortCategories = (list: Category[]): Category[] =>
  [...list].sort((a, b) => {
    const ao = a.order;
    const bo = b.order;
    if (ao !== undefined && bo !== undefined) return ao - bo;
    if (ao !== undefined) return -1;
    if (bo !== undefined) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

/**
 * 分类标签拖拽排序：把 dragIndex 位置的分类移动到 hoverIndex 位置，
 * 移动后重新编号 order（0,1,2...），保证顺序稳定。
 */
export const reorderCategories = (
  categories: Category[],
  dragIndex: number,
  hoverIndex: number,
): Category[] => {
  const ordered = sortCategories(categories);
  if (dragIndex === hoverIndex) return categories;
  if (
    dragIndex < 0 ||
    dragIndex >= ordered.length ||
    hoverIndex < 0 ||
    hoverIndex >= ordered.length
  ) {
    return categories;
  }

  const next = [...ordered];
  const [moved] = next.splice(dragIndex, 1);
  next.splice(hoverIndex, 0, moved);

  return next.map((c, idx) => (c.order === idx ? c : { ...c, order: idx }));
};

/** 按当前生效顺序取出「某分类下某象限」的任务（已完成沉底，其余按 order 升序） */
const getOrderedPeers = (
  tasks: TaskItem[],
  categoryId: string,
  quadrant: QuadrantKey,
) =>
  tasks
    .filter((t) => t.categoryId === categoryId && t.quadrant === quadrant)
    .sort((a, b) => {
      if (!!a.completed !== !!b.completed) return a.completed ? 1 : -1;
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return b.createdAt.localeCompare(a.createdAt);
    });

/**
 * 同分类同象限内按索引拖动排序：把 dragIndex 位置的项移动到 hoverIndex 位置。
 * 移动后对该分组所有项重新编号 order（0,1,2...），保证序号不碰撞。
 */
export const reorderByIndex = (
  tasks: TaskItem[],
  categoryId: string,
  quadrant: QuadrantKey,
  dragIndex: number,
  hoverIndex: number,
): TaskItem[] => {
  const peers = getOrderedPeers(tasks, categoryId, quadrant);
  if (
    dragIndex < 0 ||
    dragIndex >= peers.length ||
    hoverIndex < 0 ||
    hoverIndex >= peers.length ||
    dragIndex === hoverIndex
  ) {
    return tasks;
  }

  const next = [...peers];
  const [moved] = next.splice(dragIndex, 1);
  next.splice(hoverIndex, 0, moved);

  const orderMap = new Map<string, number>();
  next.forEach((t, idx) => orderMap.set(t.id, idx));

  const now = new Date().toISOString();
  return tasks.map((t) => {
    const o = orderMap.get(t.id);
    return o !== undefined ? { ...t, order: o, updatedAt: now } : t;
  });
};

/**
 * 将目标任务在同一分类、同一象限内移到最前或最后。
 * 做法：把同组（同分类 + 同象限 + 同完成状态）的其他任务按当前 order 重新编号为
 * 1..n，再把目标任务的 order 设为 0（置顶）或 n+1（置底），序号始终规范。
 */
export const reorderQuadrant = (
  tasks: TaskItem[],
  targetId: string,
  position: "top" | "bottom",
): TaskItem[] => {
  const target = tasks.find((t) => t.id === targetId);
  if (!target) return tasks;

  const { categoryId, quadrant, completed } = target;

  const peers = tasks.filter(
    (t) =>
      t.categoryId === categoryId &&
      t.quadrant === quadrant &&
      !!t.completed === !!completed &&
      t.id !== targetId,
  );

  peers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const orderMap = new Map<string, number>();
  peers.forEach((t, idx) => orderMap.set(t.id, idx + 1));

  const targetOrder = position === "top" ? 0 : peers.length + 1;
  const now = new Date().toISOString();

  return tasks.map((t) => {
    if (t.id === targetId) {
      return { ...t, order: targetOrder, updatedAt: now };
    }
    const o = orderMap.get(t.id);
    return o !== undefined ? { ...t, order: o, updatedAt: now } : t;
  });
};
