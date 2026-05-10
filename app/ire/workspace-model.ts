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
} from "./data";

/** Top bar + status strip copy — neutral vs demo-specific */
export type WorkspaceChrome = {
  projectDropdownTitle: string;
  projectVersionSuffix: string;
  branchCrumbs: string;
  runningExperimentsDisplay: string;
  agentsDisplay: string;
  anomaliesDisplay: string;
  statusHypothesisRef: string;
  statusVersionSigned: string;
  statusAnomalySummary: string;
  statusFairAvg: string;
  statusExperimentProgress: string;
  statusProvenance: string;
  statusAgentsDigest: string;
  statusComputeJobs: string;
  experimentActivityBadge: number | null;
  literatureActivityBadge: number | null;
};

export type WorkspaceBundle = {
  tree: TreeNode[];
  initialOpen: OpenDoc[];
  initialActive: string;
  hypotheses: HypothesisRecord[];
  experiments: ExperimentRecord[];
  datasets: DatasetRecord[];
  papers: PaperRecord[];
  protocols: ProtocolRecord[];
  agents: AgentRecord[];
  insights: InsightRecord[];
  team: TeamMember[];
  chrome: WorkspaceChrome;
};
