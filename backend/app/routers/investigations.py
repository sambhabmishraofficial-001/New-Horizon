from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.config import Settings, get_settings
from app.graphs.investigation import build_investigation_graph
from app.llm.clients import ModelConfigurationError, get_model_client
from app.models import Artifact, Investigation, Message, Run, utcnow
from app.schemas import (
    InvestigationCreate,
    InvestigationDetailResponse,
    InvestigationResponse,
    MessageCreate,
    MessageResponse,
    RunCreate,
    RunResponse,
)
from app.db import get_db

router = APIRouter(prefix="/v1/investigations", tags=["investigations"])


@router.post("", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
def create_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(get_db),
) -> Investigation:
    investigation = Investigation(
        title=payload.title or _title_from_objective(payload.objective),
        objective=payload.objective,
        domain=payload.domain,
        context=payload.context,
        status="created",
    )
    db.add(investigation)
    db.commit()
    db.refresh(investigation)
    return investigation


@router.get("", response_model=list[InvestigationResponse])
def list_investigations(db: Session = Depends(get_db)) -> list[Investigation]:
    return list(
        db.scalars(select(Investigation).order_by(desc(Investigation.created_at))).all()
    )


@router.get("/{investigation_id}", response_model=InvestigationDetailResponse)
def get_investigation(
    investigation_id: str,
    db: Session = Depends(get_db),
) -> Investigation:
    return _get_investigation_or_404(db, investigation_id)


@router.post("/{investigation_id}/messages", response_model=MessageResponse)
def add_message(
    investigation_id: str,
    payload: MessageCreate,
    db: Session = Depends(get_db),
) -> Message:
    investigation = _get_investigation_or_404(db, investigation_id)
    message = Message(
        investigation_id=investigation.id,
        role=payload.role,
        content=payload.content,
    )
    investigation.status = "active"
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.post("/{investigation_id}/run", response_model=RunResponse)
async def run_investigation(
    investigation_id: str,
    payload: RunCreate | None = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> Run:
    investigation = _get_investigation_or_404(db, investigation_id)
    mode = payload.mode if payload else "standard"

    run = Run(
        investigation_id=investigation.id,
        status="running",
        model_provider=settings.model_provider,
        model_name=settings.openai_model,
        mode=mode,
    )
    investigation.status = "running"
    db.add(run)
    db.commit()
    db.refresh(run)

    try:
        client = get_model_client(settings)
        graph = build_investigation_graph(client)
        result = await graph.ainvoke(
            {
                "investigation_id": investigation.id,
                "objective": investigation.objective,
                "domain": investigation.domain,
                "context": investigation.context,
                "messages": [
                    {"role": message.role, "content": message.content}
                    for message in investigation.messages
                ],
            }
        )
    except ModelConfigurationError as exc:
        _mark_run_failed(db, investigation, run, str(exc))
        raise HTTPException(status_code=400, detail={"run_id": run.id, "error": str(exc)}) from exc
    except Exception as exc:
        _mark_run_failed(db, investigation, run, str(exc))
        raise HTTPException(status_code=500, detail={"run_id": run.id, "error": str(exc)}) from exc

    run.status = "completed"
    run.result_json = result
    run.completed_at = utcnow()
    investigation.status = "completed"
    artifact = Artifact(
        investigation_id=investigation.id,
        run_id=run.id,
        kind="investigation_result",
        title="Investigation result",
        payload_json=result,
    )
    db.add(artifact)
    db.commit()
    db.refresh(run)
    return run


@router.get("/{investigation_id}/runs/{run_id}", response_model=RunResponse)
def get_run(
    investigation_id: str,
    run_id: str,
    db: Session = Depends(get_db),
) -> Run:
    run = db.scalar(
        select(Run).where(
            Run.id == run_id,
            Run.investigation_id == investigation_id,
        )
    )
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


def _get_investigation_or_404(db: Session, investigation_id: str) -> Investigation:
    investigation = db.scalar(
        select(Investigation)
        .where(Investigation.id == investigation_id)
        .options(
            selectinload(Investigation.messages),
            selectinload(Investigation.runs),
            selectinload(Investigation.artifacts),
        )
    )
    if not investigation:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation


def _mark_run_failed(
    db: Session,
    investigation: Investigation,
    run: Run,
    error: str,
) -> None:
    run.status = "failed"
    run.error = error
    run.completed_at = utcnow()
    investigation.status = "failed"
    db.commit()


def _title_from_objective(objective: str) -> str:
    clean = " ".join(objective.split())
    if len(clean) <= 80:
        return clean
    return f"{clean[:77]}..."
