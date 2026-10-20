import { PlayCircleOutlined } from "@ant-design/icons";
import { defineAction, reasonField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 复活：把已终止 / 已暂存的流程重新拉起（演示权限里已关闭） */
const reopen: ApprovalAction = defineAction({
  key: "reopen",
  label: "复活",
  group: "danger",
  order: 230,
  icon: <PlayCircleOutlined />,
  view: {
    type: "modal",
    title: "复活流程",
    confirmText: "确认复活",
    danger: true,
    fields: [reasonField({ label: "复活原因" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "reopen");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "审批中", currentNode: "财务经理审批" });
    appendTrace(ctx, {
      title: "流程复活",
      status: "current",
      comment: ctx.payload.reason,
    });
    return result;
  },
});

export default reopen;
