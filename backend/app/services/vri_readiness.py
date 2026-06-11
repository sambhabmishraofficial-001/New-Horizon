from __future__ import annotations

import re
from dataclasses import dataclass

from app.schemas import ClarificationItem, ClarificationOption, VriChatMessage

@dataclass
class ConversationReadiness:
    round_count: int
    objective_clear: bool
    answer_quality: str
    planning_allowed: bool
    missing_information: list[str]
    repair_reasons: list[str]
    latest_answers: list[str]


def _conversation_readiness(messages: list[VriChatMessage]) -> ConversationReadiness:
    goal = _initial_goal(messages)
    answer_rounds = _answer_rounds(messages)
    latest_answers = answer_rounds[-1] if answer_rounds else []
    all_answers = [answer for answer_round in answer_rounds for answer in answer_round]
    objective_text = " ".join([goal, *all_answers])
    objective_clear = _objective_is_clear(objective_text)
    missing_information: list[str] = []
    repair_reasons: list[str] = []

    if not objective_clear:
        missing_information.append("Clear research objective")

    if not answer_rounds:
        missing_information.extend(
            [
                "Research scope",
                "Available data or evidence source",
                "Desired output",
                "Execution constraints",
            ]
        )
        return ConversationReadiness(
            round_count=0,
            objective_clear=objective_clear,
            answer_quality="unknown",
            planning_allowed=False,
            missing_information=_dedupe_strings(missing_information),
            repair_reasons=[],
            latest_answers=[],
        )

    invalid_answers = [answer for answer in latest_answers if _answer_is_invalid(answer)]
    if invalid_answers:
        repair_reasons.extend(
            [
                "One or more answers were empty, unrelated, or not meaningful enough to plan from.",
                "Please answer the unclear items directly or explicitly delegate the choice to VRI.",
            ]
        )

    has_delegation = _has_valid_delegation(all_answers)
    meaningful_answers = [
        answer
        for answer in all_answers
        if not _answer_is_invalid(answer) and not _is_delegation(answer.lower())
    ]

    if not has_delegation and len(meaningful_answers) < 2:
        missing_information.append("A few concrete answers or explicit delegation")

    combined = objective_text.lower()
    biomedical_specific_missing = _biomedical_specific_missing(combined, len(answer_rounds))
    missing_information.extend(biomedical_specific_missing)

    if not has_delegation and len(meaningful_answers) < 3:
        if not _has_any(combined, ("dataset", "data", "public", "literature", "pubmed", "evidence", "fetch", "cohort", "trial", "gwas", "rna", "crispr", "sequence")):
            missing_information.append("Data/evidence source")
        if not _has_any(combined, ("memo", "table", "workspace", "figure", "report", "ranking", "yes/no", "conclusion", "protocol", "files", "pdf")):
            missing_information.append("Desired deliverable")
        if not _has_any(combined, ("computational", "literature", "validation", "experimental", "review", "pipeline", "machine learning", "modeling", "modelling")):
            missing_information.append("Preferred analysis route")

    answer_quality = "clear"
    if repair_reasons:
        answer_quality = "invalid"
    elif missing_information:
        answer_quality = "incomplete"

    planning_allowed = objective_clear and answer_quality == "clear"
    return ConversationReadiness(
        round_count=min(10, len(answer_rounds)),
        objective_clear=objective_clear,
        answer_quality=answer_quality,
        planning_allowed=planning_allowed,
        missing_information=_dedupe_strings(missing_information),
        repair_reasons=_dedupe_strings(repair_reasons),
        latest_answers=latest_answers,
    )



def _initial_goal(messages: list[VriChatMessage]) -> str:
    for message in messages:
        if message.role == "user" and not message.content.startswith("Answers to clarification questions:"):
            return message.content
    return ""


def _latest_user_message(messages: list[VriChatMessage]) -> str:
    for message in reversed(messages):
        if message.role == "user":
            return message.content.strip()
    return ""


def _answer_rounds(messages: list[VriChatMessage]) -> list[list[str]]:
    rounds: list[list[str]] = []
    for message in messages:
        if message.role != "user" or not message.content.startswith("Answers to clarification questions:"):
            continue
        answers: list[str] = []
        for line in message.content.splitlines()[1:]:
            _, separator, value = line.partition(":")
            answers.append((value if separator else line).strip())
        rounds.append([answer for answer in answers if answer])
    return rounds


