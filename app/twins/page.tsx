import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button, Kbd, Dot } from "@/components/ui/Primitives";
import { TWINS } from "@/lib/twins";
import { Search, Plus, ArrowUpRight } from "lucide-react";

const STATUS_META: Record<
  string,
  { label: string; dot: any; tone: string }
> = {
  reasoning: { label: "Reasoning", dot: "beacon", tone: "text-beacon-700" },
  training: { label: "Training", dot: "beacon", tone: "text-beacon-700" },
  passing: { label: "Passing", dot: "emerald", tone: "text-emerald-700" },
  awaiting: { label: "Awaiting you", dot: "rose", tone: "text-rose-700" },
  proposing: { label: "Proposing", dot: "amber", tone: "text-amber-800" },
  idle: { label: "Idle", dot: "ink", tone: "text-ink-500" },
};

export default function TwinsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Faculty"
        title="Summon a co-scientist. Argue with it until it breaks."
        lede="Each twin is a scoped AI investigator with instruments, invariants, and a lineage. Twins don't answer - they argue, cite, and propose falsifiable experiments."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Twin codex</Button>
            <Button>
              <Plus className="h-3.5 w-3.5" /> Enrol a twin
            </Button>
          </div>
        }
      />

      <div className="px-10 py-12 max-w-[1180px]">
        <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-ink-900/10 bg-white mb-10 max-w-[560px]">
          <Search className="h-3.5 w-3.5 text-ink-400" />
          <input
            className="bg-transparent outline-none text-[13.5px] flex-1 placeholder:text-ink-400"
            placeholder="Search twins by role, instrument, lineage…"
          />
          <Kbd>/</Kbd>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {TWINS.map((t) => {
            const s = STATUS_META[t.status];
            return (
              <li key={t.id}>
                <Link href={`/twins/${t.id}`} className="group block">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="h-10 w-10 rounded-md grid place-items-center text-white font-display text-[15px]"
                      style={{ background: t.color }}
                    >
                      {t.mono}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 text-[12px] ${s.tone}`}>
                      <Dot tone={s.dot} />
                      {s.label}
                    </div>
                  </div>
                  <div className="font-display text-[22px] text-ink-900 leading-tight">
                    {t.name}
                    <span className="text-ink-400 font-normal"> · {t.role}</span>
                  </div>
                  <p className="mt-3 text-[13.5px] text-ink-600 leading-relaxed line-clamp-3">
                    {t.bio}
                  </p>
                  <div className="mt-4 pt-4 border-t border-ink-900/8 grid grid-cols-3 gap-4 text-[12px] text-ink-500">
                    <Meta label="Citations" value={t.citations.toLocaleString()} />
                    <Meta label="Agree rate" value={`${Math.round(t.agreeRate * 100)}%`} />
                    <Meta label="Lineage" value={t.lineage.split(" · ")[0]} mono />
                  </div>
                  <div className="mt-4 text-[13px] text-ink-500 inline-flex items-center gap-1 group-hover:text-ink-900 transition-colors">
                    Open twin <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

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
        className={`text-ink-800 mt-1 ${
          mono ? "font-mono text-[11.5px]" : "tabular-nums text-[13px]"
        } truncate`}
      >
        {value}
      </div>
    </div>
  );
}
