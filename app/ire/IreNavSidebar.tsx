"use client";

import * as React from "react";
import { SubFeatureNavRegistration } from "@/components/institute/institute-nav-context";
import { WORKSPACE_SUB_FEATURES } from "@/lib/instituteSubFeatures";
import { useWorkspaceBundle } from "./workspace-context";
import type { ActivityItem } from "./ire-navigation";

export function IreNavBridge({
  active,
  onSelect,
}: {
  active: ActivityItem;
  onSelect: (id: ActivityItem) => void;
}) {
  const { chrome } = useWorkspaceBundle();

  const badges = React.useMemo(() => {
    const next: Partial<Record<string, number>> = {};
    if (chrome.experimentActivityBadge != null) {
      next.experiments = chrome.experimentActivityBadge;
    }
    if (chrome.literatureActivityBadge != null) {
      next.literature = chrome.literatureActivityBadge;
    }
    return next;
  }, [chrome.experimentActivityBadge, chrome.literatureActivityBadge]);

  const handleSelect = React.useCallback(
    (id: string) => onSelect(id as ActivityItem),
    [onSelect]
  );

  return (
    <SubFeatureNavRegistration
      parentFeatureId="workspace"
      items={WORKSPACE_SUB_FEATURES}
      activeId={active}
      onSelect={handleSelect}
      badges={badges}
    />
  );
}
