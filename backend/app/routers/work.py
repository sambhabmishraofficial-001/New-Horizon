import os
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.schemas import StartWorkRequest, StartWorkResponse, WorkspaceArtifactsResponse
from app.services.workrunner import start_research_workspace

router = APIRouter(prefix="/v1", tags=["work"])
PREVIEW_LIMIT = 24_000


@router.post("/start-work", response_model=StartWorkResponse)
def start_work(payload: StartWorkRequest) -> dict:
    if payload.planner_reply.stage not in {"proposal", "confirmed"} or not payload.planner_reply.planning_allowed:
        raise HTTPException(
            status_code=400,
            detail="Workspace can start only from an approved proposal with planning_allowed=true.",
        )
    try:
        return start_research_workspace(
            messages=payload.messages,
            planner_reply=payload.planner_reply,
            workstream_preference=payload.workstream_preference,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/workspaces/{run_id}/artifacts", response_model=WorkspaceArtifactsResponse)
def workspace_artifacts(run_id: str) -> dict:
    workspace = _workspace_for_run(run_id)
    files = []
    for path in sorted(workspace.rglob("*")):
        if not path.is_file() or _should_skip(path):
            continue
        relative = path.relative_to(workspace).as_posix()
        preview, truncated = _read_preview(path)
        files.append(
            {
                "path": str(path),
                "relative_path": relative,
                "kind": _artifact_kind(relative),
                "size_bytes": path.stat().st_size,
                "preview": preview,
                "truncated": truncated,
            }
        )
    return {"run_id": run_id, "workspace_path": str(workspace), "files": files}


def _workspace_for_run(run_id: str) -> Path:
    if not run_id or "/" in run_id or "\\" in run_id or ".." in run_id:
        raise HTTPException(status_code=400, detail="Invalid workspace run id.")
    root = Path(os.environ.get("VRI_WORKSPACE_ROOT", ".vri_workspaces")).resolve()
    workspace = (root / run_id).resolve()
    if root not in workspace.parents or not workspace.exists() or not workspace.is_dir():
        raise HTTPException(status_code=404, detail="Workspace not found.")
    return workspace


def _should_skip(path: Path) -> bool:
    parts = set(path.parts)
    return "venv" in parts or "__pycache__" in parts or path.name.endswith(".pyc")


def _artifact_kind(relative_path: str) -> str:
    if relative_path.startswith("scripts/"):
        return "script"
    if relative_path.startswith("data/"):
        return "data"
    if relative_path.startswith("processed/"):
        return "processed"
    if relative_path.startswith("reports/"):
        return "report"
    if relative_path.endswith(".json"):
        return "manifest"
    if relative_path.endswith(".md"):
        return "readme"
    if relative_path == "requirements.txt":
        return "requirements"
    return "artifact"


def _read_preview(path: Path) -> tuple[str, bool]:
    size = path.stat().st_size
    with path.open("rb") as handle:
        raw = handle.read(PREVIEW_LIMIT + 1)
    truncated = len(raw) > PREVIEW_LIMIT or size > PREVIEW_LIMIT
    text = raw[:PREVIEW_LIMIT].decode("utf-8", errors="replace")
    return text, truncated
