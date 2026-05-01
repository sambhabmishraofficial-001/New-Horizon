"use client";

import * as React from "react";
import {
  FileText,
  LineChart,
  Quote,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell, SectionLabel } from "./DocChrome";

export function ManuscriptDoc() {
  const [mode, setMode] = React.useState<"outline" | "write" | "review" | "submit">("write");
  return (
    <DocShell
      crumbs={["egfr", "manuscripts", "t790m-resistance.ms"]}
      right={
        <div className="flex items-center gap-2">
          <select className="h-5 text-[10.5px] font-mono border border-ink-900/10 rounded px-1.5 bg-white">
            <option>Nature</option>
            <option>Cell</option>
            <option>Science</option>
            <option>NEJM</option>
          </select>
          <button className="h-5 px-2 text-[10.5px] font-mono bg-ink-900 text-parchment-50 rounded inline-flex items-center gap-1">
            <Download className="h-2.5 w-2.5" /> repro-package
          </button>
        </div>
      }
    >
      <div className="max-w-[940px] mx-auto px-10 py-8">
        <ModeTabs mode={mode} setMode={setMode} />
        <LiveConnections />
        {mode === "outline" && <Outline />}
        {mode === "write" && <Write />}
        {mode === "review" && <Review />}
        {mode === "submit" && <Submit />}
      </div>
    </DocShell>
  );
}

