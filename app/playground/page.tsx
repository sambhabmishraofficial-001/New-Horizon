import type { Metadata } from "next";
import { PlaygroundShell } from "@/components/marketing/playground/PlaygroundShell";

export const metadata: Metadata = {
  title: "Playground - Try New Horizon for free",
  description:
    "Free playground for New Horizon institute models - co-science chat, literature synthesis, invariant audits, and experiment design.",
};

export default function PlaygroundPage() {
  return <PlaygroundShell />;
}
