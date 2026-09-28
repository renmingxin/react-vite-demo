import { atom, selector } from "recoil";
import type { Category, QuadrantKey, TaskItem } from "./types";
import {
  loadActiveCategoryId,
  loadCategories,
  loadTasks,
  saveActiveCategoryId,
  saveCategories,
  saveTasks,
} from "./utils/storage";

// 任务列表（持久化到 localStorage）
export const tasksState = atom<TaskItem[]>({
  key: "importantList/tasksState",
  default: loadTasks(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => saveTasks(newValue as TaskItem[]));
    },
  ],
});

// 分类列表（持久化）
export const categoriesState = atom<Category[]>({
  key: "importantList/categoriesState",
  default: loadCategories(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => saveCategories(newValue as Category[]));
    },
  ],
});

// 当前选中的分类（持久化，刷新后仍停留在原分类）
export const activeCategoryIdState = atom<string>({
  key: "importantList/activeCategoryIdState",
  default: loadActiveCategoryId(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => saveActiveCategoryId(newValue as string));
    },
  ],
});

// 正在被拖拽的任务 id（全局共享：拖拽期间隐藏所有 Tooltip 气泡）
export const draggingTaskIdState = atom<string | null>({
  key: "importantList/draggingTaskIdState",
  default: null,
});

// 当前分类下的任务
export const currentCategoryTasksSelector = selector<TaskItem[]>({
  key: "importantList/currentCategoryTasksSelector",
  get: ({ get }) => {
    const tasks = get(tasksState);
    const catId = get(activeCategoryIdState);
    return tasks.filter((t) => t.categoryId === catId);
  },
});

// 按象限分组（当前分类内；手动 order 优先，其次提醒时间、未完成在前）
export const tasksByQuadrantSelector = selector<
  Record<QuadrantKey, TaskItem[]>
>({
  key: "importantList/tasksByQuadrantSelector",
  get: ({ get }) => {
    const list = get(currentCategoryTasksSelector);
    const grouped: Record<QuadrantKey, TaskItem[]> = {
      urgentImportant: [],
      importantNotUrgent: [],
      urgentNotImportant: [],
      notUrgentNotImportant: [],
    };
    [...list].forEach((t) => {
      grouped[t.quadrant].push(t);
    });
    Object.keys(grouped).forEach((k) => {
      grouped[k as QuadrantKey].sort((a, b) => {
        // 1. 已完成的始终沉底
        if (!!a.completed !== !!b.completed) return a.completed ? 1 : -1;
        // 2. 手动排序（置顶/置底/拖拽排序产生的 order）优先，升序
        const ao = a.order;
        const bo = b.order;
        if (ao !== undefined && bo !== undefined) return ao - bo;
        if (ao !== undefined) return -1;
        if (bo !== undefined) return 1;
        // 3. 兜底：按提醒时间升序，再按创建时间倒序
        if (a.remindAt && b.remindAt)
          return a.remindAt.localeCompare(b.remindAt);
        if (a.remindAt) return -1;
        if (b.remindAt) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    });
    return grouped;
  },
});

// 当前分类的概览统计
export const taskStatsSelector = selector({
  key: "importantList/taskStatsSelector",
  get: ({ get }) => {
    const list = get(currentCategoryTasksSelector);
    const total = list.length;
    const completed = list.filter((t) => t.completed).length;
    const pending = total - completed;
    const remind = list.filter(
      (t) => !t.completed && t.remindAt && new Date(t.remindAt) > new Date(),
    ).length;
    return { total, completed, pending, remind };
  },
});

// 每个分类下的任务数量（用于标签上展示）
export const categoryCountsSelector = selector<Record<string, number>>({
  key: "importantList/categoryCountsSelector",
  get: ({ get }) => {
    const tasks = get(tasksState);
    const counts: Record<string, number> = {};
    tasks.forEach((t) => {
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
    });
    return counts;
  },
});
