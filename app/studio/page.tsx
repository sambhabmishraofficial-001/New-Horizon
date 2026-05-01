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
  Cpu,
  Plus,
  GitBranch,
  Database,
  Sparkles,
  BookOpen,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Layers,
  Settings2,
  LineChart,
} from "lucide-react";

export default function StudioPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Model Studio"
        title="Train, fine-tune, and argue with your models."
        lede="Studio is opinionated: every run is tied to a hypothesis, audited against invariants, and emits artifacts consumable by Canvas and Twins. No orphan experiments."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Compare runs</Button>
            <Button>
              <Plus className="h-3.5 w-3.5" /> New training
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Active runs" value="6" delta="2 queued" tone="beacon" />
          <Stat label="GPU hours · 24h" value="184" delta="Halo-A · 4×H100" tone="neutral" />
          <Stat label="Artifacts" value="231" delta="checkpoints + evals" tone="neutral" />
          <Stat label="Invariant audit" value="100%" delta="pre-promotion" tone="emerald" />
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        {/* Run list */}
        <section className="col-span-12 xl:col-span-7">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">Runs</h2>
            <div className="flex items-center gap-1.5">
              <Tag tone="outline">All programs</Tag>
              <Tag tone="outline">Status · any</Tag>
              <Tag tone="outline">Twin · any</Tag>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1fr_90px_100px_110px] gap-0 text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium px-5 py-2.5 border-b border-ink-900/8 bg-parchment-50">
              <div>Run</div>
              <div>Tied to</div>
              <div className="text-right">ETA</div>
              <div className="text-right">Δ metric</div>
              <div className="text-right">Status</div>
            </div>
            <ul>
              {RUNS.map((r) => (
                <li
                  key={r.id}
                  className="grid grid-cols-[1.2fr_1fr_90px_100px_110px] items-center px-5 py-3.5 border-b border-ink-900/6 hover:bg-parchment-50/60 transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-ink-900 text-parchment-50 grid place-items-center">
                        <r.icon className="h-3 w-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] text-ink-900 truncate">
                          {r.name}
                        </div>
                        <div className="text-[11px] text-ink-500 font-mono truncate">
                          {r.meta}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="text-[12.5px] text-ink-800 truncate">{r.hypothesis}</div>
                    <div className="text-[11px] text-ink-500 flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> {r.branch}
                    </div>
                  </div>
                  <div className="text-right text-[12px] text-ink-700 tabular-nums">
                    <Clock className="inline h-3 w-3 text-ink-400 mr-1" />
                    {r.eta}
                  </div>
                  <div className="text-right">
                    <div className="text-[12.5px] text-ink-900 tabular-nums">{r.delta}</div>
                    <Sparkline values={r.spark} width={70} height={14} color={r.color} className="ml-auto" />
                  </div>
                  <div className="text-right">
                    <StatusTag s={r.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Right: Focus run */}
        <section className="col-span-12 xl:col-span-5 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader
              eyebrow="Run in focus · Kepler ε-12 fine-tune"
              title="ProtFold-δ · K11 lit-v3"
              subtitle="Tied to H-214.1 · audited by Quorum · proposed by Dovetail"
              right={<Tag tone="beacon"><Dot tone="beacon" /> epoch 7/12</Tag>}
            />
            <Divider />
            <div className="p-5 space-y-4">
              <Param label="Base" value="ProtFold-δ-base · 1.2B params" mono />
              <Param label="Dataset" value="kinetics-lot-71a · 2.4k traces · signed" mono />
              <Param label="Objective" value="contrastive + invariant-aware decoding" />
              <Param label="Schedule" value="cosine · peak 3e-5 · 3% warmup" />
              <Divider />
              <div>
                <div className="flex items-center justify-between text-[11.5px] text-ink-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" /> Loss · val
                  </span>
                  <span className="tabular-nums">0.184 → 0.141</span>
                </div>
                <Sparkline
                  values={[2.0, 1.7, 1.45, 1.22, 1.05, 0.9, 0.8, 0.72, 0.61, 0.52, 0.45, 0.38]}
                  width={440}
                  height={56}
                  color="#5B3FB0"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Mini label="ECE" value="0.027" hint="invariant ✓" ok />
                <Mini label="KL to base" value="0.044" />
                <Mini label="Eval Δ" value="+3.2%" ok />
              </div>
            </div>
            <Divider />
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="text-[11.5px] text-ink-500">
                Promotion gated by <span className="text-ink-800 font-medium">Quorum</span> · invariants I-04, I-06
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline">
                  <BookOpen className="h-3.5 w-3.5" /> Run card
                </Button>
                <Button size="sm">
                  <ChevronRight className="h-3.5 w-3.5" /> Inspect
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Data lineage"
              title="What trained this model"
              right={<Tag tone="emerald">signed</Tag>}
            />
            <ol className="px-5 pb-5 space-y-3">
              <Lineage
                icon={Database}
                title="kinetics-lot-71a"
                note="2.4k traces · SHA 3f…a9c · signed by PI"
              />
              <Lineage
                icon={Layers}
                title="preprocess · v4"
                note="detrend · outlier gate · I-03 aware"
              />
              <Lineage
                icon={Sparkles}
                title="contrastive pairs · Kepler-gen"
                note="loop-3 mutants · 16 candidates"
              />
              <Lineage
                icon={Settings2}
                title="invariant-aware decoding"
                note="penalty λ = 0.04 · I-01 enforced"
              />
            </ol>
          </Card>
        </section>
      </div>
    </div>
  );
}

function StatusTag({ s }: { s: string }) {
  if (s === "running")
    return <Tag tone="beacon"><Dot tone="beacon" /> running</Tag>;
  if (s === "queued")
    return <Tag tone="amber"><Dot tone="amber" /> queued</Tag>;
  if (s === "passed")
    return (
      <Tag tone="emerald">
        <CheckCircle2 className="h-3 w-3" /> passed
      </Tag>
    );
  if (s === "flagged")
    return (
      <Tag tone="rose">
        <AlertTriangle className="h-3 w-3" /> flagged
      </Tag>
    );
  return <Tag>{s}</Tag>;
}

function Param({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-24 text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium pt-0.5">
        {label}
      </div>
      <div className={`text-[12.5px] text-ink-800 flex-1 ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  hint,
  ok,
}: {
  label: string;
  value: string;
  hint?: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-2">
      <div className="text-[9.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">
        {label}
      </div>
      <div
        className={`text-[13px] ${
          ok ? "text-emerald-700" : "text-ink-900"
        } tabular-nums`}
      >
        {value}
      </div>
      {hint && <div className="text-[10px] text-ink-500">{hint}</div>}
    </div>
  );
}

function Lineage({
  icon: Icon,
  title,
  note,
}: {
  icon: any;
  title: string;
  note: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="h-7 w-7 rounded-md bg-white border border-ink-900/8 grid place-items-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-ink-700" />
      </div>
      <div>
        <div className="text-[12.5px] text-ink-900">{title}</div>
        <div className="text-[11.5px] text-ink-500 font-mono">{note}</div>
      </div>
    </li>
  );
}

const RUNS = [
  {
    id: "kepler-e12",
    name: "Kepler ε-12",
    meta: "protfold-δ · k11/mg-sweep · 4×H100",
    hypothesis: "H-214.1 · loop-3 secondary site",
    branch: "k11/mg-sweep",
    eta: "42 m",
    delta: "+3.2%",
    spark: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    color: "#5B3FB0",
    status: "running",
    icon: Cpu,
  },
  {
    id: "halo-sft",
    name: "Halo-A SFT · lit-v4",
    meta: "gpt-λ-7 · 18k arguments · 2×H100",
    hypothesis: "Argumentation robustness",
    branch: "lit/v4",
    eta: "1 h 12 m",
    delta: "+1.1%",
    spark: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
    color: "#2A58BE",
    status: "running",
    icon: BookOpen,
  },
  {
    id: "quorum-calib",
    name: "Quorum · recalibration",
    meta: "neurosymbolic-core-2 · invariant audit",
    hypothesis: "I-06 drift patch",
    branch: "main",
    eta: "12 m",
    delta: "ECE ↓0.01",
    spark: [5, 4, 4, 3, 3, 3, 2, 2, 2, 2],
    color: "#12785A",
    status: "passed",
    icon: Sparkles,
  },
  {
    id: "dovetail-plan",
    name: "Dovetail planner-ω",
    meta: "RLHF on 2.1k proposals · 1×H100",
    hypothesis: "Experiment falsifiability",
    branch: "planner/v5",
    eta: "3 h",
    delta: "+0.4 bits IG",
    spark: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
    color: "#B4315F",
    status: "queued",
    icon: Activity,
  },
  {
    id: "kepler-e11-redo",
    name: "Kepler ε-11 · redo",
    meta: "rerun after lot swap",
    hypothesis: "H-214 baseline",
    branch: "k11/main",
    eta: "—",
    delta: "flag I-03",
    spark: [6, 5, 6, 7, 6, 7, 8, 7, 6, 5],
    color: "#B4315F",
    status: "flagged",
    icon: Cpu,
  },
];
