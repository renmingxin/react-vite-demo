import { UserAddOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 加签：在当前节点插入新的审批人 */
const addSign: ApprovalAction = defineAction({
  key: "addSign",
  label: "加签",
  group: "secondary",
  order: 70,
  icon: <UserAddOutlined />,
  view: {
    type: "modal",
    title: "加签",
    confirmText: "确认加签",
    fields: [assigneeField({ label: "加签人员" }), opinionField({ label: "加签说明" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "addSign");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: `加签（${ctx.payload.assignees?.length ?? 0} 人）`,
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default addSign;
