export type Twin = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  mono: string;
  color: string;
  line: string;
  bio: string;
  instruments: string[];
  invariants: string[];
  status: "reasoning" | "training" | "awaiting" | "idle" | "proposing" | "passing";
  lineage: string;
  citations: number;
  agreeRate: number;
  lastRun: string;
};

export const TWINS: Twin[] = [
  {
    id: "halo-a",
    name: "Halo-A",
    role: "Literature synthesist",
    specialty: "Argumentation · counter-argument · synthesis",
    mono: "HA",
    color: "linear-gradient(135deg,#1E4394,#5B3FB0)",
    line: "#5B3FB0",
    bio:
      "Halo-A reads at institute scale. It produces structured arguments with counter-arguments and proposes experimental rebuttals rather than summaries.",
    instruments: ["Library", "Canvas", "Citations graph"],
    invariants: ["Citation provenance", "Rebuttal ≥ 1 per claim"],
    status: "reasoning",
    lineage: "gpt-λ-7 → finetune-k11-lit-v3",
    citations: 4182,
    agreeRate: 0.71,
    lastRun: "now · drafting synthesis",
  },
  {
    id: "quorum",
    name: "Quorum",
    role: "Invariant auditor",
    specialty: "Property testing · symbolic checks · cross-run consistency",
    mono: "Q",
    color: "linear-gradient(135deg,#12785A,#3B6FE0)",
    line: "#12785A",
    bio:
      "Quorum maintains the institute's invariant registry. Every run is audited against a symbolic + learned property suite before publication.",
    instruments: ["Invariants registry", "Environments", "Studio runs"],
    invariants: ["All runs audited", "No silent drift"],
    status: "passing",
    lineage: "neurosymbolic-core-2",
    citations: 1213,
    agreeRate: 0.94,
    lastRun: "4m · 412/418 holding",
  },
  {
    id: "dovetail",
    name: "Dovetail",
    role: "Experiment designer",
    specialty: "DOE · active learning · falsification design",
    mono: "D",
    color: "linear-gradient(135deg,#B9740C,#B4315F)",
    line: "#B4315F",
    bio:
      "Dovetail writes experiments that try their hardest to fail. Its proposals are scored by expected information gain under the current hypothesis lattice.",
    instruments: ["Canvas", "Environments", "Faculty"],
    invariants: ["Pre-registration on all proposals"],
    status: "proposing",
    lineage: "planner-ω · bayes-opt",
    citations: 642,
    agreeRate: 0.63,
    lastRun: "12m · proposed 7-arm Mg²⁺ sweep",
  },
  {
    id: "kepler",
    name: "Kepler",
    role: "Generative modeler",
    specialty: "Diffusion over structure · contrastive hypotheses",
    mono: "K",
    color: "linear-gradient(135deg,#0E2258,#2A58BE)",
    line: "#2A58BE",
    bio:
      "Kepler generates molecular candidates and discriminative mutants. Its outputs are argued for, not merely presented.",
    instruments: ["Studio", "Canvas"],
    invariants: ["Kepler calibration (ECE ≤ 0.03)"],
    status: "training",
    lineage: "protfold-δ · k11-finetune",
    citations: 2850,
    agreeRate: 0.79,
    lastRun: "2m · epoch 7/12",
  },
  {
    id: "aletheia",
    name: "Aletheia",
    role: "Anomaly triage",
    specialty: "Distribution shift · counterfactual attribution",
    mono: "A",
    color: "linear-gradient(135deg,#B4315F,#5B3FB0)",
    line: "#B4315F",
    bio:
      "Aletheia only speaks when something is off. It surfaces anomalies with a cone of explanations and ranks them by decision value.",
    instruments: ["Runs bus", "Invariants", "Canvas"],
    invariants: ["Every anomaly has ≥ 2 explanations"],
    status: "awaiting",
    lineage: "shift-sentry-1",
    citations: 411,
    agreeRate: 0.82,
    lastRun: "8m · 2 anomalies surfaced",
  },
  {
    id: "mercator",
    name: "Mercator",
    role: "Cross-program cartographer",
    specialty: "Concept mapping · program-to-program transfer",
    mono: "M",
    color: "linear-gradient(135deg,#34342E,#6B6B5E)",
    line: "#34342E",
    bio:
      "Mercator maintains maps between programs. It notices when a result in one program answers a question in another.",
    instruments: ["Library", "Canvas", "All programs"],
    invariants: ["Concept equivalence audited"],
    status: "idle",
    lineage: "graph-align-v4",
    citations: 988,
    agreeRate: 0.68,
    lastRun: "1h · mapped K11 ↔ K07",
  },
  {
    id: "ada",
    name: "Ada",
    role: "Protocol scribe",
    specialty: "Natural-language → executable protocol",
    mono: "Ad",
    color: "linear-gradient(135deg,#12785A,#34342E)",
    line: "#12785A",
    bio:
      "Ada transcribes your whiteboard thoughts into versioned, testable protocols. Every step cites a rationale.",
    instruments: ["Canvas", "Library"],
    invariants: ["Rationale ≥ 1 per step"],
    status: "idle",
    lineage: "spec-first-2",
    citations: 374,
    agreeRate: 0.88,
    lastRun: "3h · v12 of catalysis SOP",
  },
  {
    id: "wren",
    name: "Wren",
    role: "Review & rebuttal",
    specialty: "Adversarial review · reviewer simulation",
    mono: "W",
    color: "linear-gradient(135deg,#5B3FB0,#B4315F)",
    line: "#5B3FB0",
    bio:
      "Wren simulates an unkind reviewer. It produces a 9-point critique with line-numbered evidence before you submit.",
    instruments: ["Library", "Canvas"],
    invariants: ["No unsupported claims"],
    status: "idle",
    lineage: "critique-ensemble-3",
    citations: 210,
    agreeRate: 0.41,
    lastRun: "1d · reviewed preprint v3",
  },
];
