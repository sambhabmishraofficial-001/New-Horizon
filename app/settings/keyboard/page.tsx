"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Segment,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";
import { Kbd } from "@/components/ui/Primitives";

const PREVIEW: { combo: string[]; label: string }[] = [
  { combo: ["⌘", "K"], label: "Open command palette" },
  { combo: ["⌘", "P"], label: "Jump to anything" },
  { combo: ["⌘", "/"], label: "Show keyboard shortcuts" },
  { combo: ["⌘", "B"], label: "Toggle side panel" },
  { combo: ["⌘", "J"], label: "Toggle bottom panel" },
  { combo: ["⌘", "I"], label: "Focus the agent composer" },
  { combo: ["⌘", "↩"], label: "Send to agent" },
  { combo: ["⌘", "S"], label: "Save the active document" },
];

export default function KeyboardSettings() {
  const { prefs, setPrefs } = useUserPrefs();

  return (
    <div>
      <SettingsHeader
        title="Keyboard"
        description="Pick a layout, customize bindings, see every shortcut at a glance."
      />

      <SettingsSection title="Layout">
        <Row label="Chord layout" description="Default uses Mac/Cmd-style chords. Vim-style adds modal nav (g g, g w).">
          <Segment
            value={prefs.keyboard.layout}
            onChange={(v) => setPrefs({ keyboard: { ...prefs.keyboard, layout: v } })}
            options={[
              { value: "default", label: "Default" },
              { value: "vim", label: "Vim-style" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Reference">
        <div className="rounded-xl border border-ink-900/10 bg-white p-1">
          {PREVIEW.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-ink-900/6 last:border-b-0"
            >
              <div className="text-[13px] text-ink-700">{s.label}</div>
              <div className="flex items-center gap-1">
                {s.combo.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[12.5px] text-ink-500">
          A full searchable reference (and per-binding overrides) ships in the next phase.
        </div>
      </SettingsSection>
    </div>
  );
}
