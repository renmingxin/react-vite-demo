import { MessageOutlined } from "@ant-design/icons";
import { defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 评论：只留痕，不影响流转 */
const comment: ApprovalAction = defineAction({
  key: "comment",
  label: "评论",
  group: "secondary",
  order: 180,
  icon: <MessageOutlined />,
  view: {
    type: "modal",
    title: "添加评论",
    confirmText: "发布",
    fields: [opinionField({ label: "评论内容", required: true, placeholder: "仅流程参与人可见" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "comment");
    if (!result.success) return result;

    appendTrace(ctx, { title: "评论", comment: ctx.payload.opinion });
    return result;
  },
});

export default comment;
