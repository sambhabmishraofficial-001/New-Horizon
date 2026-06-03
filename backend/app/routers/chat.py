from fastapi import APIRouter, Depends, HTTPException

from app.config import Settings, get_settings
from app.llm.clients import ModelConfigurationError, get_model_client
from app.prompts.labs import list_lab_prompts
from app.prompts.labs import resolve_lab_prompt
from app.schemas import LabChatRequest, LabChatResponse, ProposedLab, VriChatRequest, VriChatResponse

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
- If the user goal is vague or underspecified, stage must be "clarify" and you should ask as many useful concrete clarification questions as needed, usually 6-12.
- Clarification questions must be numbered in the text itself, for example "1. What organism or cell line...?"
- If enough information is available, stage must be "proposal" and you must propose 2-5 labs to create.
- Proposed labs may be existing lab templates or new labs such as Bioinformatics Lab, Genomics Lab, Cheminformatics Lab,
  Statistical Modeling Lab, Wet Lab Validation, Literature Evidence Lab, Data Engineering Lab, Math Modeling Lab, or Imaging Core.
- Mark labs and tasks as computational, experimental, hybrid, review, or data. Computational work is work the user can run here directly;
  experimental work is wet-lab or physical work that should be tracked on top as required validation.
- Respect any user-selected workstream preference. If they request computational-only, propose only computational/data/review work
  unless you explicitly explain that wet-lab validation is optional and should be tracked separately.
- Respect any selected lab constraints. If specific allowed labs are provided, use only those labs unless the user asks to broaden scope.
- Do not say the labs are created until the user confirms.
- If the latest user message clearly confirms the proposal, stage must be "confirmed" and you must provide the execution next steps.
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
    user_prompt = (
        f"Available starting lab templates:\n{available_labs}\n\n"
        f"Allowed lab constraint, if any:\n{allowed_labs or 'No specific lab constraint.'}\n\n"
        f"Workstream preference:\n{payload.workstream_preference}\n\n"
        f"Conversation so far:\n{transcript}\n\n"
        "Return JSON shaped exactly like this:\n"
        "{"
        '"stage":"clarify | proposal | confirmed",'
        '"answer":"direct message to user",'
        '"clarification_questions":["1. numbered question"],'
        '"proposed_labs":[{"name":"lab name","kind":"wet-lab | computational | data | review | modeling | validation","workstream":"computational | experimental | hybrid | review | data","can_run_here":true,"rationale":"why this lab is needed","first_tasks":["task"]}],'
        '"computational_work":["blue-coded work the user can run here directly"],'
        '"experimental_work":["green-coded wet-lab or validation work to track on top"],'
        '"next_actions":["action"]'
        "}"
    )

    try:
        client = get_model_client(settings)
        result = await client.generate_json(VRI_PLANNER_PROMPT, user_prompt)
    except ModelConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return VriChatResponse(
        stage=_stage(result.get("stage")),
        answer=str(result.get("answer", "")),
        clarification_questions=_string_list(result.get("clarification_questions")),
        proposed_labs=[
            ProposedLab(
                name=str(item.get("name", "Untitled lab")),
                kind=str(item.get("kind", "research")),
                workstream=_workstream(item.get("workstream")),
                can_run_here=bool(item.get("can_run_here", False)),
                rationale=str(item.get("rationale", "")),
                first_tasks=_string_list(item.get("first_tasks")),
            )
            for item in _dict_list(result.get("proposed_labs"))
        ],
        computational_work=_string_list(result.get("computational_work")),
        experimental_work=_string_list(result.get("experimental_work")),
        next_actions=_string_list(result.get("next_actions")),
    )


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
    if value in {"clarify", "proposal", "confirmed"}:
        return str(value)
    return "clarify"


def _workstream(value: object) -> str:
    if value in {"computational", "experimental", "hybrid", "review", "data"}:
        return str(value)
    return "hybrid"
