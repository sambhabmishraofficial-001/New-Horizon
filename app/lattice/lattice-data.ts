export type LatticeProgram = {
  id: string;
  code: string;
  title: string;
  progress?: number;
  status: "active" | "queued" | "complete";
  icon: "dna" | "molecule" | "cell" | "graph";
};

export type LatticeTask = {
  id: string;
  code: string;
  title: string;
  programId: string;
  progress?: number;
  updatedAt: string;
};

export const LATTICE_PROGRAMS: LatticeProgram[] = [
  {
    id: "k11",
    code: "K11",
    title: "Ribozyme catalysis · Mg²⁺ sweep",
    progress: 68,
    status: "active",
    icon: "molecule",
  },
  {
    id: "egfr",
    code: "P04",
    title: "EGFR resistance · combination arms",
    progress: 41,
    status: "active",
    icon: "cell",
  },
  {
    id: "fold",
    code: "F07",
    title: "Folding-RL environment · seed 7c3",
    status: "queued",
    icon: "graph",
  },
];

export const LATTICE_TASKS: LatticeTask[] = [
  {
    id: "t1",
    code: "TASK #71A4",
    title: "Invariant I-03 breach triage - run 71a arm 4",
    programId: "k11",
    progress: 18,
    updatedAt: "8m ago",
  },
  {
    id: "t2",
    code: "TASK #62F8B3",
    title: "Public data discovery of fibrosis biomarkers in scRNA-seq atlases",
    programId: "egfr",
    progress: 18,
    updatedAt: "2h ago",
  },
  {
    id: "t3",
    code: "TASK #A91C2",
    title: "Literature synthesis - Zhang '25 vs Okonkwo '24 on loop-3",
    programId: "k11",
    updatedAt: "22m ago",
  },
  {
    id: "t4",
    code: "TASK #E03B1",
    title: "Draft rebuttal experiment - EDTA titration 7 arms",
    programId: "k11",
    updatedAt: "1h ago",
  },
  {
    id: "t5",
    code: "TASK #K07FF",
    title: "Kepler calibration audit - ECE drift on K07",
    programId: "fold",
    updatedAt: "3h ago",
  },
  {
    id: "t6",
    code: "TASK #Q412",
    title: "Cross-program invariant candidate I-07 - buffer age correlation",
    programId: "k11",
    updatedAt: "2h ago",
  },
];

export const PLAYGROUND_EXAMPLES = [
  "Connect tau biology to early neurodegeneration signals in entorhinal cortex",
  "Mechanism of entorhinal cortex vulnerability in Alzheimer's - rank by evidence strength",
  "Design a Mg²⁺ sweep that falsifies the loop-3 secondary-site hypothesis",
  "Synthesize overnight anomalies into a standup brief for Program K11",
];

export const PROMPT_STARTERS = [
  {
    label: "Open Program K11 in the integrated workspace",
    href: "/ire",
  },
  {
    label: "Show active runs and invariant status for this program",
    action: "runs",
  },
  {
    label: "What can the co-science team do on this program?",
    action: "team",
  },
];

export const LATTICE_TWINS = [
  {
    name: "Halo-A",
    role: "Literature synthesist",
    mono: "HA",
    color: "#1F1F1B",
    now: "Drafting counter-arguments to Zhang '25",
    status: "running",
  },
  {
    name: "Quorum",
    role: "Invariant auditor",
    mono: "Q",
    color: "#12785A",
    now: "412 / 418 invariants holding",
    status: "running",
  },
  {
    name: "Dovetail",
    role: "Experiment designer",
    mono: "D",
    color: "#B9740C",
    now: "Mg²⁺ sweep · 7 arms proposed",
    status: "standby",
  },
  {
    name: "Aletheia",
    role: "Anomaly triage",
    mono: "A",
    color: "#B4315F",
    now: "2 anomalies queued for review",
    status: "flagged",
  },
];

export const LATTICE_FEED = [
  {
    who: "Aletheia",
    when: "8 min ago",
    title: "Replicate variance σ = 0.19 exceeds invariant band in arm 4.",
    href: "/ire",
  },
  {
    who: "Halo-A",
    when: "22 min ago",
    title: "Mg²⁺ bends k_obs via secondary site near loop-3.",
    href: "/canvas",
  },
  {
    who: "Quorum",
    when: "2 h ago",
    title: "Candidate invariant I-07 - buffer age correlation (p < 0.01).",
    href: "/invariants",
  },
];
