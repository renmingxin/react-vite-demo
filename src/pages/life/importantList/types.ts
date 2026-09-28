// 四象限分类
export type QuadrantKey =
  | "urgentImportant" // 重要且紧急
  | "importantNotUrgent" // 重要不紧急
  | "urgentNotImportant" // 不重要但紧急
  | "notUrgentNotImportant"; // 不重要也不紧急

// 单条任务
export interface TaskItem {
  id: string;
  title: string; // 任务标题
  description?: string; // 任务描述
  quadrant: QuadrantKey; // 所属象限
  remindAt?: string; // ISO 字符串格式的提醒时间
  notified?: boolean; // 是否已通知（避免重复提醒）
  completed?: boolean; // 是否已完成
  createdAt: string; // 创建时间
  updatedAt: string; // 最后修改时间
}

// 表单提交的数据（不含系统字段）
export interface TaskFormValues {
  title: string;
  description?: string;
  quadrant: QuadrantKey;
  remindAt?: string;
}
