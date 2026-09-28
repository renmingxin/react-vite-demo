import type { Category, TaskItem } from "../types";

const TASK_KEY = "importantList:tasks:v1";
const CATEGORY_KEY = "importantList:categories:v1";
const ACTIVE_CATEGORY_KEY = "importantList:activeCategory:v1";

/** 旧数据（无 categoryId）迁移到的默认分类 id */
export const DEFAULT_CATEGORY_ID = "cat_life";

const nowIso = () => new Date().toISOString();

/** 首次使用时内置的分类 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_life", name: "生活", color: "#52c41a", createdAt: nowIso() },
  { id: "cat_work", name: "工作", color: "#1677ff", createdAt: nowIso() },
];

// ---------------- 分类 ----------------
export const loadCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const data = JSON.parse(raw) as Category[];
    if (!Array.isArray(data) || data.length === 0) return DEFAULT_CATEGORIES;
    return data;
  } catch (e) {
    console.warn("[importantList] 读取本地分类失败", e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn("[importantList] 保存本地分类失败", e);
  }
};

export const loadActiveCategoryId = (): string => {
  try {
    return localStorage.getItem(ACTIVE_CATEGORY_KEY) || DEFAULT_CATEGORY_ID;
  } catch {
    return DEFAULT_CATEGORY_ID;
  }
};

export const saveActiveCategoryId = (id: string) => {
  try {
    localStorage.setItem(ACTIVE_CATEGORY_KEY, id);
  } catch (e) {
    console.warn("[importantList] 保存当前分类失败", e);
  }
};

// ---------------- 任务 ----------------
export const loadTasks = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem(TASK_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as TaskItem[];
    if (!Array.isArray(data)) return [];
    // 兼容旧数据：没有 categoryId 的任务归入默认分类
    return data.map((t) => ({
      ...t,
      categoryId: t.categoryId || DEFAULT_CATEGORY_ID,
    }));
  } catch (e) {
    console.warn("[importantList] 读取本地任务失败", e);
    return [];
  }
};

export const saveTasks = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("[importantList] 保存本地任务失败", e);
  }
};

// ---------------- 通用 ----------------
// 生成稳定的简单 id
export const genId = (prefix = "t"): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
