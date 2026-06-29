from __future__ import annotations

import json
from typing import Any

from app.config import Settings
from app.llm.clients import get_model_client
from app.schemas import (
    ExperimentalDesign,
    MasterPlan,
    PlanPhase,
    ProposedLab,
    ResourceItem,
    SubPlan,
    VriChatResponse,
)

PLAN_GENERATION_PROMPT = """You are Aletheia, the VRI master planner.
Given the proposed labs, the computational work, and the experimental work, generate:
1. An experimental design (hypothesis, methodology, sample size, replicates, controls, blinding, power analysis, and step-by-step protocol).
2. A structured resource list (reagents, equipment, consumables, software).

Return JSON shaped EXACTLY like this:
{
  "experimental_design": {
    "hypothesis": "...",
    "methodology": "...",
    "sample_size": "...",
    "replicates": "...",
    "controls": ["..."],
    "blinding": "...",
    "power_analysis": "...",
    "expected_outcomes": ["..."],
    "protocol_steps": [
      {
        "step_number": 1,
        "action": "...",
        "reagents": ["..."],
        "concentrations": "...",
        "duration": "...",
        "temperature": "...",
        "notes": "..."
      }
    ]
  },
  "resources": [
    {
      "category": "reagent",
      "name": "...",
      "specifications": "...",
      "quantity": "...",
      "estimated_cost": "...",
      "safety_notes": "..."
    }
  ]
}
Category MUST be one of "reagent", "equipment", "consumable", "software".
"""

async def generate_master_plan(planner_reply: VriChatResponse, settings: Settings) -> MasterPlan:
    comp_labs = []
    exp_labs = []
    for lab in planner_reply.proposed_labs:
        if lab.workstream in {"computational", "data", "review"}:
            comp_labs.append(lab)
        else:
            exp_labs.append(lab)

    # Build computational subplan
    comp_phases = []
    phase_idx = 1
    for lab in comp_labs:
        comp_phases.append(
            PlanPhase(
                phase_number=phase_idx,
                title=f"{lab.name} Execution",
                sub_plan_type="computational",
                objective=lab.rationale,
                tasks=lab.first_tasks,
                expected_outputs=[f"{lab.name.lower().replace(' ', '_')}_results.json"],
                time_estimate="Auto-generated",
                handoff="To next phase",
                dependencies=[phase_idx - 1] if phase_idx > 1 else []
            )
        )
        phase_idx += 1

    comp_subplan = SubPlan(
        type="computational",
        title="Computational Sub-Plan",
        summary="Data gathering, modeling, and automated review tasks.",
        phases=comp_phases,
    )

    # Build experimental subplan structure
    exp_phases = []
    exp_phase_idx = 1
    for lab in exp_labs:
        exp_phases.append(
            PlanPhase(
                phase_number=exp_phase_idx,
                title=f"{lab.name} Execution",
                sub_plan_type="experimental",
                objective=lab.rationale,
                tasks=lab.first_tasks,
                expected_outputs=["experiment_results.csv"],
                time_estimate="Auto-generated",
                handoff="To analysis",
                dependencies=[exp_phase_idx - 1] if exp_phase_idx > 1 else []
            )
        )
        exp_phase_idx += 1

    # Call LLM for experimental design & resources
    user_prompt = f"""
    Labs: {[lab.model_dump() for lab in planner_reply.proposed_labs]}
    Computational Work: {planner_reply.computational_work}
    Experimental Work: {planner_reply.experimental_work}
    """

    client = get_model_client(settings)
    try:
        llm_reply = await client.generate_json(PLAN_GENERATION_PROMPT, user_prompt)
    except Exception:
        # Fallback if model fails or isn't configured
        llm_reply = {"experimental_design": {}, "resources": []}

    exp_design_data = llm_reply.get("experimental_design") or {}
    resources_data = llm_reply.get("resources") or []

    # Provide defaults for missing ExperimentalDesign fields
    if not exp_design_data.get("hypothesis"):
        exp_design_data["hypothesis"] = "Determine the effect of..."
    if not exp_design_data.get("methodology"):
        exp_design_data["methodology"] = "Standard protocol"

    exp_design = ExperimentalDesign(**exp_design_data) if exp_design_data else None
    
    exp_subplan = SubPlan(
        type="experimental",
        title="Experimental Sub-Plan",
        summary="Physical wet-lab or validation tasks.",
        phases=exp_phases,
        experimental_design=exp_design
    )

    valid_categories = {"reagent", "equipment", "consumable", "software"}
    for r in resources_data:
        if r.get("category") not in valid_categories:
            r["category"] = "reagent"

    resources = [ResourceItem(**r) for r in resources_data]

    return MasterPlan(
        title="VRI Master Execution Plan",
        objective="Execute the proposed research plan in phases.",
        computational_plan=comp_subplan,
        experimental_plan=exp_subplan,
        resources=resources
    )
