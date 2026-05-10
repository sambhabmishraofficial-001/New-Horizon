"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  FlaskConical,
  ScrollText,
  ListChecks,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { cn } from "@/lib/cn";

type Tab = "projects" | "manuscripts" | "protocols";

type Template = {
  id: string;
  title: string;
  domain: string;
  hint: string;
  tags: string[];
  artifacts: number;
};

const PROJECT_TEMPLATES: Template[] = [
  {
    id: "blank",
    title: "Blank scientific program",
    domain: "Any field",
    hint: "Empty workspace with the standard surfaces — start from a question.",
    tags: ["scaffold", "neutral"],
    artifacts: 4,
  },
  {
    id: "egfr",
    title: "Mechanism · oncology resistance study",
    domain: "Life sciences · oncology",
    hint: "Worked example with three competing hypotheses, eight datasets, an analysis notebook, and a draft manuscript.",
    tags: ["wet-lab", "computational", "manuscript-ready"],
    artifacts: 24,
  },
  {
    id: "rl-protein",
    title: "RL fine-tune for protein folding",
    domain: "ML × structural biology",
    hint: "Hyperparameter sweep, baseline runs against AlphaFold2, calibration on PDB hold-outs.",
    tags: ["ML", "compute-heavy"],
    artifacts: 18,
  },
  {
    id: "climate-attribution",
    title: "Climate attribution study",
    domain: "Earth · climate",
    hint: "Counterfactual simulations, observational reconciliation, uncertainty propagation.",
    tags: ["simulation", "policy-relevant"],
    artifacts: 21,
  },
  {
    id: "cohort-epi",
    title: "Cohort epidemiology",
    domain: "Public health",
    hint: "IRB intake, exposure modelling, hierarchical regression, replication block.",
    tags: ["clinical", "regulated"],
    artifacts: 26,
  },
  {
    id: "materials-sweep",
    title: "Materials discovery sweep",
    domain: "Materials science",
    hint: "DFT screen, ML surrogate model, candidate ranking, synthesis priority queue.",
    tags: ["DFT", "screening"],
    artifacts: 19,
  },
  {
    id: "replication",
    title: "Replication study",
    domain: "Psychology · social",
    hint: "Pre-registered protocol, multi-site pre-registration, Bayes-factor analysis plan.",
    tags: ["pre-reg", "multi-site"],
    artifacts: 14,
  },
  {
    id: "lean-theorem",
    title: "Theorem formalisation (Lean)",
    domain: "Mathematics",
    hint: "Mathlib branch, statement skeleton, proof sketch, machine-checked invariants.",
    tags: ["formal", "Lean"],
    artifacts: 11,
  },
  {
    id: "cosmo-sim",
    title: "Cosmological simulation",
    domain: "Astrophysics",
    hint: "N-body initialisation, halo-finder pipeline, post-processing notebooks.",
    tags: ["HPC", "simulation"],
    artifacts: 22,
  },
  {
    id: "fmri",
    title: "fMRI analysis",
    domain: "Neuroscience",
    hint: "BIDS ingest, preprocessing pipeline, GLM template, replication on a held-out cohort.",
    tags: ["BIDS", "preprocessing"],
    artifacts: 23,
  },
  {
    id: "synthesis",
    title: "Synthesis pathway · organic chem",
    domain: "Chemistry",
    hint: "Retrosynthetic plan, reagent inventory, NMR pipeline, yield tracking.",
    tags: ["wet-lab", "yield"],
    artifacts: 17,
  },
  {
    id: "nlp-empirical",
    title: "Empirical NLP study",
    domain: "Computer science",
    hint: "Benchmark fork, training pipeline, baseline reproducibility, scaling-curve analysis.",
    tags: ["benchmark", "scaling"],
    artifacts: 16,
  },
];

type Manuscript = {
  id: string;
  journal: string;
  family: string;
  fmt: "LaTeX" | "Word" | "Markdown";
  notes: string;
};

