import { MailOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 抄送：流程结束后同步结果给相关方 */
const carbonCopy: ApprovalAction = defineAction({
  key: "carbonCopy",
  label: "抄送",
  group: "secondary",
  order: 140,
  icon: <MailOutlined />,
  view: {
    type: "modal",
    title: "抄送",
    confirmText: "确认抄送",
    fields: [assigneeField({ label: "抄送对象" }), opinionField({ label: "备注" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "carbonCopy");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: `抄送（${ctx.payload.assignees?.length ?? 0} 人）`,
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default carbonCopy;
