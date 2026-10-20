import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * 一、审批动作协议
 * 每个按钮 = { permission 按钮身份, handler 业务逻辑, view 弹窗描述 }
 * UI 层只认协议，不认具体动作；新增动作 = 新增一个文件，注册表自动收集。
 * ------------------------------------------------------------------ */

export type ActionKey =
  | "submit"
  | "agree"
  | "disagree"
  | "rollback"
  | "reject"
  | "countersign"
  | "addSign"
  | "notify"
  | "transfer"
  | "delegate"
  | "fetchBack"
  | "revoke"
  | "terminate"
  | "carbonCopy"
  | "urge"
  | "archive"
  | "saveDraft"
  | "comment"
  | "batchAgree"
  | "print"
  | "jump"
  | "suspend"
  | "reopen";

/** 按钮在工具栏中的位次 */
export type ActionGroup = "primary" | "secondary" | "danger";

/** 弹窗字段的渲染类型，视图层按此渲染，动作层不写 JSX */
export type FieldType = "textarea" | "select" | "radio" | "number" | "date";

export interface ViewFieldConfig {
  name: keyof ActionPayload & string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  multiple?: boolean;
  options?: Array<{ label: string; value: string }>;
  /** 字段下方提示，例如敏感词提示 */
  tip?: string;
}

/** 弹窗只描述「长什么样」，不描述「怎么提交」 */
export type ActionView =
  | { type: "none" }
  | {
      type: "modal";
      title: string;
      width?: number;
      confirmText?: string;
      danger?: boolean;
      fields: ViewFieldConfig[];
    };

export interface ActionPayload {
  opinion?: string;
  reason?: string;
  targetNode?: string;
  assignees?: string[];
  dueDate?: string;
  remindMethod?: string;
  method?: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
}

export interface ExecuteParams {
  action: ActionKey;
  documentId: string;
  payload: ActionPayload;
  simulateFailure: boolean;
}

export interface ApprovalApi {
  execute: (params: ExecuteParams) => Promise<ActionResult>;
}

/* ------------------------------------------------------------------ *
 * 二、单据状态树（唯一数据源）
 * ------------------------------------------------------------------ */

export type DocumentStatus = "草稿" | "审批中" | "已通过" | "已驳回" | "已终止";

export interface ApprovalDocument {
  id: string;
  code: string;
  title: string;
  type: string;
  status: DocumentStatus;
  currentNode: string;
  submitter: string;
  submitTime: string;
  handler: string;
}

export interface ApprovalForm {
  amount: number;
  department: string;
  urgency: "normal" | "urgent";
  reason: string;
  remark: string;
}

export interface SummaryItem {
  key: string;
  label: string;
  value: string;
  /** 后端标记的高亮项（例如金额超限），视图层按此加色 */
  highlight?: boolean;
}

/** 摘要分组：贴近 BPM 下发的 `summaryDetail.groups[].items[]` 结构 */
export interface SummaryGroup {
  key: string;
  title: string;
  items: SummaryItem[];
}

/** 后端整包下发的摘要详情 */
export interface SummaryDetail {
  groups: SummaryGroup[];
  updatedAt: string;
}

export type TimelineStatus = "done" | "current" | "pending" | "rejected";

export interface TimelineNode {
  id: string;
  title: string;
  operator: string;
  status: TimelineStatus;
  time?: string;
  comment?: string;
}

export interface ApprovalUiState {
  /** 当前打开的动作（命令分发器的“待执行指令”） */
  activeAction: ActionKey | null;
  pending: boolean;
  /** 仅用于演示失败回调链路 */
  simulateFailure: boolean;
  lastMessage: string;
}

export interface ApprovalState {
  document: ApprovalDocument;
  form: ApprovalForm;
  summaryDetail: SummaryDetail;
  permission: Record<string, boolean>;
  timeline: TimelineNode[];
  ui: ApprovalUiState;
  /** 与任何组件都无关的“噪声字段”，用来验证细粒度订阅 */
  perf: { noise: number };
}

/* ------------------------------------------------------------------ *
 * 三、命令式更新接口（dispatch 收口）
 * ------------------------------------------------------------------ */

export interface ApprovalDispatch {
  patch: (patch: Partial<ApprovalState>) => void;
  document: { patch: (patch: Partial<ApprovalDocument>) => void };
  form: { patch: (patch: Partial<ApprovalForm>) => void };
  /** BPM 摘要详情：全量替换与局部更新在 dispatch 内部隔离 */
  summaryDetail: {
    /** 后端整包返回：直接替换，业务层不做逐字段 diff */
    replace: (detail: SummaryDetail) => void;
    /** 前端局部刷新某个分组的某一项（不存在则追加 / 建组） */
    upsertItem: (groupId: string, item: SummaryItem) => void;
  };
  timeline: {
    push: (node: TimelineNode) => void;
    reset: (nodes: TimelineNode[]) => void;
  };
  permission: { patch: (patch: Record<string, boolean>) => void };
  ui: {
    setActiveAction: (key: ActionKey | null) => void;
    setPending: (pending: boolean) => void;
    setSimulateFailure: (value: boolean) => void;
    setLastMessage: (message: string) => void;
  };
  transaction: (fn: () => void) => void;
  reset: (state: ApprovalState) => void;
}

/* ------------------------------------------------------------------ *
 * 四、动作执行链路
 * ------------------------------------------------------------------ */

export type NotifyType = "success" | "info" | "warning" | "error";
export type NotifyFn = (type: NotifyType, content: string) => void;

export interface ActionContext {
  action: ApprovalAction;
  payload: ActionPayload;
  /** 绝对新鲜的快照（等价于 store.getState()，不受闭包影响） */
  getState: () => ApprovalState;
  dispatch: ApprovalDispatch;
  api: ApprovalApi;
  notify: NotifyFn;
  emit: (event: string, payload?: unknown) => void;
}

export type Next = () => Promise<void>;
export type Middleware = (
  ctx: ActionContext,
  next: Next
) => Promise<void> | void;

export interface ApprovalAction {
  /** 按钮身份，同时作为权限标识的默认值 */
  key: ActionKey;
  label: string;
  group: ActionGroup;
  order: number;
  icon?: ReactNode;
  /** 权限标识，默认等于 key */
  permission?: string;
  view: ActionView;
  /** 业务逻辑：动作层不关心 UI，拿到的永远是新鲜状态 */
  handler: (ctx: ActionContext) => Promise<ActionResult | void>;
  /** 提交前（例如补充上下文、埋点） */
  beforeSubmit?: (ctx: ActionContext) => void | Promise<void>;
  /** 提交后、结果回调前 */
  afterSubmit?: (ctx: ActionContext) => void | Promise<void>;
  onSuccess?: (
    ctx: ActionContext,
    result: ActionResult | void
  ) => void | Promise<void>;
  onError?: (ctx: ActionContext, error: unknown) => void;
  /** 动作私有的中间件，会插入到公共中间件之后、handler 之前 */
  middlewares?: Middleware[];
}
