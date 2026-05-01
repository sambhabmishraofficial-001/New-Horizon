/**
 * Muted institute palette for Canvas — parchment/ink base with restrained
 * accents (beacon + signal hues). Distinguishes node kinds without toy-bright blocks.
 */

export type NodeKindKey =
  | "hypothesis"
  | "experiment"
  | "dataset"
  | "model"
  | "invariant"
  | "anomaly";

export const canvasUi = {
  /** Tab bar — ink, not purple */
  tabBar: "#1F1F1B",
  tabActive: "#F5F2EA",
  tabBg: "#EEEEE9",
  toolbar: "#EEEEE9",
  paletteBg: "#FBFAF6",
  categoryStrip: "#F5F2EA",
  inspectorActions: "#F5F2EA",
  symbolBg: "#FBFAF6",
  textMuted: "#6B6B5E",
} as const;

/** Node cards: light faces, ink text, subtle 3D shadow */
export const nodeKindStyle: Record<
  NodeKindKey,
  { fill: string; shadow: string; accent: string; letterBg: string; ink: string; dot: string }
> = {
  hypothesis: {
    fill: "#E8EDF7",
    shadow: "#C5D0E5",
    accent: "#2A58BE",
    letterBg: "#1E4394",
    ink: "#0E2258",
    dot: "#2A58BE",
  },
  experiment: {
    fill: "#F3EFE6",
    shadow: "#DED4C4",
    accent: "#B9740C",
    letterBg: "#946010",
    ink: "#3D3018",
    dot: "#B9740C",
  },
  dataset: {
    fill: "#ECEEEA",
    shadow: "#D0D4CC",
    accent: "#5C6658",
    letterBg: "#3D4538",
    ink: "#1F1F1B",
    dot: "#4C4C42",
  },
  model: {
    fill: "#EDEAF5",
    shadow: "#D4CCE4",
    accent: "#5B3FB0",
    letterBg: "#45368A",
    ink: "#2A1F4D",
    dot: "#5B3FB0",
  },
  invariant: {
    fill: "#E6F1EC",
    shadow: "#BFD9CC",
    accent: "#12785A",
    letterBg: "#0E5A44",
    ink: "#0A2E24",
    dot: "#12785A",
  },
  anomaly: {
    fill: "#F3E8EC",
    shadow: "#E0CAD2",
    accent: "#B4315F",
    letterBg: "#8B2848",
    ink: "#4A1F2E",
    dot: "#B4315F",
  },
};

export type StatusKind = "running" | "passing" | "pending" | "failing" | "awaiting";

export const statusStyle: Record<StatusKind, { bg: string; fg: string; label: string }> = {
  running: { bg: "#F0E6D4", fg: "#7A5A12", label: "running" },
  passing: { bg: "#DCEBE4", fg: "#0E5A44", label: "passing" },
  pending: { bg: "#E8E8E2", fg: "#4C4C42", label: "pending" },
  failing: { bg: "#F0DEE4", fg: "#9A2850", label: "failing" },
  awaiting: { bg: "#F3EFE6", fg: "#8A6210", label: "awaits" },
};

export const edgeStroke = {
  default: "#8E8E80",
  falsify: "#B4315F",
  audit: "#12785A",
} as const;

export function darkenHex(hex: string, amt = 0.18): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) * (1 - amt)) | 0;
  const g = Math.max(0, ((n >> 8) & 0xff) * (1 - amt)) | 0;
  const b = Math.max(0, (n & 0xff) * (1 - amt)) | 0;
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
