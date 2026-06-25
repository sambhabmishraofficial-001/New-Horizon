from __future__ import annotations

from app.schemas import ProposedLab


def default_proposed_labs() -> list[ProposedLab]:
    return [
        ProposedLab(
            name="Evidence Synthesis Lab",
            kind="review",
            workstream="review",
            can_run_here=True,
            rationale="Collect and grade relevant evidence across papers, documentation, datasets, standards, and prior work for the domain.",
            first_tasks=[
                "Define search and source criteria",
                "Collect relevant evidence sources",
                "Grade claims and caveats",
            ],
        ),
        ProposedLab(
            name="Data and Artifact Lab",
            kind="data",
            workstream="data",
            can_run_here=True,
            rationale="Find, inspect, prepare, and track provenance for public or user-provided data, files, code, and intermediate artifacts.",
            first_tasks=[
                "Identify usable data or artifact sources",
                "Create source manifests",
                "Prepare normalized input or inspection files",
            ],
        ),
        ProposedLab(
            name="Mathematical and Computational Modeling Lab",
            kind="computational",
            workstream="computational",
            can_run_here=True,
            rationale="Choose and run the appropriate quantitative, statistical, simulation, or computational analysis for the question.",
            first_tasks=[
                "Select the modeling or analysis route",
                "Run reproducible scripts or calculations",
                "Create result tables, figures, and diagnostics",
            ],
        ),
        ProposedLab(
            name="Domain Specialist Lab",
            kind="review",
            workstream="hybrid",
            can_run_here=True,
            rationale="Adapt the plan to the actual field, whether mathematics, biology, chemistry, physics, engineering, clinical research, policy, or another domain.",
            first_tasks=[
                "Name the domain assumptions",
                "Translate outputs into field-specific checks",
                "Identify domain-specific validation needs",
            ],
        ),
        ProposedLab(
            name="Review and Handoff Lab",
            kind="validation",
            workstream="review",
            can_run_here=True,
            rationale="Inspect outputs, call out uncertainty, and hand off validation or next steps that sit outside the current harness.",
            first_tasks=[
                "Review generated files",
                "Summarize confidence and limitations",
                "Write validation next steps",
            ],
        ),
    ]


