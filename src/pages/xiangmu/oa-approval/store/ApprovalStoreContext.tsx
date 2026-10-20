import { useState } from "react";
import type { ReactNode } from "react";
import type { ApprovalState } from "../types";
import { ApprovalStoreContext } from "./context";
import { createStore } from "./createStore";

export function ApprovalStoreProvider({
  initialState,
  children,
}: {
  initialState: ApprovalState;
  children: ReactNode;
}) {
  const [store] = useState(() => createStore(initialState));

  return (
    <ApprovalStoreContext.Provider value={store}>
      {children}
    </ApprovalStoreContext.Provider>
  );
}
