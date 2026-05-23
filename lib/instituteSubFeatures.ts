import type { ActivityItem } from "@/app/ire/ire-navigation";

/** Sub-features shown under Workspace in the institute sidebar. */
export const WORKSPACE_SUB_FEATURES: { id: ActivityItem; label: string }[] = [
  { id: "explorer", label: "Explorer" },
  { id: "search", label: "Search" },
  { id: "program", label: "Program map" },
  { id: "hypotheses", label: "Hypotheses" },
  { id: "experiments", label: "Runs" },
  { id: "data", label: "Data" },
  { id: "literature", label: "Evidence" },
  { id: "protocols", label: "Protocols" },
  { id: "lineage", label: "Provenance" },
];

/** Sub-features shown under Overview (/lattice). */
export const OVERVIEW_SUB_FEATURES = [
  { id: "playground", label: "Co-science" },
  { id: "tasks", label: "Programs" },
] as const;

export type OverviewSubFeatureId = (typeof OVERVIEW_SUB_FEATURES)[number]["id"];

/** Institute nav items that expose sub-features in the sidebar. */
export const EXPANDABLE_INSTITUTE_FEATURES = new Set(["overview", "workspace"]);

export function staticSubFeaturesFor(parentFeatureId: string): { id: string; label: string }[] {
  if (parentFeatureId === "overview") return [...OVERVIEW_SUB_FEATURES];
  if (parentFeatureId === "workspace") return WORKSPACE_SUB_FEATURES;
  return [];
}
