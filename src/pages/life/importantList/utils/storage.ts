import type { TaskItem } from "../types";

export const loadTasks = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem("importantList:tasks:v1");
    if (!raw) return [];
    const data = JSON.parse(raw) as TaskItem[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("[importantList] 读取本地任务失败", e);
    return [];
  }
};

export const saveTasks = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem("importantList:tasks:v1", JSON.stringify(tasks));
  } catch (e) {
    console.warn("[importantList] 保存本地任务失败", e);
  }
};

// 生成稳定的简单 id
export const genId = (): string =>
  `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