def contextual_proposed_labs(context: str) -> list[ProposedLab]:
    text = context.lower()
    if _has_any(text, ("glp-1", "glp1", "semaglutide", "liraglutide", "colorectal", "cancer", "oncology", "clinical trial", "clinical trails")):
        return [
            ProposedLab(
                name="Incretin Pharmacology Lab",
                kind="clinical pharmacology",
                workstream="review",
                can_run_here=True,
                rationale="Identify the relevant GLP-1 receptor agonists, mechanisms, exposure definitions, and comparator assumptions before interpreting cancer evidence.",
                first_tasks=[
                    "List GLP-1 receptor agonists and related incretin drugs",
                    "Separate GLP-1-only agents from dual GIP/GLP-1 agents",
                    "Define drug exposure and comparator groups",
                ],
            ),
            ProposedLab(
                name="Colorectal Oncology Outcomes Lab",
                kind="oncology outcomes",
                workstream="review",
                can_run_here=True,
                rationale="Frame colorectal cancer endpoints such as incidence, recurrence, survival, progression, and prognosis so the report does not mix incompatible outcomes.",
                first_tasks=[
                    "Define colorectal cancer outcomes and endpoints",
                    "Separate incidence/risk from prognosis/survival questions",
                    "Track confounders such as obesity, diabetes, and follow-up time",
                ],
            ),
            ProposedLab(
                name="Clinical Trial Registry Lab",
                kind="clinical evidence",
                workstream="data",
                can_run_here=True,
                rationale="Search and summarize trial registry evidence and published clinical trial outcomes relevant to GLP-1 drugs and colorectal cancer.",
                first_tasks=[
                    "Build ClinicalTrials.gov and literature search queries",
                    "Extract trial status, population, intervention, comparator, and endpoints",
                    "Flag whether trials measure colorectal cancer directly or only adverse events",
                ],
            ),
            ProposedLab(
                name="Safety Signal and Epidemiology Lab",
                kind="pharmacoepidemiology",
                workstream="computational",
                can_run_here=True,
                rationale="Compare observational, meta-analysis, pharmacovigilance, and epidemiologic signals while documenting bias and confounding limits.",
                first_tasks=[
                    "Collect observational and meta-analysis evidence",
                    "Summarize direction of association and confidence",
                    "Document limitations, confounding, and signal quality",
                ],
            ),
            ProposedLab(
                name="Evidence Report Lab",
                kind="reporting",
                workstream="review",
                can_run_here=True,
                rationale="Produce an auditable report with tables, assumptions, citations, uncertainty, and recommended next steps.",
                first_tasks=[
                    "Write the structured report outline",
                    "Create evidence tables and summary claims",
                    "Separate findings, uncertainty, and recommended follow-up",
                ],
            ),
        ]
    if _has_any(text, ("math", "theorem", "proof", "derive", "equation", "optimization", "optimisation")):
        return [
            ProposedLab(
                name="Mathematical Framing Lab",
                kind="mathematics",
                workstream="review",
                can_run_here=True,
                rationale="Turn the request into definitions, assumptions, variables, and proof or computation targets.",
                first_tasks=["Formalize the objective", "List assumptions", "Identify solvable subproblems"],
            ),
            ProposedLab(
                name="Symbolic Derivation Lab",
                kind="symbolic reasoning",
                workstream="computational",
                can_run_here=True,
                rationale="Work through algebraic, analytic, or proof steps and record each transformation.",
                first_tasks=["Derive candidate solution paths", "Check edge cases", "Write reproducible notes"],
            ),
            ProposedLab(
                name="Numerical Verification Lab",
                kind="numerical analysis",
                workstream="computational",
                can_run_here=True,
                rationale="Use simulations or numerical checks to validate the symbolic result where appropriate.",
                first_tasks=["Create verification cases", "Run numerical checks", "Compare against expected behavior"],
            ),
            ProposedLab(
                name="Review and Explanation Lab",
                kind="review",
                workstream="review",
                can_run_here=True,
                rationale="Turn the result into a clear explanation with limitations and assumptions.",
                first_tasks=["Review the derivation", "Explain assumptions", "Prepare final answer"],
            ),
        ]
    if _has_any(text, ("software", "code", "api", "database", "frontend", "backend", "pipeline", "bug")):
        return [
            ProposedLab(
                name="Systems Design Lab",
                kind="software architecture",
                workstream="review",
                can_run_here=True,
                rationale="Clarify the software objective, interfaces, data flow, and failure modes before implementation.",
                first_tasks=["Map requirements", "Identify integration points", "Define acceptance checks"],
            ),
            ProposedLab(
                name="Implementation Lab",
                kind="engineering",
                workstream="computational",
                can_run_here=True,
                rationale="Create or modify code, scripts, and configuration in a reproducible workspace.",
                first_tasks=["Edit scoped files", "Wire runtime behavior", "Keep changes testable"],
            ),
            ProposedLab(
                name="Verification Lab",
                kind="testing",
                workstream="computational",
                can_run_here=True,
                rationale="Run builds, tests, and runtime checks to verify behavior.",
                first_tasks=["Run automated checks", "Inspect failures", "Document residual risk"],
            ),
            ProposedLab(
                name="Handoff Lab",
                kind="review",
                workstream="review",
                can_run_here=True,
                rationale="Summarize changed files, behavior, and next engineering decisions.",
                first_tasks=["Summarize changes", "List validation", "Call out follow-ups"],
            ),
        ]
    return default_proposed_labs()


def default_work_items() -> tuple[list[str], list[str], list[str]]:
    return (
        [
            "Create a workspace manifest that records objective, assumptions, selected labs, and data sources.",
            "Search public evidence/data first unless user-provided files are attached.",
            "Generate reproducible analysis files, result tables, and a review memo before final interpretation.",
        ],
        [
            "Track wet-lab or clinical validation as optional follow-up rather than running it inside this harness.",
        ],
        [
            "Review the plan, revise any assumptions, then approve workspace creation.",
        ],
    )


def contextual_work_items(context: str) -> tuple[list[str], list[str], list[str]]:
    text = context.lower()
    if _has_any(text, ("glp-1", "glp1", "semaglutide", "liraglutide", "colorectal", "colerectal", "cancer", "oncology")):
        return (
            [
                "Create a GLP-1 drug roster that separates GLP-1 receptor agonists from dual incretin agents.",
                "Define colorectal cancer outcome scope: incidence/risk, prognosis, recurrence, survival, or adverse-event signal.",
                "Search ClinicalTrials.gov, PubMed/Europe PMC, review articles, and safety-signal sources for GLP-1 and colorectal cancer evidence.",
                "Build an evidence table with drug, population, comparator, endpoint, study type, direction of effect, and key limitation.",
                "Draft a report that distinguishes clinical-trial evidence from observational and mechanistic evidence.",
            ],
            [
                "Track prospective clinical validation or oncology specialist review as follow-up; do not imply causality from observational evidence alone.",
            ],
            [
                "Review the report scope, comparator, and endpoint assumptions before approving workspace creation.",
            ],
        )
    return default_work_items()


