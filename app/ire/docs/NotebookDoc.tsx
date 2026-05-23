"use client";

import * as React from "react";
import {
  Play,
  Sparkles,
  Code2,
  FileText,
  LineChart,
  Beaker,
  Plus,
  GitCommit,
  ShieldCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell } from "./DocChrome";

export function NotebookDoc() {
  return (
    <DocShell
      crumbs={["egfr", "notebooks", "exp002-analysis.irenb"]}
      right={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="h-3 w-3" /> provenance verified
          </span>
          <span className="inline-flex items-center gap-1 text-beacon-700">
            <GitCommit className="h-3 w-3" /> linked · H-001
          </span>
        </div>
      }
    >
      <div className="max-w-[900px] mx-auto px-8 py-8">
        <Toolbar />
        <div className="space-y-4 mt-4">
          <MarkdownCell />
          <CodeCell />
          <DataFrameCell />
          <FigureCell />
          <AgentCell />
          <ProtocolStepCell />
          <AddCellBar />
        </div>
      </div>
    </DocShell>
  );
}

function Toolbar() {
  const btns = [
    { icon: FileText, label: "text" },
    { icon: Code2, label: "code" },
    { icon: LineChart, label: "data" },
    { icon: LineChart, label: "figure" },
    { icon: Beaker, label: "protocol step" },
    { icon: Sparkles, label: "agent query" },
  ];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="flex items-center gap-1 pr-3 border-r border-ink-900/8">
        <button className="h-7 px-2.5 rounded-md bg-ink-900 text-parchment-50 inline-flex items-center gap-1.5 text-[11.5px] font-mono hover:bg-ink-800">
          <Play className="h-3 w-3" /> run all
        </button>
        <button className="h-7 px-2.5 rounded-md border border-ink-900/10 inline-flex items-center gap-1.5 text-[11.5px] font-mono text-ink-700 hover:bg-ink-900/5">
          <Sparkles className="h-3 w-3" /> explain notebook
        </button>
      </div>
      <div className="flex items-center gap-0.5 flex-wrap text-ink-500">
        <span className="text-[10.5px] uppercase tracking-[0.16em] mr-1">
          add cell
        </span>
        {btns.map((b) => (
          <button
            key={b.label}
            className="h-7 px-2 rounded hover:bg-ink-900/5 inline-flex items-center gap-1 text-[11px] font-mono"
          >
            <b.icon className="h-3 w-3" />
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CellFrame({
  kindLabel,
  kindTone,
  number,
  actions,
  provenance,
  children,
}: {
  kindLabel: string;
  kindTone: "beacon" | "emerald" | "amber" | "violet" | "ink";
  number: string;
  actions?: React.ReactNode;
  provenance?: React.ReactNode;
  children: React.ReactNode;
}) {
  const tone = {
    beacon: "border-l-beacon-500",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    violet: "border-l-violet-500",
    ink: "border-l-ink-500",
  }[kindTone];
  return (
    <div className={cn("rounded-md border border-ink-900/8 bg-white border-l-[3px] overflow-hidden", tone)}>
      <div className="h-7 px-3 flex items-center justify-between border-b border-ink-900/6 bg-parchment-50/50">
        <div className="flex items-center gap-2 text-[10.5px] font-mono text-ink-500">
          <span className="uppercase tracking-[0.16em]">{kindLabel}</span>
          <span className="text-ink-300">·</span>
          <span>{number}</span>
          {provenance}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function MarkdownCell() {
  return (
    <CellFrame kindLabel="markdown" kindTone="ink" number="[1]">
      <div className="px-4 py-4 prose-sm">
        <h2 className="font-display text-[22px] text-ink-900 leading-tight">
          Western blot analysis - EGFR phosphorylation
        </h2>
        <p className="mt-2 text-[13.5px] text-ink-700 leading-relaxed">
          Testing <span className="font-mono text-beacon-700">H-001</span>:
          T790M mutation drives osimertinib resistance via a steric clash at
          the gatekeeper. Extract bands, normalize to total EGFR, fit
          dose-response per cell line.
        </p>
      </div>
    </CellFrame>
  );
}

function CodeCell() {
  return (
    <CellFrame
      kindLabel="code · python 3.11"
      kindTone="beacon"
      number="[2]"
      provenance={
        <span className="inline-flex items-center gap-1 text-emerald-700">
          <ShieldCheck className="h-3 w-3" /> hash 9c4d1e…
        </span>
      }
      actions={
        <>
          <Btn><Play className="h-3 w-3" /> run</Btn>
          <Btn><Sparkles className="h-3 w-3" /> explain</Btn>
          <Btn><ShieldCheck className="h-3 w-3" /> test</Btn>
        </>
      }
    >
      <pre className="font-mono text-[12.5px] leading-[1.8] px-4 py-3 bg-white">
        <Line n={1}>
          <Kw>import</Kw> <Id>pandas</Id> <Kw>as</Kw> <Id>pd</Id>
        </Line>
        <Line n={2}>
          <Kw>from</Kw> <Id>ire</Id> <Kw>import</Kw> <Id>load_dataset</Id>,{" "}
          <Id>link_hypothesis</Id>
        </Line>
        <Line n={3}>
          <Cmt># auto-resolves by experiment id - provenance is recorded</Cmt>
        </Line>
        <Line n={4}>
          df <Op>=</Op>{" "}
          <Id>load_dataset</Id>(<Str>"EXP-002/raw_blot_quantification"</Str>)
        </Line>
        <Line n={5}>
          normalized <Op>=</Op> df.<Id>normalize</Id>(
          <Id>method</Id>
          <Op>=</Op>
          <Str>"total_protein"</Str>)
        </Line>
        <Line n={6}>
          <Id>link_hypothesis</Id>(<Str>"H-001"</Str>,{" "}
          <Id>evidence</Id>
          <Op>=</Op>normalized)
        </Line>
      </pre>
      <div className="px-4 py-2 border-t border-ink-900/6 bg-parchment-50 text-[11.5px] text-ink-600 font-mono flex items-center gap-3">
        <span className="text-emerald-700">✓</span> ran in 182 ms ·
        <span>df: 48 rows × 6 cols</span>·
        <span className="text-beacon-700">evidence logged to H-001</span>
      </div>
    </CellFrame>
  );
}

function DataFrameCell() {
  const cols = ["compound", "cell_line", "conc (µM)", "pEGFR", "EGFR", "ratio"];
  const rows = [
    ["osi", "HCC827 (WT)", "0.01", "1.0", "1.0", "1.00"],
    ["osi", "HCC827 (WT)", "0.1", "0.48", "0.99", "0.48"],
    ["osi", "HCC827 (WT)", "1.0", "0.12", "0.97", "0.12"],
    ["osi", "H1975 (T790M)", "0.01", "1.0", "1.0", "1.00"],
    ["osi", "H1975 (T790M)", "0.1", "0.92", "0.98", "0.94"],
    ["osi", "H1975 (T790M)", "1.0", "0.78", "0.95", "0.82"],
  ];
  return (
    <CellFrame
      kindLabel="dataframe output"
      kindTone="emerald"
      number="[2] out"
      provenance={
        <span className="text-ink-400">→ <span className="text-emerald-700">DS-002</span></span>
      }
    >
      <div className="overflow-auto">
        <table className="w-full font-mono text-[11.5px]">
          <thead>
            <tr className="bg-parchment-50 text-ink-500">
              {cols.map((c) => (
                <th key={c} className="text-left px-3 h-6 font-medium border-b border-ink-900/8">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-ink-900/6">
                {r.map((v, j) => (
                  <td key={j} className="px-3 h-6 tabular-nums text-ink-800">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="text-ink-400">
              <td className="px-3 h-6" colSpan={cols.length}>
                … 42 more rows
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CellFrame>
  );
}

function FigureCell() {
  return (
    <CellFrame
      kindLabel="figure · live-linked"
      kindTone="violet"
      number="[3]"
      provenance={
        <span className="inline-flex items-center gap-1 text-beacon-700">
          ↻ auto-updates with DS-002
        </span>
      }
      actions={
        <>
          <Btn>export</Btn>
          <Btn>link to figure 2A</Btn>
        </>
      }
    >
      <div className="px-6 py-5">
        <DoseResponseChart />
        <div className="mt-2 text-[11.5px] text-ink-500">
          Fig. · Dose-response of pEGFR/EGFR ratio in WT vs T790M cell lines
          under osimertinib. 4-parameter logistic fit; shaded 95% CI.{" "}
          <span className="text-ink-400">[caption auto-generated]</span>
        </div>
      </div>
    </CellFrame>
  );
}

function AgentCell() {
  return (
    <CellFrame
      kindLabel="agent query · analysis"
      kindTone="amber"
      number="[4]"
      provenance={
        <span className="inline-flex items-center gap-1 text-amber-700">
          <Sparkles className="h-3 w-3" /> ran 184 ms · 67 papers in context
        </span>
      }
    >
      <div className="px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] text-ink-500">prompt</span>
          <span className="text-[13px] text-ink-800">
            What does this blot pattern suggest about the mechanism?
          </span>
        </div>
        <div className="mt-3 rounded-md border border-amber-200/50 bg-amber-50/50 px-3 py-3 text-[13px] text-ink-800 leading-relaxed">
          The dose-dependent reduction in pEGFR in HCC827 (WT) with no
          equivalent reduction in H1975 (T790M) at matched concentrations
          suggests <b>competitive inhibition</b> rather than an allosteric
          mechanism. Pattern is consistent with{" "}
          <span className="text-beacon-700 cursor-pointer hover:underline">
            Smith '24 (Fig. 3B)
          </span>
          .
          <div className="mt-2 text-[11.5px] text-ink-500 font-mono">
            cites: Smith '24 · Okonkwo '24 · Jänne '26 ·{" "}
            <span className="text-amber-700">no contradicting sources</span>
          </div>
        </div>
      </div>
    </CellFrame>
  );
}

function ProtocolStepCell() {
  return (
    <CellFrame
      kindLabel="protocol step · WB_EGFR v3.2"
      kindTone="ink"
      number="step 4/8"
      provenance={
        <span className="text-ink-400">deviation tracking on</span>
      }
    >
      <div className="px-4 py-3 grid grid-cols-12 gap-4 items-start">
        <div className="col-span-8 text-[13px] text-ink-800 leading-relaxed">
          <b>Step 4 · Blocking.</b> Block membrane in 5% BSA in TBST for 1 h at
          RT with gentle agitation.
          <div className="mt-1 text-[11.5px] text-ink-500">
            alternatives: 5% non-fat milk (lower S/N for pEGFR per community
            data)
          </div>
        </div>
        <div className="col-span-4">
          <div className="rounded-md border border-ink-900/10 px-3 py-2 text-[11px] font-mono text-ink-600">
            <div className="flex justify-between"><span>started</span><span>14:18</span></div>
            <div className="flex justify-between"><span>eta</span><span>+60 min</span></div>
            <div className="flex justify-between"><span>deviation</span><span className="text-emerald-700">none</span></div>
          </div>
        </div>
      </div>
    </CellFrame>
  );
}

function AddCellBar() {
  return (
    <button className="w-full h-8 rounded-md border border-dashed border-ink-900/15 text-ink-500 hover:text-ink-700 hover:border-ink-900/25 text-[11.5px] font-mono inline-flex items-center justify-center gap-2">
      <Plus className="h-3 w-3" /> add cell · code · markdown · agent · figure · protocol step
    </button>
  );
}

/* -------------------- tiny atoms -------------------- */
function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex">
      <span className="w-8 pr-3 text-right text-[11px] text-ink-300 tabular-nums select-none">
        {n}
      </span>
      <span className="flex-1 whitespace-pre">{children}</span>
    </div>
  );
}
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-beacon-700">{children}</span>
);
const Id = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ink-900">{children}</span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span className="text-amber-800">{children}</span>
);
const Op = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ink-500">{children}</span>
);
const Cmt = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ink-400">{children}</span>
);

function Btn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-5 px-1.5 rounded inline-flex items-center gap-1 text-[10.5px] font-mono text-ink-600 hover:bg-ink-900/5">
      {children}
    </button>
  );
}

/* -------------------- figure -------------------- */
function DoseResponseChart() {
  const W = 760;
  const H = 220;
  const pad = 40;
  const xs = Array.from({ length: 40 }, (_, i) => i / 39);

  // WT: sharp sigmoid
  const wt = xs.map((x) => 1 / (1 + Math.exp(10 * (x - 0.35))));
  // T790M: shifted, shallower
  const mt = xs.map((x) => 1 / (1 + Math.exp(6 * (x - 0.72))));

  const toX = (x: number) => pad + x * (W - pad * 2);
  const toY = (y: number) => H - pad - y * (H - pad * 2);
  const path = (s: number[]) =>
    s.map((y, i) => `${i === 0 ? "M" : "L"} ${toX(xs[i])} ${toY(y)}`).join(" ");

  const xTicks = [0.01, 0.1, 1, 10];
  const yTicks = [0, 0.5, 1.0];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* gridlines */}
      {yTicks.map((t) => (
        <line
          key={t}
          x1={pad}
          y1={toY(t)}
          x2={W - pad}
          y2={toY(t)}
          stroke="#EEEEE9"
        />
      ))}
      {/* axes */}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#B8B8AC" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#B8B8AC" />
      {/* curves */}
      <path d={path(wt)} stroke="#2A58BE" strokeWidth={2} fill="none" />
      <path d={path(mt)} stroke="#B4315F" strokeWidth={2} fill="none" />
      {/* CI bands (simple) */}
      <path
        d={
          wt
            .map((y, i) => `${i === 0 ? "M" : "L"} ${toX(xs[i])} ${toY(Math.min(1, y + 0.04))}`)
            .join(" ") +
          " " +
          wt
            .map((y, i) => `L ${toX(xs[xs.length - 1 - i])} ${toY(Math.max(0, wt[xs.length - 1 - i] - 0.04))}`)
            .join(" ") +
          " Z"
        }
        fill="#2A58BE"
        fillOpacity={0.1}
      />
      {/* labels */}
      {xTicks.map((t, i) => (
        <text
          key={i}
          x={toX(i / (xTicks.length - 1))}
          y={H - pad + 14}
          fontSize={10}
          fill="#8E8E80"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
        >
          {t}
        </text>
      ))}
      {yTicks.map((t) => (
        <text
          key={t}
          x={pad - 8}
          y={toY(t) + 3}
          fontSize={10}
          fill="#8E8E80"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          {t.toFixed(1)}
        </text>
      ))}
      <text
        x={W - pad}
        y={pad - 8}
        fontSize={11}
        fill="#2A58BE"
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
      >
        HCC827 (WT)
      </text>
      <text
        x={W - pad}
        y={pad + 6}
        fontSize={11}
        fill="#B4315F"
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
      >
        H1975 (T790M)
      </text>
      <text
        x={W / 2}
        y={H - 6}
        fontSize={10}
        fill="#6B6B5E"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
      >
        [osimertinib] (µM, log scale)
      </text>
      <text
        x={12}
        y={H / 2}
        fontSize={10}
        fill="#6B6B5E"
        textAnchor="middle"
        transform={`rotate(-90, 12, ${H / 2})`}
        fontFamily="JetBrains Mono, monospace"
      >
        pEGFR / EGFR (normalised)
      </text>
    </svg>
  );
}
