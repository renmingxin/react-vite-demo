import { SendOutlined } from "@ant-design/icons";
import { defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 提交：草稿 / 退回后重新提交 */
const submit: ApprovalAction = defineAction({
  key: "submit",
  label: "提交",
  group: "primary",
  order: 10,
  icon: <SendOutlined />,
  view: {
    type: "modal",
    title: "提交审批",
    confirmText: "确认提交",
    fields: [opinionField({ label: "提交说明", required: true, placeholder: "请补充提交说明" })],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "submit");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "审批中", currentNode: "财务经理审批" });
    appendTrace(ctx, { title: "重新提交", comment: ctx.payload.opinion });
    return result;
  },
});

export default submit;
