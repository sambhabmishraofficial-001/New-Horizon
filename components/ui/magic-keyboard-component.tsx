"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/cn";

type KeyDef = {
  id: string;
  label: React.ReactNode;
  flex?: number;
  className?: string;
  compact?: boolean;
};

const KEY_ROWS: KeyDef[][] = [
  [
    { id: "esc", label: "esc", compact: true },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `f${i + 1}`,
      label: `F${i + 1}`,
      compact: true,
    })),
    { id: "eject", label: "⏏", className: "ml-4 px-5" },
  ],
  [
    { id: "backtick", label: "`" },
    ..."1234567890".split("").map((c) => ({ id: c, label: c })),
    { id: "minus", label: "-" },
    { id: "equal", label: "=" },
    { id: "delete", label: "delete", className: "px-5" },
  ],
  [
    { id: "tab", label: "tab", flex: 2 },
    ..."QWERTYUIOP".split("").map((c) => ({ id: c, label: c })),
    { id: "lbracket", label: "[" },
    { id: "rbracket", label: "]" },
    { id: "backslash", label: "\\", flex: 2 },
  ],
  [
    { id: "caps", label: "caps lock", flex: 2 },
    ..."ASDFGHJKL".split("").map((c) => ({ id: c, label: c })),
    { id: "semicolon", label: ";" },
    { id: "quote", label: "'" },
    { id: "return", label: "return", flex: 2 },
  ],
  [
    { id: "shift-l", label: "shift", flex: 3 },
    ..."ZXCVBNM".split("").map((c) => ({ id: c, label: c })),
    { id: "comma", label: "," },
    { id: "period", label: "." },
    { id: "slash", label: "/" },
    { id: "shift-r", label: "shift", flex: 3 },
  ],
];

const BOTTOM_ROW: KeyDef[] = [
  { id: "fn", label: "fn" },
  { id: "ctrl", label: "ctrl" },
  { id: "opt-l", label: "⌥", className: "text-base p-0.5" },
  { id: "cmd-l", label: "⌘", className: "text-base p-0.5" },
  { id: "space", label: "", flex: 5, className: "min-w-[175px]" },
  { id: "cmd-r", label: "⌘", className: "text-base p-0.5" },
  { id: "opt-r", label: "⌥", className: "text-base p-0.5" },
  { id: "arrow-l", label: <ArrowLeft size={16} /> },
  { id: "arrow-r", label: <ArrowRight size={16} /> },
];

function MagicKey({
  keyDef,
  highlighted,
  pressed,
  pulseHighlight,
}: {
  keyDef: KeyDef;
  highlighted?: boolean;
  pressed?: boolean;
  pulseHighlight?: boolean;
}) {
  return (
    <div
      data-key-id={keyDef.id}
      className={cn(
        "magic-key border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center text-xs text-gray-800 cursor-default select-none transition duration-200 ease-in-out",
        keyDef.compact ? "py-1 px-1 max-h-[25px]" : "py-2 px-1",
        keyDef.className,
        highlighted && "magic-key--highlight",
        highlighted && pulseHighlight && "magic-key--pulse",
        pressed && "magic-key--pressed"
      )}
      style={keyDef.flex ? { flex: keyDef.flex } : undefined}
    >
      {keyDef.label}
    </div>
  );
}

export function MagicKeyboard({
  highlightedKeys = [],
  pressedKeys = [],
  pulseHighlight = false,
  className,
}: {
  highlightedKeys?: string[];
  pressedKeys?: string[];
  pulseHighlight?: boolean;
  className?: string;
}) {
  const highlightSet = React.useMemo(
    () => new Set(highlightedKeys),
    [highlightedKeys]
  );
  const pressedSet = React.useMemo(() => new Set(pressedKeys), [pressedKeys]);

  return (
    <div className={cn("magic-keyboard-root shrink-0", className)}>
      <div className="flex w-[600px] flex-col gap-1 rounded-xl bg-gray-300 p-5 shadow-md select-none">
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-0.5">
            {row.map((keyDef) => (
              <MagicKey
                key={keyDef.id}
                keyDef={keyDef}
                highlighted={highlightSet.has(keyDef.id)}
                pressed={pressedSet.has(keyDef.id)}
                pulseHighlight={pulseHighlight}
              />
            ))}
          </div>
        ))}

        <div className="flex items-end gap-0.5">
          {BOTTOM_ROW.slice(0, 7).map((keyDef) => (
            <MagicKey
              key={keyDef.id}
              keyDef={keyDef}
              highlighted={highlightSet.has(keyDef.id)}
              pressed={pressedSet.has(keyDef.id)}
              pulseHighlight={pulseHighlight}
            />
          ))}
          <MagicKey
            keyDef={BOTTOM_ROW[7]}
            highlighted={highlightSet.has(BOTTOM_ROW[7].id)}
            pressed={pressedSet.has(BOTTOM_ROW[7].id)}
            pulseHighlight={pulseHighlight}
          />
          <div className="flex flex-col gap-0.5">
            <MagicKey
              keyDef={{
                id: "arrow-u",
                label: <ArrowUp size={13} />,
                className: "py-0.5 px-2",
              }}
              highlighted={highlightSet.has("arrow-u")}
              pressed={pressedSet.has("arrow-u")}
              pulseHighlight={pulseHighlight}
            />
            <MagicKey
              keyDef={{
                id: "arrow-d",
                label: <ArrowDown size={13} />,
                className: "py-0.5 px-2",
              }}
              highlighted={highlightSet.has("arrow-d")}
              pressed={pressedSet.has("arrow-d")}
              pulseHighlight={pulseHighlight}
            />
          </div>
          <MagicKey
            keyDef={BOTTOM_ROW[8]}
            highlighted={highlightSet.has(BOTTOM_ROW[8].id)}
            pressed={pressedSet.has(BOTTOM_ROW[8].id)}
            pulseHighlight={pulseHighlight}
          />
        </div>
      </div>
    </div>
  );
}

export default MagicKeyboard;
