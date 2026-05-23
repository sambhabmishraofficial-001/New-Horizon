import type { LucideIcon } from "lucide-react";
import {
  Dna,
  FlaskConical,
  Brain,
  Activity,
  Microscope,
  CircuitBoard,
} from "lucide-react";

export type LabStatus = "active" | "idle" | "provisioning" | "maintenance";
export type BenchStatus = "running" | "idle" | "reserved" | "calibrating" | "offline";

export type VirtualLab = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  pi: string;
  program: string;
  status: LabStatus;
  description: string;
  color: string;
  mono: string;
  benchesTotal: number;
  benchesInUse: number;
  twinsAssigned: string[];
  computeBound: string;
  protocolsCount: number;
  runs24h: number;
  invariantHealth: string;
  lastActivity: string;
  icon: LucideIcon;
};

export type VirtualBench = {
  id: string;
  labId: string;
  name: string;
  instrument: string;
  status: BenchStatus;
  twin?: string;
  protocol?: string;
  step?: string;
  eta?: string;
  utilPct: number;
};

export type LabSession = {
  id: string;
  labId: string;
  labName: string;
  bench: string;
  protocol: string;
  twin: string;
  started: string;
  progressPct: number;
};

export type LabAuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export const VIRTUAL_LABS: VirtualLab[] = [
  {
    id: "ribozyme-wet",
    name: "Ribozyme Catalysis Lab",
    slug: "ribozyme-wet",
    domain: "RNA biochemistry",
    pi: "Dr. Jun Park",
    program: "K11",
    status: "active",
    description:
      "Wet-lab twin for Mg²⁺ sweeps, cleavage kinetics, and mutant libraries - instrument traces stream to Canvas in real time.",
    color: "#2A58BE",
    mono: "RC",
    benchesTotal: 8,
    benchesInUse: 5,
    twinsAssigned: ["Halo-A", "Quorum", "Dovetail"],
    computeBound: "halo-gpu-03 · 4×H100",
    protocolsCount: 24,
    runs24h: 17,
    invariantHealth: "412 / 412",
    lastActivity: "4m ago",
    icon: FlaskConical,
  },
  {
    id: "folding-insilico",
    name: "Protein Folding · In-silico",
    slug: "folding-insilico",
    domain: "Structural biology",
    pi: "Dr. Mei Chen",
    program: "K07",
    status: "active",
    description:
      "Deterministic Folding-RL rollouts with energy monotonicity rails; policies promoted only after Quorum audit.",
    color: "#5B4BB7",
    mono: "PF",
    benchesTotal: 12,
    benchesInUse: 9,
    twinsAssigned: ["Kepler", "Mercator", "Quorum"],
    computeBound: "fold-cluster · 8×A100",
    protocolsCount: 18,
    runs24h: 31,
    invariantHealth: "388 / 390",
    lastActivity: "1m ago",
    icon: Dna,
  },
  {
    id: "neuro-symbolic",
    name: "Neurosymbolic Discovery",
    slug: "neuro-symbolic",
    domain: "Cross-domain reasoning",
    pi: "Dr. Anitha Jakaprakash",
    program: "X01",
    status: "active",
    description:
      "Hypothesis graph bench with symbolic falsifiers and generative propose-and-test loops across literature and simulation.",
    color: "#0F766E",
    mono: "NS",
    benchesTotal: 6,
    benchesInUse: 4,
    twinsAssigned: ["Halo-A", "Literature", "Orchestrator"],
    computeBound: "symbolic-cpu-02",
    protocolsCount: 31,
    runs24h: 9,
    invariantHealth: "201 / 201",
    lastActivity: "12m ago",
    icon: Brain,
  },
  {
    id: "dose-response",
    name: "Dose–Response & Screening",
    slug: "dose-response",
    domain: "Pharmacology",
    pi: "Dr. Ruth Timme",
    program: "K14",
    status: "idle",
    description:
      "High-throughput titration search with falsification budget; integrates FDA-style audit trail for promoted curves.",
    color: "#B45309",
    mono: "DR",
    benchesTotal: 10,
    benchesInUse: 0,
    twinsAssigned: ["Dovetail"],
    computeBound: "-",
    protocolsCount: 12,
    runs24h: 0,
    invariantHealth: "96 / 96",
    lastActivity: "2d ago",
    icon: Activity,
  },
  {
    id: "imaging-core",
    name: "Live-Cell Imaging Core",
    slug: "imaging-core",
    domain: "Cell biology",
    pi: "Dr. Stephen Floor",
    program: "K03",
    status: "maintenance",
    description:
      "Microscopy pipelines with segmentation twins; scheduled calibration until 18:00 UTC - queued runs held in institute buffer.",
    color: "#9D174D",
    mono: "LC",
    benchesTotal: 4,
    benchesInUse: 0,
    twinsAssigned: ["Halo-A"],
    computeBound: "imaging-gpu-01",
    protocolsCount: 9,
    runs24h: 0,
    invariantHealth: "88 / 88",
    lastActivity: "6h ago",
    icon: Microscope,
  },
  {
    id: "xfer-bridge",
    name: "Cross-Program Transfer Bridge",
    slug: "xfer-bridge",
    domain: "Methods transfer",
    pi: "Institute ops",
    program: "Multi",
    status: "provisioning",
    description:
      "Shared bench for testing whether invariants and policies from one program survive transfer to another - provisioning twins and compute.",
    color: "#475569",
    mono: "XB",
    benchesTotal: 4,
    benchesInUse: 0,
    twinsAssigned: [],
    computeBound: "pending",
    protocolsCount: 0,
    runs24h: 0,
    invariantHealth: "-",
    lastActivity: "-",
    icon: CircuitBoard,
  },
];

