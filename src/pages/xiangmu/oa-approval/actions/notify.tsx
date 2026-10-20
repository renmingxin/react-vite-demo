import { BellOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 知会：只通知不参与审批，不改变流程节点 */
const notify: ApprovalAction = defineAction({
  key: "notify",
  label: "知会",
  group: "secondary",
  order: 80,
  icon: <BellOutlined />,
  view: {
    type: "modal",
    title: "知会",
    confirmText: "发送知会",
    fields: [
      assigneeField({ label: "知会对象" }),
      opinionField({ label: "知会内容", required: true, placeholder: "对方会在待阅列表中看到这条说明" }),
    ],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "notify");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: `知会（${ctx.payload.assignees?.length ?? 0} 人）`,
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default notify;
