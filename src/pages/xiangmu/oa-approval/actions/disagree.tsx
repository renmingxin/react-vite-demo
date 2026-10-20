import { CloseOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 不同意：必须填写原因，走 danger 样式 */
const disagree: ApprovalAction = defineAction({
  key: "disagree",
  label: "不同意",
  group: "primary",
  order: 30,
  icon: <CloseOutlined />,
  view: {
    type: "modal",
    title: "不同意",
    confirmText: "确认提交意见",
    danger: true,
    fields: [reasonField({ label: "不同意原因" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "disagree");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ currentNode: "发起人" });
    appendTrace(ctx, {
      title: "不同意",
      status: "rejected",
      comment: ctx.payload.reason,
    });
    return result;
  },
});

export default disagree;
