import { ACTION_SUCCESS_TEXT } from "../constants";
import type { ActionResult, ApprovalApi, ExecuteParams } from "../types";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 真实项目里这里是 BPM 引擎的 /approval/execute 接口。
 * 这里只保留「耗时 + 可能失败」两个特征，用来验证 pipeline 的 loading / 重试 / 失败回调。
 */
export const approvalApi: ApprovalApi = {
  async execute(params: ExecuteParams): Promise<ActionResult> {
    await delay(320 + Math.random() * 260);

    if (params.simulateFailure) {
      return {
        success: false,
        message: `[模拟异常] ${params.action} 接口返回 500，请稍后重试`,
      };
    }

    return {
      success: true,
      message: ACTION_SUCCESS_TEXT[params.action] ?? "操作成功",
    };
  },
};

/** 组装 handler 里反复出现的调用参数，避免每个动作都拼一遍 */
export function createExecuteParams(
  action: ExecuteParams["action"],
  documentId: string,
  payload: ExecuteParams["payload"],
  simulateFailure: boolean
): ExecuteParams {
  return { action, documentId, payload, simulateFailure };
}
