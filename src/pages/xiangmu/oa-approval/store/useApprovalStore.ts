import { useContext } from "react";
import type { ApprovalState } from "../types";
import { ApprovalStoreContext } from "./context";
import type { Store } from "./createStore";

export function useApprovalStore(): Store<ApprovalState> {
  const store = useContext(ApprovalStoreContext);
  if (!store) {
    throw new Error("useApprovalStore 必须在 <ApprovalStoreProvider> 内使用");
  }
  return store;
}

export type { Store };
