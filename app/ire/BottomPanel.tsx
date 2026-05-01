"use client";

import * as React from "react";
import {
  Terminal,
  AlertTriangle,
  Activity,
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Tab = "output" | "runs" | "problems" | "terminal";

export function BottomPanel({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}) {
  const [tab, setTab] = React.useState<Tab>("output");

  return (
    <div
      className={cn(
        "shrink-0 border-t border-ink-900/8 bg-parchment-50 flex flex-col min-h-0 transition-[height]",
        collapsed ? "h-8" : "h-[240px]"
      )}
    >
      <div className="h-8 shrink-0 flex items-center border-b border-ink-900/8 bg-parchment-100">
        <div className="flex items-center">
          <TabBtn active={tab === "output"} onClick={() => { setTab("output"); setCollapsed(false); }}>
            <Activity className="h-3 w-3" /> Output
          </TabBtn>
          <TabBtn active={tab === "runs"} onClick={() => { setTab("runs"); setCollapsed(false); }}>
            Runs <Counter n={2} tone="beacon" />
          </TabBtn>
          <TabBtn active={tab === "problems"} onClick={() => { setTab("problems"); setCollapsed(false); }}>
            <AlertTriangle className="h-3 w-3" /> Problems <Counter n={2} tone="rose" />
          </TabBtn>
          <TabBtn active={tab === "terminal"} onClick={() => { setTab("terminal"); setCollapsed(false); }}>
            <Terminal className="h-3 w-3" /> Terminal
          </TabBtn>
          <TabBtn active={false} onClick={() => { setTab("output"); setCollapsed(false); }}>
            <MessageSquare className="h-3 w-3" /> Aletheia <Counter n={1} tone="amber" />
          </TabBtn>
        </div>
        <div className="ml-auto flex items-center gap-1 pr-2">
          <IconBtn title={collapsed ? "Expand" : "Collapse"} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </IconBtn>
          <IconBtn title="Close">
            <X className="h-3 w-3" />
          </IconBtn>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 min-h-0 overflow-auto bg-ink-950 text-parchment-100 font-mono text-[12px] leading-[1.75] px-4 py-3">
          {tab === "output" && <Output />}
          {tab === "runs" && <RunsList />}
          {tab === "problems" && <Problems />}
          {tab === "terminal" && <TerminalView />}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 inline-flex items-center gap-1.5 text-[11.5px] font-mono border-b-2 transition-colors",
        active
          ? "border-ink-900 text-ink-900 bg-parchment-50"
          : "border-transparent text-ink-500 hover:text-ink-800"
      )}
    >
      {children}
    </button>
  );
}

function IconBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="h-5 w-5 grid place-items-center rounded hover:bg-ink-900/6 text-ink-500"
    >
      {children}
    </button>
  );
}

function Counter({ n, tone }: { n: number; tone: "beacon" | "rose" | "amber" }) {
  const tones = {
    beacon: "bg-beacon-500 text-white",
    rose: "bg-rose-600 text-white",
    amber: "bg-amber-500 text-white",
  };
  return (
    <span className={cn("inline-grid place-items-center min-w-[16px] h-4 rounded-full text-[9.5px] px-1 font-mono", tones[tone])}>
      {n}
    </span>
  );
}