function ModeTabs({
  mode,
  setMode,
}: {
  mode: "outline" | "write" | "review" | "submit";
  setMode: (m: "outline" | "write" | "review" | "submit") => void;
}) {
  return (
    <div className="flex items-center gap-1 mb-5">
      {(["outline", "write", "review", "submit"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            "h-7 px-3 text-[11.5px] font-mono rounded uppercase tracking-[0.14em]",
            mode === m
              ? "bg-ink-900 text-parchment-50"
              : "text-ink-600 hover:bg-ink-900/5"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function LiveConnections() {
  return (
    <div className="mb-8 rounded-md border border-beacon-500/20 bg-beacon-50/50 px-4 py-3">
      <SectionLabel>Live connections</SectionLabel>
      <div className="mt-2 grid grid-cols-4 gap-6 text-[12.5px] text-ink-700">
        <div>
          <div className="inline-flex items-center gap-1.5 text-beacon-800">
            <LineChart className="h-3.5 w-3.5" /> figures
          </div>
          <div className="text-ink-900 mt-0.5 tabular-nums">6 linked</div>
          <div className="text-[10.5px] text-ink-500">auto-update on data change</div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-beacon-800">
            <Quote className="h-3.5 w-3.5" /> citations
          </div>
          <div className="text-ink-900 mt-0.5 tabular-nums">34</div>
          <div className="text-[10.5px] text-ink-500">formatted · Nature style</div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-beacon-800">
            <ShieldCheck className="h-3.5 w-3.5" /> datasets
          </div>
          <div className="text-ink-900 mt-0.5 tabular-nums">3 signed</div>
          <div className="text-[10.5px] text-ink-500">repro-package ready</div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-beacon-800">
            <FileText className="h-3.5 w-3.5" /> methods
          </div>
          <div className="text-ink-900 mt-0.5">auto-drafted</div>
          <div className="text-[10.5px] text-ink-500">from protocol logs</div>
        </div>
      </div>
    </div>
  );
}

function Outline() {
  return (
    <div className="font-mono text-[12.5px] text-ink-700 leading-[1.9]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 mb-3">
        outline · drag to reorder
      </div>
      {[
        ["0.", "Abstract", "150 / 150 words · ready"],
        ["1.", "Introduction", "draft"],
        ["2.", "Results", "5 subsections · live figures"],
        ["2.1", "Baseline IC50 across cell lines", "Fig. 2A"],
        ["2.2", "T790M alters phospho-dynamics", "Fig. 2B + 2C"],
        ["2.3", "Combination therapy rescues sensitivity", "Fig. 3"],
        ["2.4", "Structural basis of resistance", "Fig. 4"],
        ["2.5", "In vivo xenograft validation", "EXP-003 · running"],
        ["3.", "Discussion", "skeleton"],
        ["4.", "Methods", "auto · from protocol logs"],
        ["5.", "Data availability", "3 datasets · DOI-ready"],
        ["6.", "Code availability", "repro-package auto-built"],
      ].map(([n, t, m], i) => (
        <div
          key={i}
          className={cn(
            "flex items-baseline gap-3",
            n.includes(".") && n.length > 2 && "pl-8 text-ink-600"
          )}
        >
          <span className="text-ink-400 w-6">{n}</span>
          <span className="flex-1">{t}</span>
          <span className="text-ink-400 text-[11px]">{m}</span>
        </div>
      ))}
    </div>
  );
}

function Write() {
  return (
    <article className="prose-sm">
      <h1 className="font-display text-[34px] text-ink-900 leading-[1.1]">
        EGFR T790M drives osimertinib resistance via a competitive mechanism
        rescuable by combination MEK inhibition
      </h1>
      <div className="mt-1 text-[12px] text-ink-500 font-mono">
        Anu S.K.¹, Priya K.¹, Marcus O.¹, Dr. Smith¹* · ¹University X · *
        corresponding
      </div>

      <h2 className="font-display text-[20px] text-ink-900 mt-10">Abstract</h2>
      <p className="text-[14px] text-ink-800 leading-relaxed mt-2">
        Osimertinib resistance remains the dominant barrier to durable EGFR-TKI
        response in lung adenocarcinoma. Using a multi-modal panel spanning
        biochemistry, cell biology, and in vivo models, we show that T790M
        drives resistance through competitive inhibition at the ATP-binding
        site and that MEK co-inhibition restores drug sensitivity.
      </p>

      <h2 className="font-display text-[20px] text-ink-900 mt-8">Results</h2>
      <p className="text-[14px] text-ink-800 leading-relaxed mt-2">
        The T790M mutation significantly reduced osimertinib sensitivity —{" "}
        <span className="inline-flex items-baseline gap-1 text-beacon-700">
          IC50 shift 12.3-fold, <i>p</i> &lt; 0.001{" "}
          <FigRef>Fig. 2A</FigRef>
        </span>{" "}
        — consistent with prior reports <CiteRef n={14}>Smith '24</CiteRef>
        <CiteRef n={22}>Chen '23</CiteRef>. Phospho-EGFR dynamics in dose- and
        time-resolved western blot analysis revealed{" "}
        <HighlightClaim tone="beacon">
          a dose-dependent reduction in pEGFR
        </HighlightClaim>{" "}
        in wild-type but not T790M cell lines, arguing against allosteric
        bypass <FigRef>Fig. 2B</FigRef>.
      </p>

      <p className="text-[14px] text-ink-800 leading-relaxed mt-3">
        Combination treatment with a MEK inhibitor restored sensitivity (
        <HighlightClaim tone="amber">
          72% tumor volume reduction vs 31% monotherapy
        </HighlightClaim>
        , <i>p</i> &lt; 0.01) <FigRef>Fig. 3</FigRef>.
      </p>

      <h2 className="font-display text-[20px] text-ink-900 mt-8">Methods</h2>
      <p className="text-[14px] text-ink-600 leading-relaxed mt-2">
        <span className="text-ink-400">[auto-drafted from protocol logs]</span>{" "}
        Cell viability was measured using an IC50 assay on a Tecan i-D3 plate
        reader as described in{" "}
        <span className="text-beacon-700 font-mono">IC50_assay v3</span>. Western
        blot analysis followed{" "}
        <span className="text-beacon-700 font-mono">Western_blot_EGFR v3.2</span>,
        with 5% BSA blocking per community-validated variant.
      </p>

      <WritingAssistant />
    </article>
  );
}

function Review() {
  return (
    <div className="space-y-4">
      <SectionLabel>Claim verification · 47 / 50 verified</SectionLabel>
      <div className="mt-2 h-1 rounded-full bg-ink-900/8 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: "94%" }} />
      </div>
      {[
        { tone: "ok", line: 12, msg: "IC50 shift 12.3× verified against EXP-001 · p < 0.001 matches fit" },
        { tone: "ok", line: 18, msg: "Citation count 34 — all formatted for Nature" },
        { tone: "warn", line: 47, msg: "Claim 'dose-dependent reduction in pEGFR' supported by EXP-002 arm 1-3 only. Add EXP-005 time-course to strengthen." },
        { tone: "ok", line: 58, msg: "Methods consistent with protocol logs (WB_EGFR v3.2, no deviation)" },
        { tone: "warn", line: 73, msg: "Figure 4 panel C: caption exceeds Nature limit (58 → 45 words)" },
        { tone: "ok", line: "—", msg: "Reproducibility package hash verified · 9c4d1e…" },
      ].map((r, i) => (
        <div
          key={i}
          className={cn(
            "rounded-md border px-3 py-2 flex items-start gap-2 text-[12.5px]",
            r.tone === "warn"
              ? "border-amber-200 bg-amber-50/50 text-ink-800"
              : "border-emerald-200 bg-emerald-50/30 text-ink-800"
          )}
        >
          {r.tone === "warn" ? (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-700 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <span className="font-mono text-ink-400">line {r.line}</span>{" "}
            <span>{r.msg}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Submit() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-ink-900/10 bg-parchment-50 p-5">
        <div className="font-display text-[20px] text-ink-900">
          Reproducibility package · Nature
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 text-[12.5px] text-ink-700 font-mono">
          {[
            ["figures (6)", "hash ✓"],
            ["datasets (3)", "signed · DOI-ready"],
            ["code (11 files)", "hash ✓"],
            ["environment.yml", "frozen · Python 3.11"],
            ["protocols (4)", "versioned"],
            ["provenance chain", "complete"],
            ["supplementary PDF", "auto-built"],
            ["cover letter", "drafted"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-b border-ink-900/6 py-1">
              <span className="text-ink-500">{k}</span>
              <span className="text-emerald-700">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-9 px-4 rounded-md bg-ink-900 text-parchment-50 inline-flex items-center gap-1.5 text-[12.5px] font-mono hover:bg-ink-800">
          <Send className="h-3.5 w-3.5" /> submit to Nature
        </button>
        <button className="h-9 px-4 rounded-md border border-ink-900/10 text-ink-700 inline-flex items-center gap-1.5 text-[12.5px] font-mono hover:bg-ink-900/5">
          preprint → bioRxiv
        </button>
        <button className="h-9 px-4 rounded-md border border-ink-900/10 text-ink-700 inline-flex items-center gap-1.5 text-[12.5px] font-mono hover:bg-ink-900/5">
          export · .irerpkg
        </button>
      </div>
    </div>
  );
}

function WritingAssistant() {
  return (
    <div className="mt-10 rounded-md border border-amber-200 bg-amber-50/40 px-4 py-3">
      <SectionLabel>Writing assistant · co-author</SectionLabel>
      <ul className="mt-2 space-y-2 text-[12.5px] text-ink-800">
        <li className="flex gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-700 mt-0.5 shrink-0" />
          <span>
            <b>Line 47 · claim not fully supported.</b> Consider adding the
            time-course data from EXP-005.
          </span>
        </li>
        <li className="flex gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-700 mt-0.5 shrink-0" />
          <span>
            3 recent papers (2026) report similar findings — cite them to
            strengthen this claim.
          </span>
        </li>
        <li className="flex gap-2">
          <Link2 className="h-3.5 w-3.5 text-beacon-700 mt-0.5 shrink-0" />
          <span>
            Methods section diverges from protocol log on Step 6 (blocking).
            Re-draft?
          </span>
        </li>
      </ul>
    </div>
  );
}

function FigRef({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-beacon-700 font-mono text-[11.5px] border-b border-beacon-500/30 cursor-pointer">
      {children} <LineChart className="h-2.5 w-2.5" />
    </span>
  );
}
function CiteRef({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <sup className="text-beacon-700 cursor-pointer hover:underline font-mono">
      [{n}]
    </sup>
  );
}
function HighlightClaim({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "beacon" | "amber";
}) {
  const t = tone === "beacon" ? "bg-beacon-50 border-b border-beacon-500" : "bg-amber-50 border-b border-amber-500";
  return <span className={cn(t, "px-0.5")}>{children}</span>;
}
