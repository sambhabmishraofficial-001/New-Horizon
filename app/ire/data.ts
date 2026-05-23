import {
  Sparkles,
  FlaskConical,
  Database,
  Cpu,
  ShieldCheck,
  Network,
  FileText,
  BookOpen,
  Beaker,
  Telescope,
  Dna,
  NotebookPen,
  LayoutGrid,
  LineChart,
  ScrollText,
  Map,
  Home,
  Plug,
  type LucideIcon,
} from "lucide-react";

export type FileKind =
  | "hyp"
  | "exp"
  | "dataset"
  | "model"
  | "invariant"
  | "twin"
  | "env"
  | "run"
  | "paper"
  | "sequence"
  | "canvas"
  | "notebook"
  | "manuscript"
  | "protocol"
  | "planner"
  | "viz"
  | "map"
  | "home"
  | "embed"
  | "latex"
  | "word"
  | "tool";

export const FILE_META: Record<
  FileKind,
  { ext: string; icon: LucideIcon; color: string; bg: string; label: string }
> = {
  hyp: { ext: ".hyp", icon: Sparkles, color: "#2A58BE", bg: "#EEF5FF", label: "Hypothesis" },
  exp: { ext: ".exp", icon: FlaskConical, color: "#B9740C", bg: "#FEF7E7", label: "Experiment" },
  dataset: { ext: ".ds", icon: Database, color: "#12785A", bg: "#EAF7F1", label: "Dataset" },
  model: { ext: ".ckpt", icon: Cpu, color: "#5B3FB0", bg: "#F1EDFB", label: "Model" },
  invariant: { ext: ".inv", icon: ShieldCheck, color: "#34342E", bg: "#F5F2EA", label: "Invariant" },
  twin: { ext: ".twin", icon: Sparkles, color: "#111110", bg: "#F7F7F5", label: "Twin" },
  env: { ext: ".env", icon: Beaker, color: "#1E4394", bg: "#EEF5FF", label: "Environment" },
  run: { ext: ".run", icon: Telescope, color: "#B4315F", bg: "#FDEEF3", label: "Run" },
  paper: { ext: ".paper", icon: FileText, color: "#34342E", bg: "#F5F2EA", label: "Paper" },
  sequence: { ext: ".seq", icon: Dna, color: "#12785A", bg: "#EAF7F1", label: "Sequence" },
  canvas: { ext: ".graph", icon: Network, color: "#5B3FB0", bg: "#F1EDFB", label: "Graph" },
  notebook: { ext: ".irenb", icon: NotebookPen, color: "#2A58BE", bg: "#EEF5FF", label: "Notebook" },
  manuscript: { ext: ".ms", icon: ScrollText, color: "#1F1F1B", bg: "#F7F7F5", label: "Manuscript" },
  protocol: { ext: ".proto", icon: BookOpen, color: "#B9740C", bg: "#FEF7E7", label: "Protocol" },
  planner: { ext: ".plan", icon: LayoutGrid, color: "#5B3FB0", bg: "#F1EDFB", label: "Planner" },
  viz: { ext: ".viz", icon: LineChart, color: "#12785A", bg: "#EAF7F1", label: "Viz" },
  map: { ext: ".hmap", icon: Map, color: "#5B3FB0", bg: "#F1EDFB", label: "Hypothesis map" },
  home: { ext: "", icon: Home, color: "#34342E", bg: "#F5F2EA", label: "Project home" },
  embed: { ext: "", icon: Plug, color: "#34342E", bg: "#F5F2EA", label: "External tool" },
  latex: { ext: ".tex", icon: ScrollText, color: "#1F1F1B", bg: "#F7F7F5", label: "LaTeX" },
  word: { ext: ".docx", icon: ScrollText, color: "#2A58BE", bg: "#EEF1FA", label: "Word document" },
  tool: { ext: "", icon: Plug, color: "#34342E", bg: "#F5F2EA", label: "Tool" },
};

export type TreeNode = {
  id: string;
  name: string;
  kind?: FileKind;
  children?: TreeNode[];
  path: string;
  meta?: string;
  status?: "active" | "testing" | "validated" | "refuted" | "draft" | "running" | "queued" | "completed" | "anomaly";
  badge?: "M" | "U" | "!" | null;
};

