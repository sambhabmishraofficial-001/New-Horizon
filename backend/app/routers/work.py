from fastapi import APIRouter, HTTPException

from app.schemas import StartWorkRequest, StartWorkResponse
from app.services.workrunner import start_research_workspace

router = APIRouter(prefix="/v1", tags=["work"])


@router.post("/start-work", response_model=StartWorkResponse)
def start_work(payload: StartWorkRequest) -> dict:
    try:
        return start_research_workspace(
            messages=payload.messages,
            planner_reply=payload.planner_reply,
            workstream_preference=payload.workstream_preference,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
