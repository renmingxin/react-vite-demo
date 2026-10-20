import { SaveOutlined } from "@ant-design/icons";
import { defineAction } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 保存草稿：无弹窗、无校验，直接落库 */
const saveDraft: ApprovalAction = defineAction({
  key: "saveDraft",
  label: "保存草稿",
  group: "secondary",
  order: 170,
  icon: <SaveOutlined />,
  view: { type: "none" },
  handler: async (ctx) => {
    const result = await callApi(ctx, "saveDraft");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "草稿" });
    appendTrace(ctx, { title: "保存草稿" });
    return result;
  },
});

export default saveDraft;