def _objective_is_clear(goal: str) -> bool:
    text = goal.lower()
    tokens = [token for token in re.findall(r"[a-zA-Z0-9][a-zA-Z0-9+-]*", text) if len(token) > 2]
    return len(tokens) >= 4 and _has_any(
        text,
        (
            "check",
            "test",
            "effect",
            "evaluate",
            "assess",
            "investigate",
            "analyze",
            "analyse",
            "predict",
            "compare",
            "find",
            "identify",
            "build",
            "review",
            "solve",
            "prove",
            "derive",
            "model",
            "optimize",
            "pattern",
            "theorem",
            "problem",
            "cause",
            "risk",
            "association",
        ),
    )


def _biomedical_specific_missing(text: str, round_count: int) -> list[str]:
    if not _looks_like_biomedical_research(text):
        return []

    missing: list[str] = []
    if not _has_any(text, ("comparator", "compare", "versus", "vs", "control", "non-user", "untreated", "placebo", "matched")):
        missing.append("Comparator/control group")
    if not _has_any(text, ("incidence", "survival", "mortality", "progression", "recurrence", "response", "hazard", "odds", "risk ratio", "prognosis", "outcome")):
        missing.append("Primary endpoint/outcome")
    if not _has_any(text, ("pubmed", "literature", "clinicaltrials", "open targets", "fda", "faers", "seer", "tcga", "gwas", "uk biobank", "public evidence", "search")):
        missing.append("Evidence sources to search")
    if not _has_any(text, ("human", "patients", "cohort", "rct", "observational", "preclinical", "in vitro", "mouse", "all populations", "class of drugs")):
        missing.append("Population/study type boundary")
    if not _has_any(text, ("pdf", "report", "memo", "table", "forest", "figure", "citation", "references")):
        missing.append("Report contents")

    if round_count < 2 and missing:
        missing.append("Second-round biomedical specificity")
    return missing


def _looks_like_biomedical_research(text: str) -> bool:
    return _has_any(
        text,
        (
            "cancer",
            "tumor",
            "tumour",
            "drug",
            "glp-1",
            "glp1",
            "semaglutide",
            "liraglutide",
            "colorectal",
            "colerectal",
            "prognosis",
            "survival",
            "clinical",
            "patient",
            "disease",
        ),
    )


def _answer_is_invalid(answer: str) -> bool:
    text = answer.strip().lower()
    if _is_delegation(text):
        return False
    if text in {"no", "yes", "all", "any", "geo", "pdf", "ml", "mr", "rna", "dna"}:
        return False
    if len(text) < 3:
        return True
    junk = {
        "asdf",
        "qwerty",
        "blah",
        "gibberish",
        "random",
        "nonsense",
    }
    if text in junk:
        return True
    if re.fullmatch(r"[\W_]+", text):
        return True
    if len(set(text.replace(" ", ""))) <= 2 and len(text) > 4:
        return True
    tokens = re.findall(r"[a-zA-Z0-9]+", text)
    if not tokens:
        return True
    if len(tokens) == 1 and len(tokens[0]) < 4:
        return True
    return False


def _has_valid_delegation(answers: list[str]) -> bool:
    return any(_is_delegation(answer.lower()) for answer in answers)


def _is_delegation(text: str) -> bool:
    return _has_any(
        text,
        (
            "you decide",
            "choose for me",
            "vri decide",
            "aletheia decide",
            "vri should choose",
            "vri choose",
            "you choose",
            "u choose",
            "choose reasonable",
            "reasonable default",
            "use default",
            "use defaults",
            "not sure, choose",
            "i am not sure",
            "i'm not sure",
            "not sure",
            "i dont know",
            "i don't know",
            "idk",
            "not decided",
            "havent decided",
            "haven't decided",
            "no preference",
            "whatever is best",
            "up to you",
            "do whats best",
            "do what's best",
            "you tell me",
            "u tell me",
            "you have to find",
            "u have to find",
            "you find",
            "find it",
            "figure it out",
            "thats why i asked",
            "that's why i asked",
            "public databases",
            "public evidence",
        ),
    )


def _repair_clarification_items(readiness: ConversationReadiness) -> list[ClarificationItem]:
    reasons = readiness.repair_reasons or readiness.missing_information
    return [
        ClarificationItem(
            id="repair-answers",
            label="1. Repair unclear answers",
            question="Some answers were not clear enough to plan from. Please restate the unclear answers in plain language, or say exactly where VRI should choose for you.",
            input_type="free_text",
            options=[],
        ),
        ClarificationItem(
            id="repair-objective",
            label="2. Objective check",
            question="What exact research question should the labs answer?",
            input_type="free_text",
            options=[],
        ),
        ClarificationItem(
            id="repair-output",
            label="3. Output check",
            question="What final output do you want: decision memo, evidence table, reproducible workspace, figure/report, or validation protocol?",
            input_type="single_choice",
            options=[
                ClarificationOption(label="Decision memo", detail="A concise conclusion with evidence and caveats."),
                ClarificationOption(label="Evidence table", detail="A structured source/claim/confidence table."),
                ClarificationOption(label="Reproducible workspace", detail="Files, scripts, manifests, and run trace."),
                ClarificationOption(label="VRI should choose", detail="Let VRI pick the most useful deliverable and state assumptions."),
            ],
        ),
    ][: max(3, min(10, len(reasons) + 1))]