export const RESEARCH_TREE: TreeNode[] = [
  {
    id: "egfr",
    name: "EGFR Inhibitor Discovery",
    path: "/egfr",
    meta: "v3 · active",
    children: [
      {
        id: "egfr-hyp",
        name: "hypotheses",
        path: "/egfr/hyp",
        children: [
          { id: "h001", name: "H-001 T790M drives resistance", kind: "hyp", path: "/egfr/hyp/H-001", meta: "active", status: "active" },
          { id: "h002", name: "H-002 combination overcomes", kind: "hyp", path: "/egfr/hyp/H-002", meta: "testing", status: "testing", badge: "M" },
          { id: "h003", name: "H-003 allosteric bypass", kind: "hyp", path: "/egfr/hyp/H-003", meta: "draft", status: "draft" },
          { id: "h004", name: "H-004 C797S co-mutation", kind: "hyp", path: "/egfr/hyp/H-004", meta: "refuted", status: "refuted" },
          { id: "h-map", name: "egfr-hypothesis-map", kind: "map", path: "/egfr/hyp/map", meta: "spatial" },
        ],
      },
      {
        id: "egfr-exp",
        name: "experiments",
        path: "/egfr/exp",
        children: [
          { id: "exp001", name: "EXP-001 IC50 panel", kind: "exp", path: "/egfr/exp/EXP-001", meta: "completed", status: "completed" },
          { id: "exp002", name: "EXP-002 WB pEGFR", kind: "exp", path: "/egfr/exp/EXP-002", meta: "step 4/8", status: "running", badge: "M" },
          { id: "exp003", name: "EXP-003 xenograft", kind: "exp", path: "/egfr/exp/EXP-003", meta: "day 12/28", status: "running" },
          { id: "exp004", name: "EXP-004 RNA-seq", kind: "exp", path: "/egfr/exp/EXP-004", meta: "designed", status: "queued" },
          { id: "exp-plan", name: "experiment-board", kind: "planner", path: "/egfr/exp/board", meta: "kanban" },
        ],
      },
      {
        id: "egfr-data",
        name: "datasets",
        path: "/egfr/data",
        children: [
          { id: "ds1", name: "cell_viability_20260410", kind: "dataset", path: "/egfr/data/cv", meta: "12 480 rows · FAIR 87" },
          { id: "ds2", name: "ic50_normalized", kind: "dataset", path: "/egfr/data/ic50", meta: "derived · FAIR 92" },
          { id: "ds3", name: "TCGA_LUAD_mutations", kind: "dataset", path: "/egfr/data/tcga", meta: "external · FAIR 100" },
          { id: "ds4", name: "ChEMBL_EGFR", kind: "dataset", path: "/egfr/data/chembl", meta: "external · FAIR 100" },
        ],
      },
      {
        id: "egfr-nb",
        name: "notebooks",
        path: "/egfr/nb",
        children: [
          { id: "nb1", name: "exp002-analysis", kind: "notebook", path: "/egfr/nb/exp002", meta: "11 cells", badge: "M" },
          { id: "nb2", name: "ic50-fitting", kind: "notebook", path: "/egfr/nb/ic50", meta: "8 cells" },
          { id: "nb3", name: "survival-curves", kind: "notebook", path: "/egfr/nb/surv", meta: "5 cells" },
        ],
      },
      {
        id: "egfr-ms",
        name: "manuscripts",
        path: "/egfr/ms",
        children: [
          { id: "ms1", name: "t790m-resistance", kind: "manuscript", path: "/egfr/ms/t790m", meta: "Nature · draft", badge: "M" },
        ],
      },
      {
        id: "egfr-viz",
        name: "figures",
        path: "/egfr/viz",
        children: [
          { id: "v1", name: "fig2a-dose-response", kind: "viz", path: "/egfr/viz/f2a", meta: "4PL fit" },
          { id: "v2", name: "fig3b-heatmap", kind: "viz", path: "/egfr/viz/f3b", meta: "heatmap" },
        ],
      },
      {
        id: "egfr-proto",
        name: "protocols",
        path: "/egfr/proto",
        children: [
          { id: "pr1", name: "IC50_assay", kind: "protocol", path: "/egfr/proto/ic50", meta: "v3 · 94% success" },
          { id: "pr2", name: "Western_blot_EGFR", kind: "protocol", path: "/egfr/proto/wb", meta: "v3.2" },
        ],
      },
      {
        id: "egfr-inv",
        name: "invariants",
        path: "/egfr/inv",
        children: [
          { id: "i01e", name: "I-E01 DMSO viability > 90%", kind: "invariant", path: "/egfr/inv/I-E01", meta: "holding" },
          { id: "i02e", name: "I-E02 blot ladder present", kind: "invariant", path: "/egfr/inv/I-E02", meta: "breaking", badge: "!" },
          { id: "i03e", name: "I-E03 ΔΔCt variance < 0.3", kind: "invariant", path: "/egfr/inv/I-E03", meta: "holding" },
        ],
      },
      {
        id: "egfr-lit",
        name: "literature",
        path: "/egfr/lit",
        children: [
          { id: "p-janne", name: "Jänne-2026", kind: "paper", path: "/egfr/lit/janne-2026", meta: "new · trending" },
          { id: "p-smith", name: "Smith-2024", kind: "paper", path: "/egfr/lit/smith-2024", meta: "cited 34×" },
          { id: "p-chen", name: "Chen-2023", kind: "paper", path: "/egfr/lit/chen-2023", meta: "cited 22×" },
          { id: "p-tran", name: "Tran-2024", kind: "paper", path: "/egfr/lit/tran-2024", meta: "contradicts H-001", badge: "!" },
        ],
      },
      {
        id: "egfr-graph",
        name: "knowledge-graph",
        path: "/egfr/graph",
        children: [
          { id: "kg1", name: "egfr-pathway", kind: "canvas", path: "/egfr/graph/pathway", meta: "847 nodes" },
        ],
      },
    ],
  },
  {
    id: "k11",
    name: "K11 · Ribozyme",
    path: "/k11",
    meta: "active",
    children: [
      {
        id: "k11-hyp",
        name: "hypotheses",
        path: "/k11/hyp",
        children: [
          { id: "h214", name: "H-214", kind: "hyp", path: "/k11/hyp/H-214", meta: "root" },
          { id: "h214-1", name: "H-214.1", kind: "hyp", path: "/k11/hyp/H-214.1", meta: "refining", badge: "M" },
        ],
      },
      {
        id: "k11-exp",
        name: "experiments",
        path: "/k11/exp",
        children: [
          { id: "e7", name: "E-7 mg-sweep", kind: "exp", path: "/k11/exp/E-7", meta: "running" },
          { id: "e8", name: "E-8 edta-titration", kind: "exp", path: "/k11/exp/E-8", meta: "pending", badge: "U" },
        ],
      },
      {
        id: "k11-data",
        name: "datasets",
        path: "/k11/data",
        children: [
          { id: "ds71a", name: "kinetics-lot-71a", kind: "dataset", path: "/k11/data/71a", meta: "2.4k traces" },
        ],
      },
      {
        id: "k11-models",
        name: "models",
        path: "/k11/models",
        children: [
          { id: "kepler-e12", name: "kepler-ε-12", kind: "model", path: "/k11/models/kepler-e12", meta: "running", badge: "M" },
        ],
      },
      {
        id: "k11-inv",
        name: "invariants",
        path: "/k11/inv",
        children: [
          { id: "i01", name: "I-01 energy-monotonic", kind: "invariant", path: "/k11/inv/I-01", meta: "holding" },
          { id: "i03", name: "I-03 replicate-sigma", kind: "invariant", path: "/k11/inv/I-03", meta: "breaking", badge: "!" },
        ],
      },
      {
        id: "k11-env",
        name: "environments",
        path: "/k11/env",
        children: [
          { id: "env-fold", name: "folding-rl", kind: "env", path: "/k11/env/folding-rl", meta: "running" },
        ],
      },
      {
        id: "k11-runs",
        name: "runs",
        path: "/k11/runs",
        children: [
          { id: "r71a", name: "run-71a", kind: "run", path: "/k11/runs/71a", meta: "anomaly", badge: "!" },
        ],
      },
    ],
  },
  {
    id: "twins",
    name: "Twins · faculty",
    path: "/twins",
    children: [
      { id: "halo-a", name: "halo-a", kind: "twin", path: "/twins/halo-a", meta: "reasoning" },
      { id: "kepler", name: "kepler", kind: "twin", path: "/twins/kepler", meta: "training" },
      { id: "quorum", name: "quorum", kind: "twin", path: "/twins/quorum", meta: "passing" },
      { id: "dovetail", name: "dovetail", kind: "twin", path: "/twins/dovetail", meta: "proposing" },
    ],
  },
];

