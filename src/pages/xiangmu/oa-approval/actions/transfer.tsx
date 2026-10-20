import { SwapOutlined } from "@ant-design/icons";
import { assigneeField, defineAction, opinionField } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import { APPROVAL_USERS } from "../constants";
import type { ApprovalAction } from "../types";

/** 转办：把当前待办整体交给另一个人，自己退出该节点 */
const transfer: ApprovalAction = defineAction({
  key: "transfer",
  label: "转办",
  group: "secondary",
  order: 90,
  icon: <SwapOutlined />,
  view: {
    type: "modal",
    title: "转办",
    confirmText: "确认转办",
    fields: [
      assigneeField({ label: "转办给", multiple: false, placeholder: "请选择接收人" }),
      opinionField({ label: "转办说明" }),
    ],
  },
  handler: async (ctx) => {
    const result = await callApi(ctx, "transfer");
    if (!result.success) return result;

    const target =
      APPROVAL_USERS.find((user) => user.value === ctx.payload.assignees?.[0])?.label ??
      "指定人员";
    ctx.dispatch.document.patch({ handler: target });
    appendTrace(ctx, { title: `转办给 ${target}`, comment: ctx.payload.opinion });
    return result;
  },
});

export default transfer;
