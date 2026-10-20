import type { ApprovalState, TimelineNode } from "../types";

const timeline: TimelineNode[] = [
  {
    id: "t1",
    title: "发起申请",
    operator: "王小雨",
    status: "done",
    time: "2026-10-19 09:12",
    comment: "Q3 市场投放费用，请审批。",
  },
  {
    id: "t2",
    title: "部门负责人审批",
    operator: "李响",
    status: "done",
    time: "2026-10-19 14:30",
    comment: "同意",
  },
  {
    id: "t3",
    title: "财务经理审批",
    operator: "张伟",
    status: "current",
    time: "",
    comment: "",
  },
  {
    id: "t4",
    title: "总经理审批",
    operator: "陈涛",
    status: "pending",
  },
];

/**
 * 每次挂载都生成一棵独立状态树，避免多实例之间互相污染。
 */
export function createInitialState(): ApprovalState {
  return {
    document: {
      id: "DOC-20261020-001",
      code: "BX-20261020-001",
      title: "Q3 市场投放费用报销单",
      type: "费用报销",
      status: "审批中",
      currentNode: "财务经理审批",
      submitter: "王小雨",
      submitTime: "2026-10-19 09:12",
      handler: "李响",
    },
    form: {
      amount: 128000,
      department: "财务部",
      urgency: "urgent",
      reason: "Q3 市场投放费用报销（抖音 + 小红书信息流）",
      remark: "",
    },
    // 贴近 BPM 后端下发的整包结构：groups[].items[]
    summaryDetail: {
      updatedAt: "10-19 14:30:00",
      groups: [
        {
          key: "base",
          title: "基础信息",
          items: [
            { key: "amount", label: "报销金额", value: "¥128,000.00", highlight: true },
            { key: "department", label: "归属部门", value: "财务部" },
            { key: "urgency", label: "紧急程度", value: "加急" },
          ],
        },
        {
          key: "flow",
          title: "流程信息",
          items: [
            { key: "attachment", label: "附件", value: "投放截图 x 6" },
            { key: "applicant", label: "申请人", value: "王小雨" },
          ],
        },
      ],
    },
    // 权限由后端下发，前端只做「展示过滤」，真正的兜底在 pipeline 里
    permission: {
      submit: true,
      agree: true,
      disagree: true,
      rollback: true,
      reject: true,
      countersign: true,
      addSign: true,
      notify: true,
      transfer: true,
      delegate: true,
      fetchBack: true,
      revoke: false,
      terminate: true,
      carbonCopy: true,
      urge: true,
      archive: false,
      saveDraft: true,
      comment: true,
      batchAgree: false,
      print: true,
      jump: true,
      suspend: true,
      reopen: false,
    },
    timeline,
    ui: {
      activeAction: null,
      pending: false,
      simulateFailure: false,
      lastMessage: "等待操作",
    },
    perf: { noise: 0 },
  };
}
