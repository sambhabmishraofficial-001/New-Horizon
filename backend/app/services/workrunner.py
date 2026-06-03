from __future__ import annotations

import json
import os
import subprocess
import sys
import textwrap
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
    tool_calls: list[dict[str, Any]] = []
    generated_files: list[str] = []
    data_files: list[str] = []
    processed_files: list[str] = []

    labs = [lab.model_dump() for lab in planner_reply.proposed_labs]
    tasks = _tasks_from_reply(planner_reply)
    queries = _build_queries(messages, planner_reply)
    query = queries[0]
    goal_text = _goal_text(messages, planner_reply)
    is_protein_sequence_job = _looks_like_protein_sequence_job(goal_text)

    _record_tool(
        tool_calls,
        name="write_workspace_manifests",
        input_payload={"workspace": str(workspace), "labs": len(labs), "tasks": len(tasks)},
        callback=lambda: _write_workspace_manifests(
            workspace=workspace,
            messages=messages,
            planner_reply=planner_reply,
            labs=labs,
            tasks=tasks,
            queries=queries,
        ),
        generated_files=generated_files,
    )
    steps.append({"status": "done", "label": "Created workspace manifests"})

    venv_path = workspace / "venv"
    venv_result = _record_tool(
        tool_calls,
        name="python_venv_create",
        input_payload={"command": [sys.executable, "-m", "venv", str(venv_path)]},
        callback=lambda: _run_command(
            [sys.executable, "-m", "venv", str(venv_path)],
            timeout=120,
            cwd=workspace,
        ),
    )
    if _command_ok(venv_result):
        steps.append({"status": "done", "label": "Created isolated Python venv"})
    else:
        errors.append("Python venv creation failed.")
        steps.append({"status": "error", "label": "Python venv creation failed"})

    literature: list[dict[str, Any]] = []
    literature_payload = _record_tool(
        tool_calls,
        name="europe_pmc_literature_search",
        input_payload={"queries": queries, "page_size": 8},
        callback=lambda: _search_and_write_literature(workspace, queries),
        generated_files=generated_files,
    )
    if isinstance(literature_payload, dict):
        literature = literature_payload.get("records", [])
        steps.append({"status": "done", "label": f"Found {len(literature)} literature records"})
    else:
        errors.append("Literature search failed.")
        _write_json(workspace / "literature.json", [])
        generated_files.append(str(workspace / "literature.json"))
        steps.append({"status": "error", "label": "Literature search failed"})

    requirements_path = workspace / "requirements.txt"
    _record_tool(
        tool_calls,
        name="write_run_requirements",
        input_payload={"file": str(requirements_path)},
        callback=lambda: _write_requirements(requirements_path),
        generated_files=generated_files,
    )
    steps.append({"status": "done", "label": "Wrote per-run requirements"})

    pip_install_result: dict[str, Any] | None = None
    if venv_path.exists():
        python_bin = _venv_binary(venv_path, "python")
        pip_install_result = _record_tool(
            tool_calls,
            name="pip_install_research_stack",
            input_payload={
                "command": [str(python_bin), "-m", "pip", "install", "-r", str(requirements_path)]
            },
            callback=lambda: _run_command(
                [str(python_bin), "-m", "pip", "install", "-r", str(requirements_path)],
                timeout=240,
                cwd=workspace,
            ),
        )
        if _command_ok(pip_install_result):
            steps.append({"status": "done", "label": "Installed packages into run venv"})
        else:
            errors.append("Package installation failed or timed out; generated scripts still use stdlib fallbacks.")
            steps.append({"status": "error", "label": "Package installation failed"})

    script_files = _record_tool(
        tool_calls,
        name="generate_research_scripts",
        input_payload={"protein_sequence_job": is_protein_sequence_job},
        callback=lambda: _write_research_scripts(workspace, is_protein_sequence_job),
        generated_files=generated_files,
    )
    if isinstance(script_files, list):
        steps.append({"status": "done", "label": f"Generated {len(script_files)} research scripts"})
    else:
        errors.append("Research script generation failed.")
        steps.append({"status": "error", "label": "Research script generation failed"})

    if is_protein_sequence_job and venv_path.exists():
        python_bin = _venv_binary(venv_path, "python")
        download_script = workspace / "scripts" / "download_uniprot_sequences.py"
        process_script = workspace / "scripts" / "prepare_sequence_features.py"
        inspect_script = workspace / "scripts" / "inspect_dataset.py"

        download_result = _record_tool(
            tool_calls,
            name="download_uniprot_sequences",
            input_payload={"command": [str(python_bin), str(download_script)]},
            callback=lambda: _run_command(
                [str(python_bin), str(download_script)],
                timeout=90,
                cwd=workspace,
            ),
        )
        fasta_path = workspace / "data" / "uniprot_reviewed_enzymes.fasta"
        metadata_path = workspace / "data" / "uniprot_download.json"
        if _command_ok(download_result) and fasta_path.exists():
            data_files.extend([str(fasta_path), str(metadata_path)])
            steps.append({"status": "done", "label": "Downloaded UniProt reviewed enzyme sequences"})
        else:
            errors.append("UniProt sequence download failed.")
            steps.append({"status": "error", "label": "UniProt sequence download failed"})

        process_result = _record_tool(
            tool_calls,
            name="process_sequence_features",
            input_payload={"command": [str(python_bin), str(process_script)]},
            callback=lambda: _run_command(
                [str(python_bin), str(process_script)],
                timeout=90,
                cwd=workspace,
            ),
        )
        features_path = workspace / "processed" / "sequence_features.csv"
        if _command_ok(process_result) and features_path.exists():
            processed_files.append(str(features_path))
            steps.append({"status": "done", "label": "Processed sequence feature table"})
        else:
            errors.append("Sequence feature processing failed.")
            steps.append({"status": "error", "label": "Sequence feature processing failed"})

        inspect_result = _record_tool(
            tool_calls,
            name="inspect_processed_dataset",
            input_payload={"command": [str(python_bin), str(inspect_script)]},
            callback=lambda: _run_command(
                [str(python_bin), str(inspect_script)],
                timeout=60,
                cwd=workspace,
            ),
        )
        report_path = workspace / "reports" / "dataset_report.json"
        if _command_ok(inspect_result) and report_path.exists():
            processed_files.append(str(report_path))
            steps.append({"status": "done", "label": "Wrote dataset inspection report"})
        else:
            errors.append("Dataset inspection failed.")
            steps.append({"status": "error", "label": "Dataset inspection failed"})
    elif not is_protein_sequence_job:
        steps.append({"status": "done", "label": "No sequence-specific data pipeline was selected"})

    readme = _workspace_readme(
        run_id=run_id,
        query=query,
        labs=planner_reply.proposed_labs,
        task_count=len(tasks),
        literature_count=len(literature),
        workstream_preference=workstream_preference,
        generated_files=generated_files,
        data_files=data_files,
        processed_files=processed_files,
    )
    (workspace / "README.md").write_text(readme, encoding="utf-8")
    if str(workspace / "README.md") not in generated_files:
        generated_files.append(str(workspace / "README.md"))
    steps.append({"status": "done", "label": "Wrote workspace README"})

    return {
        "run_id": run_id,
        "status": "completed" if not errors else "completed_with_errors",
        "workspace_path": str(workspace),
        "venv_path": str(venv_path),
        "literature_query": query,
        "steps": steps,
        "tool_calls": tool_calls,
        "generated_files": _dedupe(generated_files),
        "data_files": _dedupe(data_files),
        "processed_files": _dedupe(processed_files),
        "labs_created": labs,
        "tasks_created": tasks,
        "literature_results": literature,
        "errors": errors,
    }


