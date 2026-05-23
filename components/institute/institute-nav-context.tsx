"use client";

import * as React from "react";

export type SubFeatureItem = {
  id: string;
  label: string;
};

export type SubFeatureNavRegistration = {
  /** Matches `InstituteFeature.id` - e.g. workspace, overview */
  parentFeatureId: string;
  items: SubFeatureItem[];
  activeId: string;
  onSelect: (id: string) => void;
  badges?: Partial<Record<string, number>>;
};

type InstituteNavContextValue = {
  subFeatureNav: SubFeatureNavRegistration | null;
  setSubFeatureNav: (state: SubFeatureNavRegistration | null) => void;
};

const InstituteNavContext = React.createContext<InstituteNavContextValue | null>(
  null
);

export function InstituteNavProvider({ children }: { children: React.ReactNode }) {
  const [subFeatureNav, setSubFeatureNavState] =
    React.useState<SubFeatureNavRegistration | null>(null);

  const setSubFeatureNav = React.useCallback(
    (state: SubFeatureNavRegistration | null) => {
      setSubFeatureNavState((prev) => {
        if (prev === state) return prev;
        if (
          prev &&
          state &&
          prev.parentFeatureId === state.parentFeatureId &&
          prev.activeId === state.activeId &&
          prev.onSelect === state.onSelect &&
          prev.items === state.items &&
          prev.badges === state.badges
        ) {
          return prev;
        }
        return state;
      });
    },
    []
  );

  const value = React.useMemo(
    () => ({ subFeatureNav, setSubFeatureNav }),
    [subFeatureNav, setSubFeatureNav]
  );

  return (
    <InstituteNavContext.Provider value={value}>
      {children}
    </InstituteNavContext.Provider>
  );
}

export function useInstituteNavContext() {
  return React.useContext(InstituteNavContext);
}

/** Mount on a feature page so sub-features appear under that institute nav item. */
export function SubFeatureNavRegistration({
  parentFeatureId,
  items,
  activeId,
  onSelect,
  badges,
}: SubFeatureNavRegistration) {
  const setSubFeatureNav = useInstituteNavContext()?.setSubFeatureNav;

  React.useLayoutEffect(() => {
    if (!setSubFeatureNav) return;
    setSubFeatureNav({ parentFeatureId, items, activeId, onSelect, badges });
    return () => setSubFeatureNav(null);
  }, [setSubFeatureNav, parentFeatureId, items, activeId, onSelect, badges]);

  return null;
}
