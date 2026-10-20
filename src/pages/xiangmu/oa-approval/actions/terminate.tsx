import { DeleteOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 终止：管理员强制结束流程，不可恢复 */
const terminate: ApprovalAction = defineAction({
  key: "terminate",
  label: "终止",
  group: "danger",
  order: 130,
  icon: <DeleteOutlined />,
  view: {
    type: "modal",
    title: "终止流程",
    confirmText: "确认终止",
    danger: true,
    fields: [reasonField({ label: "终止原因", tip: "终止后流程不可恢复，请谨慎操作" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "terminate");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "已终止" });
    appendTrace(ctx, {
      title: "流程已终止",
      status: "rejected",
      comment: ctx.payload.reason,
    });
    return result;
  },
  // 动作私有能力：终止属于高危动作，额外打点（公共中间件不感知）
  beforeSubmit: (ctx) => {
    ctx.emit("risk:audit", { action: "terminate", reason: ctx.payload.reason });
  },
});

export default terminate;
