export type PlaygroundMode = "co-science" | "literature" | "invariants" | "experiments";

export const PLAYGROUND_MODES: {
  id: PlaygroundMode;
  label: string;
  placeholder: string;
}[] = [
  {
    id: "co-science",
    label: "Co-science",
    placeholder: "Ask a research question - twins will reason with you…",
  },
  {
    id: "literature",
    label: "Literature",
    placeholder: "Search papers, synthesize findings, or map a field…",
  },
  {
    id: "invariants",
    label: "Invariants",
    placeholder: "Describe a claim - we'll audit formal properties…",
  },
  {
    id: "experiments",
    label: "Experiments",
    placeholder: "Propose a protocol, environment, or next assay…",
  },
];

export function mockPlaygroundReply(
  mode: PlaygroundMode,
  prompt: string
): string {
  const q = prompt.trim().toLowerCase();

  if (mode === "literature") {
    if (q.includes("crispr") || q.includes("gene edit")) {
      return "Across 847 indexed papers (2019–2025), CRISPR base-editing in primary cells shows median editing efficiency of 62% (IQR 41–78%) with off-target rates below 0.3% when using high-fidelity variants. Three landmark trials (NCT04601016, NCT04819841, NCT05356195) report durable edits at 12 months. I can pull full provenance for any citation - this is a demo response.";
    }
    return "Literature twin would cross-reference PubMed, bioRxiv, and your institute corpus here. In the full product, every sentence links to source papers with citation cards. Try asking about a specific mechanism, disease, or method.";
  }

  if (mode === "invariants") {
    if (q.includes("energy") || q.includes("atp") || q.includes("thermo")) {
      return "Invariant audit (demo): checking energy monotonicity along the proposed reaction coordinate… **412/418 invariants holding.** One candidate violation flagged: assumed steady-state ATP flux exceeds measured Vmax for complex I under your stated conditions. Suggested rebuttal: repeat assay at 37°C with calibrated oxygen electrode.";
    }
    return "Invariant auditor would parse your claim into formal properties - conservation laws, kinetic bounds, calibration limits - and report pass/fail with named violations. Describe a hypothesis or mechanism to audit.";
  }

  if (mode === "experiments") {
    if (q.includes("ribozyme") || q.includes("rna")) {
      return "Experiment designer (demo): propose a 96-well fluorescence kinetics plate - 200 nM ribozyme, Mg²⁺ titration 0.5–20 mM, 25°C, triplicate. Estimated runtime: 4.2 h on your cluster queue `gpu-small`. Critical path: validate folding before catalysis readout.";
    }
    return "Experiment twin would draft protocols, estimate compute/wet-lab cost, and slot into your institute's critical path. Describe what you want to test or measure.";
  }

  // co-science default
  if (q.includes("hello") || q.includes("hi")) {
    return "Welcome to the New Horizon playground - free demo of institute models. Pick a mode above (Co-science, Literature, Invariants, Experiments) and ask anything. Full workspace persists programs, twins, and provenance across years.";
  }

  return "Co-science twin (demo): I would decompose your question into hypotheses, literature gaps, and the next falsifiable experiment - with full provenance in the live institute. Request access at /enrol for persistent programs, your compute, and manuscript-ready memory.";
}
