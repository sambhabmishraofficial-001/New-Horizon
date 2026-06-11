from __future__ import annotations

import json
import ast
import operator
import re
from collections.abc import AsyncIterator
from dataclasses import dataclass

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.config import Settings, get_settings
from app.llm.clients import ModelConfigurationError, get_model_client
from app.prompts.labs import list_lab_prompts
from app.prompts.labs import resolve_lab_prompt
from app.schemas import (
    ClarificationItem,
    ClarificationOption,
    LabChatRequest,
    LabChatResponse,
    ProposedLab,
    VriChatRequest,
    VriChatResponse,
)

router = APIRouter(prefix="/v1", tags=["chat"])


BASE_CHAT_PROMPT = """You are Aletheia, a careful scientific co-investigator inside New Horizon VRI.
Answer directly, but keep claims falsifiable. Return only valid JSON with:
- answer: a useful concise response
- assumptions: a list of assumptions you are making
- next_actions: a list of concrete next actions"""


VRI_PLANNER_PROMPT = """You are Aletheia, the institute architect for New Horizon VRI.
Your job is not to answer from a fixed lab. Your job is to understand the user's research goal,
ask clarifying questions when needed, then propose which virtual labs should be created.

Conversation policy:
- Classify the current turn as direct_answer, clarify, or proposal.
- If the user asks a simple factual, arithmetic, definition, status, or lightweight help question, answer directly with intent "direct_answer"; do not propose labs.
- Planning is only for multi-step research/workspace tasks.
- Ask as many clarification rounds as needed, from 1 to 10 rounds, until the objective and answers are clear enough for a concrete runnable plan.
- Each normal clarification turn should ask 3-10 useful questions. Ask fewer only when repairing one or two missing/unclear answers.
- If the user's answers are vague, gibberish, contradictory, unrelated, or incomplete, stage must be "clarify" and you must ask repair questions.
- For clarification questions with a small known answer space, return 2-4 explicit options in clarification_items and set input_type to "single_choice".
- For open-ended questions, set input_type to "free_text" and return no options.
- Clarification questions must also be summarized in clarification_questions for backwards compatibility.
- Return stage "proposal" only when objective, scope, constraints, deliverables, and runnable plan are clear.
- Proposed labs may be existing lab templates or new labs such as Bioinformatics Lab, Genomics Lab, Cheminformatics Lab,
  Statistical Modeling Lab, Wet Lab Validation, Literature Evidence Lab, Data Engineering Lab, Math Modeling Lab, or Imaging Core.
- Mark labs and tasks as computational, experimental, hybrid, review, or data. Computational work is work the user can run here directly;
  experimental work is wet-lab or physical work that should be tracked on top as required validation.
- Respect any user-selected workstream preference. If they request computational-only, propose only computational/data/review work
  unless you explicitly explain that wet-lab validation is optional and should be tracked separately.
- Respect any selected lab constraints. If specific allowed labs are provided, use only those labs unless the user asks to broaden scope.
- Do not say the labs are created until the user confirms.
- If the latest user message clearly confirms the proposal, stage must be "confirmed" and you must provide the execution next steps.
- When proposing, include plan_markdown as clean markdown with: overview, proposed labs, step-by-step tasks, estimated time per step, expected files, and lab handoffs.
- Also return readiness fields: planning_allowed, objective_clear, answer_quality, missing_information, repair_reasons.
- Avoid generic repeated answers. Use the user's actual goal, constraints, data, organism/disease/system, available assays,
  budget/time constraints, and desired output.
- Return only valid JSON. No markdown fences."""


