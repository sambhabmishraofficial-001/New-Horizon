"use client";

import * as React from "react";
import { MagicKeyboard } from "@/components/ui/magic-keyboard-component";
import { Kbd } from "@/components/ui/Primitives";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { KEYBOARD_SHORTCUTS } from "@/lib/keyboard-shortcuts";
import { KEYBOARD_SHORTCUTS_OPEN_EVENT } from "@/lib/keyboard-shortcuts-dialog";
import {
  formatShortcutKey,
  useKeyboardShortcutDemo,
} from "@/lib/hooks/useKeyboardShortcutDemo";

export { openKeyboardShortcutsDialog } from "@/lib/keyboard-shortcuts-dialog";

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [paused, setPaused] = React.useState(false);
  const {
    activeIndex,
    setActiveIndex,
    activeShortcut,
    highlightedKeys,
    pressedKeys,
    phase,
    phaseLabel,
  } = useKeyboardShortcutDemo({ enabled: open, paused });

  React.useEffect(() => {
    if (!open) setPaused(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[110] flex max-h-[min(94vh,980px)] w-[min(680px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-ink-900/8 px-6 py-4 text-left">
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Full keyboard view — watch keys glow and press in sequence.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Full keyboard hero */}
          <div className="flex flex-col items-center bg-[#ececec] px-4 py-8">
            <div className="w-full overflow-x-auto">
              <div className="mx-auto w-max">
                <MagicKeyboard
                  highlightedKeys={highlightedKeys}
                  pressedKeys={pressedKeys}
                  pulseHighlight={phase === "preview"}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
              <p className="text-[14px] font-medium text-ink-900">
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

          {/* Shortcut list below keyboard */}
          <div
            className="border-t border-ink-900/8 bg-white"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="max-h-[240px] overflow-y-auto p-2">
              {KEYBOARD_SHORTCUTS.map((shortcut, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      active
                        ? "bg-beacon-50 ring-1 ring-beacon-200"
                        : "hover:bg-ink-50"
                    )}
                  >
                    <span className="text-[13px] text-ink-700">{shortcut.label}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {shortcut.keys.map((keyId) => (
                        <Kbd key={keyId}>{formatShortcutKey(keyId)}</Kbd>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="border-t border-ink-900/6 px-4 py-2.5 text-[11.5px] text-ink-500">
              Hover the list to pause. Click a row to jump to that chord.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function KeyboardShortcutsHost() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onOpenRequest() {
      setOpen(true);
    }

    window.addEventListener(KEYBOARD_SHORTCUTS_OPEN_EVENT, onOpenRequest);
    return () => {
      window.removeEventListener(KEYBOARD_SHORTCUTS_OPEN_EVENT, onOpenRequest);
    };
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key === "/") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <KeyboardShortcutsDialog open={open} onOpenChange={setOpen} />;
}
