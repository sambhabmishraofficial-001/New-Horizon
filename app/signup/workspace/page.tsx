"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  WizardShell,
  FieldGroup,
  FieldInput,
  FieldTextArea,
} from "@/components/signup/WizardShell";
import { Segment } from "@/components/settings/SettingsKit";
import { useSignupDraft } from "@/lib/store/signup";
import { findDomain } from "@/data/catalogue/domains";
import { getCurrentUser } from "@/lib/store/auth";
import { cn } from "@/lib/cn";

type Template = {
  id: string;
  label: string;
  blurb: string;
  fits: string[];
};

const TEMPLATES: Template[] = [
  {
    id: "blank",
    label: "Blank workspace",
    blurb: "An empty institute. You build the project structure as you go.",
    fits: ["*"],
  },
  {
    id: "lab-study",
    label: "Lab / experimental study",
    blurb: "Hypothesis · protocol · runs · analysis · figures · manuscript.",
    fits: ["life", "physical", "engineering"],
  },
  {
    id: "computational-study",
    label: "Computational study",
    blurb: "Question · model · simulation runs · dataset · analysis · paper.",
    fits: ["life", "physical", "math-cs", "engineering"],
  },
  {
    id: "empirical-ml",
    label: "Empirical ML study",
    blurb: "Question · datasets · baselines · training · ablations · results.",
    fits: ["math-cs"],
  },
  {
    id: "data-analysis",
    label: "Observational data analysis",
    blurb: "Question · sources · pipeline · models · figures · write-up.",
    fits: ["physical", "social", "math-cs"],
  },
  {
    id: "clinical-study",
    label: "Clinical / cohort study",
    blurb: "Protocol · enrolment · CRFs · stats plan · analysis · report.",
    fits: ["life", "social"],
  },
  {
    id: "field-study",
    label: "Field / observational study",
    blurb: "Site · sampling · measurements · analysis · synthesis.",
    fits: ["life", "physical", "social", "engineering"],
  },
  {
    id: "user-study",
    label: "Human-subjects study",
    blurb: "Hypothesis · protocol · IRB · participants · measures · analysis.",
    fits: ["social", "math-cs"],
  },
  {
    id: "proof-study",
    label: "Theorem / proof",
    blurb: "Statement · prior results · lemmas · proof · formalisation.",
    fits: ["math-cs"],
  },
  {
    id: "review-synthesis",
    label: "Review / meta-analysis",
    blurb: "Question · search · screening · extraction · synthesis · report.",
    fits: ["*"],
  },
];

const FOCUS_BY_GROUP: Record<string, string> = {
  life: "e.g. mechanisms of acquired drug resistance in a tumour model",
  physical: "e.g. anomalous transport in a layered van der Waals material",
  "math-cs": "e.g. tighter generalisation bounds for sparse mixture models",
  engineering: "e.g. closed-loop control of a soft robotic gripper under uncertainty",
  social: "e.g. effect of remote work on early-career publication rates",
  humanities: "e.g. how peer review changed in physics between 1950 and 1980",
  other: "e.g. a question you cannot answer yet but want to",
};

export default function SignupWorkspaceStep() {
  const router = useRouter();
  const { draft, update } = useSignupDraft();
  const w = draft.workspace;
  const setField = (patch: Partial<typeof w>) => update({ workspace: { ...w, ...patch } });

  React.useEffect(() => {
    if (!getCurrentUser()) router.replace("/signup/account");
  }, [router]);

  const dom = findDomain(draft.domain.primaryDomain);
  const groupId = dom?.group ?? "other";
  const focusPlaceholder = FOCUS_BY_GROUP[groupId] ?? FOCUS_BY_GROUP.other;

  const eligible = TEMPLATES.filter(
    (t) => t.fits.includes("*") || t.fits.includes(groupId)
  );

  function persistAndAdvance() {
    router.push("/signup/preferences");
  }

  return (
    <WizardShell
      step="workspace"
      title="Spin up your first project."
      description="A project is the unit of work in the institute. You can rename it, branch it, archive it, or replicate it later."
      onBack={() => router.push("/signup/domain")}
      onNext={persistAndAdvance}
      onSkip={() => router.push("/signup/preferences")}
      nextDisabled={!w.projectName.trim()}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldGroup label="Project name" required>
          <FieldInput
            value={w.projectName}
            onChange={(v) => setField({ projectName: v })}
            placeholder="A working title is fine"
          />
        </FieldGroup>
        <FieldGroup label="Compute">
          <Segment
            value={w.compute}
            onChange={(v) => setField({ compute: v })}
            options={[
              { value: "byo", label: "BYO cluster" },
              { value: "cloud", label: "Cloud" },
              { value: "local", label: "Local only" },
            ]}
          />
        </FieldGroup>
        <div className="sm:col-span-2">
          <FieldGroup
            label="One-line research focus"
            hint="What you want the institute to help you make progress on"
          >
            <FieldTextArea
              value={w.focus}
              onChange={(v) => setField({ focus: v })}
              placeholder={focusPlaceholder}
              rows={2}
            />
          </FieldGroup>
        </div>
      </div>

      <div className="mt-8">
        <FieldGroup label="Starter template" hint={`${eligible.length} fit your discipline`}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {eligible.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                selected={w.templateId === t.id}
                onSelect={() => setField({ templateId: t.id })}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      <div className="mt-7">
        <FieldGroup
          label="Invite collaborators"
          hint="Optional — comma-separated emails, can be added later"
        >
          <FieldInput
            value={w.invites}
            onChange={(v) => setField({ invites: v })}
            placeholder="alice@lab.edu, bob@lab.edu"
          />
        </FieldGroup>
      </div>
    </WizardShell>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-1 rounded-md border px-3 py-2.5 text-left transition-colors",
        selected
          ? "border-ink-900 bg-ink-900/[0.03]"
          : "border-ink-900/10 bg-white hover:border-ink-900/25"
      )}
    >
      <span className="text-[13px] font-medium text-ink-900">{template.label}</span>
      <span className="text-[12px] leading-snug text-ink-500">{template.blurb}</span>
    </button>
  );
}
