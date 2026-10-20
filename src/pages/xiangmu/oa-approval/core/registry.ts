import type { ActionGroup, ActionKey, ApprovalAction } from "../types";

const registry = new Map<ActionKey, ApprovalAction>();

export function registerAction(action: ApprovalAction): void {
  if (registry.has(action.key)) {
    console.warn(`[oa-approval] 动作 ${action.key} 被重复注册，后者覆盖前者`);
  }
  registry.set(action.key, action);
}

export function getAction(key: ActionKey): ApprovalAction | undefined {
  return registry.get(key);
}

export function getAllActions(): ApprovalAction[] {
  return [...registry.values()].sort((a, b) => a.order - b.order);
}

/** 权限判定唯一入口：UI 过滤与 pipeline 兜底共用同一份逻辑 */
export function isActionAllowed(
  action: ApprovalAction,
  permission: Record<string, boolean>
): boolean {
  return permission[action.permission ?? action.key] === true;
}

export function getVisibleActions(
  permission: Record<string, boolean>
): ApprovalAction[] {
  return getAllActions().filter((action) => isActionAllowed(action, permission));
}

export function groupActions(actions: ApprovalAction[]): Record<ActionGroup, ApprovalAction[]> {
  const groups: Record<ActionGroup, ApprovalAction[]> = {
    primary: [],
    secondary: [],
    danger: [],
  };
  actions.forEach((action) => groups[action.group].push(action));
  return groups;
}

/**
 * 注册动作的唯一入口在 `actions/index.ts`（显式注册）。
 *
 * 这里刻意不反向 import 动作目录：
 * - 避免 registry ↔ actions 的循环依赖；
 * - 注册时机由页面入口决定，动作目录本身对注册表零耦合；
 * - 之后要改成按需加载，只需要改 `actions/index.ts` 的 import 方式。
 */