const MANUSCRIPT_TEMPLATES: Manuscript[] = [
  { id: "nature", journal: "Nature", family: "Nature family", fmt: "LaTeX", notes: "Article · 4,500 words · 6 figures" },
  { id: "science", journal: "Science", family: "AAAS", fmt: "LaTeX", notes: "Research article · 4,500 words" },
  { id: "cell", journal: "Cell", family: "Cell Press", fmt: "LaTeX", notes: "Article · graphical abstract required" },
  { id: "nm", journal: "Nature Methods", family: "Nature family", fmt: "LaTeX", notes: "Brief communication · 1,500 words" },
  { id: "ng", journal: "Nature Genetics", family: "Nature family", fmt: "LaTeX", notes: "Letter · supplementary mandatory" },
  { id: "neurips", journal: "NeurIPS", family: "ML conferences", fmt: "LaTeX", notes: "Long paper · 9 pages + refs" },
  { id: "icml", journal: "ICML", family: "ML conferences", fmt: "LaTeX", notes: "Long paper · 8 pages + refs" },
  { id: "iclr", journal: "ICLR", family: "ML conferences", fmt: "LaTeX", notes: "OpenReview format · double-blind" },
  { id: "jama", journal: "JAMA", family: "Medical", fmt: "Word", notes: "Original investigation · 3,000 words" },
  { id: "lancet", journal: "The Lancet", family: "Medical", fmt: "Word", notes: "Article · 4,500 words · CONSORT-compliant" },
  { id: "prl", journal: "Physical Review Letters", family: "APS", fmt: "LaTeX", notes: "Letter · 4 pages strict" },
  { id: "apj", journal: "Astrophysical Journal", family: "AAS", fmt: "LaTeX", notes: "Article · AASTeX 6.3" },
  { id: "jacs", journal: "JACS", family: "ACS", fmt: "LaTeX", notes: "Article · 5,000 words · TOC graphic" },
  { id: "rsc-csr", journal: "Chem. Soc. Rev.", family: "RSC", fmt: "Word", notes: "Tutorial review · 8,000 words" },
  { id: "ieee-tpami", journal: "IEEE TPAMI", family: "IEEE", fmt: "LaTeX", notes: "Article · IEEEtran · double-column" },
  { id: "acm-tods", journal: "ACM TODS", family: "ACM", fmt: "LaTeX", notes: "Article · acmart · single-column" },
  { id: "elsevier", journal: "Elsevier (generic)", family: "Elsevier", fmt: "LaTeX", notes: "elsarticle · 1.5x line spacing" },
  { id: "pnas", journal: "PNAS", family: "NAS", fmt: "LaTeX", notes: "Direct submission · 6 pages" },
  { id: "elife", journal: "eLife", family: "eLife", fmt: "Word", notes: "Research article · open peer review" },
  { id: "plos-one", journal: "PLOS ONE", family: "PLOS", fmt: "Word", notes: "Article · scope-only review" },
  { id: "arxiv", journal: "arXiv preprint", family: "Preprints", fmt: "LaTeX", notes: "Preprint scaffold · category-aware" },
  { id: "biorxiv", journal: "bioRxiv preprint", family: "Preprints", fmt: "Word", notes: "Preprint · 4,500 words" },
];

type Protocol = {
  id: string;
  title: string;
  field: string;
  duration: string;
  hint: string;
};

const PROTOCOL_TEMPLATES: Protocol[] = [
  { id: "wb", title: "Western blot", field: "Cell biology · biochem", duration: "1 day + transfer", hint: "Lysis, SDS-PAGE, transfer, probe, detection. Antibody panel placeholders." },
  { id: "qpcr", title: "qPCR (TaqMan)", field: "Molecular biology", duration: "4 h", hint: "Primer design, RNA prep, reverse transcription, ddCt analysis." },
  { id: "crispr-ko", title: "CRISPR knockout in mammalian cells", field: "Genetics", duration: "3–4 weeks", hint: "Guide design, transfection, single-cell sorting, validation." },
  { id: "elisa", title: "Sandwich ELISA", field: "Immunology", duration: "1 day", hint: "Capture, sample, detection, substrate, standard curve fitting." },
  { id: "scrnaseq", title: "Single-cell RNA-seq library prep", field: "Genomics", duration: "2 days", hint: "10x Chromium prep, QC, library normalisation, sequencing brief." },
  { id: "xtal", title: "Crystal structure determination", field: "Structural biology", duration: "weeks", hint: "Crystallisation screen, data collection, phasing, refinement." },
  { id: "synth", title: "Two-step organic synthesis", field: "Chemistry", duration: "2–3 days", hint: "Reflux, work-up, column, NMR, yield reporting." },
  { id: "behav", title: "Behavioural assay (Morris water maze)", field: "Neuroscience", duration: "5 days", hint: "Cohort spec, training schedule, probe trial, ethics gate." },
  { id: "irb", title: "IRB-style human-subjects flow", field: "Public health · social", duration: "weeks", hint: "Protocol, consent, recruitment, data-handling, debriefing." },
  { id: "rct", title: "RCT statistical analysis plan", field: "Clinical", duration: "—", hint: "Endpoints, sample size, analysis populations, multiplicity." },
  { id: "prereg", title: "Pre-registration (OSF style)", field: "Any", duration: "—", hint: "Hypothesis, design, analysis plan, frozen before data." },
  { id: "repro", title: "Computational reproducibility checklist", field: "Computational", duration: "—", hint: "Environment pin, seed pin, data hash, output verification." },
  { id: "fmri-pre", title: "fMRI preprocessing protocol", field: "Neuroscience", duration: "automated", hint: "fMRIPrep config, motion thresholds, susceptibility correction." },
  { id: "field", title: "Field ecology survey", field: "Ecology", duration: "season", hint: "Site selection, transects, sampling scheme, weather log." },
];

