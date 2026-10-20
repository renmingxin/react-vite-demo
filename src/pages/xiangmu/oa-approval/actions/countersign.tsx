import { TeamOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 会签：多人同时审批，全部通过才流转 */
const countersign: ApprovalAction = defineAction({
  key: "countersign",
  label: "会签",
  group: "secondary",
  order: 60,
  icon: <TeamOutlined />,
  view: {
    type: "modal",
    title: "发起会签",
    confirmText: "发起会签",
    fields: [
      assigneeField({ label: "会签人员" }),
      opinionField({ label: "会签说明" }),
    ],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "countersign");
    if (!result.success) return result;

    const count = ctx.payload.assignees?.length ?? 0;
    ctx.dispatch.document.patch({ currentNode: `会签（${count} 人）` });
    appendTrace(ctx, {
      title: `发起会签（${count} 人）`,
      status: "current",
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default countersign;
