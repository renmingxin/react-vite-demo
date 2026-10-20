import { CheckOutlined } from "@ant-design/icons";
import { defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 同意：最常见的动作，直接复用公共校验与成功回调 */
const agree: ApprovalAction = defineAction({
  key: "agree",
  label: "同意",
  group: "primary",
  order: 20,
  icon: <CheckOutlined />,
  view: {
    type: "modal",
    title: "同意",
    confirmText: "确认同意",
    fields: [opinionField({ placeholder: "同意意见（可选）" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "agree");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "审批中", currentNode: "总经理审批" });
    appendTrace(ctx, { title: "同意", comment: ctx.payload.opinion || "同意" });
    return result;
  },
});

export default agree;
