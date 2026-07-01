from typing import Any
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.models import WorkPhase, WorkPlan
from app.schemas import (
    ApprovePhaseRequest,
    MasterPlan,
    MasterPlanResponse,
    PhaseStatusResponse,
    PhaseVerification,
    ResourceItem,
    VriChatResponse,
)
from app.services.plan_generator import generate_master_plan
from app.services.phase_runner import run_phase

router = APIRouter(prefix="/v1", tags=["phases"])


@router.post("/plans", response_model=MasterPlanResponse)
async def create_plan(
    planner_reply: VriChatResponse,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> Any:
    """Create a master plan from an approved planner reply."""
    # Create the run record first
    run_id = str(uuid.uuid4())
    # Assuming investigation_id is passed or handled differently, 
    # but for simplicity, we mock creating a run or just a plan.
    # In VRI, we might not require investigation_id to be strictly validated for dummy data.
    
    master_plan_data = await generate_master_plan(planner_reply, settings)
    
    plan_id = str(uuid.uuid4())
    
    # Insert plan into DB
    db_plan = WorkPlan(
        id=plan_id,
        run_id=run_id,
        title=master_plan_data.title,
        objective=master_plan_data.objective,
        master_plan_json=master_plan_data.model_dump(),
        computational_plan_json=master_plan_data.computational_plan.model_dump(),
        experimental_plan_json=master_plan_data.experimental_plan.model_dump(),
        resources_json=[r.model_dump() for r in master_plan_data.resources],
        status="active"
    )
    db.add(db_plan)
    
    # Insert phases
    all_phases = master_plan_data.computational_plan.phases + master_plan_data.experimental_plan.phases
    for p in all_phases:
        db_phase = WorkPhase(
            plan_id=plan_id,
            phase_number=p.phase_number,
            sub_plan_type=p.sub_plan_type,
            title=p.title,
            objective=p.objective,
            tasks_json=p.tasks,
            expected_outputs_json=p.expected_outputs,
            time_estimate=p.time_estimate,
            handoff=p.handoff,
            dependencies_json=p.dependencies,
            status="pending"
        )
        db.add(db_phase)
        
    db.commit()
    
    # Inject the plan_id into the response for convenience
    res = master_plan_data.model_dump()
    res["id"] = plan_id
    res["run_id"] = run_id
    return res


@router.get("/plans/{plan_id}", response_model=MasterPlanResponse)
def get_plan(plan_id: str, db: Session = Depends(get_db)) -> Any:
    db_plan = db.query(WorkPlan).filter(WorkPlan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    res = db_plan.master_plan_json
    res["id"] = db_plan.id
    res["run_id"] = db_plan.run_id
    return res


@router.get("/plans/{plan_id}/phases", response_model=list[PhaseStatusResponse])
def list_phases(plan_id: str, db: Session = Depends(get_db)) -> Any:
    phases = (
        db.query(WorkPhase)
        .filter(WorkPhase.plan_id == plan_id)
        .order_by(WorkPhase.sub_plan_type, WorkPhase.phase_number)
        .all()
    )
    return [
        PhaseStatusResponse(
            id=p.id,
            phase_number=p.phase_number,
            title=p.title,
            sub_plan_type=p.sub_plan_type,
            status=p.status,
            dependencies=p.dependencies_json,
            tasks=p.tasks_json,
            expected_outputs=p.expected_outputs_json,
            actual_outputs=p.actual_outputs_json,
            verification=PhaseVerification(**p.verification_json) if p.verification_json else None
        )
        for p in phases
    ]


def _resolve_phase(db: Session, plan_id: str, phase_ref: str) -> WorkPhase:
    phase = db.query(WorkPhase).filter(WorkPhase.plan_id == plan_id, WorkPhase.id == phase_ref).first()
    if phase:
        return phase

    if phase_ref.isdigit():
        phase_number = int(phase_ref)
        matches = (
            db.query(WorkPhase)
            .filter(WorkPhase.plan_id == plan_id, WorkPhase.phase_number == phase_number)
            .order_by(WorkPhase.sub_plan_type, WorkPhase.id)
            .all()
        )
        if len(matches) == 1:
            return matches[0]
        if len(matches) > 1:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Phase number {phase_number} is ambiguous for this plan. "
                    "Use the phase id from GET /v1/plans/{plan_id}/phases."
                ),
            )

    raise HTTPException(status_code=404, detail="Phase not found")


@router.post("/plans/{plan_id}/phases/{phase_ref}/start")
async def start_phase(
    plan_id: str,
    phase_ref: str,
    db: Session = Depends(get_db)
) -> dict:
    phase = _resolve_phase(db, plan_id, phase_ref)

    if phase.status in {"running", "completed", "awaiting_approval"}:
        raise HTTPException(status_code=400, detail=f"Phase is currently {phase.status}")

    # Check dependencies
    for dep in phase.dependencies_json:
        dep_phase = (
            db.query(WorkPhase)
            .filter(
                WorkPhase.plan_id == plan_id,
                WorkPhase.sub_plan_type == phase.sub_plan_type,
                WorkPhase.phase_number == dep,
            )
            .first()
        )
        if dep_phase and dep_phase.status != "completed":
            raise HTTPException(status_code=400, detail=f"Dependency phase {dep} is not completed")

    phase.status = "running"
    db.commit()

    await run_phase(db, plan_id, phase.id)

    return {"message": "Phase started"}


@router.get("/plans/{plan_id}/phases/{phase_ref}/status", response_model=PhaseStatusResponse)
def get_phase_status(plan_id: str, phase_ref: str, db: Session = Depends(get_db)) -> Any:
    p = _resolve_phase(db, plan_id, phase_ref)

    return PhaseStatusResponse(
        id=p.id,
        phase_number=p.phase_number,
        title=p.title,
        sub_plan_type=p.sub_plan_type,
        status=p.status,
        dependencies=p.dependencies_json,
        tasks=p.tasks_json,
        expected_outputs=p.expected_outputs_json,
        actual_outputs=p.actual_outputs_json,
        verification=PhaseVerification(**p.verification_json) if p.verification_json else None
    )


@router.post("/plans/{plan_id}/phases/{phase_ref}/approve")
def approve_phase(
    plan_id: str,
    phase_ref: str,
    payload: ApprovePhaseRequest,
    db: Session = Depends(get_db)
) -> dict:
    phase = _resolve_phase(db, plan_id, phase_ref)

    if phase.status != "awaiting_approval":
        raise HTTPException(status_code=400, detail="Phase is not awaiting approval")

    phase.status = "completed" if payload.user_approved else "failed"
    db.commit()

    return {"message": f"Phase marked as {phase.status}"}


@router.get("/plans/{plan_id}/resources", response_model=list[ResourceItem])
def get_resources(plan_id: str, db: Session = Depends(get_db)) -> Any:
    plan = db.query(WorkPlan).filter(WorkPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    return [ResourceItem(**r) for r in plan.resources_json]
