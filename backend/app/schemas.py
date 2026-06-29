from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    status: str
    database: str
    model_provider: str
    model_name: str
    model_configured: bool
    langsmith_tracing: bool


class CapabilitiesResponse(BaseModel):
    investigations: bool
    langgraph_workflow: bool
    langchain_openai: bool
    lab_prompts: bool
    langsmith_tracing: bool
    provider: str
    model: str


class LabPromptResponse(BaseModel):
    id: str
    name: str
    domain: str
    system_prompt: str
    default_objective: str
    default_context: str


class LabChatRequest(BaseModel):
    lab_id: str = "ribozyme-wet"
    message: str = Field(min_length=1)
    context: str | None = None


class LabChatResponse(BaseModel):
    lab_id: str
    answer: str
    assumptions: list[str]
    next_actions: list[str]


class VriChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class ProposedLab(BaseModel):
    name: str
    kind: str
    rationale: str
    workstream: Literal["computational", "experimental", "hybrid", "review", "data"]
    can_run_here: bool
    first_tasks: list[str]


class ClarificationOption(BaseModel):
    label: str
    detail: str | None = None


class ClarificationItem(BaseModel):
    id: str
    label: str
    question: str
    input_type: Literal["single_choice", "free_text"]
    options: list[ClarificationOption] = []


class VriChatRequest(BaseModel):
    messages: list[VriChatMessage] = Field(min_length=1)
    allowed_lab_ids: list[str] = []
    workstream_preference: Literal[
        "any", "computational", "experimental", "hybrid", "review", "data"
    ] = "any"


class VriChatResponse(BaseModel):
    stage: Literal["direct_answer", "clarify", "proposal", "confirmed"]
    intent: Literal["direct_answer", "clarify", "proposal"] = "clarify"
    answer: str
    clarification_round: int = 0
    planning_allowed: bool = False
    objective_clear: bool = False
    answer_quality: Literal["unknown", "clear", "incomplete", "invalid"] = "unknown"
    missing_information: list[str] = []
    repair_reasons: list[str] = []
    clarification_questions: list[str]
    clarification_items: list[ClarificationItem] = []
    proposed_labs: list[ProposedLab]
    computational_work: list[str]
    experimental_work: list[str]
    next_actions: list[str]
    plan_markdown: str = ""


class LiteratureResult(BaseModel):
    title: str
    authors: str | None = None
    year: str | None = None
    journal: str | None = None
    doi: str | None = None
    pmid: str | None = None
    source: str | None = None
    url: str | None = None
    abstract: str | None = None


class WorkStep(BaseModel):
    status: str
    label: str


class ToolCallRecord(BaseModel):
    name: str
    status: str
    input: Any = None
    output: Any = None
    started_at: str | None = None
    completed_at: str | None = None


class LabEvent(BaseModel):
    lab_name: str
    workstream: str
    action: str
    tool: str | None = None
    files: list[str] = []
    handoff_to: str | None = None
    summary: str


class StartWorkRequest(BaseModel):
    messages: list[VriChatMessage] = Field(min_length=1)
    planner_reply: VriChatResponse
    workstream_preference: Literal[
        "any", "computational", "experimental", "hybrid", "review", "data"
    ] = "any"


class StartWorkResponse(BaseModel):
    run_id: str
    status: str
    workspace_path: str
    venv_path: str
    literature_query: str
    steps: list[WorkStep]
    tool_calls: list[ToolCallRecord]
    generated_files: list[str]
    data_files: list[str]
    processed_files: list[str]
    labs_created: list[dict[str, Any]]
    tasks_created: list[dict[str, Any]]
    lab_events: list[LabEvent] = []
    literature_results: list[LiteratureResult]
    errors: list[str]


class WorkspaceArtifactFile(BaseModel):
    path: str
    relative_path: str
    kind: str
    size_bytes: int
    preview: str
    truncated: bool


class WorkspaceArtifactsResponse(BaseModel):
    run_id: str
    workspace_path: str
    files: list[WorkspaceArtifactFile]


# --- Master Plan structure ---
class ResourceItem(BaseModel):
    category: Literal["reagent", "equipment", "consumable", "software"]
    name: str
    specifications: str = ""
    quantity: str = ""
    estimated_cost: str = ""
    safety_notes: str = ""


class ExperimentalProtocolStep(BaseModel):
    step_number: int
    action: str
    reagents: list[str] = []
    concentrations: str = ""
    duration: str = ""
    temperature: str = ""
    notes: str = ""


class ExperimentalDesign(BaseModel):
    hypothesis: str
    methodology: str
    sample_size: str = ""
    replicates: str = ""
    controls: list[str] = []
    blinding: str = ""
    power_analysis: str = ""
    protocol_steps: list[ExperimentalProtocolStep] = []
    expected_outcomes: list[str] = []


class PlanPhase(BaseModel):
    phase_number: int
    title: str
    sub_plan_type: Literal["computational", "experimental"]
    objective: str
    tasks: list[str]
    expected_outputs: list[str]
    time_estimate: str = ""
    handoff: str = ""
    dependencies: list[int] = []


class SubPlan(BaseModel):
    type: Literal["computational", "experimental"]
    title: str
    summary: str
    phases: list[PlanPhase]
    experimental_design: ExperimentalDesign | None = None


class MasterPlan(BaseModel):
    title: str
    objective: str
    computational_plan: SubPlan
    experimental_plan: SubPlan
    resources: list[ResourceItem] = []


# --- Phase execution request/response ---
class PhaseVerification(BaseModel):
    all_outputs_present: bool
    missing_outputs: list[str]
    errors: list[str]
    auto_passed: bool
    summary: str


class PhaseStatusResponse(BaseModel):
    phase_number: int
    title: str
    sub_plan_type: str
    status: str
    tasks: list[str]
    expected_outputs: list[str]
    actual_outputs: list[str]
    verification: PhaseVerification | None = None


class StartPhaseRequest(BaseModel):
    plan_id: str
    phase_number: int


class ApprovePhaseRequest(BaseModel):
    plan_id: str
    phase_number: int
    user_approved: bool = True
    notes: str = ""


class InvestigationCreate(BaseModel):
    objective: str = Field(min_length=3)
    title: str | None = Field(default=None, max_length=240)
    domain: str | None = Field(default=None, max_length=120)
    context: str | None = None


class InvestigationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    objective: str
    domain: str | None
    context: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    role: Literal["user", "assistant", "system"] = "user"
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    investigation_id: str
    role: str
    content: str
    created_at: datetime


class RunCreate(BaseModel):
    mode: str = "standard"


class RunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    investigation_id: str
    status: str
    model_provider: str
    model_name: str | None
    mode: str
    result_json: dict[str, Any] | None
    error: str | None
    started_at: datetime
    completed_at: datetime | None


class ArtifactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    investigation_id: str
    run_id: str | None
    kind: str
    title: str
    payload_json: dict[str, Any]
    created_at: datetime


class InvestigationDetailResponse(InvestigationResponse):
    messages: list[MessageResponse]
    runs: list[RunResponse]
    artifacts: list[ArtifactResponse]
