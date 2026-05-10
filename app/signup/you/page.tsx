"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  WizardShell,
  FieldGroup,
  FieldInput,
  FieldTextArea,
} from "@/components/signup/WizardShell";
import { Select } from "@/components/settings/SettingsKit";
import { useSignupDraft } from "@/lib/store/signup";
import { CAREER_STAGES } from "@/data/catalogue/domains";
import { updateProfile, getCurrentUser } from "@/lib/store/auth";

const ROLES = [
  { value: "", label: "Select a role" },
  { value: "pi", label: "Principal investigator" },
  { value: "researcher", label: "Researcher" },
  { value: "postdoc", label: "Postdoc" },
  { value: "phd", label: "PhD candidate" },
  { value: "masters", label: "Master's student" },
  { value: "undergrad", label: "Undergraduate" },
  { value: "industry", label: "Industry scientist" },
  { value: "engineer", label: "Engineer" },
  { value: "independent", label: "Independent researcher" },
  { value: "educator", label: "Educator" },
  { value: "journalist", label: "Science journalist" },
  { value: "other", label: "Other" },
];

export default function SignupYouStep() {
  const router = useRouter();
  const { draft, update } = useSignupDraft();
  const i = draft.identity;
  const setField = (patch: Partial<typeof i>) => update({ identity: { ...i, ...patch } });

  React.useEffect(() => {
    if (!getCurrentUser()) router.replace("/signup/account");
  }, [router]);

  function persistAndAdvance() {
    updateProfile({
      role: i.role || undefined,
      careerStage: i.careerStage || undefined,
      affiliation: i.institution || undefined,
      lab: i.lab || undefined,
      labUrl: i.labUrl || undefined,
      timezone: i.timezone || undefined,
      bio: i.bio || undefined,
      avatarDataUrl: i.avatarDataUrl,
    });
    router.push("/signup/domain");
  }

  function onAvatar(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField({ avatarDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  return (
    <WizardShell
      step="you"
      title="Tell us a little about you."
      description="Used to set defaults — the institute writes for your audience and shows the right tools first."
      onBack={() => router.push("/signup/account")}
      onNext={persistAndAdvance}
      onSkip={() => router.push("/signup/domain")}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldGroup label="Role">
          <Select
            value={i.role}
            onChange={(v) => setField({ role: v })}
            options={ROLES}
          />
        </FieldGroup>
        <FieldGroup label="Career stage">
          <Select
            value={i.careerStage}
            onChange={(v) => setField({ careerStage: v })}
            options={[{ value: "", label: "Select a stage" }, ...CAREER_STAGES.map((s) => ({ value: s.id, label: s.label }))]}
          />
        </FieldGroup>
        <FieldGroup label="Institution / company">
          <FieldInput
            value={i.institution}
            onChange={(v) => setField({ institution: v })}
            placeholder="University, lab, company, or independent"
          />
        </FieldGroup>
        <FieldGroup label="Group / lab">
          <FieldInput
            value={i.lab}
            onChange={(v) => setField({ lab: v })}
            placeholder="e.g. Mendel Group"
          />
        </FieldGroup>
        <FieldGroup label="Lab or homepage URL">
          <FieldInput
            value={i.labUrl}
            onChange={(v) => setField({ labUrl: v })}
            placeholder="https://"
          />
        </FieldGroup>
        <FieldGroup label="Timezone" hint="Detected from your browser">
          <FieldInput
            value={i.timezone}
            onChange={(v) => setField({ timezone: v })}
            placeholder="UTC"
          />
        </FieldGroup>
        <div className="sm:col-span-2">
          <FieldGroup
            label="Short bio"
            hint="One or two sentences — appears on your profile and helps agents calibrate"
          >
            <FieldTextArea
              value={i.bio}
              onChange={(v) => setField({ bio: v })}
              placeholder="What you study, how you study it, what you're trying to find."
              rows={3}
            />
          </FieldGroup>
        </div>
        <div className="sm:col-span-2">
          <FieldGroup label="Avatar" hint="Optional — falls back to initials">
            <div className="flex items-center gap-3">
              {i.avatarDataUrl ? (
                <img src={i.avatarDataUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-full bg-ink-900/8 text-[14px] font-semibold text-ink-700">
                  {(draft.account.preferredName || draft.account.fullName || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-ink-900/12 bg-white px-3 text-[13px] font-medium text-ink-800 transition-colors hover:bg-ink-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onAvatar(e.target.files?.[0])}
                />
                Upload image
              </label>
              {i.avatarDataUrl && (
                <button
                  type="button"
                  className="text-[12.5px] text-ink-500 hover:text-ink-900"
                  onClick={() => setField({ avatarDataUrl: undefined })}
                >
                  Remove
                </button>
              )}
            </div>
          </FieldGroup>
        </div>
      </div>
    </WizardShell>
  );
}
