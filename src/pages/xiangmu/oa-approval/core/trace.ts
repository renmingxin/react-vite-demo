import dayjs from "dayjs";
import { CURRENT_USER } from "../constants";
import type { ActionContext, TimelineStatus } from "../types";

export const nowText = () => dayjs().format("MM-DD HH:mm:ss");

/**
 * 流程轨迹写入：动作层只传业务语义（标题/意见），
 * id、操作人、时间这些「每次都要写」的东西统一收口。
 */
export function appendTrace(
  ctx: ActionContext,
  options: {
    title: string;
    status?: TimelineStatus;
    comment?: string;
    operator?: string;
  }
): void {
  const { timeline } = ctx.getState();
  ctx.dispatch.timeline.push({
    id: `trace_${Date.now()}_${timeline.length}`,
    title: options.title,
    operator: options.operator ?? CURRENT_USER.name,
    status: options.status ?? "done",
    time: nowText(),
    comment: options.comment,
  });
}