export type OpenDoc = {
  path: string;
  name: string;
  kind: FileKind;
  dirty?: boolean;
  url?: string;
  toolId?: string;
  meta?: Record<string, string>;
};

export const INITIAL_OPEN: OpenDoc[] = [
  { path: "/egfr/hyp/H-001", name: "H-001", kind: "hyp", dirty: true },
  { path: "/egfr/nb/exp002", name: "exp002-analysis", kind: "notebook", dirty: true },
  { path: "/egfr/ms/t790m", name: "t790m-resistance", kind: "manuscript" },
  { path: "/egfr/exp/board", name: "experiment-board", kind: "planner" },
  { path: "/egfr/viz/f2a", name: "fig2a-dose-response", kind: "viz" },
  { path: "/egfr/hyp/map", name: "egfr-hypothesis-map", kind: "map" },
  { path: "/egfr/graph/pathway", name: "egfr-pathway", kind: "canvas" },
  { path: "/egfr/lit/janne-2026", name: "Jänne-2026", kind: "paper" },
  { path: "/egfr/proto/wb", name: "Western_blot_EGFR", kind: "protocol" },
];

export const INITIAL_ACTIVE = "/egfr/hyp/H-001";

/* =====================================================================
   Hypotheses - full records
   ===================================================================== */