def _fallback_clarification_items(round_count: int) -> list[ClarificationItem]:
    if round_count == 0:
        return [
            ClarificationItem(
                id="direction-scope",
                label="1. Research scope",
                question="What is the broad direction of this project?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Literature/evidence review", detail="Find, grade, and summarize published or public evidence."),
                    ClarificationOption(label="Analyze my dataset", detail="Use data you already have or will attach/provide."),
                    ClarificationOption(label="Build a computational pipeline", detail="Create reproducible scripts, files, and workflow steps."),
                    ClarificationOption(label="Plan experimental validation", detail="Design wet-lab or clinical follow-up work to track."),
                ],
            ),
            ClarificationItem(
                id="direction-output",
                label="2. Desired output",
                question="What should VRI produce at the end?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Decision memo", detail="Concise recommendation with evidence and caveats."),
                    ClarificationOption(label="Reproducible workspace", detail="Scripts, manifests, files, and run trace."),
                    ClarificationOption(label="Evidence table", detail="Structured table of sources, claims, and confidence."),
                    ClarificationOption(label="Experiment plan", detail="Step-by-step validation plan for a lab team."),
                ],
            ),
            ClarificationItem(
                id="direction-context",
                label="3. Context",
                question="What data, disease, organism, assay, or constraints should VRI know before narrowing the plan?",
                input_type="free_text",
                options=[],
            ),
            ClarificationItem(
                id="direction-data",
                label="4. Data source",
                question="Should VRI use your data, public literature/data, or both?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Use my data", detail="I will provide or already have files/data."),
                    ClarificationOption(label="Use public evidence", detail="Search public literature and databases."),
                    ClarificationOption(label="Use both", detail="Combine user data with public evidence."),
                    ClarificationOption(label="VRI should choose", detail="Let VRI select the safest starting point."),
                ],
            ),
            ClarificationItem(
                id="direction-constraints",
                label="5. Constraints",
                question="Any time, compute, wet-lab, organism, cohort, or method constraints?",
                input_type="free_text",
                options=[],
            ),
        ]

    return [
        ClarificationItem(
            id="specific-targets",
            label="1. Specific target",
            question="Which exact entities, cohorts, genes, drugs, datasets, or cancer/disease types are in scope?",
            input_type="free_text",
            options=[],
        ),
        ClarificationItem(
            id="specific-methods",
            label="2. Method boundary",
            question="Which analysis style should the labs prioritize?",
            input_type="single_choice",
            options=[
                ClarificationOption(label="Computational only", detail="Use public data, code, literature, and reproducible analysis."),
                ClarificationOption(label="Computational + validation plan", detail="Run what can be run here, then specify wet-lab follow-up."),
                ClarificationOption(label="Literature first", detail="Do evidence grading before any computational pipeline."),
                ClarificationOption(label="I am not sure", detail="Let VRI choose the safest route and state assumptions."),
            ],
        ),
        ClarificationItem(
            id="specific-success",
            label="3. Success criteria",
            question="What would make the result useful: a ranking, a yes/no conclusion, a reproducible file set, a figure, a protocol, or something else?",
            input_type="free_text",
            options=[],
        ),
        ClarificationItem(
            id="specific-files",
            label="4. Expected files",
            question="Which files should the workspace create or inspect?",
            input_type="free_text",
            options=[],
        ),
        ClarificationItem(
            id="specific-stop",
            label="5. Stop condition",
            question="When should VRI stop and ask you before doing more work?",
            input_type="single_choice",
            options=[
                ClarificationOption(label="Before any external data fetch", detail="Plan first, then ask before public/database queries."),
                ClarificationOption(label="Before expensive compute", detail="Small prep is fine; ask before longer runs."),
                ClarificationOption(label="Only before workspace execution", detail="Planning can be detailed; execution still needs approval."),
                ClarificationOption(label="VRI should choose", detail="Use conservative defaults and state assumptions."),
            ],
        ),
    ]


