from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class LabPrompt:
    id: str
    name: str
    domain: str
    system_prompt: str
    default_objective: str
    default_context: str


LAB_PROMPTS: tuple[LabPrompt, ...] = (
    LabPrompt(
        id="ribozyme-wet",
        name="Ribozyme Catalysis Lab",
        domain="RNA biochemistry",
        system_prompt=(
            "You are operating inside the Ribozyme Catalysis Lab. Prioritize Mg2+ "
            "titration logic, cleavage kinetics, mutant-library controls, replicate "
            "structure, and instrument trace provenance."
        ),
        default_objective="Identify falsifiable causes for altered ribozyme cleavage kinetics.",
        default_context=(
            "Available evidence may include Mg2+ sweep traces, qPCR outputs, plate-reader "
            "kinetics, mutant libraries, buffer metadata, and protocol versions."
        ),
    ),
    LabPrompt(
        id="folding-insilico",
        name="Protein Folding In-silico",
        domain="Structural biology",
        system_prompt=(
            "You are operating inside the Protein Folding In-silico lab. Prioritize "
            "structure-quality metrics, energy monotonicity, deterministic rollout design, "
            "simulation reproducibility, sequence provenance, and audit gates."
        ),
        default_objective="Design a falsifiable investigation for a protein folding failure mode.",
        default_context=(
            "Available evidence may include candidate structures, rollout logs, energy traces, "
            "policy versions, and structural validation metrics."
        ),
    ),
    LabPrompt(
        id="neuro-symbolic",
        name="Neurosymbolic Discovery",
        domain="Cross-domain reasoning",
        system_prompt=(
            "You are operating inside the Neurosymbolic Discovery lab. Convert claims into "
            "typed hypothesis-graph nodes, identify symbolic falsifiers, separate generated "
            "ideas from sourced evidence, and preserve uncertainty at every edge."
        ),
        default_objective="Build a falsifiable hypothesis graph for a cross-domain research question.",
        default_context=(
            "Available evidence may include literature snippets, claim graphs, simulation outputs, "
            "symbolic constraints, and contradiction maps."
        ),
    ),
    LabPrompt(
        id="dose-response",
        name="Dose-Response & Screening",
        domain="Pharmacology",
        system_prompt=(
            "You are operating inside the Dose-Response & Screening lab. Prioritize assay "
            "quality, curve-fitting assumptions, concentration ranges, replicate strategy, "
            "batch effects, off-target explanations, and audit-ready pharmacology claims."
        ),
        default_objective="Find plausible causes for a shifted dose-response curve.",
        default_context=(
            "Available evidence may include titration curves, cell-line metadata, compound lots, "
            "screening controls, viability assays, and plate layouts."
        ),
    ),
    LabPrompt(
        id="imaging-core",
        name="Live-Cell Imaging Core",
        domain="Cell biology",
        system_prompt=(
            "You are operating inside the Live-Cell Imaging Core. Prioritize segmentation "
            "quality, microscopy calibration, acquisition metadata, phototoxicity, time-lapse "
            "artifacts, and phenotype definitions that can be independently audited."
        ),
        default_objective="Investigate a live-cell imaging phenotype with falsifiable controls.",
        default_context=(
            "Available evidence may include image stacks, segmentation masks, acquisition settings, "
            "calibration records, cell-state labels, and time-course annotations."
        ),
    ),
    LabPrompt(
        id="xfer-bridge",
        name="Cross-Program Transfer Bridge",
        domain="Methods transfer",
        system_prompt=(
            "You are operating inside the Cross-Program Transfer Bridge. Prioritize whether "
            "methods, invariants, policies, and protocols survive transfer across programs. "
            "Look for hidden assumptions, domain shift, reproducibility gaps, and evidence needed before reuse."
        ),
        default_objective="Audit whether a method can transfer safely between research programs.",
        default_context=(
            "Available evidence may include source-program assumptions, target-program constraints, "
            "protocol diffs, invariant checks, and failed transfer examples."
        ),
    ),
)


def list_lab_prompts() -> list[dict[str, str]]:
    return [asdict(prompt) for prompt in LAB_PROMPTS]


def resolve_lab_prompt(domain: str | None) -> LabPrompt | None:
    if not domain:
        return None
    normalized = domain.strip().lower()
    for prompt in LAB_PROMPTS:
        if normalized in {prompt.id.lower(), prompt.name.lower(), prompt.domain.lower()}:
            return prompt
    return None
