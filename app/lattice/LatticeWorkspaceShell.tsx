"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import "../ire/ire-workspace.css";
import { InstituteNavProvider } from "@/components/institute/institute-nav-context";
import { InstituteSidebarProvider } from "@/components/institute/use-institute-sidebar-state";
import { useInstituteAppShell } from "@/components/institute/institute-app-shell";
import { InstituteNavSidebar } from "@/components/institute/InstituteNavSidebar";
import { LatticeNavBridge } from "./LatticeNavBridge";
import { LatticeProgramPanel } from "./LatticeProgramPanel";
import { LatticePlayground } from "./LatticePlayground";
import { LatticeInsightPanel } from "./LatticeInsightPanel";
import { LATTICE_TASKS } from "./lattice-data";
import type { OverviewSubFeatureId } from "@/lib/instituteSubFeatures";

const BANNER_KEY = "nh_lattice_banner_dismissed";

export function LatticeWorkspaceShell() {
  const inAppShell = useInstituteAppShell();
  const inner = <LatticeWorkspaceShellInner inAppShell={inAppShell} />;

  if (inAppShell) return inner;

  return (
    <InstituteSidebarProvider>
      <InstituteNavProvider>{inner}</InstituteNavProvider>
    </InstituteSidebarProvider>
  );
}

function LatticeWorkspaceShellInner({ inAppShell }: { inAppShell: boolean }) {
  const [bannerVisible, setBannerVisible] = React.useState(false);
  const [navView, setNavView] = React.useState<OverviewSubFeatureId>("playground");
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
    LATTICE_TASKS[0]?.id ?? null
  );
  const [programFilter, setProgramFilter] = React.useState<string | "all">("all");
  const [autonomy, setAutonomy] = React.useState(1);

  React.useEffect(() => {
    setBannerVisible(window.localStorage.getItem(BANNER_KEY) !== "1");
  }, []);

  const selectedTask =
    LATTICE_TASKS.find((t) => t.id === selectedTaskId) ?? null;

  function dismissBanner() {
    window.localStorage.setItem(BANNER_KEY, "1");
    setBannerVisible(false);
  }

  return (
    <div
      className={cn(
        "ire-workspace flex flex-col overflow-hidden bg-[var(--ire-surface-muted)]",
        inAppShell ? "flex-1 min-h-0" : "fixed inset-0 z-40"
      )}
    >
      <LatticeNavBridge navView={navView} onNavViewChange={setNavView} />

      {bannerVisible && (
        <div className="shrink-0 h-9 flex items-center justify-center gap-3 px-4 bg-beacon-50 border-b border-beacon-500/20 text-[12px] text-ink-800">
          <span>
            <strong className="font-medium">Program K11 demo</strong>
            {" - "}
            Ribozyme catalysis with live twins.{" "}
            <Link href="/enrol" className="text-beacon-800 underline underline-offset-2">
              Request institute access
            </Link>
          </span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismissBanner}
            className="h-6 w-6 grid place-items-center rounded hover:bg-ink-900/5 text-ink-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex">
        {!inAppShell ? <InstituteNavSidebar /> : null}

        <LatticeProgramPanel
          navView={navView}
          onNavViewChange={setNavView}
          selectedTaskId={selectedTaskId}
          onSelectTask={(t) => {
            setSelectedTaskId(t.id);
            setNavView("playground");
          }}
          programFilter={programFilter}
          onProgramFilter={setProgramFilter}
        />

        <LatticePlayground
          selectedTask={selectedTask}
          autonomy={autonomy}
          onAutonomyChange={setAutonomy}
        />

        <LatticeInsightPanel />
      </div>
    </div>
  );
}