@router.post("/lab-chat", response_model=LabChatResponse)
async def lab_chat(
    payload: LabChatRequest,
    settings: Settings = Depends(get_settings),
) -> LabChatResponse:
    lab_prompt = resolve_lab_prompt(payload.lab_id)
    system_prompt = BASE_CHAT_PROMPT
    if lab_prompt:
        system_prompt = f"{BASE_CHAT_PROMPT}\n\nLab context:\n{lab_prompt.system_prompt}"

    user_prompt = (
        f"Lab: {lab_prompt.name if lab_prompt else payload.lab_id}\n"
        f"Context: {payload.context or 'No extra context provided.'}\n\n"
        f"User message:\n{payload.message}\n\n"
        "Return JSON shaped exactly like this:\n"
        '{"answer":"...", "assumptions":["..."], "next_actions":["..."]}'
    )

    try:
        client = get_model_client(settings)
        result = await client.generate_json(system_prompt, user_prompt)
    except ModelConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return LabChatResponse(
        lab_id=payload.lab_id,
        answer=str(result.get("answer", "")),
        assumptions=_string_list(result.get("assumptions")),
        next_actions=_string_list(result.get("next_actions")),
    )


@router.post("/vri-chat", response_model=VriChatResponse)
async def vri_chat(
    payload: VriChatRequest,
    settings: Settings = Depends(get_settings),
) -> VriChatResponse:
    direct_response = _direct_answer_response(payload)
    if direct_response:
        return direct_response

    readiness = _conversation_readiness(payload.messages)
    user_prompt = _vri_user_prompt(payload)

    try:
        client = get_model_client(settings)
        result = await client.generate_json(VRI_PLANNER_PROMPT, user_prompt)
    except ModelConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return _vri_response_from_result(result, readiness)


