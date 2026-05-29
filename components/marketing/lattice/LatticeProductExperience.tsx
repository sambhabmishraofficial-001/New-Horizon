"use client";

import Link from "next/link";
import { ArrowUpRight, GitBranch, Inbox, ShieldCheck, Sparkles } from "lucide-react";
import { LatticeStudioFrame } from "@/components/lattice/LatticeStudioFrame";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { LATTICE_PATHS } from "@/lib/latticeProduct";
import { sitePath } from "@/lib/sitePath";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Merkle-DAG objects",
    body: "15 typed kinds — Question, Hypothesis, Claim, Replication, Refutation — content-addressed and gate-validated.",
  },
  {
    icon: Inbox,
    title: "Bench + inspector",
    body: "Sidebar tree, center bench editor, right inspector with gates, activity, and CLI mirror — Antigravity-clean layout.",
  },
  {
    icon: ShieldCheck,
    title: "Replication & refutation",
    body: "/replicate and /refute from the prompt bar. Signed commits only pass when every gate is green.",
  },
  {
    icon: Sparkles,
    title: "Graph & timeline",
    body: "Free-form and DAG graph modes, investigation timeline, explore feed, and ⌘K search palette.",
  },
] as const;

export function LatticeProductExperience() {
  return (
    <div className="marketing-site min-h-screen bg-white text-ink-900 font-marketing">
      <MarketingNav variant="light" />

      <section
        id="lattice-overview"
        className="relative isolate scroll-mt-24 overflow-x-hidden bg-white text-ink-900"
      >
        <div className="mx-auto flex max-w-[980px] flex-col items-center px-6 pb-4 pt-10 text-center sm:px-10 sm:pb-6 sm:pt-14">
          <span className="inline-flex rounded-full border border-ink-100 bg-parchment-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-blue-600">
            Git for research
          </span>
          <h1 className="mt-5 font-editorial text-[42px] leading-[1.02] tracking-tight text-ink-900 sm:text-[56px]">
            Lattice
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-ink-600 sm:text-[16px]">
            Content-addressed experiments, REPRO endorsement, federated discovery.
            A separate product — not part of VRI or any institute shell.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href={sitePath(LATTICE_PATHS.home)}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Open Lattice Studio <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div
          id="lattice-workspace"
          className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-[#171717] shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
            <div className="relative aspect-[16/10] min-h-[520px] overflow-hidden bg-[#171717]">
              <LatticeStudioFrame embedded />
            </div>
          </div>
        </div>
      </section>

      <section id="lattice-primitives" className="scroll-mt-24 border-t border-ink-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-6 sm:px-10">
          <div className="max-w-[52ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              What Lattice does
            </p>
            <h2 className="mt-3 font-editorial text-[36px] leading-[1.05] text-ink-900 sm:text-[44px]">
              Orchestrate experiments, not just chat.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[15px] font-medium text-ink-900">{feature.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-600">{feature.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="lattice-start" className="scroll-mt-24 bg-parchment-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-[760px] px-6 text-center sm:px-10">
          <h2 className="font-editorial text-[34px] leading-[1.08] text-ink-900 sm:text-[40px]">
            Press ⌘K to search. ⌘. toggles the inspector.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-ink-600">
            /replicate, /refute, /commit from the prompt bar. Bench · Graph · Timeline · Explore — same studio as the live prototype.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href={sitePath(LATTICE_PATHS.home)}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Launch Lattice <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/products/"
              className="inline-flex h-10 items-center rounded-md border border-ink-200 px-5 text-sm text-ink-700 hover:bg-white"
            >
              All products
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
