"use client";

import * as React from "react";

const SIDEBAR_KEY = "nh_institute_sidebar_collapsed";
const GROUPS_KEY = "nh_institute_nav_groups";

type StoredGroups = Record<string, boolean>;

type InstituteSidebarContextValue = {
  ready: boolean;
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  toggleCollapsed: () => void;
  toggleGroup: (id: string) => void;
  setGroupExpanded: (id: string, open: boolean) => void;
  isGroupExpanded: (id: string, activeOnRoute: boolean) => boolean;
};

const InstituteSidebarContext =
  React.createContext<InstituteSidebarContextValue | null>(null);

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

function readGroups(): StoredGroups {
  try {
    const raw = window.localStorage.getItem(GROUPS_KEY);
    return raw ? (JSON.parse(raw) as StoredGroups) : {};
  } catch {
    return {};
  }
}

export function InstituteSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsedState] = React.useState(false);
  const [expandedGroups, setExpandedGroupsState] = React.useState<StoredGroups>({});
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setCollapsedState(readCollapsed());
    setExpandedGroupsState(readGroups());
    setReady(true);
  }, []);

  const setCollapsed = React.useCallback((next: boolean) => {
    setCollapsedState(next);
    try {
      window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const setGroupExpanded = React.useCallback((id: string, open: boolean) => {
    setExpandedGroupsState((prev) => {
      const next = { ...prev, [id]: open };
      try {
        window.localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleGroup = React.useCallback((id: string) => {
    setExpandedGroupsState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const isGroupExpanded = React.useCallback(
    (id: string, activeOnRoute: boolean) => {
      if (id in expandedGroups) return expandedGroups[id];
      return activeOnRoute;
    },
    [expandedGroups]
  );

  const value = React.useMemo(
    () => ({
      ready,
      collapsed,
      setCollapsed,
      toggleCollapsed,
      toggleGroup,
      setGroupExpanded,
      isGroupExpanded,
    }),
    [
      ready,
      collapsed,
      setCollapsed,
      toggleCollapsed,
      toggleGroup,
      setGroupExpanded,
      isGroupExpanded,
    ]
  );

  return React.createElement(
    InstituteSidebarContext.Provider,
    { value },
    children
  );
}

export function useInstituteSidebarState(): InstituteSidebarContextValue {
  const ctx = React.useContext(InstituteSidebarContext);
  if (!ctx) {
    throw new Error(
      "useInstituteSidebarState must be used within InstituteSidebarProvider"
    );
  }
  return ctx;
}

export function useInstituteSidebarStateOptional() {
  return React.useContext(InstituteSidebarContext);
}
