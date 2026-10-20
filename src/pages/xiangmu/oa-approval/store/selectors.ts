import type { ApprovalState } from "../types";

/**
 * selector 必须稳定（模块级常量），否则每次渲染都是新函数，
 * `useStoreData` 的缓存命中率会下降（正确性有 isEqual 兜底，但会多做一次计算）。
 */
export const selectDocument = (state: ApprovalState) => state.document;
export const selectTitle = (state: ApprovalState) => state.document.title;
export const selectStatus = (state: ApprovalState) => state.document.status;
export const selectCurrentNode = (state: ApprovalState) => state.document.currentNode;
export const selectDocumentCode = (state: ApprovalState) => state.document.code;
export const selectHandler = (state: ApprovalState) => state.document.handler;
export const selectSubmitter = (state: ApprovalState) => state.document.submitter;
export const selectSubmitTime = (state: ApprovalState) => state.document.submitTime;

export const selectForm = (state: ApprovalState) => state.form;
export const selectAmount = (state: ApprovalState) => state.form.amount;

export const selectSummaryDetail = (state: ApprovalState) => state.summaryDetail;
export const selectSummaryGroups = (state: ApprovalState) => state.summaryDetail.groups;
export const selectSummaryUpdatedAt = (state: ApprovalState) => state.summaryDetail.updatedAt;
export const selectTimeline = (state: ApprovalState) => state.timeline;
export const selectPermission = (state: ApprovalState) => state.permission;

export const selectPending = (state: ApprovalState) => state.ui.pending;
export const selectActiveAction = (state: ApprovalState) => state.ui.activeAction;
export const selectSimulateFailure = (state: ApprovalState) => state.ui.simulateFailure;
export const selectLastMessage = (state: ApprovalState) => state.ui.lastMessage;

export const selectNoise = (state: ApprovalState) => state.perf.noise;
