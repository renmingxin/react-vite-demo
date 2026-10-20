import { ExportOutlined } from "@ant-design/icons";
import { defineAction, nodeField, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import { FLOW_NODES } from "../constants";
import type { ApprovalAction } from "../types";

/** 跳转：管理员把流程直接推进到指定节点 */
const jump: ApprovalAction = defineAction({
  key: "jump",
  label: "跳转",
  group: "secondary",
  order: 210,
  icon: <ExportOutlined />,
  view: {
    type: "modal",
    title: "跳转节点",
    confirmText: "确认跳转",
    fields: [nodeField({ label: "跳转到", options: FLOW_NODES }), opinionField({ label: "跳转说明" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "jump");
    if (!result.success) return result;

    const target =
      FLOW_NODES.find((node) => node.value === ctx.payload.targetNode)?.label ??
      String(ctx.payload.targetNode);
    ctx.dispatch.document.patch({ currentNode: target });
    appendTrace(ctx, {
      title: `跳转至${target}`,
      status: "current",
      comment: ctx.payload.opinion,
    });
    return result;
  },
});

export default jump;