def _normalize_question_count(
    items: list[ClarificationItem],
    readiness: ConversationReadiness,
) -> list[ClarificationItem]:
    if _needs_biomedical_specificity(readiness):
        domain_items = _biomedical_clarification_items(readiness)
        if domain_items:
            return domain_items[:10]
    if readiness.repair_reasons:
        return items[:10]
    if len(items) >= 3:
        return items[:10]
    fallback = _fallback_clarification_items(readiness.round_count)
    seen = {item.id for item in items}
    merged = [*items]
    for item in fallback:
        if item.id not in seen:
            merged.append(item)
            seen.add(item.id)
        if len(merged) >= 3:
            break
    return merged[:10]


def _needs_biomedical_specificity(readiness: ConversationReadiness) -> bool:
    return any(
        item
        in {
            "Comparator/control group",
            "Primary endpoint/outcome",
            "Evidence sources to search",
            "Population/study type boundary",
            "Report contents",
            "Second-round biomedical specificity",
        }
        for item in readiness.missing_information
    )


def _biomedical_clarification_items(readiness: ConversationReadiness) -> list[ClarificationItem]:
    missing = set(readiness.missing_information)
    items: list[ClarificationItem] = []

    if "Comparator/control group" in missing or "Second-round biomedical specificity" in missing:
        items.append(
            ClarificationItem(
                id="biomed-comparator",
                label="1. Comparator",
                question="What should GLP-1 drug exposure be compared against?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Non-users", detail="Compare GLP-1 users against matched non-users."),
                    ClarificationOption(label="Other diabetes/obesity drugs", detail="Useful if confounding by indication matters."),
                    ClarificationOption(label="Dose/duration groups", detail="Compare higher/lower exposure or longer/shorter use."),
                    ClarificationOption(label="VRI should choose", detail="Use the safest comparator for public evidence and state the assumption."),
                ],
            )
        )

    if "Primary endpoint/outcome" in missing or "Second-round biomedical specificity" in missing:
        items.append(
            ClarificationItem(
                id="biomed-endpoint",
                label="2. Endpoint",
                question="For colorectal cancer prognosis, what primary endpoint should the report prioritize?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Overall survival", detail="Most interpretable prognosis endpoint when available."),
                    ClarificationOption(label="Progression/recurrence", detail="Focus on disease course after diagnosis."),
                    ClarificationOption(label="Cancer-specific mortality", detail="Separates CRC mortality from all-cause mortality where possible."),
                    ClarificationOption(label="VRI should choose", detail="Pick the strongest endpoint available in public evidence."),
                ],
            )
        )

    if "Evidence sources to search" in missing or "Second-round biomedical specificity" in missing:
        items.append(
            ClarificationItem(
                id="biomed-evidence-route",
                label="3. Evidence route",
                question="Which evidence sources should VRI include before writing the PDF report?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Literature only", detail="PubMed/reviews/cohort/RCT evidence with citations."),
                    ClarificationOption(label="Literature + pharmacovigilance", detail="Add FDA/FAERS-style safety signal search if available."),
                    ClarificationOption(label="Literature + public datasets", detail="Add public cancer/omics resources if relevant."),
                    ClarificationOption(label="VRI should choose", detail="Start broad, then state source assumptions in the plan."),
                ],
            )
        )

    if "Population/study type boundary" in missing or "Second-round biomedical specificity" in missing:
        items.append(
            ClarificationItem(
                id="biomed-population",
                label="4. Population",
                question="What population or study boundary should be used?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Human clinical evidence", detail="Prioritize patient cohorts, trials, registries, and meta-analyses."),
                    ClarificationOption(label="Include preclinical mechanisms", detail="Add cell/animal/mechanistic studies after clinical evidence."),
                    ClarificationOption(label="All evidence tiers", detail="Clinical, pharmacovigilance, mechanistic, and public data."),
                    ClarificationOption(label="VRI should choose", detail="Use human evidence first and add mechanisms only as support."),
                ],
            )
        )

    if "Report contents" in missing or "Second-round biomedical specificity" in missing:
        items.append(
            ClarificationItem(
                id="biomed-report",
                label="5. PDF contents",
                question="What should the PDF report definitely contain?",
                input_type="single_choice",
                options=[
                    ClarificationOption(label="Executive summary + citations", detail="Short report with conclusion, caveats, and references."),
                    ClarificationOption(label="Evidence table + conclusion", detail="Structured study table plus interpretation."),
                    ClarificationOption(label="Methods appendix", detail="Include search strategy, inclusion/exclusion logic, and limitations."),
                    ClarificationOption(label="VRI should choose", detail="Use a rigorous default report structure."),
                ],
            )
        )

    return items



def _has_any(text: str, needles: tuple[str, ...]) -> bool:
    return any(needle in text for needle in needles)


def _dedupe_strings(values: list[str]) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))