const PROJECT_DOMAINS = Array.from(new Set(PROJECT_TEMPLATES.map((p) => p.domain)));

export default function TemplatesPage() {
  const [tab, setTab] = React.useState<Tab>("projects");
  const [q, setQ] = React.useState("");
  const [domain, setDomain] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-ink-900">
      <MarketingNav />
      <main className="mx-auto max-w-[1180px] px-6 sm:px-10 pt-16 pb-28">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
          Templates
        </div>
        <h1 className="mt-3 font-editorial text-[44px] leading-[1.05] text-ink-900 tracking-tight">
          Start from something already shaped.
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-600">
          Project scaffolds with seeded hypotheses, journal-ready manuscript
          templates, and step-by-step protocols. Pick one — the workspace,
          the rules file, and the default agents come pre-configured.
        </p>

        <div className="mt-10 flex items-center gap-2 border-b border-ink-900/10">
          <Tabs tab={tab} setTab={setTab} />
          <div className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-900/12 bg-white px-2.5 w-[280px]">
            <Search className="h-3.5 w-3.5 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates"
              className="flex-1 bg-transparent outline-none text-[12.5px] text-ink-800"
            />
          </div>
        </div>

        {tab === "projects" && (
          <ProjectGrid
            q={q}
            domain={domain}
            setDomain={setDomain}
          />
        )}
        {tab === "manuscripts" && <ManuscriptGrid q={q} />}
        {tab === "protocols" && <ProtocolGrid q={q} />}
      </main>
      <MarketingFooter />
    </div>
  );
}

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; count: number; icon: typeof FlaskConical }[] = [
    { id: "projects", label: "Project starters", count: PROJECT_TEMPLATES.length, icon: FlaskConical },
    { id: "manuscripts", label: "Manuscript templates", count: MANUSCRIPT_TEMPLATES.length, icon: ScrollText },
    { id: "protocols", label: "Protocols", count: PROTOCOL_TEMPLATES.length, icon: ListChecks },
  ];
  return (
    <div className="flex items-center gap-0">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => setTab(it.id)}
          className={cn(
            "h-10 inline-flex items-center gap-2 px-4 text-[13px] -mb-[1px]",
            tab === it.id
              ? "text-ink-900 border-b-2 border-ink-900 font-medium"
              : "text-ink-500 hover:text-ink-800"
          )}
        >
          <it.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {it.label}
          <span className="font-mono text-[11px] text-ink-400">{it.count}</span>
        </button>
      ))}
    </div>
  );
}

function ProjectGrid({
  q,
  domain,
  setDomain,
}: {
  q: string;
  domain: string | null;
  setDomain: (d: string | null) => void;
}) {
  const filtered = PROJECT_TEMPLATES.filter((p) => {
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.hint.toLowerCase().includes(q.toLowerCase()) ||
      p.tags.some((t) => t.includes(q.toLowerCase()));
    const matchD = !domain || p.domain === domain;
    return matchQ && matchD;
  });

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <FilterChip active={domain == null} onClick={() => setDomain(null)}>
          All domains
        </FilterChip>
        {PROJECT_DOMAINS.map((d) => (
          <FilterChip key={d} active={domain === d} onClick={() => setDomain(d)}>
            {d}
          </FilterChip>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-12 text-center text-[13px] text-ink-500">
          No starters match that filter.
        </div>
      )}
    </>
  );
}