export type HypothesisRecord = {
  id: string;
  title: string;
  path: string;
  project: string;
  status: "active" | "testing" | "validated" | "refuted" | "draft";
  confidence: number; // 0..1
  prior: number;
  posterior: number;
  evidence: { papers: number; experiments: number; datasets: number };
  contradictions: number;
  linked: string[];
  parent?: string;
  children?: string[];
  agentNote?: string;
  predictedOutcome?: string;
};

export const HYPOTHESES: HypothesisRecord[] = [
  {
    id: "H-001",
    title: "EGFR T790M mutation drives osimertinib resistance via steric clash at the gatekeeper",
    path: "/egfr/hyp/H-001",
    project: "EGFR Inhibitor Discovery",
    status: "active",
    confidence: 0.82,
    prior: 0.55,
    posterior: 0.82,
    evidence: { papers: 12, experiments: 3, datasets: 2 },
    contradictions: 2,
    linked: ["EXP-001", "EXP-002", "DS-003"],
    children: ["H-002", "H-004"],
    agentNote: "Supported by TCGA data but mechanism unclear - suggest proteomics follow-up",
  },
  {
    id: "H-002",
    title: "Combination therapy (osimertinib + MEK inhibitor) overcomes T790M resistance",
    path: "/egfr/hyp/H-002",
    project: "EGFR Inhibitor Discovery",
    status: "testing",
    confidence: 0.41,
    prior: 0.30,
    posterior: 0.41,
    evidence: { papers: 4, experiments: 1, datasets: 0 },
    contradictions: 0,
    linked: ["EXP-003"],
    parent: "H-001",
    predictedOutcome: "67% probability of support on completion of EXP-003",
  },
  {
    id: "H-003",
    title: "Allosteric inhibitors can bypass the gatekeeper mutation entirely",
    path: "/egfr/hyp/H-003",
    project: "EGFR Inhibitor Discovery",
    status: "draft",
    confidence: 0.22,
    prior: 0.22,
    posterior: 0.22,
    evidence: { papers: 8, experiments: 0, datasets: 0 },
    contradictions: 0,
    linked: [],
    agentNote: "Literature suggests feasibility - need structural modeling before experimental phase",
  },
  {
    id: "H-004",
    title: "C797S co-mutation explains the late-stage resistance cohort",
    path: "/egfr/hyp/H-004",
    project: "EGFR Inhibitor Discovery",
    status: "refuted",
    confidence: 0.08,
    prior: 0.45,
    posterior: 0.08,
    evidence: { papers: 3, experiments: 1, datasets: 1 },
    contradictions: 5,
    linked: ["EXP-001"],
    parent: "H-001",
  },
];

/* =====================================================================
   Experiments
   ===================================================================== */

