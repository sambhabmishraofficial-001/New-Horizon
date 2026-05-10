"use client";

import * as React from "react";
import type { WorkspaceBundle } from "./workspace-model";

const WorkspaceBundleContext = React.createContext<WorkspaceBundle | null>(
  null
);

export function WorkspaceBundleProvider({
  value,
  children,
}: {
  value: WorkspaceBundle;
  children: React.ReactNode;
}) {
  return (
    <WorkspaceBundleContext.Provider value={value}>
      {children}
    </WorkspaceBundleContext.Provider>
  );
}

export function useWorkspaceBundle(): WorkspaceBundle {
  const ctx = React.useContext(WorkspaceBundleContext);
  if (!ctx) {
    throw new Error(
      "useWorkspaceBundle must be used inside WorkspaceBundleProvider"
    );
  }
  return ctx;
}
