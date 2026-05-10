"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { WizardShell, FieldGroup } from "@/components/signup/WizardShell";
import { Segment, Select } from "@/components/settings/SettingsKit";
import { useSignupDraft } from "@/lib/store/signup";
import { useUserPrefs } from "@/lib/store/preferences";
import { getCurrentUser } from "@/lib/store/auth";

export default function SignupPreferencesStep() {
  const router = useRouter();
  const { draft, update } = useSignupDraft();
  const { prefs, setPrefs, ready } = useUserPrefs();
  const p = draft.preferences;
  const setField = (patch: Partial<typeof p>) =>
    update({ preferences: { ...p, ...patch } });

  React.useEffect(() => {
    if (!getCurrentUser()) router.replace("/signup/account");
  }, [router]);

  function persistAndAdvance() {
    if (!ready) return;
    setPrefs({
      writing: { tone: p.writingTone, citationStyle: p.citationStyle },
      agents: {
        ...prefs.agents,
        defaultAutonomy: p.autonomy,
        defaultReasoning: p.reasoning,
      },
      notifications: { ...prefs.notifications, emailCadence: p.emailCadence },
    });
    router.push("/signup/done");
  }

  return (
    <WizardShell
      step="preferences"
      title="Set your defaults."
      description="These flow into every project's rules file. You can override per-project later."
      onBack={() => router.push("/signup/workspace")}
      onNext={persistAndAdvance}
      onSkip={() => router.push("/signup/done")}
    >
      <div className="space-y-7">
        <FieldGroup
          label="Writing tone"
          hint="How drafted text should read by default"
        >
          <Segment
            value={p.writingTone}
            onChange={(v) => setField({ writingTone: v })}
            options={[
              { value: "concise", label: "Concise" },
              { value: "academic", label: "Academic" },
              { value: "narrative", label: "Narrative" },
              { value: "journalistic", label: "Journalistic" },
            ]}
          />
        </FieldGroup>
        <FieldGroup label="Citation style">
          <Select
            value={p.citationStyle}
            onChange={(v) => setField({ citationStyle: v })}
            options={[
              { value: "APA", label: "APA" },
              { value: "MLA", label: "MLA" },
              { value: "Chicago", label: "Chicago" },
              { value: "IEEE", label: "IEEE" },
              { value: "Nature", label: "Nature" },
              { value: "Vancouver", label: "Vancouver" },
              { value: "BibTeX", label: "BibTeX" },
            ]}
          />
        </FieldGroup>
        <FieldGroup
          label="Default autonomy"
          hint="How much agents do without you"
        >
          <Segment
            value={p.autonomy}
            onChange={(v) => setField({ autonomy: v })}
            options={[
              { value: "suggest", label: "Suggest" },
              { value: "semi-auto", label: "Semi-auto" },
              { value: "full-auto", label: "Full-auto" },
            ]}
          />
        </FieldGroup>
        <FieldGroup
          label="Reasoning visibility"
          hint="How much chain-of-thought you see"
        >
          <Segment
            value={p.reasoning}
            onChange={(v) => setField({ reasoning: v })}
            options={[
              { value: "always", label: "Always show" },
              { value: "summary", label: "Summary" },
              { value: "hidden", label: "Hidden" },
            ]}
          />
        </FieldGroup>
        <FieldGroup label="Email cadence">
          <Segment
            value={p.emailCadence}
            onChange={(v) => setField({ emailCadence: v })}
            options={[
              { value: "instant", label: "Instant" },
              { value: "digest", label: "Daily digest" },
              { value: "weekly", label: "Weekly" },
              { value: "never", label: "Never" },
            ]}
          />
        </FieldGroup>
      </div>
    </WizardShell>
  );
}
