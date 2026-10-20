import { PauseCircleOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 暂存：挂起流程，可被「复活」重新激活 */
const suspend: ApprovalAction = defineAction({
  key: "suspend",
  label: "暂存",
  group: "secondary",
  order: 220,
  icon: <PauseCircleOutlined />,
  view: {
    type: "modal",
    title: "暂存流程",
    confirmText: "确认暂存",
    fields: [reasonField({ label: "暂存原因" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "suspend");
    if (!result.success) return result;

    appendTrace(ctx, {
      title: "流程暂存",
      status: "current",
      comment: ctx.payload.reason,
    });
    return result;
  },
});

export default suspend;
