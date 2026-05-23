"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { MemberSelector } from "@/components/ui/member-selector";
import { defaultSelectedTeamIds, teamToMembers } from "@/lib/teamMembers";
import { useWorkspaceBundle } from "./workspace-context";
import { WorkspaceAccessDialog } from "./WorkspaceAccessDialog";

export function ProjectBar() {
  const { team, chrome } = useWorkspaceBundle();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const example = params?.get("example") ?? null;
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [accessOpen, setAccessOpen] = React.useState(false);
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

  const online = team.filter((t) => t.online).length;
  const members = React.useMemo(() => teamToMembers(team), [team]);
  const teamKey = team.map((t) => t.id).join(",");
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>(() =>
    defaultSelectedTeamIds(team)
  );

  React.useEffect(() => {
    setSelectedMembers(defaultSelectedTeamIds(team));
  }, [teamKey, team]);

  return (
    <header className="h-11 shrink-0 flex items-center px-4 gap-4 border-b border-[var(--ire-border)] bg-[var(--ire-surface)]">
      <nav className="flex items-center gap-1.5 min-w-0 text-[12.5px] text-ink-600">
        <span className="text-ink-400 shrink-0">program</span>
        <ChevronRight className="h-3 w-3 shrink-0 text-ink-300" />
        <div ref={pickerRef} className="relative min-w-0">
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="inline-flex items-center gap-1 max-w-[280px] font-medium text-ink-900 hover:text-beacon-800 truncate"
          >
            <span className="truncate">{chrome.projectDropdownTitle}</span>
            <span className="text-[10px] text-ink-400 font-mono shrink-0">
              {chrome.projectVersionSuffix}
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 text-ink-400" />
          </button>
          {pickerOpen && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-[300px] rounded-lg border border-[var(--ire-border-strong)] bg-[var(--ire-surface-elevated)] shadow-[0_8px_30px_rgba(42,36,28,0.08)] overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--ire-border)] ire-label">
                Workspace
              </div>
              <PickerRow
                title="Generalized scientific program"
                hint="Domain-neutral default"
                active={example == null}
                onClick={() => switchTo(null)}
              />
              <div className="border-t border-[var(--ire-border)]">
                <div className="px-3 py-1.5 ire-label">Examples</div>
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
        <ChevronRight className="h-3 w-3 shrink-0 text-ink-300" />
        <span className="text-ink-900 font-medium shrink-0">session</span>
      </nav>

      <div className="ml-auto flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAccessOpen(true)}
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[11.5px] text-ink-500 transition-colors hover:bg-ink-900/[0.04] hover:text-ink-800"
            aria-label="Share workspace access"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="tabular-nums whitespace-nowrap">
              {online} online
            </span>
          </button>
        </div>
        <MemberSelector
          members={members}
          selected={selectedMembers}
          onChange={setSelectedMembers}
          maxVisible={5}
          compact
          className="min-w-0"
        />
      </div>

      <WorkspaceAccessDialog
        open={accessOpen}
        onOpenChange={setAccessOpen}
        team={team}
        workspaceTitle={chrome.projectDropdownTitle}
      />
    </header>
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
        "flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-[12.5px]",
        active ? "bg-beacon-50/60" : "hover:bg-[var(--ire-surface-muted)]"
      )}
    >
      <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        {active && <Check className="h-3 w-3 text-beacon-700" strokeWidth={2.5} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-ink-900 truncate">{title}</div>
        <div className="text-[11px] text-ink-500 truncate">{hint}</div>
      </div>
    </button>
  );
}
