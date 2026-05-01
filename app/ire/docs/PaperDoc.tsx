"use client";

import { Quote, Link2, ShieldCheck, Sparkles, FlaskConical, Download } from "lucide-react";
import { DocShell, SectionLabel } from "./DocChrome";
import { PAPERS, type PaperRecord } from "../data";

export function PaperDoc({ path }: { path: string }) {
  const p = PAPERS.find((x) => x.path === path) ?? PAPERS[0];

  return (
    <DocShell
      crumbs={["egfr", "literature", `${p.id}.paper`]}
      right={
        <div className="flex items-center gap-1 text-[10.5px] font-mono">
          <span className="text-beacon-700">relevance {Math.round(p.relevance * 100)}%</span>
          <button className="h-5 px-2 rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 inline-flex items-center gap-1">
            <Download className="h-2.5 w-2.5" /> PDF
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] min-h-full">
        <article className="px-10 py-10 max-w-[820px] min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-medium">
            {p.venue} · {p.year}
          </div>
          <h1 className="font-display text-[30px] leading-[1.15] text-ink-900 mt-2">
            {p.title}
          </h1>
          <div className="mt-2 text-[12.5px] text-ink-500 font-mono">
            {p.authors}
          </div>

          <section className="mt-8">
            <SectionLabel>Key claim · extracted</SectionLabel>
            <div className="mt-2 rounded-md border border-beacon-500/20 bg-beacon-50/40 px-4 py-3 text-[14.5px] text-ink-800 leading-relaxed font-display">
              "{p.keyClaim}"
            </div>
          </section>

          <section className="mt-8">
            <SectionLabel>Summary</SectionLabel>
            <p className="mt-2 text-[14px] text-ink-800 leading-relaxed">
              {p.summary}
            </p>
          </section>

          <section className="mt-8">
            <SectionLabel>Methods used</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.methods.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 h-6 px-2 rounded border border-ink-900/10 bg-white text-[11.5px] font-mono text-ink-700"
                >
                  <FlaskConical className="h-3 w-3 text-amber-700" /> {m}
                </span>
              ))}
              <button className="h-6 px-2 rounded border border-dashed border-ink-900/15 text-[11px] font-mono text-ink-500 hover:text-ink-700">
                + reuse in protocol
              </button>
            </div>
          </section>

          <section className="mt-8">
            <SectionLabel>Relation to your work</SectionLabel>
            <ul className="mt-2 space-y-2 text-[13.5px] text-ink-800">
              <li className="flex gap-2">
                <Sparkles className="h-4 w-4 text-beacon-600 mt-0.5 shrink-0" />
                <span>
                  Linked to{" "}
                  <span className="text-beacon-700 font-mono">
                    {p.linkedHypothesis ?? "H-001"}
                  </span>{" "}
                  — {p.tag === "contradicts" ? "contradicts" : "supports"} the
                  current formulation.
                </span>
              </li>
              <li className="flex gap-2">
                <Link2 className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                <span>
                  Cited by Smith '24, Chen '23 — co-cluster{" "}
                  <span className="font-mono">osimertinib-resistance</span>
                </span>
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  No methodological concerns flagged by the literature agent
                  (sample size 312, multi-centre).
                </span>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <SectionLabel>Excerpt · Fig. 3 caption</SectionLabel>
            <blockquote className="mt-2 border-l-2 border-ink-900/15 pl-4 text-[13.5px] text-ink-700 leading-relaxed">
              "Longitudinal cfDNA profiling across 312 post-progression
              biopsies identifies C797S as the predominant co-mutation in
              patients bearing T790M. Appearance is associated with loss of
              osimertinib activity and with response to combination therapy in
              the co-mutant subgroup."
            </blockquote>
          </section>
        </article>

        <aside className="border-l border-ink-900/8 bg-parchment-50 p-5 space-y-5">
          <div>
            <SectionLabel>Agent actions</SectionLabel>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              <li className="flex items-center gap-2 text-beacon-700 cursor-pointer hover:underline">
                <Link2 className="h-3 w-3" /> Link to H-001
              </li>
              <li className="flex items-center gap-2 text-beacon-700 cursor-pointer hover:underline">
                <Quote className="h-3 w-3" /> Cite in manuscript
              </li>
              <li className="flex items-center gap-2 text-beacon-700 cursor-pointer hover:underline">
                <FlaskConical className="h-3 w-3" /> Extract method to protocol
              </li>
              <li className="flex items-center gap-2 text-beacon-700 cursor-pointer hover:underline">
                <Sparkles className="h-3 w-3" /> Summarise with 3 others
              </li>
            </ul>
          </div>
          <div>
            <SectionLabel>Citation</SectionLabel>
            <div className="mt-2 font-mono text-[11px] text-ink-800 bg-white rounded-md border border-ink-900/10 px-2.5 py-2 leading-relaxed">
              {p.authors}. ({p.year}). {p.title}. <i>{p.venue}</i>.
            </div>
            <div className="mt-1 text-[10.5px] text-ink-400">
              formatted for Nature · {" "}
              <span className="text-beacon-700 cursor-pointer">change style</span>
            </div>
          </div>
          <div>
            <SectionLabel>Related papers</SectionLabel>
            <ul className="mt-2 space-y-1.5 text-[11.5px]">
              {PAPERS.filter((x) => x.id !== p.id)
                .slice(0, 4)
                .map((o) => (
                  <li key={o.id} className="text-ink-700 truncate">
                    <span className="text-beacon-700 cursor-pointer hover:underline">
                      {o.id}
                    </span>{" "}
                    <span className="text-ink-400">·</span> {o.keyClaim}
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </DocShell>
  );
}
