import type {
  TreeNode,
  OpenDoc,
  HypothesisRecord,
  ExperimentRecord,
  DatasetRecord,
  PaperRecord,
  ProtocolRecord,
  AgentRecord,
  InsightRecord,
  TeamMember,
} from "../data";
import type { WorkspaceBundle } from "../workspace-model";

/** Domain-neutral scaffold — same IRE affordances, no field-specific demo narrative */

const GENERAL_TREE: TreeNode[] = [
  {
    id: "sci-root",
    name: "Scientific program · template",
    path: "/sci/prog",
    meta: "empty scaffold · any domain",
    children: [
      {
        id: "sci-home",
        name: "project-home",
        kind: "home",
        path: "/sci/prog/home",
        meta: "start here",
      },
      {
        id: "sci-readme",
        name: "README",
        kind: "manuscript",
        path: "/sci/prog/readme",
        meta: "fill in your program",
      },
      {
        id: "sci-hyp",
        name: "hypotheses",
        path: "/sci/prog/hyp",
        children: [
          {
            id: "hs001",
            name: "H-S001 · mechanism under study",
            kind: "hyp",
            path: "/sci/prog/hyp/H-S001",
            meta: "draft",
            status: "draft",
          },
          {
            id: "hs002",
            name: "H-S002 · competing explanation",
            kind: "hyp",
            path: "/sci/prog/hyp/H-S002",
            meta: "draft",
            status: "draft",
          },
          {
            id: "hs003",
            name: "H-S003 · scope boundary",
            kind: "hyp",
            path: "/sci/prog/hyp/H-S003",
            meta: "draft",
            status: "draft",
          },
          {
            id: "hmap",
            name: "hypothesis-map",
            kind: "map",
            path: "/sci/prog/hyp/map",
            meta: "spatial",
          },
        ],
      },
      {
        id: "sci-exp",
        name: "experiments",
        path: "/sci/prog/exp",
        children: [
          {
            id: "exs001",
            name: "EXP-S001 · characterization sweep",
            kind: "exp",
            path: "/sci/prog/exp/EXP-S001",
            meta: "designed",
            status: "queued",
          },
          {
            id: "exs002",
            name: "EXP-S002 · replication block",
            kind: "exp",
            path: "/sci/prog/exp/EXP-S002",
            meta: "planned",
            status: "queued",
          },
          {
            id: "exboard",
            name: "experiment-board",
            kind: "planner",
            path: "/sci/prog/exp/board",
            meta: "kanban",
          },
        ],
      },
      {
        id: "sci-data",
        name: "datasets",
        path: "/sci/prog/data",
        children: [
          {
            id: "dsraw",
            name: "observations_raw_placeholder",
            kind: "dataset",
            path: "/sci/prog/data/raw",
            meta: "0 rows · schema only",
          },
          {
            id: "dsderiv",
            name: "derived_tables_placeholder",
            kind: "dataset",
            path: "/sci/prog/data/derived",
            meta: "empty · lineage TBD",
          },
        ],
      },
      {
        id: "sci-nb",
        name: "notebooks",
        path: "/sci/prog/nb",
        children: [
          {
            id: "nb1",
            name: "exploratory-analysis-scaffold",
            kind: "notebook",
            path: "/sci/prog/nb/explore",
            meta: "0 cells",
          },
        ],
      },
      {
        id: "sci-ms",
        name: "manuscripts",
        path: "/sci/prog/ms",
        children: [
          {
            id: "ms1",
            name: "working-outline",
            kind: "manuscript",
            path: "/sci/prog/ms/outline",
            meta: "outline · no claims yet",
          },
        ],
      },
      {
        id: "sci-viz",
        name: "figures",
        path: "/sci/prog/viz",
        children: [
          {
            id: "v1",
            name: "viz-placeholder-a",
            kind: "viz",
            path: "/sci/prog/viz/a",
            meta: "attach data source",
          },
        ],
      },
      {
        id: "sci-proto",
        name: "protocols",
        path: "/sci/prog/proto",
        children: [
          {
            id: "pr1",
            name: "standard_measurement_protocol",
            kind: "protocol",
            path: "/sci/prog/proto/std",
            meta: "draft · unversioned",
          },
        ],
      },
      {
        id: "sci-inv",
        name: "invariants",
        path: "/sci/prog/inv",
        children: [
          {
            id: "i1",
            name: "I-S01 · data-quality floor",
            kind: "invariant",
            path: "/sci/prog/inv/I-S01",
            meta: "template",
          },
          {
            id: "i2",
            name: "I-S02 · reproducibility gate",
            kind: "invariant",
            path: "/sci/prog/inv/I-S02",
            meta: "template",
          },
        ],
      },
      {
        id: "sci-lit",
        name: "literature",
        path: "/sci/prog/lit",
        children: [
          {
            id: "p1",
            name: "methods-reading-list",
            kind: "paper",
            path: "/sci/prog/lit/methods",
            meta: "seed shelf",
          },
          {
            id: "p2",
            name: "statistics-foundations",
            kind: "paper",
            path: "/sci/prog/lit/stats",
            meta: "seed shelf",
          },
        ],
      },
      {
        id: "sci-graph",
        name: "knowledge-graph",
        path: "/sci/prog/graph",
        children: [
          {
            id: "kg1",
            name: "program-graph-scaffold",
            kind: "canvas",
            path: "/sci/prog/graph/core",
            meta: "empty · link entities",
          },
        ],
      },
    ],
  },
  {
    id: "twins",
    name: "Twins · institute assistants",
    path: "/sci/twins",
    children: [
      { id: "t-a", name: "assistant-orchestrator", kind: "twin", path: "/sci/twins/orchestrator", meta: "idle" },
      { id: "t-b", name: "assistant-hypothesis", kind: "twin", path: "/sci/twins/hypothesis", meta: "idle" },
      { id: "t-c", name: "assistant-experiment", kind: "twin", path: "/sci/twins/experiment", meta: "idle" },
      { id: "t-d", name: "assistant-literature", kind: "twin", path: "/sci/twins/literature", meta: "idle" },
    ],
  },
];