def _record_tool(
    tool_calls: list[dict[str, Any]],
    *,
    name: str,
    input_payload: dict[str, Any] | str | None,
    callback,
    generated_files: list[str] | None = None,
) -> Any:
    started_at = _now_iso()
    call: dict[str, Any] = {
        "name": name,
        "status": "running",
        "input": input_payload,
        "output": None,
        "started_at": started_at,
        "completed_at": None,
    }
    tool_calls.append(call)
    try:
        output = callback()
        call["status"] = "done"
        call["output"] = _summarize_output(output)
        call["completed_at"] = _now_iso()
        if generated_files is not None:
            generated_files.extend(_extract_paths(output))
        return output
    except Exception as exc:
        call["status"] = "error"
        call["output"] = {"error": str(exc)}
        call["completed_at"] = _now_iso()
        return None


def _run_command(command: list[str], *, timeout: int, cwd: Path) -> dict[str, Any]:
    completed = subprocess.run(
        command,
        check=False,
        timeout=timeout,
        cwd=str(cwd),
        capture_output=True,
        text=True,
    )
    return {
        "command": command,
        "returncode": completed.returncode,
        "stdout": _tail(completed.stdout),
        "stderr": _tail(completed.stderr),
    }


def _command_ok(payload: Any) -> bool:
    return isinstance(payload, dict) and payload.get("returncode") == 0


