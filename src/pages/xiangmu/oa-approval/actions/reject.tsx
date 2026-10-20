import { UndoOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 退回：退回发起人，单据回到草稿态 */
const reject: ApprovalAction = defineAction({
  key: "reject",
  label: "退回",
  group: "primary",
  order: 50,
  icon: <UndoOutlined />,
  view: {
    type: "modal",
    title: "退回发起人",
    confirmText: "确认退回",
    danger: true,
    fields: [reasonField({ label: "退回原因" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "reject");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "草稿", currentNode: "发起人" });
    appendTrace(ctx, {
      title: "退回发起人",
      status: "rejected",
      comment: ctx.payload.reason,
    });
    return result;
  },
});

export default reject;
