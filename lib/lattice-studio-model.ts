export type ExperimentStatus =
  | "queued"
  | "running"
  | "blocked"
  | "drifting"
  | "failed"
  | "done";

export type LatticeNavId =
  | "overview"
  | "guide"
  | "graph"
  | "agent"
  | "explore"
  | "sources"
  | "skills"
  | "cli";

export type ArtifactKind =
  | "hypothesis"
  | "protocol"
  | "metrics"
  | "figure"
  | "walkthrough"
  | "claim"
  | "repro";

export type StudioView = "studio" | "graph";

export type DetailTab = "chat" | "artifacts" | "run" | "diff";

export type LatticeLab = {
  id: string;
  name: string;
  visibility: "private" | "lab" | "public";
  reproReceived: number;
};

export type LatticeExperiment = {
  id: string;
  code: string;
  title: string;
  labId: string;
  status: ExperimentStatus;
  updatedAt: string;
  claimHash: string;
  runHash: string;
  reproCount: number;
  contradicts: number;
  program: string;
};

export type LatticeArtifact = {
  id: string;
  experimentId: string;
  kind: ArtifactKind;
  title: string;
  hash: string;
  preview: string;
  act: "hypothesis" | "protocol" | "run" | "walkthrough";
};

export type LatticeMessage = {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  time: string;
};

export type GraphNode = {
  id: string;
  label: string;
  hash: string;
  type: "run" | "claim";
  x: number;
  y: number;
  reproCount?: number;
  contradicted?: boolean;
};

export type GraphEdge = {
  from: string;
  to: string;
  kind: "produces" | "replicates" | "contradicts" | "supersedes";
};

export const LATTICE_NAV: { id: LatticeNavId; label: string; hint?: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "guide", label: "Guide", hint: "Onboarding assistant" },
  { id: "graph", label: "Graph", hint: "Project DAG" },
  { id: "agent", label: "Agent" },
  { id: "explore", label: "Explore" },
  { id: "sources", label: "Sources" },
  { id: "skills", label: "Skills" },
  { id: "cli", label: "CLI", hint: "Coming soon" },
];

export const LATTICE_LABS: LatticeLab[] = [
  { id: "my-lab", name: "my-lab", visibility: "private", reproReceived: 12 },
  { id: "gladia", name: "gladia-lab", visibility: "lab", reproReceived: 47 },
  { id: "bio", name: "bio-scratch", visibility: "private", reproReceived: 3 },
];

export const LATTICE_EXPERIMENTS: LatticeExperiment[] = [
  {
    id: "exp-447",
    code: "exp-447",
    title: "Mg²⁺ sweep replicates Zhang '25 loop-3 claim",
    labId: "my-lab",
    status: "running",
    updatedAt: "2m ago",
    claimHash: "cid:8f3a…c21",
    runHash: "cid:91bd…04e",
    reproCount: 2,
    contradicts: 0,
    program: "K11 · ribozyme",
  },
  {
    id: "exp-446",
    code: "exp-446",
    title: "Invariant I-03 breach triage — arm 4",
    labId: "my-lab",
    status: "blocked",
    updatedAt: "18m ago",
    claimHash: "cid:2c11…9af",
    runHash: "cid:77aa…112",
    reproCount: 0,
    contradicts: 1,
    program: "K11 · ribozyme",
  },
  {
    id: "exp-445",
    code: "exp-445",
    title: "Public scRNA atlas — fibrosis biomarkers",
    labId: "gladia",
    status: "done",
    updatedAt: "1h ago",
    claimHash: "cid:aa90…331",
    runHash: "cid:551c…88d",
    reproCount: 5,
    contradicts: 0,
    program: "P04 · EGFR",
  },
  {
    id: "exp-444",
    code: "exp-444",
    title: "EDTA titration — 7 arm rebuttal draft",
    labId: "my-lab",
    status: "drifting",
    updatedAt: "2h ago",
    claimHash: "cid:019a…771",
    runHash: "cid:fe02…abc",
    reproCount: 1,
    contradicts: 0,
    program: "K11 · ribozyme",
  },
  {
    id: "exp-443",
    code: "exp-443",
    title: "Folding-RL seed 7c3 — ECE drift audit",
    labId: "bio",
    status: "failed",
    updatedAt: "3h ago",
    claimHash: "cid:8841…002",
    runHash: "cid:110f…99a",
    reproCount: 0,
    contradicts: 0,
    program: "F07 · folding",
  },
  {
    id: "exp-442",
    code: "exp-442",
    title: "Literature synthesis — Okonkwo vs Zhang",
    labId: "my-lab",
    status: "queued",
    updatedAt: "5h ago",
    claimHash: "cid:4410…eed",
    runHash: "cid:pending",
    reproCount: 0,
    contradicts: 0,
    program: "K11 · ribozyme",
  },
];