function ProjectCard({ p }: { p: Template }) {
  const isOncology = p.id === "egfr";
  const ireHref = isOncology ? "/ire?example=oncology" : "/ire";
  return (
    <article className="group rounded-md border border-ink-900/10 bg-white px-5 py-5 hover:border-ink-900/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
          {p.domain}
        </div>
        <span className="font-mono text-[10.5px] text-ink-400">
          {p.artifacts} artifacts
        </span>
      </div>
      <h3 className="mt-2 font-editorial text-[18px] leading-tight text-ink-900">
        {p.title}
      </h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">
        {p.hint}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {p.tags.map((t) => (
          <span
            key={t}
            className="text-[10.5px] px-1.5 py-0.5 rounded bg-parchment-100 text-ink-600 font-mono"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={ireHref}
          className="inline-flex h-8 items-center gap-1 rounded bg-ink-900 text-parchment-50 px-3 text-[12px] font-medium hover:bg-ink-800"
        >
          Use this <ArrowRight className="h-3 w-3" />
        </Link>
        <button className="inline-flex h-8 items-center gap-1 rounded border border-ink-900/12 px-3 text-[12px] text-ink-700 hover:bg-parchment-50">
          Preview
        </button>
      </div>
    </article>
  );
}

function ManuscriptGrid({ q }: { q: string }) {
  const filtered = MANUSCRIPT_TEMPLATES.filter(
    (m) =>
      !q ||
      m.journal.toLowerCase().includes(q.toLowerCase()) ||
      m.family.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map((m) => (
        <article
          key={m.id}
          className="rounded-md border border-ink-900/10 bg-white px-4 py-4 hover:border-ink-900/20"
        >
          <div className="flex items-start justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
              {m.family}
            </div>
            <FormatBadge fmt={m.fmt} />
          </div>
          <h3 className="mt-1.5 font-editorial text-[17px] leading-tight text-ink-900">
            {m.journal}
          </h3>
          <p className="mt-1.5 text-[12px] text-ink-600">{m.notes}</p>
          <Link
            href={m.fmt === "LaTeX" ? "/ire" : "/ire"}
            className="mt-3 inline-flex h-7 items-center gap-1 text-[11.5px] text-beacon-700 font-medium"
          >
            Open template <ChevronRight className="h-3 w-3" />
          </Link>
        </article>
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full text-center text-[13px] text-ink-500 mt-12">
          No manuscript templates match.
        </div>
      )}
    </div>
  );
}

function FormatBadge({ fmt }: { fmt: "LaTeX" | "Word" | "Markdown" }) {
  const palette = {
    LaTeX: "bg-ink-900 text-parchment-50",
    Word: "bg-blue-700 text-white",
    Markdown: "bg-emerald-700 text-white",
  }[fmt];
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-mono", palette)}>
      {fmt}
    </span>
  );
}

function ProtocolGrid({ q }: { q: string }) {
  const filtered = PROTOCOL_TEMPLATES.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.field.toLowerCase().includes(q.toLowerCase()) ||
      p.hint.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {filtered.map((p) => (
        <article
          key={p.id}
          className="rounded-md border border-ink-900/10 bg-white px-5 py-4 hover:border-ink-900/20"
        >
          <div className="flex items-start justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
              {p.field}
            </div>
            <span className="text-[10.5px] text-ink-500 font-mono">
              {p.duration}
            </span>
          </div>
          <h3 className="mt-1.5 font-editorial text-[17px] leading-tight text-ink-900">
            {p.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] text-ink-600 leading-relaxed">
            {p.hint}
          </p>
          <button className="mt-3 inline-flex h-7 items-center gap-1 text-[11.5px] text-beacon-700 font-medium">
            <Sparkles className="h-3 w-3" /> Use this protocol
          </button>
        </article>
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full text-center text-[13px] text-ink-500 mt-12">
          No protocols match that search.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 inline-flex items-center gap-1 rounded-full border px-2.5 text-[11.5px] transition-colors",
        active
          ? "border-ink-900 bg-ink-900 text-parchment-50"
          : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/30"
      )}
    >
      {children}
    </button>
  );
}
