import { PageHeader } from "@/components/shell/PageHeader";
import {
  Card,
  CardHeader,
  Tag,
  Button,
  Divider,
  Dot,
  Sparkline,
  Stat,
  Kbd,
} from "@/components/ui/Primitives";
import {
  FlaskConical,
  Play,
  Pause,
  Plus,
  Trophy,
  Activity,
  Dices,
  Dna,
  CircuitBoard,
  ChevronRight,
  Gauge,
  Flag,
} from "lucide-react";

export default function EnvironmentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="In-silico environments"
        title="Let hypotheses play out. Reward what survives the invariants."
        lede="Environments are versioned, deterministic, and invariant-aware. Twins author reward functions; Quorum keeps them honest; rollouts feed Studio, Canvas, and the anomaly triage."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Leaderboard</Button>
            <Button>
              <Plus className="h-3.5 w-3.5" /> New rollout
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Environments" value="14" delta="3 authored this month" tone="neutral" />
          <Stat label="Rollouts · 24h" value="71" delta="184h compute" tone="beacon" />
          <Stat label="Best policy · K11" value="ε-12" delta="+3.2% vs. prior" tone="emerald" />
          <Stat label="Invariant violations" value="0.4%" delta="of 2.1M steps" tone="emerald" />
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        {/* Environments */}
        <section className="col-span-12 xl:col-span-7">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">Environments</h2>
            <div className="flex items-center gap-1.5">
              <Tag tone="outline">All programs</Tag>
              <Tag tone="outline">Determinism · seeded</Tag>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {ENVS.map((e) => (
              <Card key={e.id} className="p-5 hover:shadow-lift transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-ink-900 text-parchment-50 grid place-items-center">
                      <e.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display text-[16px] text-ink-900 leading-tight">
                        {e.name}
                      </div>
                      <div className="text-[11.5px] text-ink-500">{e.sub}</div>
                    </div>
                  </div>
                  <Tag tone={e.statusTone as any}>
                    <Dot tone={e.dot as any} /> {e.status}
                  </Tag>
                </div>

                <p className="mt-3 text-[12.5px] text-ink-700 leading-relaxed">
                  {e.desc}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                  <Mini label="Obs dim" value={e.obs} />
                  <Mini label="Action" value={e.action} />
                  <Mini label="Horizon" value={e.horizon} />
                </div>

                <Divider className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkline values={e.spark} width={110} height={22} color="#2A58BE" />
                    <div className="text-[11.5px] text-ink-600">
                      <span className="text-ink-900 font-medium tabular-nums">{e.best}</span> best reward
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Open <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Live rollout + leaderboard */}
        <section className="col-span-12 xl:col-span-5 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader
              eyebrow="Live rollout"
              title="Folding-RL · seed 7c3"
              subtitle="Policy: Kepler-ε-12 · 4×H100 · step 88 420 / 120 000"
              right={
                <div className="flex items-center gap-1.5">
                  <Tag tone="beacon"><Dot tone="beacon" /> running</Tag>
                  <Button size="sm" variant="outline">
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </Button>
                </div>
              }
            />
            <Divider />
            <div className="p-5">
              <RollProgress />
              <div className="mt-5 grid grid-cols-3 gap-3">
                <LiveStat label="Reward (ema)" value="0.871" delta="↑ 0.014" />
                <LiveStat label="KL to prior" value="0.042" delta="stable" />
                <LiveStat label="Invariant hits" value="12 / 12" delta="clean" emerald />
              </div>
              <Divider className="my-5" />
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium mb-2">
                Telemetry
              </div>
              <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-3 font-mono text-[11px] leading-relaxed text-ink-700">
                <div><span className="text-ink-400">[88 342]</span> reward μ = 0.868 · σ = 0.014</div>
                <div><span className="text-ink-400">[88 391]</span> invariant I-01 ✓ I-03 ✓</div>
                <div><span className="text-ink-400">[88 420]</span> Quorum audit: <span className="text-emerald-700">pass</span></div>
                <div className="caret"><span className="text-ink-400">[88 421]</span> step </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Leaderboard · Folding-RL"
              title="Policies, ranked by survival under invariants"
              right={<Tag tone="outline">last 30d</Tag>}
            />
            <ul className="divide-y divide-ink-900/6">
              {LEADERS.map((l, i) => (
                <li key={l.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-6 text-[12px] font-mono text-ink-500 tabular-nums text-right">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink-900">{l.id}</div>
                    <div className="text-[11.5px] text-ink-500">by {l.author} · {l.note}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] text-ink-900 tabular-nums">{l.reward}</div>
                    <div className="text-[10.5px] text-ink-500">reward</div>
                  </div>
                  <Tag tone={l.ok ? "emerald" : "amber"}>
                    {l.ok ? "invariants ✓" : "1 flag"}
                  </Tag>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}

function RollProgress() {
  const pct = 73.7;
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px] text-ink-600">
        <div className="inline-flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5" /> step 88 420
        </div>
        <div className="tabular-nums">{pct.toFixed(1)}% · ~11m remaining</div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-900/8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-beacon-500 to-signal-violet"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-4 h-28 rounded-md border border-ink-900/8 bg-parchment-50 relative overflow-hidden">
        <Sparkline
          values={Array.from({ length: 48 }, (_, i) => Math.sin(i / 4) * 3 + i * 0.2 + 5)}
          width={440}
          height={110}
          color="#2A58BE"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute top-1 left-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
          Reward trace
        </div>
      </div>
    </div>
  );
}

function LiveStat({
  label,
  value,
  delta,
  emerald,
}: {
  label: string;
  value: string;
  delta: string;
  emerald?: boolean;
}) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-white p-3">
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">
        {label}
      </div>
      <div className="text-[18px] font-display text-ink-900 tabular-nums">{value}</div>
      <div className={`text-[11px] ${emerald ? "text-emerald-700" : "text-ink-500"}`}>
        {delta}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-2">
      <div className="text-[9.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">
        {label}
      </div>
      <div className="text-[12px] text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}

const ENVS = [
  {
    id: "folding-rl",
    name: "Folding-RL",
    sub: "protein folding trajectory",
    icon: Dna,
    desc: "Learn policies that reach native fold states under energy monotonicity constraints.",
    status: "running",
    statusTone: "beacon",
    dot: "beacon",
    obs: "1024",
    action: "cont · 64",
    horizon: "256",
    best: "0.891",
    spark: [2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10, 11],
  },
  {
    id: "ribozyme-catalysis",
    name: "Ribozyme-Catalysis",
    sub: "cleavage kinetics",
    icon: FlaskConical,
    desc: "Active-learning environment for Mg²⁺ sweeps and mutant selection under I-02.",
    status: "queued",
    statusTone: "amber",
    dot: "amber",
    obs: "512",
    action: "discr · 12",
    horizon: "128",
    best: "0.742",
    spark: [3, 3, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9],
  },
  {
    id: "dose-response",
    name: "Dose-Response",
    sub: "titration search",
    icon: Activity,
    desc: "Sample-efficient dose-response curve estimation with falsification budget.",
    status: "idle",
    statusTone: "neutral",
    dot: "ink",
    obs: "128",
    action: "cont · 1",
    horizon: "48",
    best: "0.812",
    spark: [4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8],
  },
  {
    id: "xfer-k07",
    name: "Xfer-K07",
    sub: "cross-program transfer",
    icon: CircuitBoard,
    desc: "Mercator-instrumented environment to test whether K11 invariants transfer to K07.",
    status: "running",
    statusTone: "beacon",
    dot: "beacon",
    obs: "2048",
    action: "hybrid",
    horizon: "512",
    best: "0.683",
    spark: [1, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9],
  },
];

const LEADERS = [
  { id: "Kepler-ε-12", author: "Kepler", note: "institute finetune · lit-v3", reward: "0.891", ok: true },
  { id: "Kepler-ε-11", author: "Kepler", note: "prior checkpoint", reward: "0.863", ok: true },
  { id: "Halo-stub-4", author: "Halo-A", note: "symbolic-heavy policy", reward: "0.822", ok: true },
  { id: "Dovetail-guided-2", author: "Dovetail", note: "DOE shaping", reward: "0.807", ok: false },
  { id: "baseline-ppo", author: "—", note: "community baseline", reward: "0.741", ok: true },
];