export type ExperimentRecord = {
  id: string;
  title: string;
  path: string;
  hypothesis: string;
  protocol: string;
  status: "backlog" | "designed" | "running" | "completed" | "failed";
  progress?: { step: number; total: number; label?: string };
  instrument?: string;
  owner: string;
  eta?: string;
  n?: number;
};

export const EXPERIMENTS: ExperimentRecord[] = [
  {
    id: "EXP-001",
    title: "IC50 Assay Panel (4 cell lines)",
    path: "/egfr/exp/EXP-001",
    hypothesis: "H-001",
    protocol: "IC50_assay v3",
    status: "completed",
    instrument: "Tecan i-D3",
    owner: "Priya",
    n: 288,
  },
  {
    id: "EXP-002",
    title: "Western Blot - EGFR phosphorylation dynamics",
    path: "/egfr/exp/EXP-002",
    hypothesis: "H-001",
    protocol: "Western_blot_EGFR v3.2",
    status: "running",
    progress: { step: 4, total: 8, label: "blocking buffer" },
    instrument: "ChemiDoc MP",
    owner: "Marcus",
    eta: "2h 18m",
  },
  {
    id: "EXP-003",
    title: "Mouse xenograft - combination Rx in vivo",
    path: "/egfr/exp/EXP-003",
    hypothesis: "H-002",
    protocol: "Xeno_LUAD v2",
    status: "running",
    progress: { step: 12, total: 28, label: "day 12" },
    owner: "Dr. Smith",
    eta: "16 days",
  },
  {
    id: "EXP-004",
    title: "RNA-seq - resistance signature discovery",
    path: "/egfr/exp/EXP-004",
    hypothesis: "H-001",
    protocol: "RNA-seq bulk v4",
    status: "designed",
    instrument: "NovaSeq X",
    owner: "Priya",
    n: 60,
  },
  {
    id: "EXP-005",
    title: "Flow cytometry - apoptosis time-course",
    path: "/egfr/exp/EXP-005",
    hypothesis: "H-002",
    protocol: "Flow_apoptosis v2",
    status: "designed",
    instrument: "BD FACSymphony",
    owner: "Marcus",
  },
  {
    id: "EXP-006",
    title: "Proteomics - resistance pathway mapping",
    path: "/egfr/exp/EXP-006",
    hypothesis: "H-003",
    protocol: "TMT_proteomics v1",
    status: "backlog",
    owner: "(unassigned)",
  },
  {
    id: "EXP-007",
    title: "CRISPR knockout - validate vulnerability hits",
    path: "/egfr/exp/EXP-007",
    hypothesis: "H-001",
    protocol: "CRISPR_KO v2",
    status: "backlog",
    owner: "(suggested by agent)",
  },
];

/* =====================================================================
   Datasets
   ===================================================================== */

export type DatasetRecord = {
  id: string;
  name: string;
  path: string;
  kind: "raw" | "processed" | "external";
  rows: number;
  cols: number;
  fair: number;
  source: string;
  provenance?: string;
  schema: { name: string; type: string }[];
  issues?: string[];
};

