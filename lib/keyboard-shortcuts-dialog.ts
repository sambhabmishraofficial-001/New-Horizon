export const KEYBOARD_SHORTCUTS_OPEN_EVENT = "vri:keyboard-shortcuts-open";

export function openKeyboardShortcutsDialog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(KEYBOARD_SHORTCUTS_OPEN_EVENT));
}
