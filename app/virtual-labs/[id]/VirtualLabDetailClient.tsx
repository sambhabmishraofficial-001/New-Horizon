"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Dot,
  Stat,
  Tag,
} from "@/components/ui/Primitives";
import { cn } from "@/lib/cn";
import {
  benchesForLab,
  getLab,
  LAB_AUDIT,
  sessionsForLab,
  type VirtualBench,
  type BenchStatus,
} from "@/lib/virtualLabs";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Cpu,
  FlaskConical,
  Network,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Users,
} from "lucide-react";

const TABS = ["Overview", "Benches", "Protocols", "Access"] as const;
type Tab = (typeof TABS)[number];

const BENCH_TONE: Record<
  BenchStatus,
  { tag: "beacon" | "emerald" | "amber" | "neutral" | "rose" | "violet"; dot: "beacon" | "emerald" | "amber" | "ink" | "rose" }
> = {
  running: { tag: "beacon", dot: "beacon" },
  idle: { tag: "neutral", dot: "ink" },
  reserved: { tag: "amber", dot: "amber" },
  calibrating: { tag: "violet", dot: "beacon" },
  offline: { tag: "rose", dot: "rose" },
};

export function VirtualLabDetailClient({ labId }: { labId: string }) {
  const lab = getLab(labId);
  const [tab, setTab] = React.useState<Tab>("Overview");
  const [benches, setBenches] = React.useState(() => benchesForLab(labId));

  if (!lab) {
    notFound();
  }

  const sessions = sessionsForLab(lab.id);
  const util =
    lab.benchesTotal > 0 ? Math.round((lab.benchesInUse / lab.benchesTotal) * 100) : 0;

  function reserveBench(benchId: string) {
    setBenches((prev) =>
      prev.map((b) =>
        b.id === benchId && b.status === "idle"
          ? {
              ...b,
              status: "reserved" as BenchStatus,
              twin: "You",
              protocol: "Ad-hoc run",
              step: "Starts on confirm",
            }
          : b
      )
    );
  }

  function releaseBench(benchId: string) {
    setBenches((prev) =>
      prev.map((b) =>
        b.id === benchId
          ? {
              ...b,
              status: "idle" as BenchStatus,
              twin: undefined,
              protocol: undefined,
              step: undefined,
              eta: undefined,
              utilPct: 0,
            }
          : b
      )
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link
            href="/virtual-labs"
            className="inline-flex items-center gap-1.5 hover:text-ink-900"
          >
            <ArrowLeft className="h-3 w-3" /> Virtual Labs
          </Link>
        }
        title={lab.name}
        lede={lab.description}
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setTab("Access")}>
              <Users className="h-3.5 w-3.5" /> Manage access
            </Button>
            <Link href="/ire">
              <Button>
                <SquareTerminal className="h-3.5 w-3.5" /> Open in IRE
              </Button>
            </Link>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Benches" value={`${lab.benchesInUse}/${lab.benchesTotal}`} delta={`${util}% in use`} tone="beacon" />
          <Stat label="Protocols" value={String(lab.protocolsCount)} delta="versioned · signed" />
          <Stat label="Runs · 24h" value={String(lab.runs24h)} delta={lab.computeBound} tone="neutral" />
          <Stat label="Invariants" value={lab.invariantHealth} delta="program health" tone="emerald" />
        </div>
      </PageHeader>

      <div className="px-8 border-b border-ink-900/8 bg-parchment-50/50">
        <div className="flex gap-1 p-1 max-w-[480px]">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 h-9 rounded-md text-[12.5px] font-medium transition-colors",
                tab === t
                  ? "bg-white text-ink-900 shadow-pane"
                  : "text-ink-600 hover:text-ink-900"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        {tab === "Overview" && <OverviewTab lab={lab} sessions={sessions} util={util} />}
        {tab === "Benches" && (
          <BenchesTab benches={benches} onReserve={reserveBench} onRelease={releaseBench} />
        )}
        {tab === "Protocols" && <ProtocolsTab labId={lab.id} count={lab.protocolsCount} />}
        {tab === "Access" && <AccessTab lab={lab} />}
      </div>
    </div>
  );
}

