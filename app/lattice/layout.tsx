import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lattice Studio",
  description:
    "Git for research — content-addressed investigations, gates, replication, and Merkle-DAG discovery.",
};

export default function LatticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100dvh", background: "#171717" }}>
      {children}
    </div>
  );
}
