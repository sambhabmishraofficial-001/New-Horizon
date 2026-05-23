"use client";

import * as React from "react";

const machineReadableSite = `# New Horizon

> This is the agent-friendly navigation document (llms.txt) for all public New Horizon content. New Horizon is the first AI-native Virtual Research Institute - building infrastructure for Human-AI Co-Science with persistent AI scientists, specialized research agents, virtual labs, reproducible runs, invariant audits, and manuscript-ready scientific memory.

New Horizon is an Applied AI Research Lab building the conditions under which human scientists - curious, creative, intuitive, irreplaceable - can work at a scale and speed previously impossible.

## Main Website

- [Home](https://newhorizon.dev/): New Horizon - the first AI-native Virtual Research Institute. An Applied AI Research lab building the infrastructure for Human-AI Co-Science.
- [Products](https://newhorizon.dev/products): The AI Native Virtual Research Institute. Twins read literature, propose experiments, run them on your compute, audit invariants, and draft manuscripts - at your pace, on your science.
- [Playground](https://newhorizon.dev/playground): Free demo - try co-science, literature synthesis, invariant audits, and experiment design without an account.
- [Pricing](https://newhorizon.dev/pricing): Pricing for cohorts and institutional access. Cohort 01 is opening for founding researchers.
- [Request Access](https://newhorizon.dev/enrol): Apply for early access to the Virtual Research Institute. Contact the team at contact@newhorizon.dev.
- [Live Institute](https://newhorizon.dev/ire): Live IRE workspace - see an institute mid-investigation, populated with a real ribozyme catalysis program (K11). Gated demo.

## Mission

The research community already possesses near-AGI-level collective intelligence, but often underestimates what it can achieve. Our aim is to provide the entire community with superintelligent systems to unleash their full potential, enabling Human-AI Co-Science at a scale, speed, and scope previously impossible.

We are building the Novum Organum for the 21st century - a new instrument for the systematization of discovery that bridges the gap between human thought bandwidth and the infinite abundance of scientific data.

## Philosophy

### Systematizing Serendipity

For centuries, the frontier of human knowledge has been pushed forward by beautiful accidents: a contaminated petri dish, a fortunate walk in the woods, or a coincidental collision of minds at an academic conference. As the complexity of our global challenges compounds, we can no longer afford to leave innovation to the mercy of chance.

Our mission is to engineer the end of accidental discovery. We are replacing serendipity with steerable reasoning - building the computational scaffolding necessary to map the unseen connections between disciplines.

### Relationship Between Human and Machine Intelligence

Philosopher Michael Polanyi spent his career describing what he called tacit knowledge - the things a scientist knows that they cannot fully articulate. That knowledge is not in any dataset. It lives in the person. Our systems are built to protect the time and space for it to operate.

The distinction we hold as foundational: amplification, not replacement. The telescope did not replace the astronomer's eye. It gave the eye something worthy of its attention.

Science has always been a collective endeavour. Newton stood on the shoulders of giants. We are building the platform that lets every scientist stand a little higher.

## Product Architecture

\`Virtual Institute → Several Virtual Labs → AI Scientist + Specialized Agents (per lab)\`

### Twins
Six of fourteen Twins on duty. Each with a role: literature synthesist, invariant auditor, experiment designer, generative modeler, anomaly triage. Named, persistent, accountable.

### Invariants
412 of 418 invariants holding. Every claim your institute makes is checked against the formal properties of your domain - energy monotonicity, kinetic saturation, calibration bounds. Wrong answers don't ship.

### Critical Path
Hypothesis → Invariant → Environment → Evidence. Every program has one path that matters. Your institute keeps it visible, executable, and four moves from a testable claim.

## First Principles

- **Persistent.** Your institute remembers every paper, dataset, hypothesis, run, and result - across years, not sessions. Branches, replicates, attestations are first-class.
- **Accountable.** Every claim traces to its source. Every result traces to the run that produced it. Every invariant violation gets a name, a candidate, and a rebuttal experiment.
- **Yours.** Your data, your IP, your compute. Bring your cluster. Bring your wet-lab. The institute is hosted; the science stays yours.

## Team

- Sambhab Mishra - Co-founder
- Anonymous - Co-founder
- Anonymous - Co-founder

## Trusted By Researchers From

- University of Sheffield
- University College London
- Johns Hopkins University
- National Institute of Science Education and Research

## Contact

- Email: contact@newhorizon.dev
- Request Access: https://newhorizon.dev/enrol

## Meta

This document follows the [llms.txt](https://llmstxt.org/) specification - a markdown standard for making websites legible to large language models and AI agents.

- Human mode: the visual website at https://newhorizon.dev/
- Machine mode: this structured, copyable, agent-readable index
- Toggle with the Human/Machine switch, press \`/\` for Machine, \`Esc\` for Human`;

export function HumanMachineToggle() {
  const [mode, setMode] = React.useState<"human" | "machine">("human");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      if (event.key === "/") {
        event.preventDefault();
        setMode("machine");
      }

      if (event.key === "Escape") {
        setMode("human");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.siteMode = mode;
    return () => {
      delete document.documentElement.dataset.siteMode;
    };
  }, [mode]);

  async function copyMachineReadableSite() {
    try {
      await navigator.clipboard.writeText(machineReadableSite);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (_) {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="human-machine-toggle" aria-label="Human and machine website mode selector">
        <div className="human-machine-toggle__switch" role="tablist" aria-label="Select website mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "human"}
            className="human-machine-toggle__button"
            onClick={() => setMode("human")}
          >
            Human
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "machine"}
            className="human-machine-toggle__button"
            onClick={() => setMode("machine")}
          >
            Machine
          </button>
          <span className={`human-machine-toggle__thumb human-machine-toggle__thumb--${mode}`} aria-hidden />
        </div>

        <div className="human-machine-toggle__hint">
          Press / for MACHINE. Esc returns to HUMAN.
        </div>
      </div>

      {mode === "machine" && (
        <div className="machine-readable-site" role="dialog" aria-modal="true" aria-label="Machine readable website">
          <div className="machine-readable-site__bar machine-readable-site__bar--minimal">
            <div className="machine-readable-site__actions">
              <button type="button" onClick={copyMachineReadableSite}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={() => setMode("human")}>
                Human
              </button>
            </div>
          </div>

          <pre className="machine-readable-site__content">
            <code>{machineReadableSite}</code>
          </pre>
        </div>
      )}
    </>
  );
}
