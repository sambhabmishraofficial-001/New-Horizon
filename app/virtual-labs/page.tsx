"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LAB_AUDIT,
  LAB_SESSIONS,
  VIRTUAL_LABS,
  type LabStatus,
  type VirtualLab,
} from "@/lib/virtualLabs";
import {
  ChevronRight,
  Filter,
  Microscope,
  Plus,
  Search,
  Calendar,
  LayoutGrid,
  Play,
  Pause,
  Sparkles,
  X,
} from "lucide-react";

type FilterKey = "all" | LabStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All labs" },
  { key: "active", label: "Active" },
  { key: "idle", label: "Idle" },
  { key: "provisioning", label: "Provisioning" },
  { key: "maintenance", label: "Maintenance" },
];

const STATUS_TONE: Record<
  LabStatus,
  { tag: "beacon" | "emerald" | "amber" | "neutral" | "rose"; dot: "beacon" | "emerald" | "amber" | "ink" | "rose" }
> = {
  active: { tag: "beacon", dot: "beacon" },
  idle: { tag: "neutral", dot: "ink" },
  provisioning: { tag: "amber", dot: "amber" },
  maintenance: { tag: "rose", dot: "rose" },
};

export default function VirtualLabsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [showCreate, setShowCreate] = React.useState(false);
  const [labs, setLabs] = React.useState(VIRTUAL_LABS);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    domain: "",
    program: "K11",
  });

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return labs.filter((lab) => {
      if (filter !== "all" && lab.status !== filter) return false;
      if (!q) return true;
      return (
        lab.name.toLowerCase().includes(q) ||
        lab.domain.toLowerCase().includes(q) ||
        lab.pi.toLowerCase().includes(q) ||
        lab.program.toLowerCase().includes(q)
      );
    });
  }, [labs, query, filter]);

  const benchesInUse = labs.reduce((n, l) => n + l.benchesInUse, 0);
  const benchesTotal = labs.reduce((n, l) => n + l.benchesTotal, 0);
  const activeLabs = labs.filter((l) => l.status === "active").length;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    const id = createForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const newLab: VirtualLab = {
      id: id || `lab-${Date.now()}`,
      slug: id,
      name: createForm.name.trim(),
      domain: createForm.domain.trim() || "General",
      pi: "You",
      program: createForm.program,
      status: "provisioning",
      description: "New virtual lab - benches and twins will be assigned during provisioning.",
      color: "#475569",
      mono: createForm.name.slice(0, 2).toUpperCase(),
      benchesTotal: 4,
      benchesInUse: 0,
      twinsAssigned: [],
      computeBound: "pending",
      protocolsCount: 0,
      runs24h: 0,
      invariantHealth: "-",
      lastActivity: "just now",
      icon: Microscope,
    };
    setLabs((prev) => [newLab, ...prev]);
    setShowCreate(false);
    setCreateForm({ name: "", domain: "", program: "K11" });
    router.push(`/virtual-labs/${newLab.id}`);
  }

  return (
    <div className="relative">
      <PageHeader
        eyebrow="Virtual Labs · Institute"
        title="Your digital lab spaces - benches, instruments, and live runs."
        lede="Each virtual lab mirrors a physical or in-silico program: protocol versions, twin assignments, compute bindings, and invariant health - all auditable from Lattice."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setFilter("active")}>
              <Filter className="h-3.5 w-3.5" /> Active only
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-3.5 w-3.5" /> New virtual lab
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-12 pt-2">
          <Stat label="Virtual labs" value={String(labs.length)} delta={`${activeLabs} active`} tone="neutral" />
          <Stat
            label="Benches in use"
            value={`${benchesInUse}/${benchesTotal}`}
            delta={`${Math.round((benchesInUse / benchesTotal) * 100) || 0}% utilisation`}
            tone="beacon"
          />
          <Stat label="Live sessions" value={String(LAB_SESSIONS.length)} delta="3 twins orchestrating" tone="beacon" />
          <Stat label="Runs · 24h" value="57" delta="across all labs" tone="emerald" />
        </div>
      </PageHeader>

      <div className="px-8 py-6 border-b border-ink-900/8 bg-parchment-50/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 h-11 px-3.5 rounded-lg border border-ink-900/10 bg-white max-w-[520px]">
            <Search className="h-4 w-4 text-ink-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-ink-400"
              placeholder="Search labs, PI, program, domain…"
              aria-label="Search virtual labs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-ink-400 hover:text-ink-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "h-8 px-3 rounded-md text-[12.5px] font-medium transition-colors",
                  filter === f.key
                    ? "bg-ink-900 text-parchment-50"
                    : "bg-white border border-ink-900/10 text-ink-600 hover:text-ink-900"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        <section className="col-span-12 xl:col-span-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-[22px] text-ink-900">
              Labs
              <span className="ml-2 text-[15px] font-normal text-ink-500">
                {filtered.length} shown
              </span>
            </h2>
            <Tag tone="outline">
              <LayoutGrid className="h-3 w-3" /> Institute-wide
            </Tag>
          </div>

          {filtered.length === 0 ? (
            <Card className="p-10 text-center">
              <Microscope className="h-10 w-10 text-ink-300 mx-auto" />
              <p className="mt-4 text-[15px] text-ink-600">No labs match your search.</p>
              <Button className="mt-4" variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          )}
        </section>

        <aside className="col-span-12 xl:col-span-4 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader
              eyebrow="Live sessions"
              title="Benches running now"
              right={<Tag tone="beacon"><Dot tone="beacon" /> {LAB_SESSIONS.length} active</Tag>}
            />
            <ul className="divide-y divide-ink-900/6">
              {LAB_SESSIONS.map((s) => (
                <li key={s.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate">{s.labName}</div>
                      <div className="text-[11.5px] text-ink-500 truncate">
                        {s.bench} · {s.protocol}
                      </div>
                    </div>
                    <Tag tone="outline">{s.twin}</Tag>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-ink-900/8 overflow-hidden">
                    <div
                      className="h-full bg-beacon-500"
                      style={{ width: `${s.progressPct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10.5px] text-ink-500">
                    <span>Started {s.started}</span>
                    <span className="tabular-nums">{s.progressPct}%</span>
                  </div>
                </li>
              ))}
            </ul>
            <Divider />
            <div className="p-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Pause className="h-3.5 w-3.5" /> Pause all
              </Button>
              <Button size="sm" className="flex-1">
                <Play className="h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Institute audit" title="Recent lab events" />
            <ul className="divide-y divide-ink-900/6 max-h-[280px] overflow-y-auto">
              {LAB_AUDIT.map((e) => (
                <li key={e.id} className="px-5 py-3">
                  <div className="flex items-baseline gap-2 text-[11px] text-ink-500">
                    <span className="font-mono tabular-nums">{e.at}</span>
                    <span>{e.actor}</span>
                  </div>
                  <div className="text-[13px] text-ink-900 mt-0.5">{e.action}</div>
                  <div className="text-[11.5px] text-ink-600 mt-0.5">{e.detail}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 bg-parchment-50/80">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium">
              Quick actions
            </div>
            <ul className="mt-3 space-y-2">
              <QuickLink href="/ire" label="Open IRE workspace" />
              <QuickLink href="/environments" label="In-silico environments" />
              <QuickLink href="/canvas" label="Link bench to Canvas" />
              <QuickLink href="/twins" label="Assign a Research Twin" />
            </ul>
          </Card>
        </aside>
      </div>

      {showCreate && (
        <CreateLabModal
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

function LabCard({ lab }: { lab: VirtualLab }) {
  const Icon = lab.icon;
  const tone = STATUS_TONE[lab.status];
  const util =
    lab.benchesTotal > 0 ? Math.round((lab.benchesInUse / lab.benchesTotal) * 100) : 0;

  return (
    <Card className="p-5 hover:shadow-lift transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-10 w-10 rounded-lg text-white grid place-items-center font-display text-[14px] shrink-0"
            style={{ background: lab.color }}
          >
            {lab.mono}
          </div>
          <div className="min-w-0">
            <div className="font-display text-[16px] text-ink-900 leading-tight truncate">
              {lab.name}
            </div>
            <div className="text-[11.5px] text-ink-500 truncate">
              {lab.pi} · {lab.program} · {lab.domain}
            </div>
          </div>
        </div>
        <Tag tone={tone.tag}>
          <Dot tone={tone.dot} /> {lab.status}
        </Tag>
      </div>

      <p className="mt-3 text-[12.5px] text-ink-700 leading-relaxed line-clamp-2">{lab.description}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        <Mini label="Benches" value={`${lab.benchesInUse}/${lab.benchesTotal}`} />
        <Mini label="Protocols" value={String(lab.protocolsCount)} />
        <Mini label="Invariants" value={lab.invariantHealth} />
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[10.5px] text-ink-500 mb-1">
          <span>Utilisation</span>
          <span className="tabular-nums">{util}%</span>
        </div>
        <div className="h-1 rounded-full bg-ink-900/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${util}%`, background: lab.color }}
          />
        </div>
      </div>

      {lab.twinsAssigned.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lab.twinsAssigned.map((t) => (
            <Tag key={t} tone="outline">
              <Sparkles className="h-3 w-3" /> {t}
            </Tag>
          ))}
        </div>
      )}

      <Divider className="my-4" />

      <div className="flex items-center justify-between">
        <div className="text-[11px] text-ink-500">Last activity · {lab.lastActivity}</div>
        <Link href={`/virtual-labs/${lab.id}`}>
          <Button size="sm" variant="outline">
            Open lab <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-2">
      <div className="text-[9.5px] uppercase tracking-[0.14em] text-ink-500 font-medium">{label}</div>
      <div className="text-[12px] text-ink-900 tabular-nums truncate">{value}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between text-[13px] text-ink-700 hover:text-ink-900 py-1"
      >
        {label}
        <ChevronRight className="h-3.5 w-3.5 text-ink-400" />
      </Link>
    </li>
  );
}

function CreateLabModal({
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  form: { name: string; domain: string; program: string };
  onChange: (v: typeof form) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-labelledby="create-lab-title"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div id="create-lab-title" className="font-display text-[20px] text-ink-900">
              New virtual lab
            </div>
            <div className="text-[13px] text-ink-500 mt-1">
              Provisioning creates benches and links to your program charter.
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-ink-400 hover:text-ink-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field
            label="Lab name"
            value={form.name}
            onChange={(name) => onChange({ ...form, name })}
            placeholder="e.g. Metabolomics Core"
            required
          />
          <Field
            label="Domain"
            value={form.domain}
            onChange={(domain) => onChange({ ...form, domain })}
            placeholder="e.g. Metabolomics"
          />
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium">Program</span>
            <select
              value={form.program}
              onChange={(e) => onChange({ ...form, program: e.target.value })}
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-ink-900/10 bg-white text-[14px] outline-none focus:border-ink-900/25"
            >
              {["K11", "K07", "K14", "K03", "X01", "Multi"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Calendar className="h-3.5 w-3.5" /> Provision lab
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full h-10 px-3 rounded-lg border border-ink-900/10 bg-white text-[14px] outline-none focus:border-ink-900/25"
      />
    </label>
  );
}
