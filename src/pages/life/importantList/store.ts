import { atom, selector } from "recoil";
import type { QuadrantKey, TaskItem } from "./types";
import { loadTasks, saveTasks } from "./utils/storage";

// 任务列表（持久化到 localStorage）
export const tasksState = atom<TaskItem[]>({
  key: "importantList/tasksState",
  default: loadTasks(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        saveTasks(newValue as TaskItem[]);
      });
    },
  ],
});

// 按象限分组（同时按提醒时间、未完成在前 排序）
export const tasksByQuadrantSelector = selector<
  Record<QuadrantKey, TaskItem[]>
>({
  key: "importantList/tasksByQuadrantSelector",
  get: ({ get }) => {
    const list = get(tasksState);
    const grouped: Record<QuadrantKey, TaskItem[]> = {
      urgentImportant: [],
      importantNotUrgent: [],
      urgentNotImportant: [],
      notUrgentNotImportant: [],
    };
    [...list].forEach((t) => {
      grouped[t.quadrant].push(t);
    });
    // 每个象限内：未完成在前；同状态按提醒时间升序，否则按创建时间倒序
    Object.keys(grouped).forEach((k) => {
      grouped[k as QuadrantKey].sort((a, b) => {
        if (!!a.completed !== !!b.completed) return a.completed ? 1 : -1;
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

// 概览统计
export const taskStatsSelector = selector({
  key: "importantList/taskStatsSelector",
  get: ({ get }) => {
    const list = get(tasksState);
    const total = list.length;
    const completed = list.filter((t) => t.completed).length;
    const pending = total - completed;
    const remind = list.filter(
      (t) => !t.completed && t.remindAt && new Date(t.remindAt) > new Date(),
    ).length;
    return { total, completed, pending, remind };
  },
});
