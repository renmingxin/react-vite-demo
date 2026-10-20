import { FLOW_NODES, APPROVAL_USERS } from "../constants";
import type { ApprovalAction, ViewFieldConfig } from "../types";

/** 动作定义工厂：仅做类型收敛，方便后续统一注入默认值（如埋点、权限前缀） */
export function defineAction(action: ApprovalAction): ApprovalAction {
  return action;
}

/* ---------------- 字段配置构造器：让动作文件只描述差异 ---------------- */

export function opinionField(
  override: Partial<ViewFieldConfig> = {}
): ViewFieldConfig {
  return {
    name: "opinion",
    label: "审批意见",
    type: "textarea",
    rows: 3,
    maxLength: 200,
    placeholder: "请输入审批意见，将同步到流程轨迹",
    ...override,
  };
}

export function reasonField(
  override: Partial<ViewFieldConfig> = {}
): ViewFieldConfig {
  return {
    name: "reason",
    label: "原因说明",
    type: "textarea",
    rows: 3,
    maxLength: 200,
    required: true,
    placeholder: "请说明原因，便于发起人理解",
    ...override,
  };
}

export function nodeField(
  override: Partial<ViewFieldConfig> = {}
): ViewFieldConfig {
  return {
    name: "targetNode",
    label: "目标节点",
    type: "select",
    required: true,
    options: FLOW_NODES,
    placeholder: "请选择要回退/跳转的节点",
    ...override,
  };
}

export function assigneeField(
  override: Partial<ViewFieldConfig> = {}
): ViewFieldConfig {
  return {
    name: "assignees",
    label: "处理人",
    type: "select",
    multiple: true,
    required: true,
    options: APPROVAL_USERS,
    placeholder: "可多选，支持按组织架构搜索",
    ...override,
  };
}

export function methodField(
  override: Partial<ViewFieldConfig> = {}
): ViewFieldConfig {
  return {
    name: "remindMethod",
    label: "提醒方式",
    type: "radio",
    required: true,
    options: [
      { label: "站内信", value: "inner" },
      { label: "短信", value: "sms" },
      { label: "企业微信", value: "wecom" },
    ],
    ...override,
  };
}
