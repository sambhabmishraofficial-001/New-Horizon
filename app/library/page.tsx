import { PageHeader } from "@/components/shell/PageHeader";
import {
  Card,
  CardHeader,
  Tag,
  Button,
  Divider,
  Stat,
  Kbd,
  Dot,
} from "@/components/ui/Primitives";
import {
  Library,
  Search,
  Filter,
  FileText,
  Database,
  Dna,
  FlaskConical,
  Cpu,
  BookOpen,
  Quote,
  ChevronRight,
  Upload,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function LibraryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="The Library"
        title="Every claim cited. Every dataset signed. Every artifact alive."
        lede="Papers, datasets, sequences, runs, and models live as first-class objects. The library is the memory of the institute — and every twin reads from it."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="h-3.5 w-3.5" /> Ingest
            </Button>
            <Button>
              <Sparkles className="h-3.5 w-3.5" /> Ask the library
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-3 h-11 px-3.5 rounded-lg border border-ink-900/10 bg-white max-w-[680px]">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-ink-400"
            placeholder='Ask a question — "papers that disagree with Zhang ’25", "all traces lot 71a"…'
          />
          <Kbd>/</Kbd>
        </div>
      </PageHeader>

      <div className="px-8 py-8 grid grid-cols-12 gap-6">
        <section className="col-span-12 xl:col-span-8">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-1 p-2 border-b border-ink-900/8 bg-parchment-50">
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  className={`h-8 px-3 rounded-md text-[12.5px] inline-flex items-center gap-1.5 ${
                    i === 0
                      ? "bg-white text-ink-900 shadow-pane"
                      : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                  <span className="text-ink-400 font-mono text-[11px]">{t.count}</span>
                </button>
              ))}
            </div>
            <ul className="divide-y divide-ink-900/6">
              {ARTIFACTS.map((a) => (
                <li key={a.id} className="p-5 hover:bg-parchment-50/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg grid place-items-center ${a.wrap}`}
                    >
                      <a.icon className={`h-4 w-4 ${a.fg}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11.5px] text-ink-500">
                        <span className="font-mono text-ink-700">{a.id}</span>
                        <span>·</span>
                        <span>{a.kind}</span>
                        <span>·</span>
                        <span>{a.when}</span>
                        {a.signed && (
                          <Tag tone="emerald">
                            <ShieldCheck className="h-3 w-3" /> signed
                          </Tag>
                        )}
                      </div>
                      <div className="mt-1 text-[14px] text-ink-900 leading-snug">
                        {a.title}
                      </div>
                      {a.body && (
                        <div className="mt-1 text-[12.5px] text-ink-600 leading-relaxed">
                          {a.body}
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {a.tags.map((t) => (
                          <Tag key={t} tone="outline">{t}</Tag>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Open <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <aside className="col-span-12 xl:col-span-4 space-y-6">
          <Card>
            <CardHeader
              eyebrow="Ask the library"
              title="Halo-A draft answer"
              subtitle='Query: “papers that disagree with Zhang ’25 on loop-3”'
              right={<Tag tone="beacon"><Dot tone="beacon" /> streaming</Tag>}
            />
            <div className="px-5 pb-5 text-[13px] text-ink-800 leading-relaxed">
              Four direct disagreements found. <b>Okonkwo ’24</b> is the strongest: it reports saturation that contradicts Zhang’s non-linear model at Mg²⁺ &gt; 6 mM. Two smaller studies (Tran ’24, Brenner ’25) are consistent with Okonkwo.
              <div className="mt-3 rounded-md border border-ink-900/8 bg-parchment-50 p-3 text-[12px]">
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-500 font-medium mb-1.5">
                  Citations
                </div>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1.5 text-beacon-700 hover:underline cursor-pointer">
                    <Quote className="h-3 w-3" /> Okonkwo et al. ’24 · Nat. Chem. Biol.
                  </li>
                  <li className="flex items-center gap-1.5 text-beacon-700 hover:underline cursor-pointer">
                    <Quote className="h-3 w-3" /> Tran et al. ’24 · RNA
                  </li>
                  <li className="flex items-center gap-1.5 text-beacon-700 hover:underline cursor-pointer">
                    <Quote className="h-3 w-3" /> Brenner ’25 · bioRxiv
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Collections"
              title="Curated by the institute"
            />
            <ul className="px-5 pb-5 space-y-2">
              {COLLECTIONS.map((c) => (
                <li
                  key={c.title}
                  className="flex items-center gap-3 rounded-md border border-ink-900/8 bg-parchment-50 p-2.5"
                >
                  <div className="h-6 w-6 rounded-md bg-white border border-ink-900/8 grid place-items-center">
                    <BookOpen className="h-3 w-3 text-ink-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-ink-900 truncate">{c.title}</div>
                    <div className="text-[11px] text-ink-500">{c.meta}</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-ink-400" />
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

const TABS = [
  { label: "All", icon: Library, count: "2,184" },
  { label: "Papers", icon: FileText, count: "948" },
  { label: "Datasets", icon: Database, count: "611" },
  { label: "Sequences", icon: Dna, count: "241" },
  { label: "Runs", icon: FlaskConical, count: "283" },
  { label: "Models", icon: Cpu, count: "101" },
];

const ARTIFACTS = [
  {
    id: "DS-0071a",
    kind: "Dataset",
    when: "2 h ago",
    title: "kinetics-lot-71a · 2.4k traces · Mg²⁺ sweep",
    body:
      "Raw cleavage traces for 7-arm Mg²⁺ sweep (WT + K7A). Signed by PI. Linked to H-214.1 and I-03.",
    tags: ["kinetics", "ribozyme", "K11", "raw"],
    icon: Database,
    wrap: "bg-emerald-50",
    fg: "text-emerald-700",
    signed: true,
  },
  {
    id: "P-2025.07.14",
    kind: "Paper (preprint)",
    when: "3 d ago",
    title: "A neurosymbolic scaffold for RNA catalysis kinetics",
    body:
      "We argue that secondary Mg²⁺ binding, previously dismissed as an artifact, is the dominant mechanism at 6–10 mM. Four experimental rebuttals attempted.",
    tags: ["K11", "argumentation", "preprint"],
    icon: FileText,
    wrap: "bg-beacon-50",
    fg: "text-beacon-700",
    signed: true,
  },
  {
    id: "M-kepler-e12",
    kind: "Model checkpoint",
    when: "1 h ago",
    title: "Kepler ε-12 · ProtFold-δ finetune",
    body:
      "+3.2% on K11 eval. ECE = 0.027. Awaiting Quorum promotion. Run card attached.",
    tags: ["model", "finetune", "invariant-aware"],
    icon: Cpu,
    wrap: "bg-violet-50",
    fg: "text-violet-700",
    signed: false,
  },
  {
    id: "SEQ-RZ-0091",
    kind: "Sequence",
    when: "1 d ago",
    title: "Ribozyme K7A · loop-3 mutant · 91 nt",
    body:
      "Designed by Kepler; sanity-checked by Ada. Predicted k_obs = 0.62 s⁻¹ at Mg²⁺ = 5 mM.",
    tags: ["sequence", "mutant", "K11"],
    icon: Dna,
    wrap: "bg-parchment-100",
    fg: "text-ink-700",
    signed: true,
  },
  {
    id: "RUN-#71a",
    kind: "Run card",
    when: "8 min ago",
    title: "Run #71a · arm 4 · anomaly triage open",
    body:
      "See anomaly A-071a/4. Three ranked explanations; rebuttal run queued.",
    tags: ["run", "anomaly", "K11"],
    icon: FlaskConical,
    wrap: "bg-amber-50",
    fg: "text-amber-700",
    signed: false,
  },
];

const COLLECTIONS = [
  { title: "Ribozyme catalysis canon", meta: "42 papers · curated by Halo-A" },
  { title: "Invariants we've earned", meta: "18 invariants · cross-program" },
  { title: "The K11 dossier", meta: "203 artifacts · program-scoped" },
  { title: "Onboarding reading room", meta: "12 min · for new enrolments" },
];
