"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Users,
  Sparkles,
  FlaskConical,
  AlertTriangle,
  GitBranch,
  Box,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useWorkspaceBundle } from "./workspace-context";

export function ProjectBar() {
  const { team, chrome } = useWorkspaceBundle();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const example = params?.get("example") ?? null;
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);

  const switchTo = (key: string | null) => {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (key) next.set("example", key);
    else next.delete("example");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : (pathname ?? "/ire"));
    setPickerOpen(false);
  };

  return (
    <div className="h-9 shrink-0 flex items-center px-3 gap-3 border-b border-ink-900/8 bg-parchment-50 text-[11.5px]">
      <div ref={pickerRef} className="relative">
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md hover:bg-ink-900/5 text-ink-900 font-medium"
        >
          <Box className="h-3.5 w-3.5 text-beacon-700" strokeWidth={1.75} />
          <span>{chrome.projectDropdownTitle}</span>
          <span className="text-[10.5px] text-ink-400 font-mono">{chrome.projectVersionSuffix}</span>
          <ChevronDown className="h-3 w-3 text-ink-400" />
        </button>
        {pickerOpen && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-[300px] rounded-md border border-ink-900/10 bg-white shadow-lift overflow-hidden">
            <div className="px-3 py-2 border-b border-ink-900/6 text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
              Workspace
            </div>
            <PickerRow
              title="Generalized scientific program"
              hint="Domain-neutral default — your starting point"
              active={example == null}
              onClick={() => switchTo(null)}
            />
            <div className="border-t border-ink-900/6">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-400">
                Examples
              </div>
              <PickerRow
                title="Oncology · EGFR resistance"
                hint="Worked bio example with wet-lab data"
                active={example === "oncology"}
                onClick={() => switchTo("oncology")}
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-ink-900/10" />

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <GitBranch className="h-3 w-3" strokeWidth={1.75} />
        <span className="font-mono text-[11px]">{chrome.branchCrumbs}</span>
      </span>

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px]">synced</span>
      </span>

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <FlaskConical className="h-3 w-3" strokeWidth={1.75} />
        <span className="font-mono text-[11px]">{chrome.runningExperimentsDisplay}</span>
      </span>

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <Sparkles className="h-3 w-3" strokeWidth={1.75} />
        <span className="font-mono text-[11px]">{chrome.agentsDisplay}</span>
      </span>

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <AlertTriangle className="h-3 w-3" strokeWidth={1.75} />
        <span className="font-mono text-[11px]">{chrome.anomaliesDisplay}</span>
      </span>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/atrium")}
          className="inline-flex h-6 items-center gap-1.5 rounded px-2 font-marketing text-[11.5px] font-medium not-italic text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Atrium
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex h-6 items-center gap-1.5 rounded px-2 font-marketing text-[11.5px] font-medium not-italic text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        >
          Home
        </button>

        <div className="h-4 w-px bg-ink-900/10" />

        <div className="flex items-center gap-1 text-ink-600">
          <Users className="h-3 w-3" />
          <span className="text-[11px]">team online · {team.filter((t) => t.online).length}</span>
        </div>
        <div className="flex items-center -space-x-1.5">
          {team
            .filter((t) => t.online)
            .slice(0, 5)
            .map((m) => (
              <div
                key={m.id}
                title={`${m.name} · ${m.role}`}
                className={cn(
                  "h-6 w-6 rounded-full ring-2 ring-parchment-50 grid place-items-center text-[9.5px] font-medium text-white font-mono"
                )}
                style={{ background: m.color }}
              >
                {m.initials}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PickerRow({
  title,
  hint,
  active,
  onClick,
}: {
  title: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2.5 px-3 py-2 text-left",
        active ? "bg-beacon-50" : "hover:bg-parchment-50"
      )}
    >
      <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        {active && <Check className="h-3 w-3 text-beacon-700" strokeWidth={2.5} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-ink-900 truncate">{title}</div>
        <div className="text-[11px] text-ink-500 truncate">{hint}</div>
      </div>
    </button>
  );
}
