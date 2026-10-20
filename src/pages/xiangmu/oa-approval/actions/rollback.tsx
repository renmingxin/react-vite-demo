import { RollbackOutlined } from "@ant-design/icons";
import { defineAction, nodeField, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import { FLOW_NODES } from "../constants";
import type { ApprovalAction } from "../types";

/** 回退：需要选择目标节点，节点列表由后端下发（这里用常量模拟） */
const rollback: ApprovalAction = defineAction({
  key: "rollback",
  label: "回退",
  group: "primary",
  order: 40,
  icon: <RollbackOutlined />,
  view: {
    type: "modal",
    title: "回退流程",
    confirmText: "确认回退",
    danger: true,
    fields: [
      nodeField({ options: FLOW_NODES.slice(0, 3), label: "回退到" }),
      opinionField({ required: true, label: "回退原因" }),
    ],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "rollback");
    if (!result.success) return result;

    const target =
      FLOW_NODES.find((node) => node.value === ctx.payload.targetNode)?.label ??
      String(ctx.payload.targetNode);
    ctx.dispatch.document.patch({ currentNode: target });
    appendTrace(ctx, {
      title: `回退至${target}`,
      status: "rejected",
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default rollback;