export const DATASETS: DatasetRecord[] = [
  {
    id: "DS-001",
    name: "cell_viability_20260410.csv",
    path: "/egfr/data/cv",
    kind: "raw",
    rows: 12480,
    cols: 6,
    fair: 87,
    source: "EXP-001 · Tecan i-D3 (TI-2847)",
    schema: [
      { name: "compound_id", type: "str" },
      { name: "cell_line", type: "cat" },
      { name: "concentration_uM", type: "f32" },
      { name: "viability_pct", type: "f32" },
      { name: "replicate", type: "i8" },
      { name: "plate", type: "str" },
    ],
    issues: ["3 outliers flagged (z > 3)", "no missing values"],
  },
  {
    id: "DS-002",
    name: "ic50_normalized.parquet",
    path: "/egfr/data/ic50",
    kind: "processed",
    rows: 4160,
    cols: 8,
    fair: 92,
    source: "derived from DS-001",
    provenance: "analysis/ic50_calc.py v2.1 (9c4d1e…)",
    schema: [
      { name: "compound_id", type: "str" },
      { name: "cell_line", type: "cat" },
      { name: "IC50_uM", type: "f32" },
      { name: "hill_coef", type: "f32" },
      { name: "r_squared", type: "f32" },
      { name: "ci_lower", type: "f32" },
      { name: "ci_upper", type: "f32" },
      { name: "n", type: "i8" },
    ],
  },
  {
    id: "DS-003",
    name: "TCGA_LUAD_mutations.h5ad",
    path: "/egfr/data/tcga",
    kind: "external",
    rows: 567,
    cols: 14,
    fair: 100,
    source: "TCGA · snapshot 2024-11",
    schema: [
      { name: "sample", type: "str" },
      { name: "EGFR_mutation", type: "cat" },
      { name: "T790M", type: "bool" },
      { name: "C797S", type: "bool" },
      { name: "stage", type: "cat" },
      { name: "os_months", type: "f32" },
    ],
  },
  {
    id: "DS-004",
    name: "ChEMBL_EGFR_inhibitors.csv",
    path: "/egfr/data/chembl",
    kind: "external",
    rows: 2843,
    cols: 11,
    fair: 100,
    source: "ChEMBL v34",
    schema: [
      { name: "chembl_id", type: "str" },
      { name: "smiles", type: "str" },
      { name: "pIC50", type: "f32" },
      { name: "target", type: "cat" },
      { name: "assay_type", type: "cat" },
    ],
  },
];

/* =====================================================================
   Literature
   ===================================================================== */

export type PaperRecord = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  path: string;
  relevance: number; // 0..1
  tag: "directly-cited" | "trending" | "contradicts" | "competitor" | "suggested";
  keyClaim: string;
  methods: string[];
  linkedHypothesis?: string;
  summary: string;
};

export const PAPERS: PaperRecord[] = [
  {
    id: "janne-2026",
    title: "Osimertinib resistance via C797S and T790M co-mutation",
    authors: "Jänne PA, Yu HA, Ramalingam SS, et al.",
    venue: "Nature Medicine",
    year: 2026,
    path: "/egfr/lit/janne-2026",
    relevance: 0.92,
    tag: "trending",
    keyClaim: "C797S co-mutation observed in 28% of T790M+ patients after progression on osimertinib",
    methods: ["WES", "cfDNA ctDNA", "PDX models"],
    linkedHypothesis: "H-001",
    summary:
      "Longitudinal analysis of 312 post-progression biopsies finds C797S emerges in 28% of cases and alters the clinical actionability of subsequent therapy.",
  },
  {
    id: "smith-2024",
    title: "T790M alters EGFR dynamics at the ATP-binding pocket",
    authors: "Smith R, Okonkwo A, Park J, et al.",
    venue: "Cell",
    year: 2024,
    path: "/egfr/lit/smith-2024",
    relevance: 0.88,
    tag: "directly-cited",
    keyClaim: "T790M induces a 2.1 Å conformational shift that favors ATP binding over osimertinib",
    methods: ["Cryo-EM", "MD simulation", "FRET"],
    linkedHypothesis: "H-001",
    summary:
      "Structural basis for osimertinib resistance via the T790M gatekeeper mutation, with high-resolution binding maps.",
  },
  {
    id: "chen-2023",
    title: "MEK inhibition restores sensitivity in T790M+ models",
    authors: "Chen L, Huang J, Wei S, et al.",
    venue: "Nature Cancer",
    year: 2023,
    path: "/egfr/lit/chen-2023",
    relevance: 0.79,
    tag: "directly-cited",
    keyClaim: "Combination osimertinib + trametinib reduces tumor volume 72% vs 31% (monotherapy)",
    methods: ["PDX xenografts", "Bliss synergy"],
    linkedHypothesis: "H-002",
    summary: "Pre-clinical support for combination therapy approach targeting bypass signaling.",
  },
  {
    id: "tran-2024",
    title: "Non-T790M mechanisms dominate late-stage resistance",
    authors: "Tran V, Nakamura K, Williams D",
    venue: "Science",
    year: 2024,
    path: "/egfr/lit/tran-2024",
    relevance: 0.74,
    tag: "contradicts",
    keyClaim: "T790M frequency falls below 30% in ≥3rd-line samples; MET amplification rises",
    methods: ["ctDNA", "IHC panel", "single-cell RNA-seq"],
    linkedHypothesis: "H-001",
    summary:
      "Challenges the primacy of T790M in late-stage resistance - suggests shifting mechanism landscape.",
  },
  {
    id: "okonkwo-2024",
    title: "Saturation kinetics in the EGFR TK domain",
    authors: "Okonkwo A, Smith R",
    venue: "eLife",
    year: 2024,
    path: "/egfr/lit/okonkwo-2024",
    relevance: 0.66,
    tag: "directly-cited",
    keyClaim: "ATP binding admits residual curvature at high [Mg²⁺] - implication for kinase assays",
    methods: ["Stopped-flow", "ITC"],
    summary: "Background biophysics underpinning T790M binding models.",
  },
  {
    id: "brenner-2025",
    title: "Agentic experimentation in drug discovery",
    authors: "Brenner S, Kim J",
    venue: "bioRxiv",
    year: 2025,
    path: "/egfr/lit/brenner-2025",
    relevance: 0.58,
    tag: "suggested",
    keyClaim: "Closed-loop active-learning reduces trial count 3× at matched accuracy",
    methods: ["Bayesian optimisation", "self-driving lab"],
    summary: "Method paper relevant to EXP-005/EXP-006 planning.",
  },
];

