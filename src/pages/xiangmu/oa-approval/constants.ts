import type { ActionKey } from "./types";

/** 动作中文名（注册表兜底使用，动作自身也可覆盖） */
export const ACTION_LABEL: Record<ActionKey, string> = {
  submit: "提交",
  agree: "同意",
  disagree: "不同意",
  rollback: "回退",
  reject: "退回",
  countersign: "会签",
  addSign: "加签",
  notify: "知会",
  transfer: "转办",
  delegate: "委托",
  fetchBack: "取回",
  revoke: "撤销",
  terminate: "终止",
  carbonCopy: "抄送",
  urge: "催办",
  archive: "归档",
  saveDraft: "保存草稿",
  comment: "评论",
  batchAgree: "批量同意",
  print: "打印",
  jump: "跳转",
  suspend: "暂存",
  reopen: "复活",
};

export const ACTION_SUCCESS_TEXT: Partial<Record<ActionKey, string>> = {
  submit: "提交成功，已进入审批流程",
  agree: "已同意，流程进入下一节点",
  disagree: "已提交不同意意见",
  rollback: "已回退到目标节点",
  reject: "已退回发起人",
  countersign: "会签任务已下发",
  addSign: "加签已生效",
  notify: "知会已送达",
  transfer: "转办成功",
  delegate: "委托已设置",
  fetchBack: "取回成功，单据回到你的待办",
  revoke: "撤销成功，流程已作废",
  terminate: "流程已终止",
  carbonCopy: "抄送成功",
  urge: "催办提醒已发送",
  archive: "归档成功",
  saveDraft: "草稿已保存",
  comment: "评论已发布",
  batchAgree: "批量同意完成",
  print: "打印任务已生成",
  jump: "跳转成功",
  suspend: "流程已暂存",
  reopen: "流程已复活",
};

/** 敏感词库（真实场景由合规中台下发） */
export const SENSITIVE_WORDS = ["垃圾", "内幕", "回扣", "滚蛋", "傻"];

export function detectSensitiveWords(text?: string): string[] {
  if (!text) return [];
  return SENSITIVE_WORDS.filter((word) => text.includes(word));
}

/** 流程节点（回退 / 跳转目标） */
export const FLOW_NODES = [
  { label: "发起人", value: "start" },
  { label: "部门负责人审批", value: "deptLeader" },
  { label: "财务经理审批", value: "financeManager" },
  { label: "总经理审批", value: "generalManager" },
  { label: "归档节点", value: "archive" },
];

/** 可加签 / 转办的人员 */
export const APPROVAL_USERS = [
  { label: "张伟 · 财务经理", value: "u_zhangwei" },
  { label: "刘敏 · 法务", value: "u_liumin" },
  { label: "陈涛 · 总经理", value: "u_chentao" },
  { label: "赵蕾 · 合规", value: "u_zhaolei" },
];

export const CURRENT_USER = {
  name: "李响",
  role: "部门负责人",
};
