"use client";

import { SubFeatureNavRegistration } from "@/components/institute/institute-nav-context";
import { OVERVIEW_SUB_FEATURES, type OverviewSubFeatureId } from "@/lib/instituteSubFeatures";

export function LatticeNavBridge({
  navView,
  onNavViewChange,
}: {
  navView: OverviewSubFeatureId;
  onNavViewChange: (view: OverviewSubFeatureId) => void;
}) {
  return (
    <SubFeatureNavRegistration
      parentFeatureId="overview"
      items={[...OVERVIEW_SUB_FEATURES]}
      activeId={navView}
      onSelect={(id) => onNavViewChange(id as OverviewSubFeatureId)}
    />
  );
}
