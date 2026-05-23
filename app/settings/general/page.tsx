"use client";

import * as React from "react";
import {
  SettingsHeader,
  SettingsSection,
  Row,
  TextInput,
  Select,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";
import { useSession, updateProfile } from "@/lib/store/auth";

export default function GeneralSettings() {
  const { user } = useSession();
  const { prefs, setPrefs } = useUserPrefs();

  if (!user) return null;

  return (
    <div>
      <SettingsHeader
        title="General"
        description="Basic personal information used across the institute."
      />

      <SettingsSection title="Profile">
        <Row label="Display name" description="How your name is shown across the institute.">
          <TextInput
            value={prefs.general.displayName || user.preferredName || ""}
            onChange={(v) => {
              setPrefs({ general: { ...prefs.general, displayName: v } });
              updateProfile({ preferredName: v });
            }}
          />
        </Row>
        <Row label="Email" description="Your sign-in identity. Cannot be changed in the demo.">
          <TextInput value={user.email} onChange={() => {}} />
        </Row>
      </SettingsSection>

      <SettingsSection title="Locale">
        <Row label="Language">
          <Select
            value={prefs.general.language}
            onChange={(v) => setPrefs({ general: { ...prefs.general, language: v } })}
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "Français" },
              { value: "de", label: "Deutsch" },
              { value: "es", label: "Español" },
              { value: "zh", label: "中文" },
              { value: "ja", label: "日本語" },
            ]}
          />
        </Row>
        <Row label="Timezone">
          <TextInput
            value={prefs.general.timezone}
            onChange={(v) => setPrefs({ general: { ...prefs.general, timezone: v } })}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Defaults">
        <Row label="Default landing" description="Where to send you after sign-in.">
          <Select
            value={prefs.general.defaultLanding}
            onChange={(v) =>
              setPrefs({
                general: { ...prefs.general, defaultLanding: v as any },
              })
            }
            options={[
              { value: "/lattice", label: "Lattice (overview)" },
              { value: "/ire", label: "IRE workspace" },
              { value: "/library", label: "Library" },
            ]}
          />
        </Row>
      </SettingsSection>
    </div>
  );
}