def _write_workspace_manifests(
    *,
    workspace: Path,
    messages: list[VriChatMessage],
    planner_reply: VriChatResponse,
    labs: list[dict[str, Any]],
    tasks: list[dict[str, Any]],
    queries: list[str],
) -> dict[str, Any]:
    files = [
        workspace / "conversation.json",
        workspace / "planner_reply.json",
        workspace / "labs.json",
        workspace / "tasks.json",
        workspace / "queries.txt",
    ]
    _write_json(files[0], [message.model_dump() for message in messages])
    _write_json(files[1], planner_reply.model_dump())
    _write_json(files[2], labs)
    _write_json(files[3], tasks)
    files[4].write_text("\n".join(queries), encoding="utf-8")
    return {"files": [str(path) for path in files]}


def _search_and_write_literature(workspace: Path, queries: list[str]) -> dict[str, Any]:
    literature, attempted_queries = search_literature_many(queries)
    literature_path = workspace / "literature.json"
    queries_path = workspace / "literature_queries.json"
    _write_json(literature_path, literature)
    _write_json(queries_path, attempted_queries)
    return {
        "records": literature,
        "attempted_queries": attempted_queries,
        "files": [str(literature_path), str(queries_path)],
    }


def _write_requirements(path: Path) -> dict[str, Any]:
    packages = [
        "requests>=2.32,<3",
        "numpy>=1.26",
        "pandas>=2.2",
        "scikit-learn>=1.5",
        "biopython>=1.84",
    ]
    path.write_text("\n".join(packages) + "\n", encoding="utf-8")
    return {"files": [str(path)], "packages": packages}


def _write_research_scripts(workspace: Path, is_protein_sequence_job: bool) -> list[str]:
    scripts_dir = workspace / "scripts"
    data_dir = workspace / "data"
    processed_dir = workspace / "processed"
    reports_dir = workspace / "reports"
    models_dir = workspace / "models"
    for path in (scripts_dir, data_dir, processed_dir, reports_dir, models_dir):
        path.mkdir(parents=True, exist_ok=True)

    files = [
        scripts_dir / "download_uniprot_sequences.py",
        scripts_dir / "prepare_sequence_features.py",
        scripts_dir / "inspect_dataset.py",
        scripts_dir / "train_ph_regressor.py",
        scripts_dir / "README.md",
        data_dir / "ph_labels_template.csv",
    ]
    files[0].write_text(_download_script(), encoding="utf-8")
    files[1].write_text(_feature_script(), encoding="utf-8")
    files[2].write_text(_inspect_script(), encoding="utf-8")
    files[3].write_text(_train_script(), encoding="utf-8")
    files[4].write_text(_scripts_readme(is_protein_sequence_job), encoding="utf-8")
    files[5].write_text("sequence_id,optimal_ph\nexample_uniprot_id,7.0\n", encoding="utf-8")
    return [str(path) for path in files]


