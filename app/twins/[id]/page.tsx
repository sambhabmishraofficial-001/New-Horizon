import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  Card,
  CardHeader,
  Tag,
  Button,
  Divider,
  Dot,
  Kbd,
  Sparkline,
} from "@/components/ui/Primitives";
import { TWINS } from "@/lib/twins";
import {
  ArrowLeft,
  CornerDownLeft,
  Sparkles,
  ShieldCheck,
  Cpu,
  FlaskConical,
  Network,
  Quote,
  BookOpen,
  Paperclip,
  Brain,
  CircleDot,
  GitBranch,
  ChevronRight,
} from "lucide-react";

export async function generateStaticParams() {
  return TWINS.map((t) => ({ id: t.id }));
}

export default function TwinDetail({ params }: { params: { id: string } }) {
  const twin = TWINS.find((t) => t.id === params.id);
  if (!twin) notFound();

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link
            href="/twins"
            className="inline-flex items-center gap-1.5 hover:text-ink-900"
          >
            <ArrowLeft className="h-3 w-3" /> Faculty
          </Link>
        }
        title={
          <div className="flex items-center gap-5">
            <div
              className="h-14 w-14 rounded-xl grid place-items-center text-white font-display text-[20px]"
              style={{ background: twin.color }}
            >
              {twin.mono}
            </div>
            <div>
              {twin.name}
              <span className="text-ink-400 font-normal"> · {twin.role}</span>
            </div>
          </div>
        }
        lede={twin.bio}
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <GitBranch className="h-3.5 w-3.5" /> Fork twin
            </Button>
            <Button>Assign to program</Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-10 pt-2 text-[13px]">
          <Meta label="Status" value={twin.status} />
          <Meta label="Lineage" value={twin.lineage} mono />
          <Meta label="Citations" value={twin.citations.toLocaleString()} />
          <Meta label="Agree rate" value={`${Math.round(twin.agreeRate * 100)}%`} />
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        {/* Left: Chat / reasoning chain */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader
              eyebrow="Reasoning chain · live"
              title="Mg²⁺ concentration bends cleavage rate non-linearly"
              subtitle="Halo-A is arguing with Kepler. Dovetail is listening for a falsification."
              right={
                <div className="flex items-center gap-1.5">
                  <Tag tone="emerald"><Dot tone="emerald" /> streaming</Tag>
                  <Button size="sm" variant="outline">
                    <Network className="h-3.5 w-3.5" /> Pin to canvas
                  </Button>
                </div>
              }
            />
            <Divider />
            <div className="p-5 space-y-4">
              {CHAIN.map((m, i) => (
                <Turn key={i} {...m} />
              ))}
              <div className="flex items-center gap-2 text-[12px] text-ink-500">
                <CircleDot className="h-3.5 w-3.5 animate-pulseSoft text-beacon-600" />
                Halo-A is composing a rebuttal with 3 citations…
              </div>
            </div>
            <Divider />
            <Composer />
          </Card>

          <Card>
            <CardHeader
              eyebrow="Instruments"
              title="What this twin can reach for"
              subtitle="Scoped at the program level · audited by Quorum"
            />
            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
              {INSTRUMENTS.map((i) => (
                <div
                  key={i.name}
                  className="rounded-lg border border-ink-900/8 bg-parchment-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-white border border-ink-900/8 grid place-items-center">
                      <i.icon className="h-3.5 w-3.5 text-ink-700" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] text-ink-900">{i.name}</div>
                      <div className="text-[11.5px] text-ink-500">{i.scope}</div>
                    </div>
                    <Tag tone={i.enabled ? "emerald" : "outline"}>
                      {i.enabled ? "enabled" : "off"}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: meta */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <Card>
            <CardHeader
              eyebrow="Invariants this twin honours"
              title="Rails for the mind"
            />
            <ul className="px-5 pb-5 space-y-2">
              {twin.invariants.map((inv) => (
                <li key={inv} className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 mt-0.5" />
                  <span className="text-[13px] text-ink-800 leading-snug">
                    {inv}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 mt-0.5" />
                <span className="text-[13px] text-ink-800 leading-snug">
                  Every assertion is either cited or marked{" "}
                  <span className="font-mono text-ink-900">
                    [speculation]
                  </span>
                  .
                </span>
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader eyebrow="Trace · last 40 exchanges" title="Signal of usefulness" />
            <div className="px-5 pb-5">
              <Sparkline
                values={[4,5,3,7,6,8,7,9,11,10,9,12,11,13,12,14,13,15]}
                width={280}
                height={56}
                color="#2A58BE"
              />
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11.5px]">
                <Mini label="Helpful" value="82%" hint="↑ 3 pts" />
                <Mini label="Challenged" value="14" hint="last 7d" />
                <Mini label="Overridden" value="2" hint="by PI" />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Lineage"
              title="How this twin came to be"
              subtitle="Fully auditable. Forkable."
            />
            <ol className="px-5 pb-5 space-y-3 relative">
              {LINEAGE.map((l, i) => (
                <li key={i} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-5 rounded-full bg-white border border-ink-900/15 grid place-items-center text-[10px] text-ink-700 font-medium">
                      {i + 1}
                    </div>
                    {i < LINEAGE.length - 1 && (
                      <div className="flex-1 w-px bg-ink-900/10 mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="text-[12.5px] text-ink-900">{l.title}</div>
                    <div className="text-[11px] text-ink-500 font-mono">{l.meta}</div>
                    <div className="text-[12px] text-ink-600 mt-0.5">{l.note}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Chain turns ---------------- */
type Turn = {
  who: "halo-a" | "kepler" | "dovetail" | "you" | "aletheia" | "quorum";
  kind: "claim" | "counter" | "propose" | "cite" | "note";
  text: string;
  cites?: string[];
  tool?: string;
};

const CHAIN: Turn[] = [
  {
    who: "halo-a",
    kind: "claim",
    text:
      "Mg²⁺ bends k_obs non-linearly. Two candidate mechanisms: saturation of the primary site, and recruitment of a secondary binding site near loop-3.",
    cites: ["Zhang ’25", "Okonkwo ’24"],
  },
  {
    who: "kepler",
    kind: "counter",
    text:
      "Structural contrast: I generated 16 loop-3 mutants. 11 abolish the non-linearity if (and only if) the second site is causal.",
    tool: "diffusion · ProtFold-δ",
  },
  {
    who: "dovetail",
    kind: "propose",
    text:
      "Falsification plan: 7-arm Mg²⁺ sweep × wild-type + loop-3 K7A. Expected information gain: 0.42 bits. Replicates N=5.",
    tool: "active-DOE",
  },
  {
    who: "quorum",
    kind: "note",
    text:
      "Pre-registered. Invariants I-01…I-04 will be audited on each arm. No silent drift permitted.",
  },
  {
    who: "you",
    kind: "note",
    text:
      "Tighten the DOE - give me an arm that would separate a cofactor artifact from a true site.",
  },
  {
    who: "dovetail",
    kind: "propose",
    text:
      "Added arm 8: EDTA titration at fixed Mg²⁺ (5 mM). Resolves cofactor vs. site in the regime where the two mechanisms coincide.",
    tool: "active-DOE",
  },
];

function Turn({ who, kind, text, cites, tool }: Turn) {
  const meta = AUTHORS[who];
  const kindTone: Record<string, any> = {
    claim: "beacon",
    counter: "violet",
    propose: "amber",
    cite: "outline",
    note: "outline",
  };
  return (
    <div className="flex gap-3">
      <div
        className="h-7 w-7 shrink-0 rounded-md grid place-items-center text-white text-[11px] font-medium shadow-pane"
        style={{ background: meta.color }}
      >
        {meta.mono}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11.5px] text-ink-500">
          <span className="text-ink-900 font-medium">{meta.name}</span>
          <span>·</span>
          <Tag tone={kindTone[kind]}>{kind}</Tag>
          {tool && (
            <>
              <span>·</span>
              <span className="font-mono text-[11px] text-ink-500">{tool}</span>
            </>
          )}
        </div>
        <div className="mt-1 text-[13.5px] text-ink-800 leading-relaxed">{text}</div>
        {cites && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {cites.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 text-[11px] text-beacon-700 hover:underline cursor-pointer"
              >
                <Quote className="h-3 w-3" /> {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const AUTHORS: Record<string, { name: string; mono: string; color: string }> = {
  "halo-a": {
    name: "Halo-A",
    mono: "HA",
    color: "linear-gradient(135deg,#1E4394,#5B3FB0)",
  },
  kepler: {
    name: "Kepler",
    mono: "K",
    color: "linear-gradient(135deg,#0E2258,#2A58BE)",
  },
  dovetail: {
    name: "Dovetail",
    mono: "D",
    color: "linear-gradient(135deg,#B9740C,#B4315F)",
  },
  quorum: {
    name: "Quorum",
    mono: "Q",
    color: "linear-gradient(135deg,#12785A,#3B6FE0)",
  },
  aletheia: {
    name: "Aletheia",
    mono: "A",
    color: "linear-gradient(135deg,#B4315F,#5B3FB0)",
  },
  you: {
    name: "You",
    mono: "JR",
    color: "linear-gradient(135deg,#111110,#34342E)",
  },
};

function Composer() {
  return (
    <div className="p-3">
      <div className="rounded-lg border border-ink-900/10 bg-white shadow-pane">
        <div className="px-3 pt-2 flex items-center gap-2">
          <Tag tone="outline"><Brain className="h-3 w-3" /> Neurosymbolic mode</Tag>
          <Tag tone="outline">Scope · Program K11</Tag>
          <Tag tone="outline">Budget · 120k tokens</Tag>
          <div className="ml-auto text-[11px] text-ink-500">
            Press <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to send · <Kbd>⌥</Kbd> <Kbd>↵</Kbd> to route
          </div>
        </div>
        <textarea
          placeholder="Ask, challenge, or propose. Twins cite, argue, and falsify - they don't answer."
          className="w-full px-3 py-2.5 bg-transparent outline-none text-[13.5px] placeholder:text-ink-400 resize-none"
          rows={2}
        />
        <div className="px-2 pb-2 flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-3.5 w-3.5" /> Attach dataset
          </Button>
          <Button variant="ghost" size="sm">
            <BookOpen className="h-3.5 w-3.5" /> Cite from Library
          </Button>
          <Button variant="ghost" size="sm">
            <FlaskConical className="h-3.5 w-3.5" /> Propose experiment
          </Button>
          <div className="ml-auto">
            <Button size="sm">
              Send <CornerDownLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const INSTRUMENTS = [
  { name: "Library", scope: "read · cite · cross-program", icon: BookOpen, enabled: true },
  { name: "Canvas", scope: "read · edit nodes", icon: Network, enabled: true },
  { name: "Studio", scope: "launch short runs (≤ 1h)", icon: Cpu, enabled: true },
  { name: "Environments", scope: "read-only rollouts", icon: FlaskConical, enabled: true },
  { name: "Invariants registry", scope: "read · propose new", icon: ShieldCheck, enabled: true },
  { name: "Faculty", scope: "propose twin → twin routing", icon: Sparkles, enabled: false },
];

const LINEAGE = [
  {
    title: "Foundation: gpt-λ-7",
    meta: "Apr 02 · public",
    note: "General-purpose reasoner. Chosen for counter-argument latency.",
  },
  {
    title: "Institutional SFT on 18k arguments",
    meta: "May 11 · internal",
    note: "Corpus: 1.2M citation pairs, 18k adversarial exchanges from the library.",
  },
  {
    title: "Program K11 fine-tune · lit-v3",
    meta: "Jul 04 · signed by Quorum",
    note: "Adds ribozyme literature + invariant-aware decoding. Calibrated ECE = 0.027.",
  },
];

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-400 font-medium">
        {label}
      </div>
      <div
        className={`text-ink-900 mt-1 ${
          mono ? "font-mono text-[12px]" : "text-[14px]"
        } truncate`}
      >
        {value}
      </div>
    </div>
  );
}

function Mini({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-2 font-marketing not-italic">
      <div className="font-marketing text-[9.5px] font-medium uppercase not-italic tracking-[0.14em] text-ink-500">
        {label}
      </div>
      <div className="font-marketing text-[12.5px] not-italic tabular-nums text-ink-900">
        {value}
      </div>
      {hint && (
        <div className="font-marketing text-[10px] not-italic text-ink-500">
          {hint}
        </div>
      )}
    </div>
  );
}