@router.post("/vri-chat/stream")
async def vri_chat_stream(
    payload: VriChatRequest,
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    direct_response = _direct_answer_response(payload)
    if direct_response:
        async def direct_event_stream() -> AsyncIterator[str]:
            for chunk in _chunk_text(direct_response.answer, 24):
                yield _sse("answer_delta", {"delta": chunk})
            yield _sse("final", direct_response.model_dump())

        return StreamingResponse(direct_event_stream(), media_type="text/event-stream")

    readiness = _conversation_readiness(payload.messages)
    user_prompt = _vri_user_prompt(payload)

    try:
        client = get_model_client(settings)
    except ModelConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    async def event_stream() -> AsyncIterator[str]:
        full_response = ""
        answer_extractor = _AnswerDeltaExtractor()
        emitted_answer = False
        yield _sse("status", {"message": "Routing request through VRI planner."})

        try:
            async for delta in client.stream_text(VRI_PLANNER_PROMPT, user_prompt):
                full_response += delta
                answer_delta = answer_extractor.push(delta)
                if answer_delta:
                    emitted_answer = True
                    yield _sse("answer_delta", {"delta": answer_delta})

            result = client._parse_json(full_response)
            response = _vri_response_from_result(result, readiness)

            if not emitted_answer and response.answer:
                for chunk in _chunk_text(response.answer, 24):
                    yield _sse("answer_delta", {"delta": chunk})

            yield _sse("final", response.model_dump())
        except Exception as exc:
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


def _vri_user_prompt(payload: VriChatRequest) -> str:
    available_labs = [
        {"id": lab["id"], "name": lab["name"], "domain": lab["domain"]}
        for lab in list_lab_prompts()
    ]
    allowed_labs = [
        lab for lab in available_labs if lab["id"] in set(payload.allowed_lab_ids)
    ]
    transcript = "\n".join(
        f"{message.role.upper()}: {message.content}" for message in payload.messages
    )
    readiness = _conversation_readiness(payload.messages)
    if readiness.planning_allowed:
        turn_instruction = "The deterministic gate says planning is allowed. Produce a concrete proposal unless the latest user message changed the objective."
    elif readiness.repair_reasons:
        turn_instruction = "The deterministic gate found unclear or invalid answers. Stay in clarify mode and ask focused repair questions."
    else:
        turn_instruction = "The deterministic gate says more information is needed. Stay in clarify mode and ask 3-10 useful questions."
    user_prompt = (
        f"Available starting lab templates:\n{available_labs}\n\n"
        f"Allowed lab constraint, if any:\n{allowed_labs or 'No specific lab constraint.'}\n\n"
        f"Workstream preference:\n{payload.workstream_preference}\n\n"
        f"Clarification rounds already answered:\n{readiness.round_count}\n\n"
        f"Objective clear:\n{readiness.objective_clear}\n\n"
        f"Answer quality:\n{readiness.answer_quality}\n\n"
        f"Missing information:\n{readiness.missing_information}\n\n"
        f"Repair reasons:\n{readiness.repair_reasons}\n\n"
        f"Planning allowed by deterministic gate:\n{readiness.planning_allowed}\n\n"
        f"Current instruction:\n{turn_instruction}\n\n"
        f"Conversation so far:\n{transcript}\n\n"
        "Return JSON shaped exactly like this:\n"
        "{"
        '"stage":"direct_answer | clarify | proposal | confirmed",'
        '"intent":"direct_answer | clarify | proposal",'
        '"answer":"direct message to user",'
        '"clarification_round":0,'
        '"planning_allowed":false,'
        '"objective_clear":false,'
        '"answer_quality":"unknown | clear | incomplete | invalid",'
        '"missing_information":["missing item"],'
        '"repair_reasons":["reason"],'
        '"clarification_questions":["1. numbered question"],'
        '"clarification_items":[{"id":"short-id","label":"1. Topic","question":"specific question","input_type":"single_choice | free_text","options":[{"label":"option","detail":"why this option matters"}]}],'
        '"proposed_labs":[{"name":"lab name","kind":"wet-lab | computational | data | review | modeling | validation","workstream":"computational | experimental | hybrid | review | data","can_run_here":true,"rationale":"why this lab is needed","first_tasks":["task"]}],'
        '"computational_work":["blue-coded work the user can run here directly"],'
        '"experimental_work":["green-coded wet-lab or validation work to track on top"],'
        '"next_actions":["action"],'
        '"plan_markdown":"markdown plan with proposed labs, step-by-step tasks, estimates, files, and lab handoffs"'
        "}"
    )
    return user_prompt


def _vri_response_from_result(
    result: dict,
    readiness: "ConversationReadiness",
) -> VriChatResponse:
    stage = _stage(result.get("stage"))
    intent = _intent(result.get("intent") or stage)
    forced_clarify = False
    if stage == "direct_answer":
        stage = "clarify"
        intent = "clarify"
        forced_clarify = True
    if not readiness.planning_allowed and stage in {"proposal", "confirmed"}:
        stage = "clarify"
        intent = "clarify"
        forced_clarify = True

    clarification_items = _clarification_items(
        result.get("clarification_items"),
        result.get("clarification_questions"),
    )
    if stage == "clarify" and not clarification_items:
        clarification_items = (
            _repair_clarification_items(readiness)
            if readiness.repair_reasons
            else _fallback_clarification_items(readiness.round_count)
        )
    if stage == "clarify":
        clarification_items = _normalize_question_count(clarification_items, readiness)

    proposed_labs = [
        ProposedLab(
            name=str(item.get("name", "Untitled lab")),
            kind=str(item.get("kind", "research")),
            workstream=_workstream(item.get("workstream")),
            can_run_here=bool(item.get("can_run_here", False)),
            rationale=str(item.get("rationale", "")),
            first_tasks=_string_list(item.get("first_tasks")),
        )
        for item in _dict_list(result.get("proposed_labs"))
    ]

    computational_work = _string_list(result.get("computational_work"))
    experimental_work = _string_list(result.get("experimental_work"))
    next_actions = _string_list(result.get("next_actions"))
    if stage == "clarify":
        proposed_labs = []
        computational_work = []
        experimental_work = []
        next_actions = []

    plan_markdown = str(result.get("plan_markdown") or "").strip()
    if stage != "clarify" and not plan_markdown:
        plan_markdown = _fallback_plan_markdown(
            proposed_labs=proposed_labs,
            computational_work=computational_work,
            experimental_work=experimental_work,
            next_actions=next_actions,
        )

    return VriChatResponse(
        stage=stage,
        intent=intent if stage != "clarify" else "clarify",
        answer=_clarify_answer(result, readiness, forced_clarify) if stage == "clarify" else str(result.get("answer", "")),
        clarification_round=min(10, readiness.round_count + 1) if stage == "clarify" else readiness.round_count,
        planning_allowed=stage in {"proposal", "confirmed"} and readiness.planning_allowed,
        objective_clear=readiness.objective_clear,
        answer_quality=readiness.answer_quality,
        missing_information=readiness.missing_information,
        repair_reasons=readiness.repair_reasons,
        clarification_questions=[item.question for item in clarification_items],
        clarification_items=clarification_items,
        proposed_labs=proposed_labs,
        computational_work=computational_work,
        experimental_work=experimental_work,
        next_actions=next_actions,
        plan_markdown=plan_markdown,
    )


def _clarification_items(value: object, fallback_questions: object) -> list[ClarificationItem]:
    items: list[ClarificationItem] = []
    for index, item in enumerate(_dict_list(value), start=1):
        question = str(item.get("question") or item.get("label") or "").strip()
        if not question:
            continue
        raw_options = _dict_list(item.get("options"))
        options = [
            ClarificationOption(
                label=str(option.get("label") or "").strip(),
                detail=str(option.get("detail")).strip() if option.get("detail") else None,
            )
            for option in raw_options
            if str(option.get("label") or "").strip()
        ][:4]
        input_type = item.get("input_type")
        if input_type != "single_choice" or len(options) < 2:
            input_type = "free_text"
            options = []
        items.append(
            ClarificationItem(
                id=str(item.get("id") or f"q{index}"),
                label=str(item.get("label") or f"{index}. Clarification"),
                question=question,
                input_type=input_type,
                options=options,
            )
        )

    if items:
        return items

    return [
        ClarificationItem(
            id=f"q{index}",
            label=f"{index}. Clarification",
            question=question,
            input_type="free_text",
            options=[],
        )
        for index, question in enumerate(_string_list(fallback_questions), start=1)
    ]


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
    objective_clear = _objective_is_clear(goal)
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

    if len(latest_answers) < 3 and not _has_valid_delegation(latest_answers):
        missing_information.append("At least three concrete answers or explicit delegation")

    combined = " ".join([goal, *latest_answers]).lower()
    if not _has_any(combined, ("dataset", "data", "public", "literature", "pubmed", "evidence", "fetch", "cohort", "trial", "gwas", "rna", "crispr", "sequence", "choose", "decide")):
        missing_information.append("Data/evidence source")
    if not _has_any(combined, ("memo", "table", "workspace", "figure", "report", "ranking", "yes/no", "conclusion", "protocol", "files", "choose", "decide")):
        missing_information.append("Desired deliverable")
    if not _has_any(combined, ("computational", "literature", "validation", "experimental", "review", "pipeline", "choose", "decide", "not sure")):
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


def _direct_answer_response(payload: VriChatRequest) -> VriChatResponse | None:
    latest = _latest_user_message(payload.messages)
    if not latest:
        return None
    if latest.startswith("Answers to clarification questions:"):
        return None

    arithmetic = _answer_arithmetic(latest)
    if arithmetic:
        return _direct_response(arithmetic)

    definition = _answer_definition(latest)
    if definition:
        return _direct_response(definition)

    if _looks_like_direct_lightweight_question(latest):
        return _direct_response(
            "This looks like a direct question rather than a workspace task. I can answer it directly here; ask me to make a research plan if you want labs, files, and execution."
        )
    return None


def _direct_response(answer: str) -> VriChatResponse:
    return VriChatResponse(
        stage="direct_answer",
        intent="direct_answer",
        answer=answer,
        clarification_round=0,
        planning_allowed=False,
        objective_clear=True,
        answer_quality="clear",
        missing_information=[],
        repair_reasons=[],
        clarification_questions=[],
        clarification_items=[],
        proposed_labs=[],
        computational_work=[],
        experimental_work=[],
        next_actions=[],
        plan_markdown="",
    )


def _answer_arithmetic(message: str) -> str | None:
    text = message.strip().lower()
    match = re.search(r"(?:what(?:'s| is)?|calculate|compute|answer)\s+([0-9\s+\-*/().%^=]+)\??$", text)
    if not match:
        return None
    expr = match.group(1).strip().replace("^", "**")
    if "=" in expr and not any(op in expr for op in ["+", "-", "*", "/", "%", "**"]):
        left, _, right = expr.partition("=")
        left_value = _safe_arithmetic(left)
        right_value = _safe_arithmetic(right)
        if left_value is None or right_value is None:
            return None
        return f"{left.strip()} = {right.strip()} is {left_value == right_value}."
    value = _safe_arithmetic(expr.replace("=", ""))
    if value is None:
        return None
    if float(value).is_integer():
        value = int(value)
    return f"The answer is {value}."


def _safe_arithmetic(expr: str) -> float | None:
    allowed = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    def eval_node(node):
        if isinstance(node, ast.Expression):
            return eval_node(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return float(node.value)
        if isinstance(node, ast.UnaryOp) and type(node.op) in allowed:
            return allowed[type(node.op)](eval_node(node.operand))
        if isinstance(node, ast.BinOp) and type(node.op) in allowed:
            return allowed[type(node.op)](eval_node(node.left), eval_node(node.right))
        raise ValueError("unsupported")

    try:
        tree = ast.parse(expr, mode="eval")
        return float(eval_node(tree))
    except Exception:
        return None


def _answer_definition(message: str) -> str | None:
    text = message.strip().lower().rstrip("?")
    match = re.match(r"^(?:what is|what does|define|explain)\s+(.+?)(?:\s+mean)?$", text)
    if not match:
        return None
    term = match.group(1).strip(" .")
    if _looks_like_research_request(text):
        return None
    definitions = {
        "rna-seq": "RNA-seq means RNA sequencing. It measures RNA transcripts to estimate gene-expression levels and compare biological states.",
        "rnaseq": "RNA-seq means RNA sequencing. It measures RNA transcripts to estimate gene-expression levels and compare biological states.",
        "crispr": "CRISPR is a genome-editing and functional-genomics system often used to perturb genes and test their roles in cells or organisms.",
        "vri": "VRI means Virtual Research Institute here: a coordinated set of virtual labs that plan, run, and audit research workflows.",
    }
    if term in definitions:
        return definitions[term]
    if len(term.split()) <= 5:
        return f"{term} is a term I can explain directly, but I do not have a specialized definition wired for it yet. Ask it as a research task if you want VRI to route it through labs."
    return None


def _looks_like_direct_lightweight_question(message: str) -> bool:
    text = message.lower().strip()
    if _looks_like_research_request(text):
        return False
    return text.endswith("?") and len(text.split()) <= 16


def _looks_like_research_request(text: str) -> bool:
    return _has_any(
        text,
        (
            "investigate",
            "analyze",
            "analyse",
            "research",
            "plan",
            "workflow",
            "pipeline",
            "workspace",
            "run",
            "check if",
            "cause",
            "risk",
            "association",
            "dataset",
            "study",
        ),
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
            "investigate",
            "analyze",
            "analyse",
            "predict",
            "compare",
            "find",
            "identify",
            "build",
            "review",
            "cause",
            "risk",
            "association",
        ),
    )


def _answer_is_invalid(answer: str) -> bool:
    text = answer.strip().lower()
    if _is_delegation(text):
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
        "idk",
        "i dont know",
        "i don't know",
        "none",
        "nothing",
        "na",
        "n/a",
        "not sure",
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
    return _has_any(text, ("you decide", "choose for me", "vri decide", "aletheia decide", "not sure, choose", "i am not sure"))


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


def _clarify_answer(
    result: dict,
    readiness: ConversationReadiness,
    forced_clarify: bool,
) -> str:
    if readiness.repair_reasons:
        return (
            "I cannot make a reliable plan from those answers yet. "
            "A few responses are unclear or not meaningful enough, so I need the repair answers below before proposing labs."
        )
    if readiness.missing_information:
        missing = ", ".join(readiness.missing_information[:4])
        return f"I need a bit more detail before planning. Missing: {missing}."
    if forced_clarify:
        return "I need to clarify the objective before proposing labs or starting a workspace."
    return str(result.get("answer", "")) or "I need a bit more detail before planning."


def _fallback_plan_markdown(
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
    task_lines = []
    task_index = 1
    for task in computational_work:
        task_lines.append(f"{task_index}. **Computational task** - {task} _(estimate: 5-15 min)_")
        task_index += 1
    for task in experimental_work:
        task_lines.append(f"{task_index}. **Validation task** - {task} _(estimate: planning only)_")
        task_index += 1
    for task in next_actions:
        task_lines.append(f"{task_index}. **Next action** - {task} _(estimate: 2-5 min)_")
        task_index += 1
    tasks = "\n".join(task_lines) or "1. **Review** - Confirm scope before workspace creation _(estimate: 2 min)_"
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

### Step-by-step tasks
{tasks}

### Expected files
{files}

### Lab handoffs
- The coordinating planner creates manifests first.
- Evidence/data labs create source files.
- Computational labs create scripts and processed outputs.
- Review labs inspect results and summarize caveats before final interpretation.
"""


def _clarification_round_count(messages: list) -> int:
    return min(10, len(_answer_rounds(messages)))


def _has_any(text: str, needles: tuple[str, ...]) -> bool:
    return any(needle in text for needle in needles)


def _dedupe_strings(values: list[str]) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))


def _sse(event: str, data: object) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _chunk_text(value: str, size: int):
    for index in range(0, len(value), size):
        yield value[index : index + size]


class _AnswerDeltaExtractor:
    def __init__(self) -> None:
        self.buffer = ""
        self.emitted_length = 0

    def push(self, delta: str) -> str:
        self.buffer += delta
        answer = _extract_answer_prefix(self.buffer)
        if len(answer) <= self.emitted_length:
            return ""
        next_delta = answer[self.emitted_length :]
        self.emitted_length = len(answer)
        return next_delta


def _extract_answer_prefix(content: str) -> str:
    key_index = content.find('"answer"')
    if key_index == -1:
        return ""

    colon_index = content.find(":", key_index + len('"answer"'))
    if colon_index == -1:
        return ""

    quote_index = content.find('"', colon_index + 1)
    if quote_index == -1:
        return ""

    chars: list[str] = []
    index = quote_index + 1
    while index < len(content):
        char = content[index]
        if char == '"':
            return "".join(chars)
        if char == "\\":
            if index + 1 >= len(content):
                return "".join(chars)
            escaped = content[index + 1]
            if escaped == "u":
                digits = content[index + 2 : index + 6]
                if len(digits) < 4:
                    return "".join(chars)
                try:
                    chars.append(chr(int(digits, 16)))
                except ValueError:
                    return "".join(chars)
                index += 6
                continue
            chars.append(
                {
                    '"': '"',
                    "\\": "\\",
                    "/": "/",
                    "b": "\b",
                    "f": "\f",
                    "n": "\n",
                    "r": "\r",
                    "t": "\t",
                }.get(escaped, escaped)
            )
            index += 2
            continue
        chars.append(char)
        index += 1

    return "".join(chars)


def _string_list(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value]
    if value is None:
        return []
    return [str(value)]


def _dict_list(value: object) -> list[dict]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        return [value]
    return []


def _stage(value: object) -> str:
    if value in {"direct_answer", "clarify", "proposal", "confirmed"}:
        return str(value)
    return "clarify"


def _intent(value: object) -> str:
    if value in {"direct_answer", "clarify", "proposal"}:
        return str(value)
    if value == "confirmed":
        return "proposal"
    return "clarify"


def _workstream(value: object) -> str:
    if value in {"computational", "experimental", "hybrid", "review", "data"}:
        return str(value)
    return "hybrid"
