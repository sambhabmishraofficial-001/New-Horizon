"use client";

import * as React from "react";
import type { FileKind, OpenDoc } from "./data";
import type { WorkspaceBundle } from "./workspace-model";
import {
  resolveInsightNavigation,
  type ActivityItem,
  type InsightNavigation,
  type PinnedContext,
} from "./ire-navigation";
import type { InsightRecord } from "./data";

export type IreNavigation = {
  open: OpenDoc[];
  activity: ActivityItem;
  setActivity: (a: ActivityItem) => void;
  openDoc: (path: string, name: string, kind: FileKind) => void;
  openTool: (id: string, label: string, kind: FileKind) => void;
  setActive: (path: string) => void;
  closeDoc: (path: string) => void;
  activePath: string;
  activeDocName: string;
  pinnedContext: PinnedContext | null;
  pinContext: (ctx: PinnedContext | null) => void;
  followInsight: (insight: InsightRecord) => void;
};

type WorkspaceContextValue = {
  bundle: WorkspaceBundle;
  navigation: IreNavigation;
};

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null);

export function WorkspaceBundleProvider({
  value,
  children,
}: {
  value: WorkspaceBundle;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState<OpenDoc[]>(value.initialOpen);
  const [active, setActive] = React.useState<string>(value.initialActive);
  const [activity, setActivity] = React.useState<ActivityItem>("explorer");
  const [pinnedContext, setPinnedContext] = React.useState<PinnedContext | null>(
    null
  );

  React.useEffect(() => {
    setOpen(value.initialOpen);
    setActive(value.initialActive);
    setPinnedContext(null);
  }, [value]);

  const openDoc = React.useCallback((path: string, name: string, kind: FileKind) => {
    setOpen((prev) =>
      prev.find((d) => d.path === path) ? prev : [...prev, { path, name, kind }]
    );
    setActive(path);
  }, []);

  const openTool = React.useCallback((id: string, label: string, kind: FileKind) => {
    const path = `/tool/${id}/${Date.now()}`;
    setOpen((prev) => [...prev, { path, name: label, kind, toolId: id }]);
    setActive(path);
  }, []);

  const setActivePath = React.useCallback((path: string) => {
    setActive(path);
  }, []);

  const closeDoc = React.useCallback((path: string) => {
    setOpen((prev) => {
      const next = prev.filter((d) => d.path !== path);
      setActive((current) => {
        if (current !== path) return current;
        return next.length ? next[next.length - 1].path : current;
      });
      return next;
    });
  }, []);

  const applyNavigation = React.useCallback((nav: InsightNavigation) => {
    if (nav.activity) setActivity(nav.activity);
    if (nav.path && nav.name && nav.kind) {
      openDoc(nav.path, nav.name, nav.kind);
    }
    if (nav.pin) setPinnedContext(nav.pin);
  }, [openDoc]);

  const followInsight = React.useCallback(
    (insight: InsightRecord) => {
      const nav = resolveInsightNavigation(insight, value);
      if (nav) applyNavigation(nav);
    },
    [applyNavigation, value]
  );

  const activeDoc = open.find((d) => d.path === active);

  React.useEffect(() => {
    if (!activeDoc) return;
    setPinnedContext((prev) =>
      prev?.path === activeDoc.path
        ? prev
        : {
            label: activeDoc.name,
            path: activeDoc.path,
            kind: activeDoc.kind,
          }
    );
  }, [activeDoc?.path, activeDoc?.name, activeDoc?.kind]);

  const navigation: IreNavigation = {
    open,
    activity,
    setActivity,
    openDoc,
    openTool,
    setActive: setActivePath,
    closeDoc,
    activePath: active,
    activeDocName: activeDoc?.name ?? "-",
    pinnedContext,
    pinContext: setPinnedContext,
    followInsight,
  };

  return (
    <WorkspaceContext.Provider value={{ bundle: value, navigation }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceBundle(): WorkspaceBundle {
  const ctx = React.useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useWorkspaceBundle must be used inside WorkspaceBundleProvider"
    );
  }
  return ctx.bundle;
}

export function useIreNavigation(): IreNavigation {
  const ctx = React.useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useIreNavigation must be used inside WorkspaceBundleProvider"
    );
  }
  return ctx.navigation;
}
