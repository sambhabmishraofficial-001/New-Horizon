from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from app.schemas import ProposedLab, VriChatMessage, VriChatResponse
from app.services.literature import search_literature_many


def start_research_workspace(
    messages: list[VriChatMessage],
    planner_reply: VriChatResponse,
    workstream_preference: str,
) -> dict[str, Any]:
    run_id = str(uuid4())
    root = Path(os.environ.get("VRI_WORKSPACE_ROOT", ".vri_workspaces")).resolve()
    workspace = root / run_id
    workspace.mkdir(parents=True, exist_ok=True)

    steps: list[dict[str, str]] = []
    errors: list[str] = []

    labs = [lab.model_dump() for lab in planner_reply.proposed_labs]
    tasks = _tasks_from_reply(planner_reply)
    queries = _build_queries(messages, planner_reply)
    query = queries[0]

    _write_json(workspace / "conversation.json", [message.model_dump() for message in messages])
    _write_json(workspace / "planner_reply.json", planner_reply.model_dump())
    _write_json(workspace / "labs.json", labs)
    _write_json(workspace / "tasks.json", tasks)
    (workspace / "queries.txt").write_text("\n".join(queries), encoding="utf-8")
    steps.append({"status": "done", "label": "Created workspace manifests"})

    venv_path = workspace / "venv"
    try:
        subprocess.run(
            [sys.executable, "-m", "venv", str(venv_path)],
            check=True,
            timeout=120,
            capture_output=True,
            text=True,
        )
        steps.append({"status": "done", "label": "Created isolated Python venv"})
    except Exception as exc:
        errors.append(f"venv creation failed: {exc}")
        steps.append({"status": "error", "label": "Python venv creation failed"})

    literature: list[dict[str, Any]] = []
    try:
        literature, attempted_queries = search_literature_many(queries)
        _write_json(workspace / "literature.json", literature)
        _write_json(workspace / "literature_queries.json", attempted_queries)
        steps.append({"status": "done", "label": f"Found {len(literature)} literature records"})
    except Exception as exc:
        errors.append(f"literature search failed: {exc}")
        _write_json(workspace / "literature.json", [])
        steps.append({"status": "error", "label": "Literature search failed"})

    readme = _workspace_readme(
        run_id=run_id,
        query=query,
        labs=planner_reply.proposed_labs,
        task_count=len(tasks),
        literature_count=len(literature),
        workstream_preference=workstream_preference,
    )
    (workspace / "README.md").write_text(readme, encoding="utf-8")
    steps.append({"status": "done", "label": "Wrote workspace README"})

    return {
        "run_id": run_id,
        "status": "completed" if not errors else "completed_with_errors",
        "workspace_path": str(workspace),
        "venv_path": str(venv_path),
        "literature_query": query,
        "steps": steps,
        "labs_created": labs,
        "tasks_created": tasks,
        "literature_results": literature,
        "errors": errors,
    }


def _tasks_from_reply(reply: VriChatResponse) -> list[dict[str, Any]]:
    tasks: list[dict[str, Any]] = []
    for item in reply.computational_work:
        tasks.append({"title": item, "workstream": "computational", "source": "computational_work"})
    for item in reply.experimental_work:
        tasks.append({"title": item, "workstream": "experimental", "source": "experimental_work"})
    for item in reply.next_actions:
        tasks.append({"title": item, "workstream": "hybrid", "source": "next_actions"})
    for lab in reply.proposed_labs:
        for task in lab.first_tasks:
            tasks.append({"title": task, "workstream": lab.workstream, "source": lab.name})
    return tasks


def _build_queries(messages: list[VriChatMessage], reply: VriChatResponse) -> list[str]:
    user_goal = " ".join(
        message.content for message in messages if message.role == "user"
    ).lower()
    lab_terms = " ".join(lab.name for lab in reply.proposed_labs[:3]).lower()
    work_terms = " ".join(reply.computational_work[:3]).lower()
    compact_goal = _compact_terms(user_goal)

    queries: list[str] = []
    if "ph" in user_goal and ("protein" in user_goal or "sequence" in user_goal):
        queries.extend(
            [
                '"protein sequence" "pH" "machine learning"',
                '"optimal pH" enzyme "sequence" prediction',
                '"enzyme optimum pH" "machine learning"',
                '"protein pH optimum" "sequence" regression',
                '"isoelectric point" protein sequence prediction',
            ]
        )
    if "crispr" in user_goal or "rna-seq" in user_goal or "transcriptomic" in user_goal:
        queries.extend(
            [
                '"CRISPR screen" "RNA-seq" drug resistance',
                '"drug resistance" transcriptomics "CRISPR screen"',
                '"functional genomics" "drug resistance" cancer',
            ]
        )
    if compact_goal:
        queries.append(compact_goal)
    if lab_terms or work_terms:
        queries.append(_compact_terms(f"{lab_terms} {work_terms}"))
    queries.extend(
        [
            "machine learning protein sequence prediction",
            "computational biology model sequence regression",
        ]
    )
    return [query for query in queries if query][:8]


def _compact_terms(text: str) -> str:
    stop = {
        "i", "want", "to", "make", "a", "the", "and", "or", "from", "with", "for",
        "all", "only", "nothing", "else", "dont", "don't", "idk", "tell", "me",
        "just", "project", "has", "have", "work", "model", "predict", "prediction",
    }
    tokens = [
        token.strip(".,:;()[]{}!?\"'").lower()
        for token in text.replace("/", " ").split()
    ]
    kept = [token for token in tokens if len(token) > 2 and token not in stop]
    return " ".join(dict.fromkeys(kept[:16]))


def _write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def _workspace_readme(
    run_id: str,
    query: str,
    labs: list[ProposedLab],
    task_count: int,
    literature_count: int,
    workstream_preference: str,
) -> str:
    lab_lines = "\n".join(
        f"- {lab.name} ({lab.workstream}; {'runnable here' if lab.can_run_here else 'track on top'})"
        for lab in labs
    )
    return f"""# VRI Research Workspace

Run: `{run_id}`
Created: `{datetime.now(timezone.utc).isoformat()}`
Workstream preference: `{workstream_preference}`

## Literature Query

```text
{query}
```

Additional attempted queries are written to `queries.txt`.

## Labs

{lab_lines or "- No labs proposed."}

## Artifacts

- `conversation.json`
- `planner_reply.json`
- `labs.json`
- `tasks.json` ({task_count} tasks)
- `literature.json` ({literature_count} records)
- `queries.txt`
- `venv/`
"""
