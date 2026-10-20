import { ImportOutlined } from "@ant-design/icons";
import { defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 取回：在下一节点处理前把单据收回自己的待办 */
const fetchBack: ApprovalAction = defineAction({
  key: "fetchBack",
  label: "取回",
  group: "secondary",
  order: 110,
  icon: <ImportOutlined />,
  view: {
    type: "modal",
    title: "取回单据",
    confirmText: "确认取回",
    fields: [opinionField({ label: "取回原因", required: true })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "fetchBack");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ currentNode: "部门负责人审批", handler: "李响" });
    appendTrace(ctx, {
      title: "取回单据",
      comment: ctx.payload.opinion,
      operator: "李响",
    });
    return result;
  },
});

export default fetchBack;
