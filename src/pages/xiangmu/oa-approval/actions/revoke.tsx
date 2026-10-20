import { StopOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 撤销：发起人作废流程（演示权限里已关闭） */
const revoke: ApprovalAction = defineAction({
  key: "revoke",
  label: "撤销",
  group: "danger",
  order: 120,
  icon: <StopOutlined />,
  view: {
    type: "modal",
    title: "撤销流程",
    confirmText: "确认撤销",
    danger: true,
    fields: [reasonField({ label: "撤销原因" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "revoke");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "草稿", currentNode: "发起人" });
    appendTrace(ctx, {
      title: "撤销流程",
      status: "rejected",
      comment: ctx.payload.reason,
      operator: "王小雨",
    });
    return result;
  },
});

export default revoke;