def _download_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import json
        import urllib.parse
        import urllib.request
        from datetime import datetime, timezone
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        DATA = ROOT / "data"
        DATA.mkdir(exist_ok=True)

        QUERY = "(reviewed:true) AND (ec:*)"
        URL = "https://rest.uniprot.org/uniprotkb/search?" + urllib.parse.urlencode(
            {"query": QUERY, "format": "fasta", "size": "200"}
        )

        request = urllib.request.Request(
            URL,
            headers={"User-Agent": "NewHorizonVRI/0.1 local data fetch"},
        )
        with urllib.request.urlopen(request, timeout=45) as response:
            fasta = response.read().decode("utf-8")

        if not fasta.startswith(">"):
            raise RuntimeError("UniProt did not return FASTA content.")

        fasta_path = DATA / "uniprot_reviewed_enzymes.fasta"
        meta_path = DATA / "uniprot_download.json"
        fasta_path.write_text(fasta, encoding="utf-8")
        count = sum(1 for line in fasta.splitlines() if line.startswith(">"))
        meta_path.write_text(
            json.dumps(
                {
                    "source": "UniProtKB REST API",
                    "query": QUERY,
                    "url": URL,
                    "records": count,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "note": "This is sequence data only. Numeric pH labels still need a curated source.",
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        print(json.dumps({"fasta": str(fasta_path), "records": count}))
        '''
    ).strip() + "\n"


def _feature_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        FASTA = ROOT / "data" / "uniprot_reviewed_enzymes.fasta"
        OUT = ROOT / "processed" / "sequence_features.csv"
        OUT.parent.mkdir(exist_ok=True)
        AAS = "ACDEFGHIKLMNPQRSTVWY"


        def read_fasta(path: Path):
            current_id = None
            description = ""
            seq_parts = []
            for raw in path.read_text(encoding="utf-8").splitlines():
                line = raw.strip()
                if not line:
                    continue
                if line.startswith(">"):
                    if current_id and seq_parts:
                        yield current_id, description, "".join(seq_parts)
                    description = line[1:]
                    current_id = description.split()[0].split("|")[1] if "|" in description else description.split()[0]
                    seq_parts = []
                else:
                    seq_parts.append(line)
            if current_id and seq_parts:
                yield current_id, description, "".join(seq_parts)


        def features(sequence: str) -> dict[str, float | int | str]:
            length = len(sequence)
            if length == 0:
                raise ValueError("Empty sequence.")
            row: dict[str, float | int | str] = {
                "length": length,
                "charged_fraction": sum(sequence.count(aa) for aa in "DEKRH") / length,
                "acidic_fraction": sum(sequence.count(aa) for aa in "DE") / length,
                "basic_fraction": sum(sequence.count(aa) for aa in "KRH") / length,
                "aromatic_fraction": sum(sequence.count(aa) for aa in "FWY") / length,
                "hydrophobic_fraction": sum(sequence.count(aa) for aa in "AILMFWV") / length,
            }
            for aa in AAS:
                row[f"aa_{aa}"] = sequence.count(aa) / length
            return row


        if not FASTA.exists():
            raise FileNotFoundError(f"Missing FASTA file: {FASTA}")

        rows = []
        for sequence_id, description, sequence in read_fasta(FASTA):
            row = {"sequence_id": sequence_id, "description": description}
            row.update(features(sequence))
            rows.append(row)

        if not rows:
            raise RuntimeError("No FASTA records parsed.")

        with OUT.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)

        print(json.dumps({"features": str(OUT), "rows": len(rows), "columns": len(rows[0])}))
        '''
    ).strip() + "\n"


def _inspect_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path


        ROOT = Path(__file__).resolve().parents[1]
        FEATURES = ROOT / "processed" / "sequence_features.csv"
        REPORT = ROOT / "reports" / "dataset_report.json"
        REPORT.parent.mkdir(exist_ok=True)

        if not FEATURES.exists():
            raise FileNotFoundError(f"Missing feature table: {FEATURES}")

        with FEATURES.open(encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            rows = list(reader)

        lengths = [int(float(row["length"])) for row in rows]
        report = {
            "feature_table": str(FEATURES),
            "rows": len(rows),
            "columns": len(reader.fieldnames or []),
            "min_length": min(lengths) if lengths else None,
            "max_length": max(lengths) if lengths else None,
            "mean_length": round(sum(lengths) / len(lengths), 2) if lengths else None,
            "label_status": "missing_numeric_optimal_ph_labels",
            "next_step": "Curate sequence_id,optimal_ph labels in data/ph_labels_template.csv, then run scripts/train_ph_regressor.py.",
        }
        REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report))
        '''
    ).strip() + "\n"


def _train_script() -> str:
    return textwrap.dedent(
        r'''
        from __future__ import annotations

        import csv
        import json
        from pathlib import Path

        from sklearn.ensemble import RandomForestRegressor
        from sklearn.metrics import mean_absolute_error, r2_score
        from sklearn.model_selection import train_test_split


        ROOT = Path(__file__).resolve().parents[1]
        FEATURES = ROOT / "processed" / "sequence_features.csv"
        LABELS = ROOT / "data" / "ph_labels_template.csv"
        REPORT = ROOT / "reports" / "model_report.json"
        REPORT.parent.mkdir(exist_ok=True)

        if not FEATURES.exists():
            raise FileNotFoundError("Run prepare_sequence_features.py first.")
        if not LABELS.exists():
            raise FileNotFoundError("Add labels to data/ph_labels_template.csv first.")

        with FEATURES.open(encoding="utf-8") as handle:
            features = {row["sequence_id"]: row for row in csv.DictReader(handle)}
        with LABELS.open(encoding="utf-8") as handle:
            labels = {
                row["sequence_id"]: float(row["optimal_ph"])
                for row in csv.DictReader(handle)
                if row.get("sequence_id") and row.get("optimal_ph")
            }

        if len(labels) < 20:
            raise RuntimeError("Need at least 20 labeled sequence_id,optimal_ph rows before training.")

        x_rows = []
        y = []
        feature_names = []
        for sequence_id, label in labels.items():
            row = features.get(sequence_id)
            if not row:
                continue
            numeric = {
                key: float(value)
                for key, value in row.items()
                if key not in {"sequence_id", "description"}
            }
            if not feature_names:
                feature_names = list(numeric.keys())
            x_rows.append([numeric[name] for name in feature_names])
            y.append(label)

        if len(y) < 20:
            raise RuntimeError("Fewer than 20 labels matched downloaded feature rows.")

        x_train, x_test, y_train, y_test = train_test_split(x_rows, y, test_size=0.2, random_state=13)
        model = RandomForestRegressor(n_estimators=200, random_state=13)
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        report = {
            "rows": len(y),
            "features": feature_names,
            "mae": mean_absolute_error(y_test, predictions),
            "r2": r2_score(y_test, predictions),
            "note": "Use external validation before treating this as a real pH predictor.",
        }
        REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report))
        '''
    ).strip() + "\n"


def _scripts_readme(is_protein_sequence_job: bool) -> str:
    selected = "yes" if is_protein_sequence_job else "no"
    return f"""# Generated VRI Scripts

Sequence/protein data pipeline selected: `{selected}`

Run order:

```bash
venv/bin/python scripts/download_uniprot_sequences.py
venv/bin/python scripts/prepare_sequence_features.py
venv/bin/python scripts/inspect_dataset.py
```

The generated training script needs real `sequence_id,optimal_ph` labels before it can train:

```bash
venv/bin/python scripts/train_ph_regressor.py
```

The current automatic data fetch downloads sequence data from UniProt. It does not invent numeric pH labels.
"""


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


def _goal_text(messages: list[VriChatMessage], reply: VriChatResponse) -> str:
    pieces = [message.content for message in messages]
    pieces.extend(lab.name for lab in reply.proposed_labs)
    pieces.extend(reply.computational_work)
    pieces.extend(reply.experimental_work)
    pieces.extend(reply.next_actions)
    return " ".join(pieces).lower()


def _looks_like_protein_sequence_job(text: str) -> bool:
    return ("protein" in text or "enzyme" in text) and ("sequence" in text or "fasta" in text or "ph" in text)


def _write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def _workspace_readme(
    run_id: str,
    query: str,
    labs: list[ProposedLab],
    task_count: int,
    literature_count: int,
    workstream_preference: str,
    generated_files: list[str],
    data_files: list[str],
    processed_files: list[str],
) -> str:
    lab_lines = "\n".join(
        f"- {lab.name} ({lab.workstream}; {'runnable here' if lab.can_run_here else 'track on top'})"
        for lab in labs
    )
    generated_lines = "\n".join(f"- `{path}`" for path in _dedupe(generated_files))
    data_lines = "\n".join(f"- `{path}`" for path in _dedupe(data_files))
    processed_lines = "\n".join(f"- `{path}`" for path in _dedupe(processed_files))
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
- `requirements.txt`
- `scripts/`
- `venv/`

## Generated Files

{generated_lines or "- None."}

## Data Files

{data_lines or "- None yet."}

## Processed Files

{processed_lines or "- None yet."}
"""


def _venv_binary(venv_path: Path, name: str) -> Path:
    windows_path = venv_path / "Scripts" / f"{name}.exe"
    if windows_path.exists():
        return windows_path
    return venv_path / "bin" / name


def _extract_paths(output: Any) -> list[str]:
    if isinstance(output, dict):
        files = output.get("files")
        if isinstance(files, list):
            return [str(path) for path in files]
    if isinstance(output, list):
        return [str(item) for item in output if isinstance(item, str)]
    return []


def _summarize_output(output: Any) -> Any:
    if isinstance(output, dict):
        summarized = dict(output)
        records = summarized.get("records")
        if isinstance(records, list):
            summarized["records"] = {
                "count": len(records),
                "sample_titles": [
                    item.get("title")
                    for item in records[:3]
                    if isinstance(item, dict) and item.get("title")
                ],
            }
        return summarized
    if isinstance(output, list) and len(output) > 12:
        return {"count": len(output), "items": output[:12]}
    return output


def _tail(value: str, limit: int = 3000) -> str:
    value = value.strip()
    if len(value) <= limit:
        return value
    return value[-limit:]


def _dedupe(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
