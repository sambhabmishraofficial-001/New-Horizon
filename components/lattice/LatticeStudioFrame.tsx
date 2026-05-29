"use client";

import { LatticePasswordGate } from "@/components/lattice/LatticePasswordGate";

export function LatticeStudioFrame({ embedded = false }: { embedded?: boolean }) {
  return (
    <LatticePasswordGate compact={embedded}>
      <iframe
        src="/lattice-app/index.html"
        title="Lattice Studio"
        className="block w-full border-0 bg-[#171717]"
        style={{
          height: embedded ? "100%" : "100dvh",
          minHeight: embedded ? 520 : undefined,
        }}
      />
    </LatticePasswordGate>
  );
}
