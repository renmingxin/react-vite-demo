import { InboxOutlined } from "@ant-design/icons";
import { defineAction } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/**
 * 归档：无弹窗动作。
 * view = none 时命令分发器直接执行，视图层不需要为它写任何按钮逻辑。
 */
const archive: ApprovalAction = defineAction({
  key: "archive",
  label: "归档",
  group: "secondary",
  order: 160,
  icon: <InboxOutlined />,
  view: { type: "none" },
  handler: async (ctx) => {
    const result = await callApi(ctx, "archive");
    if (!result.success) return result;

    ctx.dispatch.document.patch({ status: "已通过", currentNode: "已归档" });
    appendTrace(ctx, { title: "流程归档" });
    return result;
  },
});

export default archive;
