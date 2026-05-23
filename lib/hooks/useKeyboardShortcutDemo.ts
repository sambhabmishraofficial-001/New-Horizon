"use client";

import * as React from "react";
import { KEYBOARD_SHORTCUTS } from "@/lib/keyboard-shortcuts";

export type ShortcutDemoPhase = "preview" | "modifier" | "chord" | "release";

const PHASE_PREVIEW_MS = 700;
const PHASE_MODIFIER_MS = 650;
const PHASE_CHORD_MS = 750;
const PHASE_RELEASE_MS = 450;

export function useKeyboardShortcutDemo(options: {
  enabled: boolean;
  paused?: boolean;
  initialIndex?: number;
}) {
  const { enabled, paused = false, initialIndex = 0 } = options;
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const [phase, setPhase] = React.useState<ShortcutDemoPhase>("preview");
  const [pressedKeys, setPressedKeys] = React.useState<string[]>([]);

  const activeShortcut = KEYBOARD_SHORTCUTS[activeIndex];

  React.useEffect(() => {
    if (!enabled || paused) return;

    const shortcut = KEYBOARD_SHORTCUTS[activeIndex];
    const mod = shortcut.keys[0];
    const keys = shortcut.keys;

    setPhase("preview");
    setPressedKeys([]);

    const modifierTimer = window.setTimeout(() => {
      setPhase("modifier");
      setPressedKeys([mod]);
    }, PHASE_PREVIEW_MS);

    const chordTimer = window.setTimeout(() => {
      setPhase("chord");
      setPressedKeys(keys);
    }, PHASE_PREVIEW_MS + PHASE_MODIFIER_MS);

    const releaseTimer = window.setTimeout(() => {
      setPhase("release");
      setPressedKeys([]);
    }, PHASE_PREVIEW_MS + PHASE_MODIFIER_MS + PHASE_CHORD_MS);

    const nextTimer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % KEYBOARD_SHORTCUTS.length);
    }, PHASE_PREVIEW_MS + PHASE_MODIFIER_MS + PHASE_CHORD_MS + PHASE_RELEASE_MS);

    return () => {
      window.clearTimeout(modifierTimer);
      window.clearTimeout(chordTimer);
      window.clearTimeout(releaseTimer);
      window.clearTimeout(nextTimer);
    };
  }, [enabled, paused, activeIndex]);

  React.useEffect(() => {
    if (!enabled) {
      setActiveIndex(initialIndex);
      setPhase("preview");
      setPressedKeys([]);
    }
  }, [enabled, initialIndex]);

  const phaseLabel = React.useMemo(() => {
    switch (phase) {
      case "preview":
        return "Next chord";
      case "modifier":
        return "Hold modifier";
      case "chord":
        return "Press together";
      case "release":
        return "Release";
      default:
        return "";
    }
  }, [phase]);

  return {
    activeIndex,
    setActiveIndex,
    activeShortcut,
    highlightedKeys: activeShortcut.keys,
    pressedKeys,
    phase,
    phaseLabel,
  };
}

export function formatShortcutKey(keyId: string) {
  if (keyId === "cmd-l" || keyId === "cmd-r") return "⌘";
  if (keyId === "return") return "↩";
  if (keyId === "slash") return "/";
  return keyId.toUpperCase();
}
