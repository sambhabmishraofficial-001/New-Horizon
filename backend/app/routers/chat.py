from __future__ import annotations

import json
import ast
import operator
import re
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.config import Settings, get_settings
from app.llm.clients import ModelConfigurationError, get_model_client
from app.prompts.labs import list_lab_prompts
from app.prompts.labs import resolve_lab_prompt
from app.services.vri_readiness import (
    ConversationReadiness,
    _answer_rounds,
    _conversation_readiness,
    _fallback_clarification_items,
    _initial_goal,
    _latest_user_message,
    _normalize_question_count,
    _repair_clarification_items,
)
from app.services.vri_plans import (
    contextual_proposed_labs,
    contextual_work_items,
    default_proposed_labs,
    default_work_items,
    delegated_plan_markdown,
    fallback_plan_markdown,
)
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
- If the user says they do not know, have not decided, or asks VRI to choose, treat that as valid delegation rather than an invalid answer.
- When choices are delegated, propose a conservative plan with explicit assumptions instead of repeatedly asking the same question.
- For clarification questions with a small known answer space, return 2-4 explicit options in clarification_items and set input_type to "single_choice".
- For open-ended questions, set input_type to "free_text" and return no options.
- Clarification questions must also be summarized in clarification_questions for backwards compatibility.
- Return stage "proposal" only when objective, scope, constraints, deliverables, and runnable plan are clear.
- Proposed labs are not limited to the starter templates. Create whatever institute labs the request needs, including mathematics,
  statistics, physics, chemistry, biology, clinical research, engineering, computer science, literature, policy, or domain-specific labs.
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
    if readiness.planning_allowed and _latest_user_message(payload.messages).startswith("Answers to clarification questions:"):
        return _deterministic_proposal_response(payload, readiness)

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
    if readiness.planning_allowed and _latest_user_message(payload.messages).startswith("Answers to clarification questions:"):
        response = _deterministic_proposal_response(payload, readiness)

        async def proposal_event_stream() -> AsyncIterator[str]:
            yield _sse("status", {"message": "Drafting a proposal from delegated defaults."})
            for chunk in _chunk_text(response.answer, 24):
                yield _sse("answer_delta", {"delta": chunk})
            yield _sse("final", response.model_dump())

        return StreamingResponse(proposal_event_stream(), media_type="text/event-stream")

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
        f"Optional starter lab templates, not an exhaustive lab list:\n{available_labs}\n\n"
        f"Allowed starter-template constraint, if any. If empty, create any labs the research requires:\n{allowed_labs or 'No specific lab constraint; VRI may create any needed labs.'}\n\n"
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
    forced_proposal = False
    if stage == "direct_answer":
        stage = "clarify"
        intent = "clarify"
        forced_clarify = True
    if not readiness.planning_allowed and stage in {"proposal", "confirmed"}:
        stage = "clarify"
        intent = "clarify"
        forced_clarify = True
    if readiness.planning_allowed and stage == "clarify":
        stage = "proposal"
        intent = "proposal"
        forced_proposal = True

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
    if stage != "clarify" and not proposed_labs:
        proposed_labs = default_proposed_labs()

    computational_work = _string_list(result.get("computational_work"))
    experimental_work = _string_list(result.get("experimental_work"))
    next_actions = _string_list(result.get("next_actions"))
    if stage != "clarify" and not any([computational_work, experimental_work, next_actions]):
        computational_work, experimental_work, next_actions = default_work_items()
    if stage == "clarify":
        proposed_labs = []
        computational_work = []
        experimental_work = []
        next_actions = []

    plan_markdown = str(result.get("plan_markdown") or "").strip()
    if stage != "clarify" and not plan_markdown:
        plan_markdown = fallback_plan_markdown(
            proposed_labs=proposed_labs,
            computational_work=computational_work,
            experimental_work=experimental_work,
            next_actions=next_actions,
        )

    return VriChatResponse(
        stage=stage,
        intent=intent if stage != "clarify" else "clarify",
        answer=(
            _clarify_answer(result, readiness, forced_clarify)
            if stage == "clarify"
            else _proposal_answer(result, forced_proposal)
        ),
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


def _proposal_answer(result: dict, forced_proposal: bool) -> str:
    answer = str(result.get("answer", "")).strip()
    if answer and not forced_proposal:
        return answer
    return (
        "I have enough to draft a conservative VRI plan. Where you have not decided details, "
        "I will use explicit defaults and keep execution blocked until you approve."
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

    biomedical_answer = _answer_biomedical_direct_question(latest)
    if biomedical_answer:
        return _direct_response(biomedical_answer)

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


def _deterministic_proposal_response(
    payload: VriChatRequest,
    readiness: ConversationReadiness,
) -> VriChatResponse:
    goal = _initial_goal(payload.messages).strip()
    answer_rounds = _answer_rounds(payload.messages)
    answers = [answer for answer_round in answer_rounds for answer in answer_round]
    context = " ".join([goal, *answers])
    proposed_labs = contextual_proposed_labs(context)
    computational_work, experimental_work, next_actions = contextual_work_items(context)
    plan_markdown = delegated_plan_markdown(
        goal=goal,
        answers=answers,
        proposed_labs=proposed_labs,
        computational_work=computational_work,
        experimental_work=experimental_work,
        next_actions=next_actions,
        workstream_preference=payload.workstream_preference,
    )
    return VriChatResponse(
        stage="proposal",
        intent="proposal",
        answer=(
            "I have enough to make a conservative VRI plan. I will choose reasonable defaults "
            "where you delegated details, state those assumptions, and wait for approval before creating files or running work."
        ),
        clarification_round=readiness.round_count,
        planning_allowed=True,
        objective_clear=True,
        answer_quality="clear",
        missing_information=[],
        repair_reasons=[],
        clarification_questions=[],
        clarification_items=[],
        proposed_labs=proposed_labs,
        computational_work=computational_work,
        experimental_work=experimental_work,
        next_actions=next_actions,
        plan_markdown=plan_markdown,
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


def _answer_biomedical_direct_question(message: str) -> str | None:
    text = message.lower().strip()
    asks_for_answer = _has_any(
        text,
        (
            "tell me",
            "what are",
            "list",
            "explain",
            "what is the effect",
            "what's the effect",
            "effect on",
        ),
    )
    mentions_glp = _has_any(text, ("glp-1", "glp1", "glp 1", "semaglutide", "liraglutide"))
    mentions_cancer = _has_any(text, ("cancer", "colorectal", "colerectal", "crc"))
    asks_to_execute = _has_any(text, ("make a plan", "create a plan", "workspace", "run", "start work", "generate files"))
    if not asks_for_answer or not mentions_glp or asks_to_execute:
        return None

    if mentions_cancer:
        return (
            "GLP-1 receptor agonist drugs include semaglutide, liraglutide, dulaglutide, exenatide, lixisenatide, and albiglutide where available. "
            "Related incretin drugs include tirzepatide, which is a dual GIP/GLP-1 agonist rather than GLP-1-only.\n\n"
            "For colorectal cancer, the current high-level reading is not a simple 'causes cancer' conclusion. Evidence usually needs to be separated into: "
            "incidence/risk of developing colorectal cancer, prognosis after colorectal cancer, recurrence, and treatment interactions. Obesity and diabetes are major confounders, so observational signals can be misleading. "
            "A useful report should compare GLP-1 users against non-users or other diabetes/weight-loss therapies, then separate randomized trials, observational cohorts, meta-analyses, pharmacovigilance signals, and mechanistic evidence."
        )

    return (
        "Common GLP-1 receptor agonists include semaglutide, liraglutide, dulaglutide, exenatide, lixisenatide, and albiglutide where available. "
        "Tirzepatide is related but is a dual GIP/GLP-1 agonist, so it should be tracked separately when comparing evidence."
    )


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
            "solve",
            "prove",
            "derive",
            "model",
            "optimize",
            "pattern",
            "theorem",
            "check if",
            "cause",
            "risk",
            "association",
            "dataset",
            "study",
        ),
    )


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