function OverviewTab({
  lab,
  sessions,
  util,
}: {
  lab: NonNullable<ReturnType<typeof getLab>>;
  sessions: ReturnType<typeof sessionsForLab>;
  util: number;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 lg:col-span-7 space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6 text-[13px]">
            <Meta label="Principal investigator" value={lab.pi} />
            <Meta label="Program" value={lab.program} />
            <Meta label="Domain" value={lab.domain} />
            <Meta label="Compute" value={lab.computeBound} />
            <Meta label="Status" value={lab.status} />
            <Meta label="Last activity" value={lab.lastActivity} />
          </div>
          <Divider className="my-5" />
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium mb-2">
            Bench utilisation
          </div>
          <div className="h-2 rounded-full bg-ink-900/8 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${util}%`, background: lab.color }}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Twins on duty"
            title="Assigned Research Twins"
            right={
              <Link href="/twins">
                <Button size="sm" variant="outline">
                  Assign <Plus className="h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          />
          {lab.twinsAssigned.length === 0 ? (
            <p className="px-6 pb-5 text-[13px] text-ink-500">No twins assigned yet.</p>
          ) : (
            <ul className="divide-y divide-ink-900/6">
              {lab.twinsAssigned.map((t) => (
                <li key={t} className="px-6 py-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[13px] text-ink-900">
                    <Sparkles className="h-4 w-4 text-beacon-600" />
                    {t}
                  </span>
                  <Tag tone="outline">on duty</Tag>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <aside className="col-span-12 lg:col-span-5 space-y-6">
        <Card>
          <CardHeader eyebrow="Live in this lab" title="Active sessions" />
          {sessions.length === 0 ? (
            <p className="px-6 pb-5 text-[13px] text-ink-500">No active sessions.</p>
          ) : (
            <ul className="divide-y divide-ink-900/6">
              {sessions.map((s) => (
                <li key={s.id} className="px-6 py-3">
                  <div className="text-[13px] text-ink-900">{s.bench}</div>
                  <div className="text-[11.5px] text-ink-500">
                    {s.protocol} · {s.twin}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-ink-900/8">
                    <div
                      className="h-full bg-beacon-500"
                      style={{ width: `${s.progressPct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader eyebrow="Audit" title="Lab event log" />
          <ul className="divide-y divide-ink-900/6 max-h-[240px] overflow-y-auto">
            {LAB_AUDIT.slice(0, 4).map((e) => (
              <li key={e.id} className="px-6 py-3">
                <div className="text-[11px] text-ink-500 font-mono">
                  {e.at} · {e.actor}
                </div>
                <div className="text-[13px] text-ink-900">{e.action}</div>
                <div className="text-[11.5px] text-ink-600">{e.detail}</div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/canvas">
            <Button variant="outline" className="w-full">
              <Network className="h-3.5 w-3.5" /> Canvas
            </Button>
          </Link>
          <Link href="/environments">
            <Button variant="outline" className="w-full">
              <FlaskConical className="h-3.5 w-3.5" /> Environments
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}

function BenchesTab({
  benches,
  onReserve,
  onRelease,
}: {
  benches: VirtualBench[];
  onReserve: (id: string) => void;
  onRelease: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        eyebrow="Instrument benches"
        title="Reserve, run, and release"
        right={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Add bench
          </Button>
        }
      />
      <div className="grid grid-cols-[1fr_1.2fr_100px_1fr_120px] gap-0 text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium px-5 py-2.5 border-b border-ink-900/8 bg-parchment-50">
        <div>Bench</div>
        <div>Instrument</div>
        <div>Status</div>
        <div>Assignment</div>
        <div className="text-right">Actions</div>
      </div>
      <ul>
        {benches.length === 0 ? (
          <li className="px-5 py-8 text-center text-[13px] text-ink-500">
            No benches provisioned yet.
          </li>
        ) : (
          benches.map((b) => {
            const tone = BENCH_TONE[b.status];
            return (
              <li
                key={b.id}
                className="grid grid-cols-[1fr_1.2fr_100px_1fr_120px] items-center px-5 py-3.5 border-b border-ink-900/6"
              >
                <div className="text-[13px] font-medium text-ink-900">{b.name}</div>
                <div className="text-[12px] text-ink-600 truncate pr-2">{b.instrument}</div>
                <div>
                  <Tag tone={tone.tag}>
                    <Dot tone={tone.dot} /> {b.status}
                  </Tag>
                </div>
                <div className="min-w-0 text-[12px] text-ink-600 truncate">
                  {b.twin ? (
                    <>
                      <span className="text-ink-900">{b.twin}</span>
                      {b.protocol && ` · ${b.protocol}`}
                      {b.step && (
                        <span className="block text-[11px] text-ink-500">{b.step}</span>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex justify-end gap-1.5">
                  {b.status === "idle" && (
                    <Button size="sm" variant="outline" onClick={() => onReserve(b.id)}>
                      Reserve
                    </Button>
                  )}
                  {(b.status === "reserved" || b.status === "running") && (
                    <Button size="sm" variant="outline" onClick={() => onRelease(b.id)}>
                      Release
                    </Button>
                  )}
                  {b.status === "running" && (
                    <Button size="sm">
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}

function ProtocolsTab({ labId, count }: { labId: string; count: number }) {
  const protocols = [
    { id: "p1", name: "Mg sweep v3.2", version: "3.2", signed: true, runs: 12 },
    { id: "p2", name: "Cleavage kinetics", version: "1.4", signed: true, runs: 8 },
    { id: "p3", name: "Mutant library prep", version: "2.0", signed: false, runs: 0 },
  ].slice(0, Math.max(Math.min(count, 3), 1));

  return (
    <Card className="overflow-hidden">
      <CardHeader
        eyebrow="Versioned methods"
        title="Protocols linked to this lab"
        right={
          <Button size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5" /> Import protocol
          </Button>
        }
      />
      <ul className="divide-y divide-ink-900/6">
        {protocols.map((p) => (
          <li key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-parchment-50/60">
            <div className="h-9 w-9 rounded-lg bg-ink-900/5 grid place-items-center">
              <FlaskConical className="h-4 w-4 text-ink-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-ink-900">{p.name}</div>
              <div className="text-[11.5px] text-ink-500">
                v{p.version} · {p.runs} runs in lab
              </div>
            </div>
            {p.signed ? (
              <Tag tone="emerald">
                <ShieldCheck className="h-3 w-3" /> signed
              </Tag>
            ) : (
              <Tag tone="amber">draft</Tag>
            )}
            <Button size="sm" variant="outline">
              Open <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </li>
        ))}
      </ul>
      <Divider />
      <div className="p-4 text-[12px] text-ink-500">
        Lab ID <span className="font-mono text-ink-700">{labId}</span> · protocols sync with
        Library and IRE
      </div>
    </Card>
  );
}

function AccessTab({ lab }: { lab: NonNullable<ReturnType<typeof getLab>> }) {
  const members = [
    { name: lab.pi, role: "PI · admin", email: "pi@helix.bio" },
    { name: "Jun Park", role: "Researcher", email: "jun@helix.bio" },
    { name: "Institute ops", role: "Auditor", email: "contact@newhorizon.dev" },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 lg:col-span-7 overflow-hidden">
        <CardHeader
          eyebrow="People & roles"
          title="Who can reserve benches and edit protocols"
          right={
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> Invite
            </Button>
          }
        />
        <ul className="divide-y divide-ink-900/6">
          {members.map((m) => (
            <li key={m.email} className="px-6 py-4 flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-ink-900 text-white text-[11px] font-medium grid place-items-center">
                {m.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="text-[14px] text-ink-900">{m.name}</div>
                <div className="text-[12px] text-ink-500">{m.email}</div>
              </div>
              <Tag tone="outline">{m.role}</Tag>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-5 p-6">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium">
          Compute binding
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-ink-900 text-parchment-50 grid place-items-center">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[14px] text-ink-900">{lab.computeBound}</div>
            <div className="text-[12px] text-ink-500">Dedicated to this lab</div>
          </div>
        </div>
        <Divider className="my-5" />
        <Button variant="outline" className="w-full">
          <Calendar className="h-3.5 w-3.5" /> Schedule maintenance window
        </Button>
      </Card>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">
        {label}
      </div>
      <div className="mt-1 text-ink-900">{value}</div>
    </div>
  );
}
