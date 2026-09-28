// 四象限分类
export type QuadrantKey =
  | "urgentImportant" // 重要且紧急
  | "importantNotUrgent" // 重要不紧急
  | "urgentNotImportant" // 不重要但紧急
  | "notUrgentNotImportant"; // 不重要也不紧急

/** 清单/分类（生活、工作、学习…可自定义增删） */
export interface Category {
  id: string;
  name: string;
  color: string; // 分类主题色（用于标签）
  createdAt: string;
}

// 单条任务
export interface TaskItem {
  id: string;
  title: string; // 任务标题
  description?: string; // 任务描述
  categoryId: string; // 所属分类
  quadrant: QuadrantKey; // 所属象限
  remindAt?: string; // ISO 字符串格式的提醒时间
  notified?: boolean; // 是否已通知（避免重复提醒）
  completed?: boolean; // 是否已完成
  order?: number; // 象限内手动排序序号（越小越靠前，置顶/置底使用）
  createdAt: string; // 创建时间
  updatedAt: string; // 最后修改时间
}

// 表单提交的数据（不含系统字段）
export interface TaskFormValues {
  title: string;
  description?: string;
  quadrant: QuadrantKey;
  categoryId?: string; // 所属分类（编辑时可移动）
  remindAt?: string;
}

// 分类表单
export interface CategoryFormValues {
  name: string;
  color: string;
}
