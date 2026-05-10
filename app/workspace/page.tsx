"use client";

import { WorkspaceBundleProvider } from "../ire/workspace-context";
import { IreWorkspaceShell } from "../ire/IreWorkspaceShell";
import { ireGeneralBundle } from "../ire/bundles/ire-general";

export default function WorkspacePage() {
  return (
    <WorkspaceBundleProvider value={ireGeneralBundle}>
      <IreWorkspaceShell />
    </WorkspaceBundleProvider>
  );
}
