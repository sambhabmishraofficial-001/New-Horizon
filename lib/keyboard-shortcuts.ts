export type KeyboardShortcut = {
  id: string;
  keys: string[];
  label: string;
};

/** Key ids match `MagicKeyboard` key `id` fields. */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { id: "palette", keys: ["cmd-l", "K"], label: "Open command palette" },
  { id: "jump", keys: ["cmd-l", "P"], label: "Jump to anything" },
  { id: "shortcuts", keys: ["cmd-l", "slash"], label: "Show keyboard shortcuts" },
  { id: "sidebar", keys: ["cmd-l", "B"], label: "Toggle side panel" },
  { id: "bottom", keys: ["cmd-l", "J"], label: "Toggle bottom panel" },
  { id: "composer", keys: ["cmd-l", "I"], label: "Focus the agent composer" },
  { id: "send", keys: ["cmd-l", "return"], label: "Send to agent" },
  { id: "save", keys: ["cmd-l", "S"], label: "Save the active document" },
];

export function comboToKeyIds(combo: string[]): string[] {
  return combo.map((key) => {
    if (key === "⌘") return "cmd-l";
    if (key === "↩") return "return";
    if (key === "/") return "slash";
    return key;
  });
}
