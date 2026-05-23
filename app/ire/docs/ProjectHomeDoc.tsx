"use client";

import { DocShell } from "./DocChrome";
import { ProgramScaffoldHome } from "@/components/ire/ProgramScaffoldHome";

export function ProjectHomeDoc() {
  return (
    <DocShell crumbs={["scientific program", "project home"]}>
      <ProgramScaffoldHome />
    </DocShell>
  );
}
