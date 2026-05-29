import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  FlaskConical,
  GitBranch,
  Microscope,
  Network,
  Sparkles,
  SquareActivity,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

const labSections = [
  {
    title: "Programs",
    href: "/ire",
    description:
      "Long-running research tracks with hypotheses, protocols, and review gates kept in one institute graph.",
    icon: GitBranch,
    meta: "8 active threads",
  },
  {
    title: "Twins",
    href: "/twins",
    description:
      "Specialized AI researchers assigned to literature, experiment design, analysis, and critique.",
    icon: Sparkles,
    meta: "Faculty layer",
  },
  {
    title: "Environments",
    href: "/environments",
    description:
      "In-silico benches for rollouts, reward models, simulations, and instrument-aware workflows.",
    icon: FlaskConical,
    meta: "Live sandboxes",
  },
  {
    title: "Library",
    href: "/library",
    description:
      "Datasets, papers, protocols, notebooks, and generated artifacts indexed for reproducible work.",
    icon: BookOpen,
    meta: "Source-linked",
  },
];

const dispatchRows = [
  ["K11", "Protein design loop", "screening", "92% traceable"],
  ["K07", "Literature contradiction map", "review", "31 claims"],
  ["K14", "Cell-state simulator", "running", "6 rollouts"],
  ["X01", "Protocol transfer audit", "queued", "4 labs"],
];

const releases = [
  {
    label: "Evaluation",
    title: "Co-science task sheets",
    copy: "Benchmark prompts for measuring whether a research twin can preserve assumptions, surface uncertainty, and hand back useful work.",
  },
  {
    label: "Agent",
    title: "Aletheia investigation flow",
    copy: "A structured investigator loop for gathering context, building a claim map, and proposing the next experimental move.",
  },
  {
    label: "System",
    title: "Lattice provenance layer",
    copy: "A graph-native record of how a result moved from source material to hypothesis, protocol, run, and conclusion.",
  },
];

