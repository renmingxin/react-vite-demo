import type { QuadrantKey } from "./types";
import {
  FireOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import React from "react";

export interface QuadrantMeta {
  key: QuadrantKey;
  title: string;
  subtitle: string; // 行动建议
  color: string; // 主题色
  bgColor: string; // 象限列底色（很淡）
  cardBg: string; // 任务卡片底色（比列底色略深，拖动后背景变化更明显）
  icon: React.ReactNode;
}

// 四象限配置（顺序即为界面展示顺序：左下、右下、左上、右上）
export const QUADRANTS: QuadrantMeta[] = [
  {
    key: "urgentImportant",
    title: "重要且紧急",
    subtitle: "立即去做 · 危机/截止事项",
    color: "#ff4d4f",
    bgColor: "#fff1f0",
    cardBg: "#ffe1de",
    icon: React.createElement(FireOutlined),
  },
  {
    key: "importantNotUrgent",
    title: "重要不紧急",
    subtitle: "计划去做 · 长期价值/成长",
    color: "#fa8c16",
    bgColor: "#fff7e6",
    cardBg: "#ffeac9",
    icon: React.createElement(BulbOutlined),
  },
  {
    key: "urgentNotImportant",
    title: "不重要但紧急",
    subtitle: "尽量交办 · 他人干扰/琐事",
    color: "#faad14",
    bgColor: "#fffbe6",
    cardBg: "#fff3c4",
    icon: React.createElement(ThunderboltOutlined),
  },
  {
    key: "notUrgentNotImportant",
    title: "不重要也不紧急",
    subtitle: "尽量不做 · 浪费时间的事",
    color: "#8c8c8c",
    bgColor: "#fafafa",
    cardBg: "#ececec",
    icon: React.createElement(CoffeeOutlined),
  },
];

export const QUADRANT_MAP: Record<QuadrantKey, QuadrantMeta> = QUADRANTS.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<QuadrantKey, QuadrantMeta>,
);

// 本地存储 Key
export const STORAGE_KEY = "importantList:tasks:v1";

// 拖拽 MIME 类型
export const DRAG_MIME = "application/x-importantlist-task";

// 分类主题色板（新建/编辑分类时可选）
export const CATEGORY_COLORS = [
  "#1677ff",
  "#52c41a",
  "#fa8c16",
  "#eb2f96",
  "#722ed1",
  "#13c2c2",
  "#f5222d",
  "#8c8c8c",
];