def delegated_plan_markdown(
    *,
    goal: str,
    answers: list[str],
    proposed_labs: list[ProposedLab],
    computational_work: list[str],
    experimental_work: list[str],
    next_actions: list[str],
    workstream_preference: str,
) -> str:
    clean_goal = goal or "User-delegated VRI research question"
    assumptions = _delegated_assumptions(answers, workstream_preference)
    assumption_lines = "\n".join(f"- {assumption}" for assumption in assumptions)
    answer_lines = "\n".join(f"- {answer}" for answer in answers if answer.strip()) or "- No clarification answers were supplied."
    lab_lines = "\n".join(
        f"- **{lab.name}** ({lab.workstream}): {lab.rationale}"
        for lab in proposed_labs
    )
    phase_3_tasks = "\n".join(
        [
            "- Choose the main analysis route aligned with the objective and selected workstream.",
            "- Define reproducible scripts/notebooks and success criteria for each lab contribution.",
            "- Create result tables/figures and diagnostics for interpretability.",
        ]
    )
    phase_4_tasks = "\n".join(
        [
            "- Execute lightweight computational steps in sequence and capture intermediate artifacts.",
            "- Compare outputs against assumptions, constraints, and stop rules.",
            "- Record validation caveats and uncertainty notes before interpretation.",
        ]
    )
    phase_5_tasks = "\n".join(
        [
            "- Summarize outputs, confidence, and limitations in a report-ready structure.",
            "- Capture lab-to-lab handoffs and what remains for external validation.",
            "- Prepare final approval-ready deliverables for the user.",
        ]
    )
    files = "\n".join(
        [
            "- `conversation.json` - original chat and approvals",
            "- `planner_reply.json` - structured plan and selected labs",
            "- `labs.json` - lab identities, responsibilities, and handoffs",
            "- `tasks.json` - step-by-step work plan with status",
            "- `queries.txt` - public evidence/data search queries",
            "- `literature.json` - collected public evidence when search runs",
            "- `requirements.txt` and scripts - created only after approval",
            "- `report.md` or `report.pdf` scaffold if the approved deliverable asks for a report",
        ]
    )
    handoffs = "\n".join(
        [
            "- Evidence Synthesis Lab -> Data and Artifact Lab: source list, evidence claims, and caveats.",
            "- Data and Artifact Lab -> Mathematical and Computational Modeling Lab: source manifest and usable public/user data paths.",
            "- Mathematical and Computational Modeling Lab -> Domain Specialist Lab: result tables, scripts, figures, and diagnostics.",
            "- Domain Specialist Lab -> Review and Handoff Lab: field-specific checks, limitations, and validation needs.",
            "- Review and Handoff Lab -> user: final interpretation, files created, limitations, and recommended next steps.",
        ]
    )
    computational = "\n".join(f"- {item}" for item in computational_work)
    experimental = "\n".join(f"- {item}" for item in experimental_work)
    actions = "\n".join(f"- {item}" for item in next_actions)

    return f"""## Proposed VRI Plan

### Objective
{clean_goal}

### Assumptions VRI Will Use
{assumption_lines}

### User Answers Captured
{answer_lines}

### Proposed Labs
{lab_lines}

### Phased Execution Plan

#### Phase 1 - Environment setup and source intake _(estimate: 10-20 min)_
Objective: lock scope and prepare a reproducible workspace.
- Record objective, delegated defaults, stop rules, and selected labs in workspace manifests.
- Confirm source strategy (public evidence/data first; user files if attached).
- Create initial query and source manifest files.
Expected files:
- `conversation.json`
- `planner_reply.json`
- `queries.txt`
Handoff: Evidence Synthesis Lab -> Data and Artifact Lab.

#### Phase 2 - Data cleaning, preprocessing, and quality checks _(estimate: 15-35 min)_
Objective: transform raw sources into analysis-ready inputs with provenance.
- Normalize source metadata, identifiers, and file layout.
- Run schema/quality checks and flag missingness or contradictions.
- Produce cleaned intermediate artifacts with traceability.
Expected files:
- `literature.json` (when search runs)
- `tasks.json`
- cleaned/intermediate data artifacts
Handoff: Data and Artifact Lab -> Mathematical and Computational Modeling Lab.

#### Phase 3 - Modeling and analysis _(estimate: 20-45 min)_
Objective: run the core computational or domain analysis.
{phase_3_tasks}
Expected files:
- `requirements.txt` and analysis scripts
- result tables/figures/diagnostics
Handoff: Mathematical and Computational Modeling Lab -> Domain Specialist Lab.

#### Phase 4 - Validation and review _(estimate: 10-25 min)_
Objective: test robustness and separate claims from uncertainty.
{phase_4_tasks}
Expected files:
- validation notes
- review annotations linked to artifacts
Handoff: Domain Specialist Lab -> Review and Handoff Lab.

#### Phase 5 - Final handoff and deliverables _(estimate: 5-15 min)_
Objective: deliver a clear, auditable output package.
{phase_5_tasks}
Expected files:
- `report.md` or `report.pdf` scaffold
- final summary and next-step notes
Handoff: Review and Handoff Lab -> user.

### Computational Work
{computational}

### Validation Tracked Separately
{experimental}

### Expected Files
{files}

### Lab Handoffs
{handoffs}

### Before Execution
{actions}
"""


