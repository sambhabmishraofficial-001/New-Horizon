"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { WorkspaceBundleProvider } from "./workspace-context";
import { IreWorkspaceShell } from "./IreWorkspaceShell";
import { ireGeneralBundle } from "./bundles/ire-general";
import { ireDemoBundle } from "./bundles/ire-demo";

function IREInner() {
  const params = useSearchParams();
  const example = params?.get("example");
  const bundle = example === "oncology" ? ireDemoBundle : ireGeneralBundle;
  return (
    <WorkspaceBundleProvider value={bundle}>
      <IreWorkspaceShell />
    </WorkspaceBundleProvider>
  );
}

export default function IREPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-parchment-50" />}>
      <IREInner />
    </React.Suspense>
  );
}
