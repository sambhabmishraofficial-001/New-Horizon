import type { ClarificationOption, WorkstreamPreference } from "./types";

export const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

export const CONVERSATIONS_KEY = "vri.planner.conversations";
export const WORK_RUNS_KEY = "vri.workspace.runs";

export const workstreams: { value: WorkstreamPreference; label: string }[] = [
  { value: "any", label: "Any work" },
  { value: "computational", label: "Computational" },
  { value: "experimental", label: "Experimental" },
  { value: "hybrid", label: "Hybrid" },
  { value: "review", label: "Review" },
  { value: "data", label: "Data" },
];

export const defaultLabCreationDomains = [
  "Mathematics",
  "Statistics",
  "Biology",
  "Chemistry",
  "Physics",
  "Clinical",
  "Engineering",
  "Computer science",
  "Literature",
  "Policy",
];

export const VRI_DELEGATION_ANSWER =
  "VRI should choose a reasonable default and state the assumption before execution.";

export const VRI_DELEGATION_OPTION: ClarificationOption = {
  label: "VRI should choose",
  detail: "Use the safest default, state the assumption, and keep execution blocked until approval.",
};