const GENERAL_INITIAL_OPEN: OpenDoc[] = [
  { path: "/sci/prog/home", name: "project-home", kind: "home" },
];

const GENERAL_HYPOTHESES: HypothesisRecord[] = [
  {
    id: "H-S001",
    title:
      "Principal measurable quantity responds to controlled perturbations in a way consistent with proposed mechanism class",
    path: "/sci/prog/hyp/H-S001",
    project: "Scientific program · template",
    status: "draft",
    confidence: 0.35,
    prior: 0.35,
    posterior: 0.35,
    evidence: { papers: 0, experiments: 0, datasets: 0 },
    contradictions: 0,
    linked: [],
    agentNote:
      "Replace mechanism class and measurable quantity with your domain language. Attach datasets and experiments as they are defined.",
  },
  {
    id: "H-S002",
    title: "Alternative mechanism explains the same observations without contradicting known constraints",
    path: "/sci/prog/hyp/H-S002",
    project: "Scientific program · template",
    status: "draft",
    confidence: 0.35,
    prior: 0.35,
    posterior: 0.35,
    evidence: { papers: 0, experiments: 0, datasets: 0 },
    contradictions: 0,
    linked: [],
    parent: "H-S001",
    agentNote: "Use this slot for an explicit competitor hypothesis once H-S001 is stated crisply.",
  },
  {
    id: "H-S003",
    title: "Observed effects stay inside declared scope (units, regime, population)",
    path: "/sci/prog/hyp/H-S003",
    project: "Scientific program · template",
    status: "draft",
    confidence: 0.5,
    prior: 0.5,
    posterior: 0.5,
    evidence: { papers: 0, experiments: 0, datasets: 0 },
    contradictions: 0,
    linked: [],
    agentNote: "Good place to encode domain boundaries and exclusion criteria.",
  },
];

const GENERAL_EXPERIMENTS: ExperimentRecord[] = [
  {
    id: "EXP-S001",
    title: "Measurement sweep · define factors and levels",
    path: "/sci/prog/exp/EXP-S001",
    hypothesis: "H-S001",
    protocol: "standard_measurement_protocol · draft",
    status: "designed",
    owner: "(assign)",
  },
  {
    id: "EXP-S002",
    title: "Replication block · minimum N for variance stability",
    path: "/sci/prog/exp/EXP-S002",
    hypothesis: "H-S001",
    protocol: "standard_measurement_protocol · draft",
    status: "backlog",
    owner: "(assign)",
  },
];

const GENERAL_DATASETS: DatasetRecord[] = [
  {
    id: "DS-S001",
    name: "observations_raw_placeholder.csv",
    path: "/sci/prog/data/raw",
    kind: "raw",
    rows: 0,
    cols: 0,
    fair: 0,
    source: "no ingest yet",
    schema: [
      { name: "run_id", type: "str" },
      { name: "timestamp", type: "datetime" },
      { name: "condition_id", type: "str" },
      { name: "measurement", type: "f64" },
      { name: "unit", type: "str" },
    ],
    issues: ["Define schema with domain-specific columns before first ingest"],
  },
  {
    id: "DS-S002",
    name: "derived_tables_placeholder.parquet",
    path: "/sci/prog/data/derived",
    kind: "processed",
    rows: 0,
    cols: 0,
    fair: 0,
    source: "derived from DS-S001 (pending)",
    provenance: "(none)",
    schema: [{ name: "(define)", type: "?" }],
    issues: ["Add transformation scripts and pin versions"],
  },
];