export default function LabsPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav />

      <main className="bg-white">
        <section className="border-b border-ink-900/8 bg-white">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 pb-20 pt-12 sm:px-10 sm:pb-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:pt-16">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                New Horizon Labs
              </div>
              <h1 className="mt-5 max-w-[9ch] font-editorial text-[56px] leading-[0.98] text-ink-900 sm:text-[76px]">
                Labs for co-science.
              </h1>
              <p className="mt-6 max-w-[48ch] !font-light text-[16px] leading-[1.7] text-ink-600 sm:text-[18px]">
                A public-facing workbench for the systems New Horizon is
                testing: research twins, virtual labs, evaluations, model
                notes, and reproducible artifacts.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/virtual-labs" className="btn-xai btn-xai-primary">
                  Open virtual labs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/blog" className="btn-xai btn-xai-secondary">
                  Read notes <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <LabConsole />
          </div>
        </section>

        <section className="bg-parchment-50/35">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
            <div className="mb-10 flex flex-col justify-between gap-4 border-b border-ink-900/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                  Index
                </div>
                <h2 className="mt-3 font-editorial text-[38px] leading-[1.05] text-ink-900 sm:text-[48px]">
                  What the lab is publishing.
                </h2>
              </div>
              <p className="max-w-[42ch] text-[14.5px] leading-[1.7] text-ink-600">
                Each area points into a working part of the institute, so the
                page stays closer to a lab bench than a brochure.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {labSections.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-lg border border-ink-900/8 bg-white p-5 transition-colors hover:border-ink-900/18"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg border border-ink-900/10 bg-white text-ink-900">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="font-editorial text-[23px] leading-tight text-ink-900">
                            {item.title}
                          </h3>
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                            {item.meta}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 text-ink-300 transition-colors group-hover:text-ink-900" />
                    </div>
                    <p className="mt-4 max-w-[56ch] text-[14px] leading-[1.7] text-ink-600">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Research dispatch
              </div>
              <h2 className="mt-3 max-w-[12ch] font-editorial text-[38px] leading-[1.05] text-ink-900 sm:text-[48px]">
                Current work, not just claims.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.75] text-ink-600">
                The labs page frames experiments as operating records:
                what is being tested, which systems are involved, and where
                the evidence is stored.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-ink-900/10 bg-white">
              <div className="grid grid-cols-[0.7fr_1.4fr_0.8fr_0.8fr] border-b border-ink-900/10 bg-parchment-50/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                <span>Track</span>
                <span>Workstream</span>
                <span>Status</span>
                <span>Signal</span>
              </div>
              {dispatchRows.map(([track, workstream, status, signal]) => (
                <div
                  key={track}
                  className="grid grid-cols-[0.7fr_1.4fr_0.8fr_0.8fr] items-center border-b border-ink-900/7 px-4 py-4 last:border-b-0"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
                    {track}
                  </span>
                  <span className="text-[14px] text-ink-900">
                    {workstream}
                  </span>
                  <span className="text-[12px] capitalize text-ink-600">
                    {status}
                  </span>
                  <span className="text-[12px] text-ink-500">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-ink-900/8 bg-parchment-50/35">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
            <div className="max-w-[58ch]">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Releases
              </div>
              <h2 className="mt-3 font-editorial text-[38px] leading-[1.05] text-ink-900 sm:text-[48px]">
                Small releases from the institute floor.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {releases.map((release) => (
                <article
                  key={release.title}
                  className="rounded-lg border border-ink-900/8 bg-white p-5"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                    {release.label}
                  </div>
                  <h3 className="mt-4 font-editorial text-[24px] leading-[1.08] text-ink-900">
                    {release.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.7] text-ink-600">
                    {release.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function LabConsole() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-ink-900/12 bg-white shadow-editorial">
      <div className="flex h-11 items-center justify-between border-b border-ink-900/10 bg-parchment-50/70 px-4">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          labs.newhorizon.dev
        </div>
      </div>

      <div className="grid min-h-[430px] gap-0 lg:grid-cols-[0.76fr_1fr]">
        <div className="border-b border-ink-900/8 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            <SquareActivity className="h-3.5 w-3.5" />
            Live bench map
          </div>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }, (_, index) => {
              const active = [1, 4, 7, 12, 16, 18, 22].includes(index);
              return (
                <span
                  key={index}
                  className={[
                    "aspect-square rounded-[5px] border",
                    active
                      ? "border-beacon-500/35 bg-beacon-50 shadow-[0_0_0_1px_rgba(59,111,224,0.14)]"
                      : "border-ink-900/8 bg-parchment-50/70",
                  ].join(" ")}
                />
              );
            })}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <ConsoleStat label="runs" value="47" />
            <ConsoleStat label="sources" value="1.2k" />
            <ConsoleStat label="twins" value="12" />
            <ConsoleStat label="audits" value="99%" />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            <Network className="h-3.5 w-3.5" />
            Knowledge trace
          </div>
          <div className="mt-6 space-y-4">
            <TraceRow
              icon={Microscope}
              title="Experiment request"
              copy="Generate a candidate protocol for a low-sample validation run."
            />
            <TraceRow
              icon={Boxes}
              title="Artifact binding"
              copy="Attach paper set, dataset hash, and constraint notes before execution."
            />
            <TraceRow
              icon={Sparkles}
              title="Twin critique"
              copy="Flag missing controls, confidence breaks, and next-step branches."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsoleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-white p-3">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400">
        {label}
      </div>
      <div className="mt-1 text-[22px] leading-none text-ink-900">{value}</div>
    </div>
  );
}

function TraceRow({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Microscope;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-ink-900/8 bg-parchment-50/45 p-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-ink-700 shadow-pane">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="font-editorial text-[20px] leading-tight text-ink-900">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">{copy}</p>
      </div>
    </div>
  );
}
