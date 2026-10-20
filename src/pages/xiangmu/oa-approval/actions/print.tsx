import { PrinterOutlined } from "@ant-design/icons";
import { defineAction } from "../core/defineAction";
import { callApi } from "../core/execute";
import { appendTrace } from "../core/trace";
import type { ApprovalAction } from "../types";

/** 打印：同步能力，同样走 pipeline（防重、权限、事件广播一个都不少） */
const print: ApprovalAction = defineAction({
  key: "print",
  label: "打印",
  group: "secondary",
  order: 200,
  icon: <PrinterOutlined />,
  view: { type: "none" },
  handler: async (ctx) => {
    await callApi(ctx, "print");
    appendTrace(ctx, { title: "生成打印任务" });
    return { success: true, message: "打印任务已生成" };
  },
});

export default print;
