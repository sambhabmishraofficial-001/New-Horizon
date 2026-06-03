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


class VriChatRequest(BaseModel):
    messages: list[VriChatMessage] = Field(min_length=1)


class VriChatResponse(BaseModel):
    stage: Literal["clarify", "proposal", "confirmed"]
    answer: str
    clarification_questions: list[str]
    proposed_labs: list[ProposedLab]
    computational_work: list[str]
    experimental_work: list[str]
    next_actions: list[str]


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
