"use client";

import * as React from "react";
import {
  SettingsHeader,
  SettingsSection,
  Row,
  Segment,
} from "@/components/settings/SettingsKit";
import { MagicKeyboard } from "@/components/ui/magic-keyboard-component";
import { Kbd } from "@/components/ui/Primitives";
import { useUserPrefs } from "@/lib/store/preferences";
import { KEYBOARD_SHORTCUTS } from "@/lib/keyboard-shortcuts";
import {
  formatShortcutKey,
  useKeyboardShortcutDemo,
} from "@/lib/hooks/useKeyboardShortcutDemo";
import { cn } from "@/lib/cn";

export default function KeyboardSettings() {
  const { prefs, setPrefs } = useUserPrefs();
  const [paused, setPaused] = React.useState(false);
  const {
    activeIndex,
    setActiveIndex,
    activeShortcut,
    highlightedKeys,
    pressedKeys,
    phase,
    phaseLabel,
  } = useKeyboardShortcutDemo({ enabled: true, paused });

  return (
    <div>
      <SettingsHeader
        title="Keyboard"
        description="Pick a layout, customize bindings, see every shortcut at a glance."
      />

      <SettingsSection title="Layout">
        <Row
          label="Chord layout"
          description="Default uses Mac/Cmd-style chords. Vim-style adds modal nav (g g, g w)."
        >
          <Segment
            value={prefs.keyboard.layout}
            onChange={(v) =>
              setPrefs({ keyboard: { ...prefs.keyboard, layout: v } })
            }
            options={[
              { value: "default", label: "Default" },
              { value: "vim", label: "Vim-style" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Shortcut demo">
        <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-[#ececec]">
          <div className="flex flex-col items-center px-4 py-8">
            <div className="w-full overflow-x-auto">
              <div className="mx-auto w-max">
                <MagicKeyboard
                  highlightedKeys={highlightedKeys}
                  pressedKeys={pressedKeys}
                  pulseHighlight={phase === "preview"}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center gap-1 text-center">
              <p className="text-[13px] font-medium text-ink-900">
                {activeShortcut.label}
              </p>
              <p className="text-[12px] text-ink-500">{phaseLabel}</p>
              <div className="flex items-center gap-1">
                {activeShortcut.keys.map((keyId) => (
                  <Kbd
                    key={keyId}
                    className={cn(
                      pressedKeys.includes(keyId) &&
                        "border-beacon-300 bg-beacon-50 text-beacon-800"
                    )}
                  >
                    {formatShortcutKey(keyId)}
                  </Kbd>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Reference">
        <div
          className="rounded-xl border border-ink-900/10 bg-white p-1"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {KEYBOARD_SHORTCUTS.map((shortcut, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={shortcut.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 border-b border-ink-900/6 px-4 py-2.5 text-left last:border-b-0 transition-colors",
                  active ? "bg-beacon-50/80" : "hover:bg-ink-50"
                )}
              >
                <div className="text-[13px] text-ink-700">{shortcut.label}</div>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((keyId) => (
                    <Kbd key={keyId}>{formatShortcutKey(keyId)}</Kbd>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-[12.5px] text-ink-500">
          Hover the list to pause the demo. Click any row to jump to that chord.
        </div>
      </SettingsSection>
    </div>
  );
}