/* =====================================================================
   Protocols
   ===================================================================== */

export type ProtocolRecord = {
  id: string;
  name: string;
  version: string;
  path: string;
  duration: string;
  success: number;
  runs: number;
  lastUsed: string;
  linkedExperiments: string[];
  owner: "mine" | "community";
  steps: number;
};

export const PROTOCOLS: ProtocolRecord[] = [
  { id: "P-001", name: "IC50_assay", version: "3.0", path: "/egfr/proto/ic50", duration: "4.1 h", success: 0.97, runs: 34, lastUsed: "2026-04-15", linkedExperiments: ["EXP-001"], owner: "mine", steps: 6 },
  { id: "P-002", name: "Western_blot_EGFR", version: "3.2", path: "/egfr/proto/wb", duration: "6.2 h", success: 0.94, runs: 18, lastUsed: "2026-04-18", linkedExperiments: ["EXP-002", "EXP-005"], owner: "mine", steps: 8 },
  { id: "P-003", name: "RNA-seq bulk", version: "4.0", path: "/egfr/proto/rnaseq", duration: "24 h", success: 0.91, runs: 12, lastUsed: "2026-04-10", linkedExperiments: ["EXP-004"], owner: "mine", steps: 12 },
  { id: "P-004", name: "Flow_apoptosis", version: "2.0", path: "/egfr/proto/flow", duration: "3.5 h", success: 0.89, runs: 22, lastUsed: "2026-04-12", linkedExperiments: ["EXP-005"], owner: "mine", steps: 7 },
  { id: "P-005", name: "TMT_proteomics", version: "1.0", path: "/egfr/proto/tmt", duration: "48 h", success: 0.86, runs: 5, lastUsed: "2026-03-28", linkedExperiments: ["EXP-006"], owner: "mine", steps: 14 },
  { id: "P-006", name: "Xeno_LUAD", version: "2.0", path: "/egfr/proto/xeno", duration: "28 days", success: 0.82, runs: 6, lastUsed: "2026-04-01", linkedExperiments: ["EXP-003"], owner: "mine", steps: 9 },
  { id: "P-C01", name: "BCA_protein_quant", version: "community", path: "/comm/bca", duration: "45 min", success: 0.98, runs: 4210, lastUsed: "community", linkedExperiments: [], owner: "community", steps: 5 },
  { id: "P-C02", name: "qPCR_SYBR", version: "community", path: "/comm/qpcr", duration: "2.5 h", success: 0.95, runs: 8930, lastUsed: "community", linkedExperiments: [], owner: "community", steps: 6 },
];

/* =====================================================================
   Agents (the research agent hierarchy)
   ===================================================================== */

export type AgentRecord = {
  id: string;
  name: string;
  role: string;
  icon: "orchestrator" | "hypothesis" | "experiment" | "analysis" | "literature" | "protocol" | "knowledge" | "writing";
  status: "running" | "idle" | "standby" | "flagged";
  activity?: string;
};

