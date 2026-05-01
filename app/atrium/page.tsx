"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  Button,
  Dot,
} from "@/components/ui/Primitives";
import {
  ArrowUpRight,
  Sparkles,
  Telescope,
  AlertTriangle,
  CheckCircle2,
  CornerDownRight,
  X,
} from "lucide-react";

const DEMO_BANNER_KEY = "nh_demo_banner_dismissed";

export default function AtriumPage() {
  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Atrium · Program K11"
        title={
          <>
            <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
              Good morning, Jun.
              <span
                title="This is a public demo populated with a ribozyme catalysis program. Sign in to use your own data."
                className="inline-flex h-6 items-center rounded-full bg-ink-50 px-2.5 text-[10.5px] font-mono uppercase tracking-[0.12em] text-ink-600"
              >
                DEMO
              </span>
            </span>
            <br />
            <span className="text-ink-400">The institute is four moves from a testable claim.</span>
          </>
        }
        lede="Overnight, your twins refined twelve hypotheses, ruled out four with invariant checks, and surfaced two anomalies worth your attention."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">Resume standup</Button>
            <Button size="md">
              <Sparkles className="h-3.5 w-3.5" /> Summon a twin
            </Button>
          </div>
        }
      />

      <div className="px-10 py-14 max-w-[1180px]">
        <section>
          <SectionHeading
            title="Critical path"
            kicker="K11 · Ribozyme catalysis · branch mg-sweep"
            right={
              <Link href="/canvas" className="text-[13px] text-ink-600 hover:text-ink-900 inline-flex items-center gap-1">
                Open in Canvas <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CriticalPath />
        </section>

        <section className="mt-20 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading
              title="Today's discovery"
              kicker="Four items · ordered by decision value"
            />
            <ul className="divide-y divide-ink-900/8 border-t border-b border-ink-900/8">
              {FEED.map((f, i) => (
                <li key={i} className="py-6 first:pt-5 group">
                  <div className="flex items-baseline gap-3 text-[12px] text-ink-500">
                    <span className="text-ink-800 font-medium">{f.who}</span>
                    <span>{f.when}</span>
                    <span className="text-ink-300">·</span>
                    <span>{f.where}</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-[20px] leading-snug text-ink-900 max-w-[56ch]">
                    {f.title}
                  </h3>
                  {f.body && (
                    <p className="mt-2 text-[14px] text-ink-600 leading-relaxed max-w-[62ch]">
                      {f.body}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-[12.5px] text-ink-500">
                    {f.chips.map((c, j) => (
                      <span key={j} className="inline-flex items-center gap-1.5">
                        {c.dot && <Dot tone={c.dot as any} />}
                        {c.label}
                      </span>
                    ))}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-ink-600 inline-flex items-center gap-1">
                      <CornerDownRight className="h-3 w-3" /> Open
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col-span-12 lg:col-span-5 space-y-12">
            <div>
              <SectionHeading title="Twins on duty" kicker="Six of fourteen twins on duty" />
              <ul className="space-y-5">
                {TWINS.map((t) => (
                  <li key={t.name} className="flex items-start gap-3">
                    <div
                      className="h-8 w-8 rounded-md grid place-items-center text-white text-[11.5px] font-medium shrink-0"
                      style={{ background: t.color }}
                    >
                      {t.mono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <div className="text-[13.5px] text-ink-900">
                          {t.name}
                          <span className="text-ink-400 font-normal"> · {t.role}</span>
                        </div>
                        <span className="text-[11.5px] text-ink-500">{t.status}</span>
                      </div>
                      <div className="text-[12.5px] text-ink-500 mt-0.5 truncate">
                        {t.now}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/twins"
                className="inline-flex items-center gap-1 text-[13px] text-ink-600 hover:text-ink-900 mt-6"
              >
                Faculty directory <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div>
              <SectionHeading title="Invariants" kicker="412 of 418 holding" />
              <ul className="space-y-3.5 text-[13.5px]">
                {INVARIANTS.map((i) => (
                  <li key={i.id} className="flex items-baseline gap-3">
                    {i.ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 translate-y-0.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 translate-y-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-ink-800 leading-snug">{i.label}</div>
                      <div className="text-[11.5px] text-ink-400 font-mono mt-0.5">
                        {i.formula}
                      </div>
                    </div>
                    <span className="text-[11.5px] text-ink-400 tabular-nums">
                      {i.runs}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/invariants"
                className="inline-flex items-center gap-1 text-[13px] text-ink-600 hover:text-ink-900 mt-6"
              >
                Discovery lens <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function DemoBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(window.localStorage.getItem(DEMO_BANNER_KEY) !== "1");
  }, []);

  function dismiss() {
    window.localStorage.setItem(DEMO_BANNER_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="h-12 bg-ink-900 font-marketing not-italic text-parchment-50 border-b border-ink-950">
      <div className="h-full px-10 flex items-center justify-between gap-6 font-marketing text-[13px] not-italic">
        <div className="truncate font-marketing not-italic">
          <span className="font-mono uppercase tracking-[0.16em] text-parchment-100/70">VRI Demo</span>
          <span className="text-ink-400 mx-2">·</span>
          <span className="font-marketing not-italic">You're seeing K11, a ribozyme-catalysis program. Your institute would look like this.</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="font-marketing not-italic text-parchment-50/75 hover:text-parchment-50">
            ← Back to landing
          </Link>
          <span className="h-4 w-px bg-ink-700/40" />
          <Link href="/#request" className="font-marketing not-italic text-parchment-50/75 hover:text-parchment-50">
            Request Access
          </Link>
          <button
            type="button"
            aria-label="Dismiss demo banner"
            onClick={dismiss}
            className="ml-1 h-7 w-7 rounded-md grid place-items-center text-parchment-50/60 hover:text-parchment-50 hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  kicker,
  right,
}: {
  title: string;
  kicker?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-400 font-medium">
          {kicker}
        </div>
        <h2 className="font-display text-[26px] text-ink-900 leading-none mt-2">
          {title}
        </h2>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

function CriticalPath() {
  const reduceMotion = useReducedMotion();
  const [minutes, setMinutes] = React.useState(42);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setMinutes((m) => Math.max(1, m - 1));
    }, 60000);
    return () => window.clearInterval(interval);
  }, []);

  const steps = [
    {
      i: "I",
      label: "Hypothesis",
      title: "Mg²⁺ concentration bends cleavage rate non-linearly",
      state: "confirmed",
    },
    {
      i: "II",
      label: "Invariant",
      title: "Energy monotonicity across folding trajectory",
      state: "passing",
    },
    {
      i: "III",
      label: "Environment",
      title: "Folding-RL · seed 7c3 · 120k steps",
      state: "running",
    },
    {
      i: "IV",
      label: "Evidence",
      title: "Replicate N = 5. Report ready in ~42 minutes.",
      state: "queued",
    },
  ];
  const stateMeta: Record<string, { label: string; dot: any; tone: string }> = {
    confirmed: { label: "confirmed", dot: "emerald", tone: "text-emerald-700" },
    passing: { label: "passing", dot: "emerald", tone: "text-emerald-700" },
    running: { label: "running", dot: "beacon", tone: "text-beacon-700" },
    queued: { label: "queued", dot: "amber", tone: "text-amber-800" },
  };
  return (
    <div className="grid grid-cols-4 gap-8 border-t border-ink-900/8 pt-8">
      {steps.map((s) => {
        const m = stateMeta[s.state];
        return (
          <div key={s.i}>
            <div className="flex items-baseline gap-2">
              <div className="font-display text-[13px] text-ink-400 tabular-nums">
                {s.i}
              </div>
              <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-400 font-medium">
                {s.label}
              </div>
            </div>
            <h3 className="mt-3 font-display text-[17px] leading-snug text-ink-900 min-h-[3em]">
              {s.title}
            </h3>
            {s.state === "queued" && (
              <div className="mt-1 font-mono text-[11.5px] text-amber-700">
                Ready in ~{minutes} minutes
              </div>
            )}
            <div className={`mt-4 inline-flex items-center gap-1.5 text-[12px] ${m.tone}`}>
              {s.state === "running" && !reduceMotion ? (
                <motion.span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-beacon-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : (
                <Dot tone={m.dot} />
              )}
              {m.label}
            </div>
            {s.state === "running" && (
              <div className="mt-3 h-[2px] w-full bg-ink-900/8 overflow-hidden">
                {reduceMotion ? (
                  <div className="h-full w-[88%] bg-beacon-500" />
                ) : (
                  <motion.div
                    className="h-full bg-beacon-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 4, ease: "easeOut" }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const TWINS = [
  {
    name: "Halo-A",
    role: "Literature synthesist",
    mono: "HA",
    color: "#1F1F1B",
    now: "Drafting: counter-arguments to Zhang '25",
    status: "reasoning",
  },
  {
    name: "Quorum",
    role: "Invariant auditor",
    mono: "Q",
    color: "#12785A",
    now: "Checking energy monotonicity · 412 / 418",
    status: "passing",
  },
  {
    name: "Dovetail",
    role: "Experiment designer",
    mono: "D",
    color: "#B9740C",
    now: "Proposing Mg²⁺ sweep · 7 arms",
    status: "proposing",
  },
  {
    name: "Kepler",
    role: "Generative modeler",
    mono: "K",
    color: "#2A58BE",
    now: "Fine-tuning ProtFold-δ · epoch 7 of 12",
    status: "training",
  },
  {
    name: "Aletheia",
    role: "Anomaly triage",
    mono: "A",
    color: "#B4315F",
    now: "Two anomalies queued for your review",
    status: "awaiting",
  },
];

const INVARIANTS = [
  {
    id: "I-01",
    label: "Energy monotonic across folding trajectory",
    formula: "∀t. E(t+1) ≤ E(t) + ε",
    ok: true,
    runs: "23 / 23",
  },
  {
    id: "I-02",
    label: "Cleavage rate respects Mg²⁺ saturation",
    formula: "k_obs(c) = k_max · c / (K + c)",
    ok: true,
    runs: "23 / 23",
  },
  {
    id: "I-03",
    label: "Replicate variance within σ-band",
    formula: "σ(replicates) < 0.12",
    ok: false,
    runs: "21 / 23",
  },
  {
    id: "I-04",
    label: "Kepler predictions remain calibrated",
    formula: "ECE ≤ 0.03",
    ok: true,
    runs: "23 / 23",
  },
];

const FEED = [
  {
    who: "Aletheia",
    when: "08 min ago",
    where: "Run #71a · arm 4",
    title:
      "Replicate variance σ = 0.19 exceeds the invariant band in arm 4.",
    body:
      "Two candidate explanations. Pipetting artifact has been ruled out by Halo-B. A latent cofactor at 8 mM remains plausible; Dovetail has drafted a rebuttal experiment.",
    chips: [
      { label: "Invariant I-03", dot: "amber" },
      { label: "Review required", dot: "rose" },
    ],
  },
  {
    who: "Halo-A",
    when: "22 min ago",
    where: "Canvas · H-214",
    title:
      "Refined: Mg²⁺ bends k_obs non-linearly via a secondary site near loop-3.",
    body:
      "The argument chain references Zhang '25 (agrees) and Okonkwo '24 (disagrees). Kepler has proposed a loop-3 mutant that would discriminate the two.",
    chips: [
      { label: "H-214 → H-214.1", dot: "beacon" },
      { label: "Neurosymbolic", dot: null },
    ],
  },
  {
    who: "Folding-RL",
    when: "1 h ago",
    where: "seed 7c3",
    title:
      "Rollout converged at 120k steps. Reward trace stabilised within 3.2% of ceiling.",
    body:
      "Invariant guard held throughout. Kepler is consuming the trace for fine-tune checkpoint ε-12.",
    chips: [
      { label: "Converged", dot: "emerald" },
      { label: "Checkpoint ε-12", dot: null },
    ],
  },
  {
    who: "Quorum",
    when: "2 h ago",
    where: "Cross-program lens",
    title:
      "New invariant candidate: replicate variance correlates with buffer age (p < 0.01).",
    body:
      "Cross-checked against seven programs. If accepted, this becomes I-07 and will be audited on every run.",
    chips: [
      { label: "Candidate I-07", dot: "beacon" },
      { label: "Cross-program", dot: null },
    ],
  },
];
