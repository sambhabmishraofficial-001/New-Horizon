"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { WorkspaceBundleProvider } from "./workspace-context";
import { IreWorkspaceShell } from "./IreWorkspaceShell";
import { ireGeneralBundle } from "./bundles/ire-general";
import { ireDemoBundle } from "./bundles/ire-demo";
import { useClientSearchParamsReady } from "@/lib/hooks/useClientSearchParams";

function IrePreviewFallback() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#282824]">
      <div className="h-11 shrink-0 border-b border-white/10 bg-[#30302c]" />
      <div className="flex flex-1 items-center justify-center text-[13px] text-[#e8e8e4]/70">
        Loading workspace…
      </div>
    </div>
  );
}

function IREInner() {
  const params = useSearchParams();
  const paramsReady = useClientSearchParamsReady();

  if (!paramsReady) {
    return <IrePreviewFallback />;
  }

  const example = params?.get("example");
  const previewTheme = params?.get("theme") === "dark" ? "dark" : undefined;
  const bundle = example === "oncology" ? ireDemoBundle : ireGeneralBundle;

  return (
    <WorkspaceBundleProvider value={bundle}>
      <IreWorkspaceShell previewTheme={previewTheme} />
    </WorkspaceBundleProvider>
  );
}

export default function IREPage() {
  return (
    <React.Suspense fallback={<IrePreviewFallback />}>
      <IREInner />
    </React.Suspense>
  );
}
