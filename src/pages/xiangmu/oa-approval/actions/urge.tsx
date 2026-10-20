import { ClockCircleOutlined } from "@ant-design/icons";
import { defineAction, methodField, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 催办：向当前处理人发送提醒 */
const urge: ApprovalAction = defineAction({
  key: "urge",
  label: "催办",
  group: "secondary",
  order: 150,
  icon: <ClockCircleOutlined />,
  view: {
    type: "modal",
    title: "催办提醒",
    confirmText: "发送提醒",
    fields: [methodField(), opinionField({ label: "催办语", placeholder: "例如：该单据已超时 4 小时" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "urge");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: "发送催办",
      status: "current",
      comment: `${ctx.payload.remindMethod} · ${ctx.payload.opinion ?? ""}`,
    });
    return result;
  },
});

export default urge;
