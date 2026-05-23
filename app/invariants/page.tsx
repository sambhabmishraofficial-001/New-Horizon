import { PageHeader } from "@/components/shell/PageHeader";
import {
  Card,
  CardHeader,
  Tag,
  Button,
  Divider,
  Dot,
  Sparkline,
  Kbd,
  Stat,
} from "@/components/ui/Primitives";
import {
  ShieldCheck,
  AlertTriangle,
  Telescope,
  ChevronRight,
  Plus,
  GitCompare,
  Clock,
  Sparkles,
  FlaskConical,
  TrendingDown,
  Hash,
} from "lucide-react";

export default function InvariantsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Discovery lens"
        title="Invariants are what refuses to change. Anomalies are what should."
        lede="Every run, across every program, is audited against a living registry of invariants. When the world says something different, Aletheia surfaces it - with a cone of explanations and a ranked decision value."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Compare programs</Button>
            <Button>
              <Plus className="h-3.5 w-3.5" /> Propose invariant
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Under audit" value="418" delta="across 7 programs" tone="neutral" />
          <Stat label="Holding" value="412" delta="98.6%" tone="emerald" />
          <Stat label="Under review" value="4" delta="quorum requested" tone="beacon" />
          <Stat label="Open anomalies" value="2" delta="1 high decision-value" tone="rose" />
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        {/* Invariants registry */}
        <section className="col-span-12 xl:col-span-7">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">Invariants registry</h2>
            <div className="flex items-center gap-1.5">
              <Tag tone="outline">All programs</Tag>
              <Tag tone="outline">Status · any</Tag>
              <Tag tone="outline">Since · 30d</Tag>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium px-5 py-2.5 border-b border-ink-900/8 bg-parchment-50">
              <div className="w-14">ID</div>
              <div>Invariant</div>
              <div className="text-right pr-6">Runs</div>
              <div className="text-right w-24">Status</div>
            </div>
            <ul>
              {INVARIANTS.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-0 items-center px-5 py-3 border-b border-ink-900/6 hover:bg-parchment-50/60 transition-colors"
                >
                  <div className="w-14">
                    <span className="font-mono text-[11px] text-ink-600">{i.id}</span>
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="text-[13px] text-ink-900 leading-snug truncate">
                      {i.label}
                    </div>
                    <div className="text-[11.5px] text-ink-500 font-mono truncate">
                      {i.formula}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {i.tags.map((t) => (
                        <Tag key={t} tone="outline">{t}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="text-right pr-6 text-[12.5px] tabular-nums text-ink-700">
                    {i.runs}
                  </div>
                  <div className="text-right w-24">
                    {i.status === "holding" && (
                      <Tag tone="emerald"><Dot tone="emerald" /> holding</Tag>
                    )}
                    {i.status === "review" && (
                      <Tag tone="beacon"><Dot tone="beacon" /> review</Tag>
                    )}
                    {i.status === "breaking" && (
                      <Tag tone="rose"><Dot tone="rose" /> breaking</Tag>
                    )}
                    {i.status === "candidate" && (
                      <Tag tone="violet"><Dot tone="beacon" /> candidate</Tag>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Anomalies */}
        <section className="col-span-12 xl:col-span-5 space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-[22px] text-ink-900">Anomaly triage</h2>
              <Tag tone="rose">
                <Dot tone="rose" /> 2 awaiting
              </Tag>
            </div>
            <div className="space-y-4">
              {ANOMALIES.map((a) => (
                <Card key={a.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11.5px] text-ink-500">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      <span className="font-mono text-ink-700">{a.id}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      <span>{a.when}</span>
                      <span>·</span>
                      <span>{a.where}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-ink-700">
                        <TrendingDown className="h-3 w-3" />
                        decision value{" "}
                        <span className="text-ink-900 font-medium tabular-nums">
                          {a.decisionValue}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 text-[14px] text-ink-900 leading-snug">
                      {a.title}
                    </div>
                    <div className="mt-1 text-[12.5px] text-ink-600 leading-relaxed">
                      Violated <span className="font-mono text-ink-900">{a.invariant}</span>{" "}
                      - {a.violation}
                    </div>

                    <div className="mt-3 rounded-md border border-ink-900/8 bg-parchment-50 p-3">
                      <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium mb-2">
                        Cone of explanations
                      </div>
                      <ul className="space-y-1.5">
                        {a.explanations.map((e, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[12.5px]">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ink-400" />
                            <span className="text-ink-800 leading-snug flex-1">
                              {e.text}
                            </span>
                            <span className="text-[10.5px] tabular-nums text-ink-500">
                              p = {e.p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-ink-900/8 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11.5px] text-ink-500">
                      <Sparkles className="h-3.5 w-3.5 text-beacon-600" />
                      Drafted by{" "}
                      <span className="text-ink-800 font-medium">Aletheia</span> · reviewed
                      by{" "}
                      <span className="text-ink-800 font-medium">Dovetail</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                      <Button variant="outline" size="sm">
                        <FlaskConical className="h-3.5 w-3.5" /> Rebuttal run
                      </Button>
                      <Button size="sm">
                        Open <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader
              eyebrow="Invariant of the week"
              title="I-07 · Buffer age correlates with replicate variance"
              subtitle="Candidate. Cross-program support from K11, K07, K02 (p < 0.01)."
              right={<Tag tone="violet">neurosymbolic</Tag>}
            />
            <div className="px-5 pb-5">
              <div className="font-mono text-[12px] text-ink-800 bg-parchment-50 border border-ink-900/8 rounded-md p-3">
                <Hash className="inline h-3 w-3 text-ink-400 mr-1" />
                <span className="text-beacon-700">forall</span> run ∈ programs.{" "}
                <span className="text-ink-900">corr(age(buffer), σ(replicates))</span> {" "}
                &lt; 0.12
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[11.5px] text-ink-500">Proposed by Quorum · audited on 142 runs</div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline">Challenge</Button>
                  <Button size="sm"><ShieldCheck className="h-3.5 w-3.5" /> Accept</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

const INVARIANTS: Array<{
  id: string;
  label: string;
  formula: string;
  runs: string;
  status: "holding" | "review" | "breaking" | "candidate";
  tags: string[];
}> = [
  {
    id: "I-01",
    label: "Energy monotonicity across folding trajectory",
    formula: "∀t. E(t+1) ≤ E(t) + ε",
    runs: "238 / 238",
    status: "holding",
    tags: ["symbolic", "physics"],
  },
  {
    id: "I-02",
    label: "Cleavage rate respects Mg²⁺ saturation",
    formula: "k_obs(c) = k_max · c / (K + c)",
    runs: "112 / 112",
    status: "holding",
    tags: ["ribozyme", "kinetics"],
  },
  {
    id: "I-03",
    label: "Replicate variance within σ-band",
    formula: "σ(replicates) < 0.12",
    runs: "21 / 23",
    status: "breaking",
    tags: ["experimental", "audit"],
  },
  {
    id: "I-04",
    label: "Kepler predictions remain calibrated",
    formula: "ECE ≤ 0.03",
    runs: "47 / 47",
    status: "holding",
    tags: ["learned", "calibration"],
  },
  {
    id: "I-05",
    label: "Every claim is cited or marked [speculation]",
    formula: "∀claim ∈ library. cited ∨ marked",
    runs: "∞",
    status: "holding",
    tags: ["epistemic"],
  },
  {
    id: "I-06",
    label: "No silent drift in Kepler embeddings",
    formula: "‖μ_t − μ_0‖ < 0.08",
    runs: "47 / 47",
    status: "review",
    tags: ["drift", "learned"],
  },
  {
    id: "I-07",
    label: "Buffer age ⊥ replicate variance",
    formula: "corr(age, σ) < 0.12",
    runs: "142 / 142",
    status: "candidate",
    tags: ["cross-program", "proposed"],
  },
];

const ANOMALIES = [
  {
    id: "A-071a/4",
    when: "8 min ago",
    where: "K11 · Run #71a · arm 4 (Mg²⁺ 8 mM)",
    title: "Replicate variance spikes to σ = 0.19 in arm 4 only.",
    invariant: "I-03",
    violation: "band threshold is σ < 0.12.",
    decisionValue: "0.81",
    explanations: [
      {
        text: "Latent cofactor at 8 mM (loop-3 recruitment of an unmodeled ion).",
        p: "0.46",
      },
      {
        text: "Pipetting artifact on lot 71a (volumetric drift).",
        p: "0.19",
      },
      {
        text: "Buffer age - supports candidate invariant I-07.",
        p: "0.28",
      },
    ],
  },
  {
    id: "A-069c",
    when: "2 h ago",
    where: "K07 · Run #69c · full sweep",
    title: "Kepler calibration drifts at epoch 11 (ECE = 0.041).",
    invariant: "I-04",
    violation: "ECE threshold is 0.03.",
    decisionValue: "0.64",
    explanations: [
      {
        text: "Training distribution shifted after new lot 71a data was ingested.",
        p: "0.52",
      },
      {
        text: "Temperature miscalibration - routine fix with recalibration pass.",
        p: "0.31",
      },
    ],
  },
];
