import { SolutionOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 委托：在指定时间段内把自己的审批权委托给别人 */
const delegate: ApprovalAction = defineAction({
  key: "delegate",
  label: "委托",
  group: "secondary",
  order: 100,
  icon: <SolutionOutlined />,
  view: {
    type: "modal",
    title: "设置委托",
    confirmText: "确认委托",
    fields: [
      assigneeField({ label: "委托人", multiple: false }),
      { name: "dueDate", label: "委托截止日期", type: "date", required: true },
      opinionField({ label: "委托说明" }),
    ],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "delegate");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: `委托至 ${ctx.payload.dueDate}`,
      status: "current",
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default delegate;
