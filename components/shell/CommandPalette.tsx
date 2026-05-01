"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Network,
  Telescope,
  FlaskConical,
  Cpu,
  Users,
  Home,
  GraduationCap,
  Library,
  Compass,
  FileSearch,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV } from "@/lib/nav";
import { Kbd } from "@/components/ui/Primitives";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Jump to" | "Ask the institute" | "Actions";
  icon: any;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);

  const commands = React.useMemo<Command[]>(() => {
    const nav = NAV.map((n) => ({
      id: `nav-${n.href}`,
      label: n.label,
      hint: n.description,
      group: "Jump to" as const,
      icon: n.icon,
      run: () => {
        router.push(n.href);
        onClose();
      },
    }));
    const ask: Command[] = [
      {
        id: "ask-1",
        label: query || "Ask: Which invariants broke in the last 24h?",
        hint: "Route to an AID · reasoning chain streamed to canvas",
        group: "Ask the institute",
        icon: FileSearch,
        run: () => {
          router.push("/invariants");
          onClose();
        },
      },
      {
        id: "ask-2",
        label: query
          ? `Summon a Research Twin for “${query}”`
          : "Summon a Research Twin",
        hint: "Spawns a scoped twin with tool access",
        group: "Ask the institute",
        icon: Sparkles,
        run: () => {
          router.push("/twins");
          onClose();
        },
      },
    ];
    const actions: Command[] = [
      {
        id: "act-1",
        label: "New RL environment rollout",
        hint: "Launch in Environments · budget 200k steps",
        group: "Actions",
        icon: FlaskConical,
        run: () => {
          router.push("/environments");
          onClose();
        },
      },
      {
        id: "act-2",
        label: "Start a fine-tune on ProtFold-δ",
        hint: "Studio · 4×H100 · 45 min ETA",
        group: "Actions",
        icon: Cpu,
        run: () => {
          router.push("/studio");
          onClose();
        },
      },
      {
        id: "act-3",
        label: "Enrol a new AID (AI Investigator)",
        hint: "Configure scope, instruments, and invariants",
        group: "Actions",
        icon: GraduationCap,
        run: () => {
          router.push("/enrol");
          onClose();
        },
      },
    ];
    return [...nav, ...ask, ...actions];
  }, [query, router, onClose]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      (c.label + " " + (c.hint ?? "")).toLowerCase().includes(q)
    );
  }, [commands, query]);

  React.useEffect(() => {
    setIndex(0);
  }, [query, open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(filtered.length - 1, i + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        filtered[index]?.run();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, index]);

  const grouped = React.useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      groups[c.group] ||= [];
      groups[c.group].push(c);
    });
    return groups;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-950/30 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[640px] rounded-xl bg-white shadow-lift border border-ink-900/10 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 h-12 border-b border-ink-900/8">
              <Search className="h-4 w-4 text-ink-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the institute, jump, or act…"
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-400"
              />
              <Kbd>esc</Kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto py-1.5">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="py-1">
                  <div className="px-4 py-1 text-[10.5px] uppercase tracking-[0.14em] text-ink-400 font-medium">
                    {group}
                  </div>
                  {items.map((c) => {
                    const global = filtered.indexOf(c);
                    const active = global === index;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onMouseEnter={() => setIndex(global)}
                        onClick={() => c.run()}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2 text-left",
                          active ? "bg-beacon-50" : "hover:bg-ink-900/5"
                        )}
                      >
                        <div
                          className={cn(
                            "h-7 w-7 rounded-md border grid place-items-center",
                            active
                              ? "bg-white border-beacon-300 text-beacon-700"
                              : "bg-ink-50 border-ink-900/8 text-ink-600"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-ink-900 truncate">{c.label}</div>
                          {c.hint && (
                            <div className="text-[11.5px] text-ink-500 truncate">{c.hint}</div>
                          )}
                        </div>
                        {active && (
                          <div className="flex items-center gap-1 text-ink-500 text-[11px]">
                            <CornerDownLeft className="h-3.5 w-3.5" /> enter
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-ink-500 text-sm">
                  No matches. Try “invariant”, “rollout”, “twin”, “fine-tune”.
                </div>
              )}
            </div>
            <div className="h-9 px-3 flex items-center justify-between text-[11px] text-ink-500 border-t border-ink-900/8 bg-parchment-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" /> navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> select
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-beacon-600" />
                Routed by the <span className="text-ink-700 font-medium">Atrium router</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