/* ------------ Output ------------ */
function Output() {
  const lines: { t: string; k?: "info" | "warn" | "err" | "ok"; tag?: string }[] = [
    { t: "Reloaded kepler-ε-12 checkpoint", k: "info", tag: "studio" },
    { t: "Invariant I-01 (energy monotonic) — 88 340 / 88 340 ✓", k: "ok", tag: "quorum" },
    { t: "Invariant I-03 (σ < 0.12) — band exceeded in arm 4 (σ = 0.19)", k: "err", tag: "quorum" },
    { t: "Cone of explanations ranked → A-071a/4", k: "warn", tag: "aletheia" },
    { t: "Rebuttal run drafted: E-8 EDTA titration at 5 mM", k: "info", tag: "dovetail" },
    { t: "Pre-registered. Awaiting PI sign-off.", k: "info", tag: "quorum" },
    { t: "folding-rl.env · step 88 420 / 120 000 · reward_ema 0.871", k: "info", tag: "env" },
    { t: "Halo-A composing counter-argument against Zhang '25…", k: "info", tag: "halo-a" },
  ];
  return (
    <>
      {lines.map((l, i) => {
        const toneCls =
          l.k === "err"
            ? "text-rose-300"
            : l.k === "warn"
            ? "text-amber-200"
            : l.k === "ok"
            ? "text-emerald-300"
            : "text-parchment-100";
        return (
          <div key={i}>
            <span className="text-ink-500">[{String(i + 1).padStart(3, "0")}]</span>{" "}
            {l.tag && <span className="text-beacon-300">{l.tag}</span>}{" "}
            <span className={toneCls}>{l.t}</span>
          </div>
        );
      })}
      <div className="caret text-parchment-100">
        <span className="text-ink-500">[009]</span>{" "}
      </div>
    </>
  );
}

/* ------------ Runs list ------------ */
function RunsList() {
  const runs = [
    { id: "run-71a · arm 4", state: "ANOMALY", tone: "text-rose-300", when: "now" },
    { id: "folding-rl · seed 7c3", state: "STEP 88420 / 120000", tone: "text-beacon-300", when: "now" },
    { id: "halo-a-sft · lit-v4", state: "EPOCH 7 / 12", tone: "text-beacon-300", when: "42m" },
    { id: "quorum · recalibration", state: "PASSED", tone: "text-emerald-300", when: "3h" },
    { id: "kepler-ε-11 · redo", state: "FLAGGED (I-03)", tone: "text-rose-300", when: "5h" },
  ];
  return (
    <>
      {runs.map((r) => (
        <div key={r.id} className="flex items-baseline">
          <span className="text-ink-400 w-12">{r.when}</span>
          <span className="flex-1">{r.id}</span>
          <span className={cn("font-mono", r.tone)}>{r.state}</span>
        </div>
      ))}
    </>
  );
}

/* ------------ Problems (anomalies) ------------ */
function Problems() {
  const items = [
    {
      sev: "error",
      path: "k11/runs/run-71a.run",
      line: 4,
      col: 8,
      msg: "Invariant I-03 broken — σ(replicates) = 0.19 > 0.12 in arm 4",
      hint: "candidate causes: cofactor · pipetting · buffer age",
    },
    {
      sev: "warn",
      path: "k07/runs/run-69c.run",
      line: 11,
      col: null,
      msg: "Kepler calibration drift — ECE = 0.041 > 0.03",
      hint: "distribution shift since lot-71a ingestion",
    },
  ];
  return (
    <>
      {items.map((p, i) => (
        <div key={i} className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className={cn(p.sev === "error" ? "text-rose-300" : "text-amber-200")}>
              {p.sev === "error" ? "✗" : "!"}
            </span>
            <span className="text-beacon-300">{p.path}</span>
            <span className="text-ink-400">
              {p.line}:{p.col ?? "—"}
            </span>
            <span className="text-parchment-100">{p.msg}</span>
          </div>
          <div className="text-ink-400 pl-5">↳ {p.hint}</div>
        </div>
      ))}
    </>
  );
}

/* ------------ Terminal ------------ */
function TerminalView() {
  return (
    <>
      <div><span className="text-emerald-300">horizon</span><span className="text-ink-400">@k11</span>:<span className="text-beacon-300">~/mg-sweep</span>$ horizon run E-8 --dry-run</div>
      <div className="text-ink-300">Planning experiment E-8 (EDTA titration at 5 mM Mg²⁺)…</div>
      <div className="text-ink-300">· Invariant guards: I-01, I-03, I-04</div>
      <div className="text-ink-300">· Twins: dovetail, quorum</div>
      <div className="text-ink-300">· Expected info gain: 0.31 bits</div>
      <div className="text-emerald-300">✓ Plan is executable. 7 arms · N=5 · eta 42 min.</div>
      <div className="caret"><span className="text-emerald-300">horizon</span><span className="text-ink-400">@k11</span>:<span className="text-beacon-300">~/mg-sweep</span>$ </div>
    </>
  );
}