def fallback_plan_markdown(
    *,
    proposed_labs: list[ProposedLab],
    computational_work: list[str],
    experimental_work: list[str],
    next_actions: list[str],
) -> str:
    lab_lines = "\n".join(
        f"- **{lab.name}** ({lab.workstream}, {lab.kind}): {lab.rationale}"
        for lab in proposed_labs
    ) or "- No labs proposed."
    phase_3 = "\n".join(f"- {task}" for task in computational_work) or "- Run scoped computational tasks aligned with the objective."
    phase_4 = "\n".join(f"- {task}" for task in experimental_work) or "- Record validation checks and caveats for review."
    phase_5 = "\n".join(f"- {task}" for task in next_actions) or "- Confirm final review and execution approval path."
    files = "\n".join(
        [
            "- `conversation.json` and `planner_reply.json`",
            "- `labs.json`, `tasks.json`, and `queries.txt`",
            "- `literature.json` when evidence search is run",
            "- `requirements.txt`, generated scripts, data, processed files, and reports when applicable",
        ]
    )
    return f"""## Proposed VRI Plan

### Labs
{lab_lines}

### Phased execution plan

#### Phase 1 - Environment setup and data/source intake _(estimate: 10-20 min)_
- Lock objective, scope, assumptions, and selected labs.
- Prepare workspace manifests and source queries.
Handoff: planner -> evidence/data labs.

#### Phase 2 - Data cleaning and preprocessing _(estimate: 15-35 min)_
- Normalize sources and file structures.
- Run quality checks and produce analysis-ready artifacts.
Handoff: data/artifact labs -> modeling/analysis labs.

#### Phase 3 - Modeling and analysis _(estimate: 20-45 min)_
{phase_3}
Handoff: modeling/analysis labs -> domain review.

#### Phase 4 - Validation and review _(estimate: 10-25 min)_
{phase_4}
Handoff: domain review -> handoff lab.

#### Phase 5 - Final handoff and deliverables _(estimate: 5-15 min)_
{phase_5}
Handoff: handoff lab -> user.

### Expected files
{files}

### Lab handoffs
- The coordinating planner creates manifests first.
- Evidence/data labs create source files.
- Computational labs create scripts and processed outputs.
- Review labs inspect results and summarize caveats before final interpretation.
"""


def _delegated_assumptions(answers: list[str], workstream_preference: str) -> list[str]:
    combined = " ".join(answers).lower()
    assumptions = [
        "Use public evidence, public datasets, and user-provided files when available; choose the source type that fits the field.",
        "Prefer computational/review/data work inside this harness; physical, wet-lab, clinical, or field validation is tracked as follow-up only.",
        "State uncertainty and stop before workspace execution until the user approves this plan.",
    ]
    if workstream_preference != "any":
        assumptions.append(f"Respect the selected workstream preference: {workstream_preference}.")
    if _has_any(combined, ("computational", "no just computational", "only computational")):
        assumptions.append("Do not propose executable wet-lab work; include validation only as a written handoff.")
    if _has_any(combined, ("1 month", "one month")):
        assumptions.append("Keep the plan sized for a one-month research/reporting window.")
    if _has_any(combined, ("pdf", "report", "minor report")):
        assumptions.append("Prepare the deliverable as a report-oriented workspace, with a markdown/PDF path after approval.")
    if _has_valid_delegation(answers):
        assumptions.append("For unresolved choices, VRI will choose conservative defaults and record them in the workspace manifest.")
    return list(dict.fromkeys(assumption for assumption in assumptions if assumption))


def _has_valid_delegation(answers: list[str]) -> bool:
    return any(
        _has_any(
            answer.lower(),
            (
                "vri should choose",
                "choose",
                "reasonable default",
                "idk",
                "not sure",
                "you tell me",
                "find it",
                "figure it out",
            ),
        )
        for answer in answers
    )


def _has_any(text: str, needles: tuple[str, ...]) -> bool:
    return any(needle in text for needle in needles)