export const VIRTUAL_BENCHES: VirtualBench[] = [
  {
    id: "b-rc-01",
    labId: "ribozyme-wet",
    name: "Bench A1",
    instrument: "qPCR · BioRad CFX",
    status: "running",
    twin: "Halo-A",
    protocol: "Mg sweep v3.2",
    step: "Cycle 28 / 40",
    eta: "~22m",
    utilPct: 78,
  },
  {
    id: "b-rc-02",
    labId: "ribozyme-wet",
    name: "Bench A2",
    instrument: "Plate reader · BMG CLARIO",
    status: "running",
    twin: "Dovetail",
    protocol: "Cleavage kinetics",
    step: "Read 12 / 96",
    eta: "~1h 10m",
    utilPct: 62,
  },
  {
    id: "b-rc-03",
    labId: "ribozyme-wet",
    name: "Bench B1",
    instrument: "Liquid handler · Hamilton",
    status: "reserved",
    twin: "Quorum",
    protocol: "Mutant library prep",
    step: "Starts 14:00",
    utilPct: 0,
  },
  {
    id: "b-rc-04",
    labId: "ribozyme-wet",
    name: "Bench B2",
    instrument: "HPLC · Agilent 1260",
    status: "idle",
    utilPct: 0,
  },
  {
    id: "b-pf-01",
    labId: "folding-insilico",
    name: "Sim rack 1",
    instrument: "Folding-RL env",
    status: "running",
    twin: "Kepler",
    protocol: "Native fold policy ε-12",
    step: "88 420 / 120 000",
    eta: "~11m",
    utilPct: 94,
  },
  {
    id: "b-pf-02",
    labId: "folding-insilico",
    name: "Sim rack 2",
    instrument: "Folding-RL env",
    status: "running",
    twin: "Kepler",
    protocol: "Ablation sweep",
    step: "12 100 / 50 000",
    eta: "~2h",
    utilPct: 88,
  },
  {
    id: "b-ns-01",
    labId: "neuro-symbolic",
    name: "Graph bench",
    instrument: "Canvas subgraph",
    status: "running",
    twin: "Orchestrator",
    protocol: "Hypothesis map K11→K07",
    step: "Falsifier pass 3",
    eta: "~8m",
    utilPct: 55,
  },
];

export const LAB_SESSIONS: LabSession[] = [
  {
    id: "sess-1",
    labId: "ribozyme-wet",
    labName: "Ribozyme Catalysis",
    bench: "Bench A1",
    protocol: "Mg sweep v3.2",
    twin: "Halo-A",
    started: "09:14",
    progressPct: 68,
  },
  {
    id: "sess-2",
    labId: "folding-insilico",
    labName: "Protein Folding",
    bench: "Sim rack 1",
    protocol: "Native fold policy ε-12",
    twin: "Kepler",
    started: "08:02",
    progressPct: 74,
  },
  {
    id: "sess-3",
    labId: "neuro-symbolic",
    labName: "Neurosymbolic",
    bench: "Graph bench",
    protocol: "Hypothesis map",
    twin: "Orchestrator",
    started: "10:41",
    progressPct: 41,
  },
];

export const LAB_AUDIT: LabAuditEntry[] = [
  {
    id: "a1",
    at: "10:52",
    actor: "Quorum",
    action: "Invariant audit",
    detail: "I-02 passed on Ribozyme bench A1 · signed",
  },
  {
    id: "a2",
    at: "10:48",
    actor: "Jun Park",
    action: "Protocol fork",
    detail: "Mg sweep v3.2 → v3.3 (increased replicates)",
  },
  {
    id: "a3",
    at: "10:31",
    actor: "Kepler",
    action: "Policy promoted",
    detail: "Kepler-ε-12 → Studio after Folding-RL rollout",
  },
  {
    id: "a4",
    at: "10:12",
    actor: "Institute ops",
    action: "Bench reserved",
    detail: "Hamilton B1 · Mutant library prep · 14:00 UTC",
  },
];

export function getLab(id: string): VirtualLab | undefined {
  return VIRTUAL_LABS.find((l) => l.id === id);
}

export function benchesForLab(labId: string): VirtualBench[] {
  return VIRTUAL_BENCHES.filter((b) => b.labId === labId);
}

export function sessionsForLab(labId: string): LabSession[] {
  return LAB_SESSIONS.filter((s) => s.labId === labId);
}
