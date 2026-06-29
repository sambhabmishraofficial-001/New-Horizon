export type Workstream = "computational" | "experimental" | "hybrid" | "review" | "data";
export type WorkstreamPreference = "any" | Workstream;

export type Health = {
  status: string;
  database: string;
  model_provider: string;
  model_name: string;
  model_configured: boolean;
  langsmith_tracing: boolean;
};

export type LabPrompt = {
  id: string;
  name: string;
  domain: string;
  system_prompt: string;
  default_objective: string;
  default_context: string;
};

export type LiteratureResult = {
  title: string;
  authors?: string | null;
  year?: string | null;
  journal?: string | null;
  doi?: string | null;
  pmid?: string | null;
  source?: string | null;
  url?: string | null;
  abstract?: string | null;
};

export type ToolCallRecord = {
  name: string;
  status: string;
  input?: unknown;
  output?: unknown;
  started_at?: string | null;
  completed_at?: string | null;
};

export type LabEvent = {
  lab_name: string;
  workstream: string;
  action: string;
  tool?: string | null;
  files: string[];
  handoff_to?: string | null;
  summary: string;
};

export type ProposedLab = {
  name: string;
  kind: string;
  workstream: Workstream;
  can_run_here: boolean;
  rationale: string;
  first_tasks: string[];
};

export type ClarificationOption = {
  label: string;
  detail?: string | null;
};

export type ClarificationItem = {
  id: string;
  label: string;
  question: string;
  input_type: "single_choice" | "free_text";
  options: ClarificationOption[];
};

export type WorkRun = {
  run_id: string;
  status: string;
  workspace_path: string;
  venv_path: string;
  literature_query: string;
  steps: { status: string; label: string }[];
  tool_calls: ToolCallRecord[];
  generated_files: string[];
  data_files: string[];
  processed_files: string[];
  labs_created: ProposedLab[];
  tasks_created: { title: string; workstream: Workstream; source: string }[];
  lab_events?: LabEvent[];
  literature_results: LiteratureResult[];
  errors: string[];
};

export type WorkspaceArtifactFile = {
  path: string;
  relative_path: string;
  kind: string;
  size_bytes: number;
  preview: string;
  truncated: boolean;
};

export type WorkspaceArtifacts = {
  run_id: string;
  workspace_path: string;
  files: WorkspaceArtifactFile[];
};

export type PlannerMessage = {
  role: "user" | "assistant";
  content: string;
  reply?: VriPlannerReply;
};

export type VriPlannerReply = {
  stage: "direct_answer" | "clarify" | "proposal" | "confirmed";
  intent?: "direct_answer" | "clarify" | "proposal";
  answer: string;
  clarification_round?: number;
  planning_allowed?: boolean;
  objective_clear?: boolean;
  answer_quality?: "unknown" | "clear" | "incomplete" | "invalid";
  missing_information?: string[];
  repair_reasons?: string[];
  clarification_questions: string[];
  clarification_items?: ClarificationItem[];
  proposed_labs: ProposedLab[];
  computational_work: string[];
  experimental_work: string[];
  next_actions: string[];
  plan_markdown?: string;
};

export type SavedConversation = {
  id: string;
  title: string;
  updated_at: string;
  messages: PlannerMessage[];
  reply: VriPlannerReply | null;
  workstream_preference: WorkstreamPreference;
  allowed_lab_ids: string[];
};

export type ViewFile = {
  id: string;
  name: string;
  path: string;
  kind: string;
  sizeLabel: string;
  preview: string | null;
  truncated?: boolean;
};

export type InspectorPanel = "progress" | "results" | "files" | "tools";
export type ViewerMode = "plan" | "file" | "lab" | "execution" | "idle";

// --- Phased Execution Types ---

export type ResourceItem = {
  category: "reagent" | "equipment" | "consumable" | "software";
  name: string;
  specifications: string;
  quantity: string;
  estimated_cost: string;
  safety_notes: string;
};

export type ExperimentalProtocolStep = {
  step_number: number;
  action: string;
  reagents: string[];
  concentrations: string;
  duration: string;
  temperature: string;
  notes: string;
};

export type ExperimentalDesign = {
  hypothesis: string;
  methodology: string;
  sample_size: string;
  replicates: string;
  controls: string[];
  blinding: string;
  power_analysis: string;
  protocol_steps: ExperimentalProtocolStep[];
  expected_outcomes: string[];
};

export type PlanPhase = {
  phase_number: number;
  title: string;
  sub_plan_type: "computational" | "experimental";
  objective: string;
  tasks: string[];
  expected_outputs: string[];
  time_estimate: string;
  handoff: string;
  dependencies: number[];
};

export type SubPlan = {
  type: "computational" | "experimental";
  title: string;
  summary: string;
  phases: PlanPhase[];
  experimental_design: ExperimentalDesign | null;
};

export type MasterPlan = {
  id: string;
  run_id: string;
  title: string;
  objective: string;
  computational_plan: SubPlan;
  experimental_plan: SubPlan;
  resources: ResourceItem[];
};

export type PhaseVerification = {
  all_outputs_present: boolean;
  missing_outputs: string[];
  errors: string[];
  auto_passed: boolean;
  summary: string;
};

export type PhaseStatusResponse = {
  phase_number: number;
  title: string;
  sub_plan_type: "computational" | "experimental";
  status: "pending" | "running" | "completed" | "failed" | "awaiting_approval";
  tasks: string[];
  expected_outputs: string[];
  actual_outputs: string[];
  verification: PhaseVerification | null;
};
