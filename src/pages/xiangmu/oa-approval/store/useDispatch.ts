import { useMemo } from "react";
import dayjs from "dayjs";
import type { ApprovalDispatch, ApprovalState, TimelineNode } from "../types";
import { useApprovalStore } from "./useApprovalStore";

/**
 * 命令式更新收口。
 *
 * 业务层不再手写 `{...state, form: {...state.form, amount}}`，而是调用语义化命令：
 * - `dispatch.form.patch` 普通字段局部合并
 * - `dispatch.summaryDetail.replace` BPM 摘要详情全量替换（后端返回整包，语义不同）
 * - `dispatch.transaction` 多次写入合并为一次通知
 *
 * dispatch 对象本身在 store 生命周期内保持稳定引用，可以安全地放进依赖数组。
 */
export function useDispatch(): ApprovalDispatch {
  const store = useApprovalStore();

  return useMemo<ApprovalDispatch>(() => {
    const pushTimeline = (node: TimelineNode) =>
      store.setState((prev) => ({ timeline: [...prev.timeline, node] }));

    return {
      patch: (patch) => store.setState(patch),

      document: {
        patch: (patch) =>
          store.setState((prev) => ({ document: { ...prev.document, ...patch } })),
      },

      form: {
        patch: (patch) =>
          store.setState((prev) => ({ form: { ...prev.form, ...patch } })),
      },

      summaryDetail: {
        /** 全量替换：处理「后端下发整包摘要」的语义，避免业务层散落合并判断 */
        replace: (detail) => store.setState({ summaryDetail: detail }),
        /**
         * 局部更新：只改某个分组下的某一项。
         * BPM 的摘要详情是 groups[].items[] 两层结构，业务层不需要知道这一层的合并规则。
         */
        upsertItem: (groupId, item) =>
          store.setState((prev) => {
            const { groups } = prev.summaryDetail;
            const hasGroup = groups.some((group) => group.key === groupId);

            const nextGroups = hasGroup
              ? groups.map((group) => {
                  if (group.key !== groupId) return group;
                  const exists = group.items.some((it) => it.key === item.key);
                  return {
                    ...group,
                    items: exists
                      ? group.items.map((it) => (it.key === item.key ? item : it))
                      : [...group.items, item],
                  };
                })
              : [...groups, { key: groupId, title: groupId, items: [item] }];

            return {
              summaryDetail: {
                groups: nextGroups,
                updatedAt: dayjs().format("MM-DD HH:mm:ss"),
              },
            };
          }),
      },

      timeline: {
        push: pushTimeline,
        reset: (nodes) => store.setState({ timeline: nodes }),
      },

      permission: {
        patch: (patch) =>
          store.setState((prev) => ({ permission: { ...prev.permission, ...patch } })),
      },

      ui: {
        setActiveAction: (key) =>
          store.setState((prev) => ({ ui: { ...prev.ui, activeAction: key } })),
        setPending: (pending) =>
          store.setState((prev) => ({ ui: { ...prev.ui, pending } })),
        setSimulateFailure: (simulateFailure) =>
          store.setState((prev) => ({ ui: { ...prev.ui, simulateFailure } })),
        setLastMessage: (lastMessage) =>
          store.setState((prev) => ({ ui: { ...prev.ui, lastMessage } })),
      },

      transaction: (fn) => store.transaction(fn),

      reset: (state: ApprovalState) => store.setState(state),
    };
  }, [store]);
}