const GENERAL_PAPERS: PaperRecord[] = [
  {
    id: "methods-generic",
    title: "Transparent reporting for quantitative experiments across disciplines",
    authors: "Community guidelines consortium",
    venue: "Standards in Science",
    year: 2024,
    path: "/sci/prog/lit/methods",
    relevance: 0.72,
    tag: "suggested",
    keyClaim: "Pre-registration, raw data deposit, and explicit analysis plans reduce irreproducibility.",
    methods: ["reporting checklist", "metadata"],
    summary: "Orientation shelf — swap for domain founding papers as your program matures.",
  },
  {
    id: "stats-generic",
    title: "Modern inference practices for small samples and structured variance",
    authors: "Martinez L, Patel N",
    venue: "Annual Review of Methods",
    year: 2023,
    path: "/sci/prog/lit/stats",
    relevance: 0.68,
    tag: "suggested",
    keyClaim: "Mixed-effects and hierarchical models outperform naive aggregation when batches cluster.",
    methods: ["mixed models", "cross-validation"],
    summary: "Placeholder reading — replace with field-standard statistical references.",
  },
];

const GENERAL_PROTOCOLS: ProtocolRecord[] = [
  {
    id: "P-S001",
    name: "standard_measurement_protocol",
    version: "draft",
    path: "/sci/prog/proto/std",
    duration: "TBD",
    success: 0,
    runs: 0,
    lastUsed: "—",
    linkedExperiments: [],
    owner: "mine",
    steps: 0,
  },
];

const GENERAL_AGENTS: AgentRecord[] = [
  {
    id: "orch",
    name: "Director",
    role: "orchestrator",
    icon: "orchestrator",
    status: "idle",
    activity: "waiting for program definition · no queued jobs",
  },
  {
    id: "hyp",
    name: "Hypothesis",
    role: "generate · score · update",
    icon: "hypothesis",
    status: "idle",
    activity: "attach literature and measurements to activate scoring",
  },
  {
    id: "exp",
    name: "Experiment",
    role: "design · dispatch · monitor",
    icon: "experiment",
    status: "idle",
    activity: "create protocols and instrument connectors",
  },
  {
    id: "ana",
    name: "Analysis",
    role: "stats · viz · interpret",
    icon: "analysis",
    status: "idle",
  },
  {
    id: "lit",
    name: "Literature",
    role: "watch · claim · contradict",
    icon: "literature",
    status: "idle",
    activity: "configure feeds when domain keywords are set",
  },
  {
    id: "proto",
    name: "Protocol",
    role: "optimise · track deviations",
    icon: "protocol",
    status: "idle",
  },
  {
    id: "kg",
    name: "Knowledge",
    role: "graph · gaps · queries",
    icon: "knowledge",
    status: "idle",
  },
  {
    id: "write",
    name: "Writing",
    role: "draft · verify claims · format",
    icon: "writing",
    status: "idle",
  },
];

const GENERAL_INSIGHTS: InsightRecord[] = [
  {
    id: "ig1",
    ts: "now",
    source: "hyp",
    title: "Program scaffold ready",
    body: "Rename hypotheses, plug in protocols, and link datasets. Agents stay idle until claims and runs exist.",
    tone: "info",
  },
  {
    id: "ig2",
    ts: "—",
    source: "protocol",
    title: "Protocol versioning",
    body: "Commit a versioned protocol before scheduling EXP-S001 so invariants can bind to explicit steps.",
    tone: "info",
  },
  {
    id: "ig3",
    ts: "—",
    source: "kg",
    title: "Graph is empty",
    body: "Seed entities (methods, materials, populations) from your domain ontology or spreadsheet import.",
    tone: "info",
  },
];

const GENERAL_TEAM: TeamMember[] = [
  { id: "you", name: "You", role: "Principal investigator", initials: "YO", color: "#12785A", online: true },
  { id: "c1", name: "Collaborator A", role: "Lab member", initials: "CA", color: "#2A58BE", online: false },
  { id: "c2", name: "Collaborator B", role: "Lab member", initials: "CB", color: "#B9740C", online: false },
];

export const ireGeneralBundle: WorkspaceBundle = {
  tree: GENERAL_TREE,
  initialOpen: GENERAL_INITIAL_OPEN,
  initialActive: "/sci/prog/home",
  hypotheses: GENERAL_HYPOTHESES,
  experiments: GENERAL_EXPERIMENTS,
  datasets: GENERAL_DATASETS,
  papers: GENERAL_PAPERS,
  protocols: GENERAL_PROTOCOLS,
  agents: GENERAL_AGENTS,
  insights: GENERAL_INSIGHTS,
  team: GENERAL_TEAM,
  chrome: {
    projectDropdownTitle: "Scientific program · template",
    projectVersionSuffix: " · scaffold",
    branchCrumbs: "hypothesis/H-S001",
    runningExperimentsDisplay: "0 running",
    agentsDisplay: "0 agents active",
    anomaliesDisplay: "0 anomalies",
    statusHypothesisRef: "hypothesis/H-S001 · draft",
    statusVersionSigned: "draft · unsigned",
    statusAnomalySummary: "0 anomalies",
    statusFairAvg: "FAIR · not rated",
    statusExperimentProgress: "no runs queued",
    statusProvenance: "provenance · pending first run",
    statusAgentsDigest: "agents idle · configure program",
    statusComputeJobs: "0 jobs · connect compute",
    experimentActivityBadge: null,
    literatureActivityBadge: null,
  },
};
