"use client";

import { Archive, KeyRound, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { AnimatedPrincipleCard } from "@/components/ui/animated-principle-card";

const PRINCIPLES = [
  {
    id: "persistent",
    lead: "Persistent.",
    body:
      "Your institute remembers every paper, dataset, hypothesis, run, and result - across years, not sessions. Branches, replicates, attestations are first-class.",
    icon: Archive,
    variant: "persistent" as const,
    tags: ["Memory", "Branches", "Attestations"],
  },
  {
    id: "accountable",
    lead: "Accountable.",
    body:
      "Every claim traces to its source. Every result traces to the run that produced it. Every invariant violation gets a name, a candidate, and a rebuttal experiment.",
    icon: ShieldCheck,
    variant: "accountable" as const,
    tags: ["Provenance", "Invariants", "Audit trail"],
  },
  {
    id: "yours",
    lead: "Yours.",
    body:
      "Your data, your IP, your compute. Bring your cluster. Bring your wet-lab. The institute is hosted; the science stays yours.",
    icon: KeyRound,
    variant: "yours" as const,
    tags: ["Your data", "Your IP", "Your compute"],
  },
];

export function PrinciplesInteractiveCards({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 [perspective:1200px] sm:grid-cols-3 sm:gap-6",
        className
      )}
      aria-label="Institute principles"
    >
      {PRINCIPLES.map((principle) => (
        <AnimatedPrincipleCard
          key={principle.id}
          icon={principle.icon}
          lead={principle.lead}
          body={principle.body}
          tags={principle.tags}
          variant={principle.variant}
          className="min-h-[280px] sm:min-h-[320px]"
        />
      ))}
    </div>
  );
}
