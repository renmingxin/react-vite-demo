import { createContext } from "react";
import type { ApprovalState } from "../types";
import type { Store } from "./createStore";

/**
 * Context 里只放「永远不变的 store 实例」，不放状态树。
 * 这是干掉 Context 全量重渲染的关键：Provider 的 value 永不变化，
 * 状态变更通过 store.subscribe + useSyncExternalStore 直达需要的组件。
 */
export const ApprovalStoreContext = createContext<Store<ApprovalState> | null>(null);
