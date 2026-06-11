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
