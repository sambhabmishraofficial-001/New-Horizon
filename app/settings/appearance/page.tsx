"use client";

import * as React from "react";
import {
  SettingsHeader,
  SettingsSection,
  Row,
  Segment,
  Toggle,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";

export default function AppearanceSettings() {
  const { prefs, setPrefs } = useUserPrefs();

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = prefs.appearance.theme;
    }
  }, [prefs.appearance.theme]);

  return (
    <div>
      <SettingsHeader
        title="Appearance"
        description="How the institute looks. The IRE workspace adapts to your choice."
      />

      <SettingsSection title="Theme">
        <Row label="Color theme" description="Sepia softens the parchment a touch; dark uses obsidian.">
          <Segment
            value={prefs.appearance.theme}
            onChange={(v) => setPrefs({ appearance: { ...prefs.appearance, theme: v } })}
            options={[
              { value: "light", label: "Light" },
              { value: "sepia", label: "Sepia" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Type & density">
        <Row label="Font size">
          <Segment
            value={prefs.appearance.fontSize}
            onChange={(v) => setPrefs({ appearance: { ...prefs.appearance, fontSize: v } })}
            options={[
              { value: "sm", label: "Small" },
              { value: "md", label: "Default" },
              { value: "lg", label: "Large" },
            ]}
          />
        </Row>
        <Row label="Density">
          <Segment
            value={prefs.appearance.density}
            onChange={(v) => setPrefs({ appearance: { ...prefs.appearance, density: v } })}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Motion">
        <Row label="Reduce motion" description="Suppress incidental animation. Honors prefers-reduced-motion regardless.">
          <Toggle
            checked={prefs.appearance.reduceMotion}
            onChange={(v) => setPrefs({ appearance: { ...prefs.appearance, reduceMotion: v } })}
          />
        </Row>
      </SettingsSection>
    </div>
  );
}