export const AGENTS: AgentRecord[] = [
  { id: "orch", name: "Director", role: "orchestrator", icon: "orchestrator", status: "running", activity: "coordinating 4 agents · queueing EXP-004" },
  { id: "hyp", name: "Hypothesis", role: "generate · score · update", icon: "hypothesis", status: "running", activity: "updating H-001 posterior (78% → 82%)" },
  { id: "exp", name: "Experiment", role: "design · dispatch · monitor", icon: "experiment", status: "running", activity: "monitoring EXP-002 step 4/8" },
  { id: "ana", name: "Analysis", role: "stats · viz · interpret", icon: "analysis", status: "standby" },
  { id: "lit", name: "Literature", role: "watch · claim · contradict", icon: "literature", status: "idle", activity: "daily digest at 09:00" },
  { id: "proto", name: "Protocol", role: "optimise · track deviations", icon: "protocol", status: "idle" },
  { id: "kg", name: "Knowledge", role: "graph · gaps · queries", icon: "knowledge", status: "idle" },
  { id: "write", name: "Writing", role: "draft · verify claims · format", icon: "writing", status: "standby" },
];

/* =====================================================================
   Insights - the stream shown in the right rail
   ===================================================================== */

export type InsightRecord = {
  id: string;
  ts: string; // relative
  source: "lit" | "analysis" | "hyp" | "exp" | "kg" | "protocol" | "writing";
  title: string;
  body: string;
  action?: string;
  tone?: "info" | "warn" | "success" | "breaking";
};

export const INSIGHTS: InsightRecord[] = [
  {
    id: "i-1",
    ts: "2m",
    source: "lit",
    title: "Jänne et al. 2026 · C797S co-mutation in 28% of T790M+",
    body: "New Nature Medicine paper strongly relevant to H-001 and H-004. Claim extracted; citations pre-formatted for Nature.",
    action: "Open · Link to H-001",
    tone: "info",
  },
  {
    id: "i-2",
    ts: "14m",
    source: "exp",
    title: "EXP-002 · anomaly in step 4",
    body: "pEGFR signal 40% lower than expected. Possible: antibody lot variation or genuine biological effect. Cone of explanations ranked.",
    action: "Investigate",
    tone: "warn",
  },
  {
    id: "i-3",
    ts: "22m",
    source: "hyp",
    title: "H-001 confidence updated · 78% → 82%",
    body: "EXP-001 IC50 shift (12.3×, p<0.001) increased posterior belief. Bayesian update logged.",
    action: "Inspect update",
    tone: "success",
  },
  {
    id: "i-4",
    ts: "41m",
    source: "analysis",
    title: "Suggested visualization for DS-002",
    body: "4-parameter logistic with 95% CI bands best fits dose-response for 4 cell lines. Apply or choose alternative.",
    action: "Apply",
    tone: "info",
  },
  {
    id: "i-5",
    ts: "1h",
    source: "kg",
    title: "Knowledge gap · MEK → PI3K crosstalk",
    body: "Your graph has strong EGFR→MEK coverage but only 2 edges into PI3K. 11 candidate papers found.",
    action: "Fill gap",
    tone: "info",
  },
  {
    id: "i-6",
    ts: "2h",
    source: "protocol",
    title: "WB_EGFR v3.2 · BSA blocking variant outperforms",
    body: "Community data (41 runs) shows 12% better S/N for pEGFR with BSA vs non-fat milk.",
    action: "Fork protocol",
    tone: "info",
  },
  {
    id: "i-7",
    ts: "3h",
    source: "writing",
    title: "Manuscript claim flagged · line 47",
    body: "Claim: 'dose-dependent reduction in pEGFR' is supported by EXP-002 arm 1-3 only. EXP-005 time-course would strengthen it.",
    action: "Resolve",
    tone: "warn",
  },
];

/* =====================================================================
   Team - collaborators
   ===================================================================== */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  online: boolean;
};

export const TEAM: TeamMember[] = [
  { id: "pi", name: "Dr. Smith", role: "PI", initials: "DS", color: "#1F1F1B", online: true },
  { id: "p", name: "Priya K.", role: "Postdoc", initials: "PK", color: "#2A58BE", online: true },
  { id: "m", name: "Marcus O.", role: "PhD", initials: "MO", color: "#B9740C", online: true },
  { id: "you", name: "Anu SK", role: "PI", initials: "AS", color: "#12785A", online: true },
  { id: "ext", name: "Dr. Rao (UCSF)", role: "Collaborator", initials: "VR", color: "#5B3FB0", online: false },
];
