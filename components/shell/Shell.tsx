"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { InstituteNavProvider } from "@/components/institute/institute-nav-context";
import { InstituteSidebarProvider } from "@/components/institute/use-institute-sidebar-state";
import {
  InstituteAppShellProvider,
} from "@/components/institute/institute-app-shell";
import { InstituteNavSidebar } from "@/components/institute/InstituteNavSidebar";
import { VriOnboardingGate } from "@/components/onboarding/VriOnboardingGate";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { TopBar } from "@/components/shell/TopBar";
import { cn } from "@/lib/cn";
import { institutePathActive } from "@/lib/instituteNav";
import "@/app/ire/ire-workspace.css";

function isInstituteWorkspaceMain(pathname: string): boolean {
  return (
    institutePathActive(pathname, "/ire") ||
    institutePathActive(pathname, "/lattice")
  );
}

/** Authenticated app shell - one persistent institute sidebar across all routes. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const workspaceMain = isInstituteWorkspaceMain(pathname);
  const [cmdOpen, setCmdOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <InstituteAppShellProvider>
      <InstituteSidebarProvider>
        <InstituteNavProvider>
          <div className="institute-nav-root ire-workspace app-shell h-screen flex flex-col bg-[var(--ire-bg)] font-marketing not-italic">
            <TopBar onOpenCommand={() => setCmdOpen(true)} />
            <div className="flex flex-1 min-h-0">
              <InstituteNavSidebar />
              <main
                className={cn(
                  "flex-1 min-w-0 min-h-0 bg-[var(--ire-surface-muted)]",
                  workspaceMain
                    ? "flex flex-col overflow-hidden"
                    : "overflow-y-auto bg-[var(--ire-bg)]"
                )}
              >
                {children}
              </main>
            </div>
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
            <VriOnboardingGate />
          </div>
        </InstituteNavProvider>
      </InstituteSidebarProvider>
    </InstituteAppShellProvider>
  );
}
