import { CheckSquareOutlined } from "@ant-design/icons";
import { defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 批量同意：真实场景选中文档后批量执行，这里复用同一套链路 */
const batchAgree: ApprovalAction = defineAction({
  key: "batchAgree",
  label: "批量同意",
  group: "secondary",
  order: 190,
  icon: <CheckSquareOutlined />,
  view: {
    type: "modal",
    title: "批量同意",
    confirmText: "批量同意（含当前单据）",
    fields: [opinionField({ label: "批量意见" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "batchAgree");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ currentNode: "总经理审批" });
    appendTrace(ctx, {
      title: "批量同意",
      comment: ctx.payload.opinion || "批量同意",
    });
    return result;
  },
});

export default batchAgree;
