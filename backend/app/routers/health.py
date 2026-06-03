from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.config import Settings, get_settings
from app.db import get_db
from app.llm.clients import model_configured
from app.prompts.labs import list_lab_prompts
from app.schemas import CapabilitiesResponse, HealthResponse, LabPromptResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> HealthResponse:
    database_status = "ok"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        database_status = "error"

    return HealthResponse(
        status="ok" if database_status == "ok" else "degraded",
        database=database_status,
        model_provider=settings.model_provider,
        model_name=settings.openai_model,
        model_configured=model_configured(settings),
        langsmith_tracing=settings.langsmith_tracing,
    )


@router.get("/v1/capabilities", response_model=CapabilitiesResponse)
def capabilities(settings: Settings = Depends(get_settings)) -> CapabilitiesResponse:
    return CapabilitiesResponse(
        investigations=True,
        langgraph_workflow=True,
        langchain_openai=settings.model_provider == "openai",
        lab_prompts=True,
        langsmith_tracing=settings.langsmith_tracing,
        provider=settings.model_provider,
        model=settings.openai_model,
    )


@router.get("/v1/lab-prompts", response_model=list[LabPromptResponse])
def lab_prompts() -> list[dict[str, str]]:
    return list_lab_prompts()
