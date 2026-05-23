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
} from "@/components/ui/Primitives";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Cpu,
  Building2,
  Key,
  Activity,
  ChevronRight,
  Globe2,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export default function FacultyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Faculty · Helix Bio Group"
        title="People, permissions, and compute - as one institute."
        lede="Researchers are first-class. Labs are first-class. Compute nodes are first-class. Everything is audited; nothing is implicit."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Roles & policy</Button>
            <Button>
              <UserPlus className="h-3.5 w-3.5" /> Enrol researcher
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Researchers" value="34" delta="3 joined this month" />
          <Stat label="Labs" value="6" delta="2 programs cross-lab" />
          <Stat label="Compute nodes" value="12" delta="8 in use" tone="beacon" />
          <Stat label="External fellows" value="9" delta="3 universities" />
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        <section className="col-span-12 xl:col-span-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">Labs</h2>
            <Tag tone="outline">6 labs · 7 programs</Tag>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {LABS.map((l) => (
              <Card key={l.id} className="p-5 hover:shadow-lift transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg text-white grid place-items-center font-display text-[15px] shadow-pane"
                      style={{ background: l.color }}
                    >
                      {l.mono}
                    </div>
                    <div>
                      <div className="font-display text-[16px] text-ink-900 leading-tight">
                        {l.name}
                      </div>
                      <div className="text-[11.5px] text-ink-500">
                        {l.pi} · {l.focus}
                      </div>
                    </div>
                  </div>
                  <Tag tone={l.tone as any}><Dot tone={l.dot as any} /> {l.state}</Tag>
                </div>
                <p className="mt-3 text-[12.5px] text-ink-700 leading-relaxed">
                  {l.desc}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                  <Mini label="Members" value={l.members} />
                  <Mini label="Programs" value={l.programs} />
                  <Mini label="Compute" value={l.compute} />
                </div>
                <Divider className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {l.avatars.map((a, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full bg-ink-900 text-white text-[10px] font-medium grid place-items-center ring-2 ring-white"
                        style={{ background: a.color }}
                      >
                        {a.m}
                      </div>
                    ))}
                    <div className="h-6 w-6 rounded-full bg-ink-100 text-ink-600 text-[10px] font-medium grid place-items-center ring-2 ring-white">
                      +{l.extra}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Open lab <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">Compute nodes</h2>
            <Tag tone="outline">Halo cluster · 12 nodes</Tag>
          </div>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1fr_90px_100px_120px_100px] gap-0 text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium px-5 py-2.5 border-b border-ink-900/8 bg-parchment-50">
              <div>Node</div>
              <div className="text-right">GPUs</div>
              <div className="text-right">Utilisation</div>
              <div>Bound to</div>
              <div className="text-right">Status</div>
            </div>
            <ul>
              {NODES.map((n) => (
                <li
                  key={n.name}
                  className="grid grid-cols-[1fr_90px_100px_120px_100px] items-center px-5 py-3 border-b border-ink-900/6"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-md bg-ink-900 text-parchment-50 grid place-items-center">
                      <Cpu className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] text-ink-900 truncate">{n.name}</div>
                      <div className="text-[11px] text-ink-500 font-mono truncate">{n.meta}</div>
                    </div>
                  </div>
                  <div className="text-right text-[12.5px] tabular-nums text-ink-800">
                    {n.gpus}
                  </div>
                  <div className="text-right">
                    <UtilBar pct={n.util} />
                  </div>
                  <div className="text-[12px] text-ink-700 truncate">{n.boundTo}</div>
                  <div className="text-right">
                    <Tag tone={n.tone as any}><Dot tone={n.dot as any} /> {n.state}</Tag>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="col-span-12 xl:col-span-4 space-y-6">
          <Card>
            <CardHeader eyebrow="Roles" title="Least privilege, by design" />
            <ul className="px-5 pb-5 space-y-2">
              {ROLES.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center gap-3 rounded-md border border-ink-900/8 bg-parchment-50 p-2.5"
                >
                  <div className="h-7 w-7 rounded-md bg-white border border-ink-900/8 grid place-items-center">
                    <r.icon className="h-3.5 w-3.5 text-ink-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink-900">{r.name}</div>
                    <div className="text-[11.5px] text-ink-500 truncate">{r.can}</div>
                  </div>
                  <div className="text-[11px] text-ink-500 tabular-nums">{r.count}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader eyebrow="Audit feed" title="Who did what" />
            <ul className="px-5 pb-5 space-y-3">
              {AUDIT.map((a, i) => (
                <li key={i} className="flex gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-ink-900 text-white text-[10px] font-medium grid place-items-center shrink-0">
                    {a.mono}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] text-ink-900">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-ink-600">{a.verb}</span>{" "}
                      <span className="font-mono text-[11.5px] text-ink-800">
                        {a.target}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-500">{a.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}

function UtilBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="h-1.5 w-16 rounded-full bg-ink-900/8 overflow-hidden">
        <div
          className="h-full bg-beacon-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11.5px] text-ink-700 tabular-nums w-8 text-right">{pct}%</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-2">
      <div className="text-[9.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">
        {label}
      </div>
      <div className="text-[12.5px] text-ink-900">{value}</div>
    </div>
  );
}

const LABS = [
  {
    id: "ribozyme",
    name: "Ribozyme Lab",
    pi: "PI · Jun Raman",
    focus: "Catalytic RNA · in-silico kinetics",
    mono: "RB",
    color: "linear-gradient(135deg,#1E4394,#5B3FB0)",
    state: "active",
    tone: "emerald",
    dot: "emerald",
    desc: "Anchors Program K11. Runs the mg-sweep branch with co-authoring twins Halo-A, Kepler, Dovetail.",
    members: "8",
    programs: "K11, K07",
    compute: "Halo-A,B",
    avatars: [
      { m: "JR", color: "#111110" },
      { m: "ZO", color: "#2A58BE" },
      { m: "MK", color: "#12785A" },
    ],
    extra: 5,
  },
  {
    id: "folding",
    name: "Folding Lab",
    pi: "PI · Mei Ko",
    focus: "Diffusion over structure",
    mono: "FL",
    color: "linear-gradient(135deg,#0E2258,#2A58BE)",
    state: "active",
    tone: "emerald",
    dot: "emerald",
    desc: "Curates ProtFold-δ and its institute finetunes. Kepler reports here for evaluation.",
    members: "6",
    programs: "K02, K07",
    compute: "Halo-C",
    avatars: [
      { m: "MK", color: "#12785A" },
      { m: "AR", color: "#5B3FB0" },
    ],
    extra: 4,
  },
  {
    id: "epistemic",
    name: "Epistemic Lab",
    pi: "PI · A. Raman",
    focus: "Invariants · argumentation",
    mono: "EL",
    color: "linear-gradient(135deg,#34342E,#6B6B5E)",
    state: "active",
    tone: "emerald",
    dot: "emerald",
    desc: "Owns Quorum and the invariants registry. Cross-cuts all programs.",
    members: "4",
    programs: "All",
    compute: "Halo-D (shared)",
    avatars: [
      { m: "AR", color: "#5B3FB0" },
      { m: "LP", color: "#B4315F" },
    ],
    extra: 2,
  },
  {
    id: "clinical",
    name: "Translational Lab",
    pi: "PI · S. Okafor",
    focus: "Dose-response · biomarkers",
    mono: "TL",
    color: "linear-gradient(135deg,#B9740C,#B4315F)",
    state: "cooldown",
    tone: "amber",
    dot: "amber",
    desc: "Scaling up K02 dose-response environment. Currently paused for invariant audit.",
    members: "5",
    programs: "K02",
    compute: "Halo-E",
    avatars: [
      { m: "SO", color: "#B9740C" },
      { m: "JT", color: "#B4315F" },
    ],
    extra: 3,
  },
];

const NODES = [
  { name: "halo-a", meta: "4× H100 · 80GB · NVLink", gpus: "4", util: 86, boundTo: "Kepler ε-12", state: "busy", tone: "beacon", dot: "beacon" },
  { name: "halo-b", meta: "4× H100 · 80GB · NVLink", gpus: "4", util: 62, boundTo: "Halo-A SFT", state: "busy", tone: "beacon", dot: "beacon" },
  { name: "halo-c", meta: "8× A100 · 40GB", gpus: "8", util: 12, boundTo: "-", state: "idle", tone: "neutral", dot: "ink" },
  { name: "halo-d", meta: "2× H100 · shared", gpus: "2", util: 48, boundTo: "Quorum audit", state: "busy", tone: "beacon", dot: "beacon" },
  { name: "halo-e", meta: "4× A100 · 80GB", gpus: "4", util: 0, boundTo: "maintenance", state: "down", tone: "rose", dot: "rose" },
];

const ROLES = [
  { name: "Principal Investigator", can: "sign off promotions · approve invariants", count: "4", icon: Briefcase },
  { name: "Researcher", can: "author hypotheses, runs, twins (scoped)", count: "22", icon: GraduationCap },
  { name: "Fellow", can: "read · propose · comment (external)", count: "9", icon: Globe2 },
  { name: "Quorum auditor", can: "audit-only · no writes", count: "2", icon: ShieldCheck },
];

const AUDIT = [
  { mono: "JR", who: "J. Raman", verb: "promoted", target: "Kepler ε-12 → production", when: "just now" },
  { mono: "AR", who: "A. Raman", verb: "accepted invariant", target: "I-07 candidate", when: "4 min ago" },
  { mono: "MK", who: "M. Ko", verb: "forked twin", target: "Kepler → Kepler-ko-2", when: "32 min ago" },
  { mono: "Q", who: "Quorum", verb: "audited", target: "Run #71a · arm 4", when: "1 h ago" },
  { mono: "SO", who: "S. Okafor", verb: "paused lab", target: "Translational (K02)", when: "3 h ago" },
];
