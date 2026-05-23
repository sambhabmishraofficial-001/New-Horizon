"use client";

import { ArrowUpRight, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWorkspaceBundle, useIreNavigation } from "../workspace-context";
import { buildProvenanceTrace } from "../ire-navigation";

export function ProvenancePanel() {
  const bundle = useWorkspaceBundle();
  const { openDoc, activePath } = useIreNavigation();
  const steps = buildProvenanceTrace(bundle);

  return (
    <div className="h-full flex flex-col bg-[var(--ire-surface)]">
      <div className="h-10 px-3 flex items-center border-b border-[var(--ire-border)] ire-label normal-case tracking-[0.12em] text-[11px]">
        Provenance trace
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="font-marketing text-[12px] font-light leading-relaxed text-ink-600">
          Verified chain from hypotheses through runs to datasets. Pin hashes
          and environment fingerprints before manuscript export.
        </p>

        <ol className="mt-4 space-y-0 relative">
          {steps.map((step, index) => (
            <li key={step.id} className="relative pl-6 pb-4">
              {index < steps.length - 1 ? (
                <span
                  className="absolute left-[7px] top-3 bottom-0 w-px bg-ink-900/15"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white",
                  step.kind === "hypothesis"
                    ? "border-beacon-500"
                    : step.kind === "experiment"
                    ? "border-emerald-500"
                    : "border-ink-400"
                )}
                aria-hidden
              />
              {step.path && step.fileKind ? (
                <button
                  type="button"
                  onClick={() => openDoc(step.path!, step.label, step.fileKind!)}
                  className={cn(
                    "w-full text-left rounded-md border px-2.5 py-2 hover:border-ink-900/20",
                    activePath === step.path
                      ? "border-beacon-500/35 bg-white"
                      : "border-ink-900/10 bg-white/80"
                  )}
                >
                  <StepContent step={step} linked />
                </button>
              ) : (
                <div className="rounded-md border border-ink-900/10 bg-white/80 px-2.5 py-2">
                  <StepContent step={step} />
                </div>
              )}
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="mt-2 h-8 w-full rounded-lg border border-ink-900/10 bg-white font-mono text-[11px] text-ink-700 hover:border-ink-900/20 inline-flex items-center justify-center gap-1.5"
        >
          <Link2 className="h-3 w-3" />
          Export .irerpkg
        </button>
      </div>
    </div>
  );
}

function StepContent({
  step,
  linked,
}: {
  step: { label: string; detail: string; kind: string };
  linked?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-ink-900">{step.label}</span>
        {linked ? (
          <ArrowUpRight className="h-3 w-3 text-ink-400" aria-hidden />
        ) : null}
      </div>
      <p className="mt-0.5 font-marketing text-[10.5px] leading-snug text-ink-600">
        {step.detail}
      </p>
    </>
  );
}
