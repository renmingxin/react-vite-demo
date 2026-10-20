import { createExecuteParams } from "../services/approvalApi";
import type { ActionContext, ActionKey, ActionResult } from "../types";

/**
 * 动作 handler 的固定开场：把「当前单据 id + 最新 payload + 演示开关」
 * 从最新快照里取出来交给接口层，避免每个动作都写一遍。
 */
export function callApi(ctx: ActionContext, action: ActionKey): Promise<ActionResult> {
  const state = ctx.getState();
  return ctx.api.execute(
    createExecuteParams(action, state.document.id, ctx.payload, state.ui.simulateFailure)
  );
}
