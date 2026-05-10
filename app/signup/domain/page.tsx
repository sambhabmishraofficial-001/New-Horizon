"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  WizardShell,
  FieldGroup,
  FieldInput,
  ChipToggle,
} from "@/components/signup/WizardShell";
import { useSignupDraft } from "@/lib/store/signup";
import {
  DOMAIN_GROUPS,
  DOMAINS_BY_GROUP,
  METHODS,
  type DomainGroup,
  findDomain,
} from "@/data/catalogue/domains";
import { updateProfile, getCurrentUser } from "@/lib/store/auth";
import { cn } from "@/lib/cn";

export default function SignupDomainStep() {
  const router = useRouter();
  const { draft, update } = useSignupDraft();
  const d = draft.domain;

  React.useEffect(() => {
    if (!getCurrentUser()) router.replace("/signup/account");
  }, [router]);

  const setField = (patch: Partial<typeof d>) => update({ domain: { ...d, ...patch } });

  const [activeGroup, setActiveGroup] = React.useState<DomainGroup>(
    (d.primaryDomainGroup as DomainGroup) || "life"
  );

  function pickPrimary(id: string) {
    const dom = findDomain(id);
    setField({
      primaryDomain: id,
      primaryDomainGroup: dom?.group ?? "other",
      secondaryDomains: d.secondaryDomains.filter((s) => s !== id),
    });
  }

  function toggleSecondary(id: string) {
    if (id === d.primaryDomain) return;
    const has = d.secondaryDomains.includes(id);
    if (has) setField({ secondaryDomains: d.secondaryDomains.filter((s) => s !== id) });
    else if (d.secondaryDomains.length < 3)
      setField({ secondaryDomains: [...d.secondaryDomains, id] });
  }

  function toggleMethod(id: string) {
    const has = d.methods.includes(id);
    if (has) setField({ methods: d.methods.filter((m) => m !== id) });
    else setField({ methods: [...d.methods, id] });
  }

  function persistAndAdvance() {
    const dom = findDomain(d.primaryDomain);
    updateProfile({
      primaryDomain: d.primaryDomain || undefined,
      primaryDomainGroup: dom?.group,
      secondaryDomains: d.secondaryDomains.length ? d.secondaryDomains : undefined,
      subfield: d.subfield || undefined,
      methods: d.methods.length ? d.methods : undefined,
    });
    router.push("/signup/workspace");
  }

  return (
    <WizardShell
      step="domain"
      title="Your discipline."
      description="Pick a primary field and up to three secondary. Drives default agents, templates, and seeded artifacts. Pure interdisciplinary work — pick the closest, refine with the secondary picks."
      onBack={() => router.push("/signup/you")}
      onNext={persistAndAdvance}
      onSkip={() => router.push("/signup/workspace")}
      nextDisabled={!d.primaryDomain}
    >
      <FieldGroup label="Primary field" required>
        <div className="rounded-xl border border-ink-900/10 bg-white">
          <div className="flex flex-wrap items-center gap-1 border-b border-ink-900/8 px-2 py-1.5">
            {DOMAIN_GROUPS.filter((g) => g.id !== "other" && g.id !== "humanities").map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroup(g.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                  activeGroup === g.id
                    ? "bg-ink-900 text-parchment-50"
                    : "text-ink-600 hover:bg-ink-50"
                )}
              >
                {g.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveGroup("humanities")}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                activeGroup === "humanities"
                  ? "bg-ink-900 text-parchment-50"
                  : "text-ink-600 hover:bg-ink-50"
              )}
            >
              History & philosophy
            </button>
            <button
              type="button"
              onClick={() => setActiveGroup("other")}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                activeGroup === "other"
                  ? "bg-ink-900 text-parchment-50"
                  : "text-ink-600 hover:bg-ink-50"
              )}
            >
              Other
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5 p-3 sm:grid-cols-2">
            {DOMAINS_BY_GROUP[activeGroup].map((dom) => (
              <DomainOption
                key={dom.id}
                label={dom.label}
                selected={d.primaryDomain === dom.id}
                onClick={() => pickPrimary(dom.id)}
              />
            ))}
          </div>
        </div>
      </FieldGroup>

      <div className="mt-7">
        <FieldGroup
          label="Secondary fields"
          hint={`${d.secondaryDomains.length}/3 selected`}
        >
          <div className="flex flex-wrap gap-1.5">
            {DOMAIN_GROUPS.flatMap((g) => DOMAINS_BY_GROUP[g.id]).map((dom) => {
              const isPrimary = d.primaryDomain === dom.id;
              const isSecondary = d.secondaryDomains.includes(dom.id);
              const disabled =
                isPrimary || (!isSecondary && d.secondaryDomains.length >= 3);
              return (
                <button
                  key={dom.id}
                  type="button"
                  disabled={disabled && !isSecondary}
                  onClick={() => toggleSecondary(dom.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                    isPrimary
                      ? "border-ink-900/15 bg-ink-50 text-ink-400 cursor-not-allowed"
                      : isSecondary
                      ? "border-ink-900 bg-ink-900 text-parchment-50"
                      : disabled
                      ? "border-ink-900/10 text-ink-400 cursor-not-allowed"
                      : "border-ink-900/12 bg-white text-ink-700 hover:border-ink-900/30"
                  )}
                >
                  {dom.label}
                </button>
              );
            })}
          </div>
        </FieldGroup>
      </div>

      <div className="mt-7">
        <FieldGroup label="Subfield" hint="Free text — anything more specific">
          <FieldInput
            value={d.subfield}
            onChange={(v) => setField({ subfield: v })}
            placeholder="e.g. cosmic-ray propagation, transformer interpretability, panel data identification"
          />
        </FieldGroup>
      </div>

      <div className="mt-7">
        <FieldGroup label="Methods" hint="Select any that apply">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {METHODS.map((m) => (
              <ChipToggle
                key={m.id}
                label={m.label}
                description={m.description}
                checked={d.methods.includes(m.id)}
                onChange={() => toggleMethod(m.id)}
              />
            ))}
          </div>
        </FieldGroup>
      </div>
    </WizardShell>
  );
}

function DomainOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-[12.5px] font-medium transition-colors",
        selected
          ? "border-ink-900 bg-ink-900/[0.03] text-ink-900"
          : "border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/25"
      )}
    >
      <span>{label}</span>
      {selected && (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
          primary
        </span>
      )}
    </button>
  );
}
