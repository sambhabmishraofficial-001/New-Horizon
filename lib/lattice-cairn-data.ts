export type LatticeInboxItem = {
  id: string;
  title: string;
  status: "running" | "blocked" | "done" | "drifting" | "failed" | "queued";
  snippet: string;
  time: string;
  active?: boolean;
};

export type LatticeGraphNode = {
  id: string;
  type: "claim" | "run" | "repro" | "fork";
  label: string;
  cid: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

export type LatticeGraphEdge = {
  from: string;
  to: string;
  type: "produces" | "repro" | "contradicts" | "forks" | "supersedes" | "cites";
};

export const LATTICE_CAIRN_DATA = {
  user: {
    name: "Mira Khatri",
    handle: "@mkhatri",
    affiliation: "Allen Institute · Vision Team",
    avatarLetter: "M",
  },
  labs: [
    { id: "vision", name: "vision-scaling", color: "#2563eb", count: 124 },
    { id: "diff", name: "diffusion-laws", color: "#2563eb", count: 86 },
    { id: "shared", name: "khatri-lab/shared", color: "#7c3aed", count: 14 },
  ],
  inbox: [
    {
      id: "exp-0447",
      title: "Sweep: width vs depth at compute-optimal",
      status: "running",
      snippet: "Run 4/12 · loss=2.31 · 38m elapsed · A100×4",
      time: "now",
      active: true,
    },
    {
      id: "exp-0446",
      title: "Replicate Hoffmann '22 with DiT backbone",
      status: "blocked",
      snippet: "Awaiting approval: compute spend $84.20 → $210.00",
      time: "4m",
    },
    {
      id: "exp-0445",
      title: "Ablate noise schedule (cosine vs sigmoid)",
      status: "done",
      snippet: "FID 18.2 → 16.7 · walkthrough ready · 2 REPROs signed",
      time: "2h",
    },
    {
      id: "exp-0444",
      title: "Param sweep — learning rate × batch",
      status: "drifting",
      snippet: "Agent extended scope to 3 new dims · review",
      time: "5h",
    },
    {
      id: "exp-0443",
      title: "CIFAR-100 control baseline",
      status: "failed",
      snippet: "Dataset hash mismatch on epoch 12 · halted",
      time: "1d",
    },
    {
      id: "exp-0442",
      title: "Reproduce @rmehta/exp-0291 (UNet variant)",
      status: "queued",
      snippet: "Queued behind exp-0447 · est. 4h start",
      time: "1d",
    },
    {
      id: "exp-0441",
      title: "Fork: @gladia/exp-1108 + lower LR",
      status: "done",
      snippet: "Confirmed loss-divergence claim · REPRO signed",
      time: "3d",
    },
  ] satisfies LatticeInboxItem[],
  graph: {
    nodes: [
      { id: "c-001", type: "claim", label: "Diffusion loss scales as L(N,D) ∝ N^-0.34", cid: "bafy...c7e", x: 600, y: 80, size: 22, color: "#2563eb" },
      { id: "r-040", type: "run", label: "exp-0440 · 1.3B params · 200B tok", cid: "bafy...8d1", x: 360, y: 200, size: 16, color: "#2563eb" },
      { id: "r-041", type: "run", label: "exp-0441 · 2.7B params · 400B tok", cid: "bafy...2a4", x: 600, y: 200, size: 16, color: "#2563eb" },
      { id: "r-042", type: "run", label: "exp-0442 · 7B params · 800B tok", cid: "bafy...9b3", x: 840, y: 200, size: 16, color: "#2563eb" },
      { id: "p-040a", type: "repro", label: "@rmehta REPRO ✓", cid: "bafy...11f", x: 240, y: 320, size: 11, color: "#2563eb" },
      { id: "p-040b", type: "repro", label: "@gladia REPRO ✓", cid: "bafy...22a", x: 360, y: 360, size: 11, color: "#2563eb" },
      { id: "p-041a", type: "repro", label: "@cohere REPRO ✓", cid: "bafy...3bb", x: 540, y: 340, size: 11, color: "#2563eb" },
      { id: "p-041b", type: "repro", label: "@khatri REPRO ✓", cid: "bafy...4cc", x: 660, y: 360, size: 11, color: "#2563eb" },
      { id: "r-447", type: "run", label: "exp-0447 · width-vs-depth sweep", cid: "bafy...5dd", x: 960, y: 340, size: 16, color: "#2563eb" },
      { id: "c-002", type: "claim", label: "Width matters less than depth ≥ 24L", cid: "bafy...6ee", x: 1040, y: 460, size: 18, color: "#dc2626" },
      { id: "f-001", type: "fork", label: "Fork → @mkhatri/diff-laws", cid: "bafy...7ff", x: 760, y: 480, size: 13, color: "#7c3aed" },
      { id: "r-446", type: "run", label: "exp-0446 · DiT backbone replicate", cid: "bafy...88a", x: 600, y: 580, size: 16, color: "#2563eb" },
      { id: "c-003", type: "claim", label: "Scaling holds across DiT and UNet", cid: "bafy...99b", x: 460, y: 700, size: 20, color: "#2563eb" },
      { id: "c-000", type: "claim", label: "Hoffmann '22 — Chinchilla scaling", cid: "bafy...000", x: 240, y: 80, size: 18, color: "#9ca3af" },
    ] satisfies LatticeGraphNode[],
    edges: [
      { from: "r-040", to: "c-001", type: "produces" },
      { from: "r-041", to: "c-001", type: "produces" },
      { from: "r-042", to: "c-001", type: "produces" },
      { from: "p-040a", to: "r-040", type: "repro" },
      { from: "p-040b", to: "r-040", type: "repro" },
      { from: "p-041a", to: "r-041", type: "repro" },
      { from: "p-041b", to: "r-041", type: "repro" },
      { from: "r-447", to: "c-001", type: "contradicts" },
      { from: "r-447", to: "c-002", type: "produces" },
      { from: "f-001", to: "c-001", type: "forks" },
      { from: "f-001", to: "r-446", type: "produces" },
      { from: "r-446", to: "c-003", type: "produces" },
      { from: "c-003", to: "c-001", type: "supersedes" },
      { from: "c-001", to: "c-000", type: "cites" },
    ] satisfies LatticeGraphEdge[],
  },
} as const;

export type LatticeSurface = "studio" | "graph" | "node" | "profiles" | "docs";

export type DetailTab =
  | "feed"
  | "run"
  | "walkthrough"
  | "reviews"
  | "repros"
  | "trust";