export const LATTICE_ARTIFACTS: LatticeArtifact[] = [
  {
    id: "a1",
    experimentId: "exp-447",
    kind: "hypothesis",
    title: "Hypothesis card",
    hash: "cid:8f3a…c21",
    act: "hypothesis",
    preview:
      "Loop-3 Mg²⁺ coordination shifts catalytic rate under 2 mM EDTA without denaturing tertiary contacts.",
  },
  {
    id: "a2",
    experimentId: "exp-447",
    kind: "protocol",
    title: "Protocol · 7-arm sweep",
    hash: "cid:proto-447",
    act: "protocol",
    preview: "Variables: [Mg²⁺], EDTA, temperature. Seeds: 7. Sandbox: modal/gpu-a10.",
  },
  {
    id: "a3",
    experimentId: "exp-447",
    kind: "metrics",
    title: "Metrics table",
    hash: "cid:met-447",
    act: "run",
    preview: "k_cat: 0.84 ± 0.06 s⁻¹ · ΔG‡: -2.1 kcal/mol · n=7 arms",
  },
  {
    id: "a4",
    experimentId: "exp-447",
    kind: "figure",
    title: "Catalytic rate vs EDTA",
    hash: "cid:fig-447",
    act: "run",
    preview: "Commentable plot — highlight region to iterate subplot.",
  },
  {
    id: "a5",
    experimentId: "exp-447",
    kind: "walkthrough",
    title: "Reproducibility walkthrough",
    hash: "cid:walk-447",
    act: "walkthrough",
    preview: "To re-run: lattice repro exp-447 --seed 7 --env lockfile.env",
  },
];

export const LATTICE_MESSAGES: LatticeMessage[] = [
  {
    id: "m1",
    role: "system",
    content: "Stage lease acquired · compute grant $42 / $50 cap",
    time: "09:14",
  },
  {
    id: "m2",
    role: "user",
    content: "Replicate Zhang '25 loop-3 under EDTA perturbation. Flag if k_cat drops >15%.",
    time: "09:15",
  },
  {
    id: "m3",
    role: "agent",
    content:
      "Spawned 7-arm sweep. Artifacts: hypothesis card, protocol, metrics table, figure. Awaiting approval for external API (arxiv.org).",
    time: "09:16",
  },
];

export const LATTICE_GRAPH_NODES: GraphNode[] = [
  { id: "n1", label: "RUN-441", hash: "cid:441…", type: "run", x: 80, y: 220, reproCount: 3 },
  { id: "n2", label: "CLAIM-12", hash: "cid:8f3…", type: "claim", x: 240, y: 120 },
  { id: "n3", label: "RUN-447", hash: "cid:91b…", type: "run", x: 400, y: 220, reproCount: 2 },
  { id: "n4", label: "REPRO-09", hash: "cid:rep…", type: "run", x: 560, y: 140, reproCount: 5 },
  { id: "n5", label: "CLAIM-19", hash: "cid:019…", type: "claim", x: 320, y: 320, contradicted: true },
];

export const LATTICE_GRAPH_EDGES: GraphEdge[] = [
  { from: "n1", to: "n2", kind: "produces" },
  { from: "n2", to: "n3", kind: "supersedes" },
  { from: "n3", to: "n4", kind: "replicates" },
  { from: "n2", to: "n5", kind: "contradicts" },
];

export const LATTICE_COMMANDS = [
  { id: "replicate", label: "/replicate exp-447", hint: "Spawn REPRO attempt against target hash" },
  { id: "contradict", label: "/contradict @claim:8f3a", hint: "Open adjudication thread" },
  { id: "sweep", label: "/sweep params.edta 0.5:3.0", hint: "Parallel fan-out from composer" },
  { id: "figure", label: "/figure catalytic-rate", hint: "Generate commentable figure artifact" },
  { id: "graph", label: "Toggle graph view", hint: "⌘E Studio ↔ Graph" },
  { id: "studio", label: "Toggle studio view", hint: "⌘E Graph ↔ Studio" },
  { id: "diff", label: "Open run diff", hint: "Compare RUN-441 vs RUN-447" },
  { id: "zenodo", label: "Mint DOI via Zenodo", hint: "Tag content-addressed release" },
];

export const STATUS_LABEL: Record<ExperimentStatus, string> = {
  queued: "queued",
  running: "running",
  blocked: "blocked-on-approval",
  drifting: "drifting",
  failed: "failed",
  done: "done",
};

export function experimentsForLab(labId: string | "all") {
  if (labId === "all") return LATTICE_EXPERIMENTS;
  return LATTICE_EXPERIMENTS.filter((e) => e.labId === labId);
}

export function artifactsForExperiment(id: string) {
  return LATTICE_ARTIFACTS.filter((a) => a.experimentId === id);
}
