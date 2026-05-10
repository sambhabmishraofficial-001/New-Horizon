"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Select,
  Toggle,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";

export default function NotificationSettings() {
  const { prefs, setPrefs } = useUserPrefs();
  const n = prefs.notifications;
  const set = (patch: Partial<typeof n>) =>
    setPrefs({ notifications: { ...n, ...patch } });

  return (
    <div>
      <SettingsHeader
        title="Notifications"
        description="Choose what reaches your inbox and what stays inside the institute."
      />

      <SettingsSection title="Email">
        <Row label="Cadence">
          <Select
            value={n.emailCadence}
            onChange={(v) => set({ emailCadence: v })}
            options={[
              { value: "instant", label: "Instant" },
              { value: "digest", label: "Daily digest" },
              { value: "weekly", label: "Weekly digest" },
              { value: "never", label: "Never" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="In-app">
        <Row label="Show in-app notifications">
          <Toggle checked={n.inApp} onChange={(v) => set({ inApp: v })} />
        </Row>
        <Row label="Mentions" description="When a teammate or agent @-mentions you.">
          <Toggle checked={n.mentions} onChange={(v) => set({ mentions: v })} />
        </Row>
        <Row label="Run completion" description="When a long experiment or training run finishes.">
          <Toggle checked={n.runCompletion} onChange={(v) => set({ runCompletion: v })} />
        </Row>
        <Row label="Anomalies" description="When an invariant breaks or an audit flags a result.">
          <Toggle checked={n.anomalies} onChange={(v) => set({ anomalies: v })} />
        </Row>
      </SettingsSection>
    </div>
  );
}
