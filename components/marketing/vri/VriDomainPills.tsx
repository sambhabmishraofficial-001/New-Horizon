"use client";

import { cn } from "@/lib/cn";

const DOMAIN_PILLS = [
  { label: "Biotech & drug discovery" },
  { label: "Neuroscience" },
  { label: "Chemistry" },
  { label: "Materials science" },
  { label: "Genomics" },
  { label: "See more", muted: true },
] as const;

export function VriDomainPills({ className }: { className?: string }) {
  return (
    <div
      className={cn("vri-domain-pills", className)}
      aria-label="Research domains"
      role="group"
    >
      <ul className="vri-domain-pills__list">
        {DOMAIN_PILLS.map((pill) => (
          <li key={pill.label} className="vri-domain-pills__item">
            <span
              className={cn(
                "vri-domain-pills__pill",
                "muted" in pill && pill.muted && "vri-domain-pills__pill--muted",
              )}
            >
              {pill.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
