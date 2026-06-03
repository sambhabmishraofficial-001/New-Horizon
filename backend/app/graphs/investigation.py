from __future__ import annotations

import json
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from app.llm.clients import OpenAIModelClient
from app.prompts.labs import resolve_lab_prompt


class InvestigationState(TypedDict, total=False):
    investigation_id: str
    objective: str
    domain: str | None
    context: str | None
    messages: list[dict[str, str]]
    normalized_objective: str
    research_plan: list[dict[str, Any]]
    hypotheses: list[dict[str, Any]]
    falsifiers: list[dict[str, Any]]
    evidence_requests: list[dict[str, Any]]
    risks: list[dict[str, Any]]
    next_actions: list[dict[str, Any]]
    summary: str


BASE_SYSTEM_PROMPT = """You are Aletheia, a careful scientific investigation agent for a Virtual Research Institute.
Return only valid JSON. Do not include markdown fences.
Be explicit about uncertainty, falsifiability, missing evidence, and next experiments."""


def build_investigation_graph(model_client: OpenAIModelClient):
    graph = StateGraph(InvestigationState)

    async def intake(state: InvestigationState) -> dict[str, Any]:
        objective = state["objective"].strip()
        return {"normalized_objective": objective}

    async def planner(state: InvestigationState) -> dict[str, Any]:
        payload = await model_client.generate_json(
            _system_prompt(state),
            _prompt(
                "Create a concise investigation plan.",
                state,
                {
                    "research_plan": [
                        {
                            "step": "short step name",
                            "purpose": "why this step matters",
                            "output": "expected artifact",
                        }
                    ],
                    "evidence_requests": [
                        {
                            "kind": "dataset, assay, paper, protocol, or metadata",
                            "reason": "why it is needed",
                        }
                    ],
                },
            ),
        )
        return {
            "research_plan": _as_list(payload.get("research_plan")),
            "evidence_requests": _as_list(payload.get("evidence_requests")),
        }

    async def hypothesis_generator(state: InvestigationState) -> dict[str, Any]:
        payload = await model_client.generate_json(
            _system_prompt(state),
            _prompt(
                "Generate falsifiable hypotheses for this investigation.",
                state,
                {
                    "hypotheses": [
                        {
                            "title": "hypothesis title",
                            "rationale": "why it may be true",
                            "test": "experiment or analysis that could test it",
                            "confidence": "low, medium, or high",
                        }
                    ]
                },
            ),
        )
        return {"hypotheses": _as_list(payload.get("hypotheses"))}

    async def critic(state: InvestigationState) -> dict[str, Any]:
        payload = await model_client.generate_json(
            _system_prompt(state),
            _prompt(
                "Critique the plan and hypotheses. Focus on falsifiers and weak assumptions.",
                state,
                {
                    "falsifiers": [
                        {
                            "hypothesis": "hypothesis being challenged",
                            "falsifier": "result that would weaken or reject it",
                            "required_evidence": "evidence needed",
                        }
                    ],
                    "risks": [
                        {
                            "risk": "failure mode or bias",
                            "mitigation": "practical mitigation",
                        }
                    ],
                },
            ),
        )
        return {
            "falsifiers": _as_list(payload.get("falsifiers")),
            "risks": _as_list(payload.get("risks")),
        }

    async def synthesizer(state: InvestigationState) -> dict[str, Any]:
        payload = await model_client.generate_json(
            _system_prompt(state),
            _prompt(
                "Synthesize the investigation into an executive research summary and next actions.",
                state,
                {
                    "summary": "short summary",
                    "next_actions": [
                        {
                            "action": "next action",
                            "owner": "human researcher, AI investigator, or lab",
                            "priority": "low, medium, or high",
                        }
                    ],
                },
            ),
        )
        return {
            "summary": str(payload.get("summary", "")),
            "next_actions": _as_list(payload.get("next_actions")),
        }

    graph.add_node("intake", intake)
    graph.add_node("planner", planner)
    graph.add_node("hypothesis_generator", hypothesis_generator)
    graph.add_node("critic", critic)
    graph.add_node("synthesizer", synthesizer)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "planner")
    graph.add_edge("planner", "hypothesis_generator")
    graph.add_edge("hypothesis_generator", "critic")
    graph.add_edge("critic", "synthesizer")
    graph.add_edge("synthesizer", END)

    return graph.compile()


def _system_prompt(state: InvestigationState) -> str:
    lab_prompt = resolve_lab_prompt(state.get("domain"))
    if not lab_prompt:
        return BASE_SYSTEM_PROMPT
    return f"{BASE_SYSTEM_PROMPT}\n\nLab context:\n{lab_prompt.system_prompt}"


def _prompt(instruction: str, state: InvestigationState, response_schema: dict[str, Any]) -> str:
    prompt_state = {
        "objective": state.get("normalized_objective") or state.get("objective"),
        "domain": state.get("domain"),
        "context": state.get("context"),
        "messages": state.get("messages", []),
        "research_plan": state.get("research_plan", []),
        "hypotheses": state.get("hypotheses", []),
        "falsifiers": state.get("falsifiers", []),
        "evidence_requests": state.get("evidence_requests", []),
    }
    return (
        f"{instruction}\n\n"
        f"Investigation state:\n{json.dumps(prompt_state, indent=2)}\n\n"
        f"Return JSON matching this shape:\n{json.dumps(response_schema, indent=2)}"
    )


def _as_list(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item if isinstance(item, dict) else {"value": item} for item in value]
    if isinstance(value, dict):
        return [value]
    if value is None:
        return []
    return [{"value": value}]
