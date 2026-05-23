"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Star,
  Folder,
  FileText,
  GitBranch,
  Star as StarIcon,
  GitFork,
  Code2,
  Play,
  Cloud,
  Upload,
  Download,
  Filter,
  type LucideIcon,
  Quote,
  ScrollText,
  Database as DatabaseIcon,
  Notebook,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type ToolKind =
  | "refs" // Zotero, Mendeley, EndNote, Papers, Scholar
  | "storage" // Drive, OneDrive, Dropbox, Zenodo, Figshare, OSF, protocols.io
  | "code" // GitHub, Colab, Jupyter, HF, Kaggle, W&B
  | "slides" // PowerPoint, Slides
  | "richtext" // Google Docs, Notion
  | "scholar"; // Google Scholar (search)

const TOOL_REGISTRY: Record<
  string,
  { kind: ToolKind; label: string; subtitle: string; accent: string }
> = {
  zotero: { kind: "refs", label: "Zotero", subtitle: "My library", accent: "#a91d1d" },
  mendeley: { kind: "refs", label: "Mendeley", subtitle: "Library", accent: "#a01612" },
  endnote: { kind: "refs", label: "EndNote", subtitle: "References", accent: "#1d6cab" },
  papers: { kind: "refs", label: "Papers", subtitle: "Reading list", accent: "#0a8f5b" },
  scholar: { kind: "scholar", label: "Google Scholar", subtitle: "Literature search", accent: "#0b5394" },

  drive: { kind: "storage", label: "Google Drive", subtitle: "My drive", accent: "#1a73e8" },
  onedrive: { kind: "storage", label: "OneDrive", subtitle: "Files", accent: "#0364B8" },
  dropbox: { kind: "storage", label: "Dropbox", subtitle: "Home", accent: "#0061FF" },
  zenodo: { kind: "storage", label: "Zenodo", subtitle: "Records", accent: "#1f76b4" },
  figshare: { kind: "storage", label: "Figshare", subtitle: "Items", accent: "#c41a52" },
  osf: { kind: "storage", label: "OSF", subtitle: "Projects", accent: "#1c4d77" },
  protocols: { kind: "storage", label: "protocols.io", subtitle: "Workspaces", accent: "#36a3a8" },

  github: { kind: "code", label: "GitHub", subtitle: "Repositories", accent: "#1f2328" },
  colab: { kind: "code", label: "Google Colab", subtitle: "Notebooks", accent: "#F9AB00" },
  jupyter: { kind: "code", label: "Jupyter", subtitle: "Notebooks", accent: "#F37726" },
  huggingface: { kind: "code", label: "Hugging Face", subtitle: "Models · datasets", accent: "#FFD21E" },
  kaggle: { kind: "code", label: "Kaggle", subtitle: "Notebooks · datasets", accent: "#20BEFF" },
  wandb: { kind: "code", label: "Weights & Biases", subtitle: "Runs", accent: "#FFCC33" },

  ppt: { kind: "slides", label: "PowerPoint", subtitle: "Slides", accent: "#B7472A" },
  slides: { kind: "slides", label: "Google Slides", subtitle: "Slides", accent: "#F4B400" },

  docs: { kind: "richtext", label: "Google Docs", subtitle: "Document", accent: "#1a73e8" },
  notion: { kind: "richtext", label: "Notion", subtitle: "Page", accent: "#0a0a0a" },
};

export function ToolDoc({ id, label }: { id: string; label?: string }) {
  const meta = TOOL_REGISTRY[id];
  if (!meta) return <ToolEmpty label={label ?? id} />;
  switch (meta.kind) {
    case "refs":
      return <ReferenceManagerSurface label={meta.label} accent={meta.accent} />;
    case "storage":
      return <StorageSurface label={meta.label} subtitle={meta.subtitle} accent={meta.accent} />;
    case "code":
      return <CodeSurface label={meta.label} accent={meta.accent} id={id} />;
    case "slides":
      return <SlidesSurface label={meta.label} />;
    case "richtext":
      return <RichTextSurface label={meta.label} />;
    case "scholar":
      return <ScholarSurface />;
  }
}

function ToolHeader({
  label,
  subtitle,
  accent,
  right,
}: {
  label: string;
  subtitle: string;
  accent: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="h-12 shrink-0 flex items-center gap-3 px-4 border-b border-ink-900/8 bg-white">
      <div
        className="h-7 w-7 rounded grid place-items-center text-white font-mono text-[12px] font-semibold"
        style={{ background: accent }}
      >
        {label.slice(0, 1)}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-ink-900 truncate">{label}</div>
        <div className="text-[11px] text-ink-500 font-mono">{subtitle}</div>
      </div>
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

function ToolEmpty({ label }: { label: string }) {
  return (
    <div className="flex-1 grid place-items-center bg-white text-ink-500">
      <div className="text-center">
        <div className="font-editorial text-[20px] text-ink-700">{label}</div>
        <p className="mt-1 text-[12.5px]">Surface not configured.</p>
      </div>
    </div>
  );
}

/* ---------- Reference manager ---------- */

const REFS_SAMPLE = [
  {
    title: "Mechanisms of acquired resistance to EGFR-TKIs in NSCLC",
    authors: "Yang J., Liao H., Wei W.",
    venue: "Cell Reports Medicine",
    year: 2023,
    tags: ["resistance", "EGFR", "review"],
  },
  {
    title: "On the reproducibility of computational pipelines in genomics",
    authors: "Singh R., Nakamura T.",
    venue: "Nature Methods",
    year: 2024,
    tags: ["reproducibility"],
  },
  {
    title: "Hierarchical models for small-sample biomedical experiments",
    authors: "Patel N., Martinez L., Iwasa K.",
    venue: "Annual Reviews",
    year: 2023,
    tags: ["statistics", "methods"],
  },
  {
    title: "CRISPR screens in patient-derived organoids",
    authors: "Kim J., Wei T., Holt R.",
    venue: "Cell",
    year: 2025,
    tags: ["CRISPR", "organoid"],
  },
  {
    title: "FAIR data principles for laboratory metadata",
    authors: "Wilkinson M., et al.",
    venue: "Scientific Data",
    year: 2022,
    tags: ["FAIR"],
  },
  {
    title: "Drug-tolerant persister cells: a moving target",
    authors: "Sharma S.V., Lee D.Y., Settleman J.",
    venue: "Cell",
    year: 2024,
    tags: ["persister", "resistance"],
  },
  {
    title: "On the calibration of confidence in machine-learning classifiers",
    authors: "Guo C., Pleiss G., Sun Y., Weinberger K.",
    venue: "ICML",
    year: 2017,
    tags: ["ML", "calibration"],
  },
];

function ReferenceManagerSurface({ label, accent }: { label: string; accent: string }) {
  const [q, setQ] = React.useState("");
  const filtered = REFS_SAMPLE.filter(
    (r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      r.authors.toLowerCase().includes(q.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <ToolHeader
        label={label}
        subtitle="library · synced"
        accent={accent}
        right={
          <>
            <SearchInput value={q} onChange={setQ} placeholder="Search title, author, tag" />
            <button className="h-7 inline-flex items-center gap-1 rounded bg-ink-900 text-parchment-50 px-2.5 text-[11.5px] hover:bg-ink-800">
              <Plus className="h-3 w-3" /> Add reference
            </button>
          </>
        }
      />
      <div className="flex-1 min-h-0 flex">
        <div className="w-[200px] shrink-0 border-r border-ink-900/8 bg-parchment-50 py-2">
          <SidebarLabel>Collections</SidebarLabel>
          {[
            { i: Folder, l: "All references", n: REFS_SAMPLE.length },
            { i: Folder, l: "Recently added", n: 3 },
            { i: Star, l: "Starred", n: 4 },
            { i: Folder, l: "EGFR resistance", n: 12 },
            { i: Folder, l: "Methods · stats", n: 9 },
            { i: Folder, l: "Reading queue", n: 18 },
          ].map((c, i) => (
            <button
              key={i}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-white",
                i === 0 && "bg-white text-ink-900"
              )}
            >
              <c.i className="h-3.5 w-3.5 text-ink-500" />
              <span className="flex-1 text-left text-ink-700 truncate">{c.l}</span>
              <span className="font-mono text-[10.5px] text-ink-400">{c.n}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-white border-b border-ink-900/8">
              <tr className="text-left text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                <th className="px-4 py-2 w-7"></th>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2 w-[160px]">Authors</th>
                <th className="px-2 py-2 w-[140px]">Venue</th>
                <th className="px-2 py-2 w-[60px]">Year</th>
                <th className="px-2 py-2 w-[160px]">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b border-ink-900/5 hover:bg-parchment-50">
                  <td className="px-4 py-2">
                    <Star className="h-3.5 w-3.5 text-ink-300" />
                  </td>
                  <td className="px-2 py-2 text-ink-900">{r.title}</td>
                  <td className="px-2 py-2 text-ink-600 truncate">{r.authors}</td>
                  <td className="px-2 py-2 text-ink-600">{r.venue}</td>
                  <td className="px-2 py-2 text-ink-600 font-mono">{r.year}</td>
                  <td className="px-2 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {r.tags.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-parchment-100 text-ink-600 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Scholar search ---------- */

function ScholarSurface() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <ToolHeader label="Google Scholar" subtitle="literature search" accent="#0b5394" />
      <div className="px-8 py-6 max-w-[820px]">
        <div className="flex items-center gap-1 h-10 px-3 rounded-full border border-ink-900/15 bg-white">
          <Search className="h-4 w-4 text-ink-500" />
          <input
            placeholder="Search papers, authors, citations…"
            className="flex-1 outline-none text-[13px] bg-transparent"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11.5px] text-ink-500">
          <span>About 12,400 results · 0.21s</span>
        </div>
        <div className="mt-2">
          {REFS_SAMPLE.slice(0, 5).map((r, i) => (
            <article key={i} className="py-3 border-b border-ink-900/8">
              <a className="text-[14px] text-beacon-700 hover:underline">{r.title}</a>
              <div className="text-[11.5px] text-ink-600 mt-0.5">
                {r.authors} · <span className="italic">{r.venue}</span>, {r.year}
              </div>
              <p className="text-[12px] text-ink-700 mt-1 leading-relaxed">
                We propose a unified framework for reasoning about {r.tags[0]} in modern research workflows…
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-500 font-mono">
                <span>cited by {120 + i * 47}</span>
                <span>related</span>
                <span>cite</span>
                <span>save to library</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Storage ---------- */

const STORAGE_FILES = [
  { name: "manuscript-v3.docx", kind: "doc", size: "184 KB", modified: "today, 14:21" },
  { name: "figures", kind: "folder", size: "-", modified: "yesterday" },
  { name: "raw-data", kind: "folder", size: "-", modified: "Apr 28" },
  { name: "supplementary.pdf", kind: "pdf", size: "2.1 MB", modified: "Apr 24" },
  { name: "analysis.ipynb", kind: "notebook", size: "412 KB", modified: "Apr 22" },
  { name: "preregistration.md", kind: "md", size: "9 KB", modified: "Apr 20" },
  { name: "protocol-v2.docx", kind: "doc", size: "62 KB", modified: "Apr 18" },
  { name: "results.csv", kind: "csv", size: "844 KB", modified: "Apr 12" },
  { name: "fig1-source.svg", kind: "image", size: "118 KB", modified: "Apr 10" },
  { name: "review-notes.md", kind: "md", size: "5 KB", modified: "Apr 6" },
];

function StorageSurface({
  label,
  subtitle,
  accent,
}: {
  label: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <ToolHeader
        label={label}
        subtitle={subtitle}
        accent={accent}
        right={
          <>
            <button className="h-7 inline-flex items-center gap-1 rounded border border-ink-900/12 bg-white px-2 text-[11.5px] text-ink-700 hover:bg-parchment-50">
              <Upload className="h-3 w-3" /> Upload
            </button>
            <button className="h-7 inline-flex items-center gap-1 rounded bg-ink-900 text-parchment-50 px-2.5 text-[11.5px] hover:bg-ink-800">
              <Plus className="h-3 w-3" /> New folder
            </button>
          </>
        }
      />
      <div className="flex-1 min-h-0 flex">
        <div className="w-[200px] shrink-0 border-r border-ink-900/8 bg-parchment-50 py-2">
          <SidebarLabel>Locations</SidebarLabel>
          {[
            { i: Cloud, l: "My drive", n: 142 },
            { i: Folder, l: "Shared with me", n: 18 },
            { i: Folder, l: "Recent", n: 23 },
            { i: Star, l: "Starred", n: 7 },
            { i: Download, l: "Trash", n: 0 },
          ].map((c, i) => (
            <button
              key={i}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-white",
                i === 0 && "bg-white text-ink-900"
              )}
            >
              <c.i className="h-3.5 w-3.5 text-ink-500" />
              <span className="flex-1 text-left text-ink-700">{c.l}</span>
              <span className="font-mono text-[10.5px] text-ink-400">{c.n}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-white border-b border-ink-900/8">
              <tr className="text-left text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                <th className="px-4 py-2">Name</th>
                <th className="px-2 py-2 w-[120px]">Modified</th>
                <th className="px-2 py-2 w-[80px]">Size</th>
              </tr>
            </thead>
            <tbody>
              {STORAGE_FILES.map((f, i) => (
                <tr key={i} className="border-b border-ink-900/5 hover:bg-parchment-50 cursor-pointer">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <FileBadge kind={f.kind} />
                    <span className="text-ink-900">{f.name}</span>
                  </td>
                  <td className="px-2 py-2 text-ink-600 font-mono text-[11.5px]">{f.modified}</td>
                  <td className="px-2 py-2 text-ink-600 font-mono text-[11.5px]">{f.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FileBadge({ kind }: { kind: string }) {
  const palette: Record<string, [LucideIcon, string]> = {
    doc: [FileText, "#2A58BE"],
    pdf: [FileText, "#B5392F"],
    notebook: [Notebook, "#F37726"],
    md: [ScrollText, "#34342E"],
    csv: [DatabaseIcon, "#12785A"],
    image: [FileText, "#5B3FB0"],
    folder: [Folder, "#B9740C"],
  };
  const [Icon, color] = palette[kind] ?? [FileText, "#34342E"];
  return <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} strokeWidth={1.75} />;
}

/* ---------- Code (GitHub / Colab / Jupyter / HF / Kaggle / W&B) ---------- */

const REPO_FILES = [
  { name: "README.md", kind: "md" },
  { name: "src", kind: "folder" },
  { name: "notebooks", kind: "folder" },
  { name: "tests", kind: "folder" },
  { name: "data", kind: "folder" },
  { name: "pyproject.toml", kind: "md" },
  { name: "Dockerfile", kind: "md" },
  { name: ".github", kind: "folder" },
];

function CodeSurface({ label, accent, id }: { label: string; accent: string; id: string }) {
  const isGithub = id === "github";
  const isNotebook = id === "colab" || id === "jupyter" || id === "kaggle";
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <ToolHeader
        label={label}
        subtitle={isNotebook ? "notebook" : "main · default branch"}
        accent={accent}
        right={
          <>
            {isGithub && (
              <>
                <SmallStat icon={StarIcon} label="1.2k" />
                <SmallStat icon={GitFork} label="184" />
              </>
            )}
            <button className="h-7 inline-flex items-center gap-1 rounded border border-ink-900/12 bg-white px-2 text-[11.5px] text-ink-700 hover:bg-parchment-50">
              <GitBranch className="h-3 w-3" /> main
            </button>
            <button className="h-7 inline-flex items-center gap-1 rounded bg-ink-900 text-parchment-50 px-2.5 text-[11.5px] hover:bg-ink-800">
              <Code2 className="h-3 w-3" /> Open
            </button>
          </>
        }
      />
      {isNotebook ? <NotebookView /> : <RepoView />}
    </div>
  );
}

function RepoView() {
  return (
    <div className="flex-1 min-h-0 flex">
      <div className="w-[280px] shrink-0 border-r border-ink-900/8 bg-parchment-50 overflow-y-auto">
        <div className="px-3 py-2 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
          Files
        </div>
        {REPO_FILES.map((f, i) => (
          <button key={i} className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-white">
            {f.kind === "folder" ? (
              <Folder className="h-3.5 w-3.5 text-ink-500" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-ink-500" />
            )}
            <span className="text-ink-700">{f.name}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-6 py-6 max-w-[760px]">
          <h1 className="font-editorial text-[26px] text-ink-900 leading-tight">README.md</h1>
          <p className="mt-3 text-[13px] text-ink-700 leading-relaxed">
            A clean working surface for any scientific program - open the project
            in your IRE, attach datasets, run experiments. The repository hosts
            analysis pipelines, protocols, and figure-generation code.
          </p>
          <h2 className="mt-6 font-editorial text-[18px] text-ink-900">Layout</h2>
          <ul className="mt-2 space-y-1 text-[12.5px] text-ink-700 font-mono">
            <li>src/ - analysis pipelines</li>
            <li>notebooks/ - exploratory and figure notebooks</li>
            <li>data/ - pinned datasets and schemas</li>
            <li>tests/ - pipeline tests, schema checks, golden runs</li>
          </ul>
          <h2 className="mt-6 font-editorial text-[18px] text-ink-900">Quick start</h2>
          <pre className="mt-2 bg-parchment-100 border border-ink-900/8 rounded p-3 text-[11.5px] font-mono text-ink-800 overflow-x-auto">
{`uv venv && uv pip install -e ".[dev]"
uv run python -m pytest -q
uv run jupyter lab notebooks/`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function NotebookView() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-white">
      <div className="max-w-[760px] mx-auto px-6 py-6 space-y-4">
        <NotebookCell type="md">
          <h2 className="text-[18px] font-medium text-ink-900">Setup</h2>
          <p className="text-[12.5px] text-ink-700">Load packages and pinned dataset.</p>
        </NotebookCell>
        <NotebookCell type="code" run="In [1]">
{`import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
df = pd.read_parquet("data/observations.parquet")
df.shape`}
        </NotebookCell>
        <NotebookCell type="output" run="Out [1]">
          <span className="font-mono text-[12px]">(2418, 17)</span>
        </NotebookCell>
        <NotebookCell type="code" run="In [2]">
{`X = df.drop(columns=["outcome"])
y = df["outcome"].astype(int)
clf = LogisticRegression(max_iter=400).fit(X, y)
clf.score(X, y)`}
        </NotebookCell>
        <NotebookCell type="output" run="Out [2]">
          <span className="font-mono text-[12px]">0.7613</span>
        </NotebookCell>
        <NotebookCell type="md">
          <p className="text-[12.5px] text-ink-700">
            Baseline accuracy. Promote to <span className="font-mono">EXP-001</span>{" "}
            in the IRE before running held-out evaluation.
          </p>
        </NotebookCell>
      </div>
    </div>
  );
}

function NotebookCell({
  type,
  run,
  children,
}: {
  type: "md" | "code" | "output";
  run?: string;
  children: React.ReactNode;
}) {
  if (type === "md") {
    return <div className="border border-transparent hover:border-ink-900/8 rounded px-3 py-2">{children}</div>;
  }
  return (
    <div className="flex gap-3">
      <span className="font-mono text-[10.5px] text-ink-400 w-[60px] pt-2.5 shrink-0">{run}</span>
      <pre
        className={cn(
          "flex-1 rounded p-3 font-mono text-[11.5px] leading-[1.6] overflow-x-auto",
          type === "code" ? "bg-parchment-50 border border-ink-900/8 text-ink-800" : "text-ink-700"
        )}
      >
        {children}
      </pre>
    </div>
  );
}

function SmallStat({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 h-7 px-2 text-[11.5px] text-ink-700 font-mono border border-ink-900/12 rounded bg-white">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

/* ---------- Slides ---------- */

function SlidesSurface({ label }: { label: string }) {
  const slides = [
    "Title · A program for any scientific question",
    "Why · the IRE binds claims to evidence",
    "How · agents · runs · provenance",
    "Demo · open hypothesis → run → manuscript",
    "Roadmap · this quarter",
    "Thanks",
  ];
  const [active, setActive] = React.useState(0);
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-parchment-50">
      <ToolHeader
        label={label}
        subtitle={`slide ${active + 1} / ${slides.length}`}
        accent="#B7472A"
        right={
          <button className="h-7 inline-flex items-center gap-1 rounded bg-ink-900 text-parchment-50 px-2.5 text-[11.5px] hover:bg-ink-800">
            <Play className="h-3 w-3" /> Present
          </button>
        }
      />
      <div className="flex-1 min-h-0 flex">
        <div className="w-[200px] shrink-0 border-r border-ink-900/8 bg-white overflow-y-auto py-2 px-2 space-y-1.5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "w-full aspect-[16/9] rounded border bg-white px-2.5 py-1.5 text-left text-[10.5px] text-ink-700 leading-tight",
                i === active ? "border-beacon-500 ring-1 ring-beacon-500/30" : "border-ink-900/10"
              )}
            >
              <div className="font-mono text-[9px] text-ink-400 mb-0.5">{i + 1}</div>
              {s.split("·")[0]}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 grid place-items-center">
          <div className="aspect-[16/9] w-[640px] bg-white border border-ink-900/10 shadow-page px-12 py-10">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-400">
              Slide {active + 1}
            </div>
            <h1 className="mt-3 font-editorial text-[36px] leading-tight text-ink-900">
              {slides[active].split("·")[0].trim()}
            </h1>
            <p className="mt-2 text-[15px] text-ink-600 leading-relaxed">
              {slides[active].split("·").slice(1).join("·").trim()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Rich text (Docs / Notion) ---------- */

function RichTextSurface({ label }: { label: string }) {
  const [body, setBody] = React.useState(
    `An integrated research environment unifies the surfaces a scientist already touches every day - a writing canvas, a citation library, a notebook, a planner - and binds them to the same evidence graph. The point is not to replace those surfaces. It is to make them aware of each other.\n\nWhen the manuscript cites a result, the result has a fingerprint. When the figure renders, it pulls its data from a pinned hash. When the protocol runs, the run is signed.`
  );
  const words = body.trim().split(/\s+/).length;
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <ToolHeader
        label={label}
        subtitle={`document · ${words} words`}
        accent="#1a73e8"
        right={
          <>
            <span className="h-7 inline-flex items-center gap-1 rounded px-2 text-[11.5px] text-emerald-700">
              <Cloud className="h-3 w-3" /> Saved
            </span>
          </>
        }
      />
      <div className="h-9 shrink-0 flex items-center gap-1 border-b border-ink-900/8 px-3 bg-parchment-50 text-[11.5px]">
        <select className="h-6 px-2 rounded border border-ink-900/10 bg-white text-[11px]">
          <option>Normal text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
        </select>
        <span className="h-4 w-px bg-ink-900/10 mx-1" />
        <RichBtn icon={Bold} />
        <RichBtn icon={Italic} />
        <RichBtn icon={Underline} />
        <span className="h-4 w-px bg-ink-900/10 mx-1" />
        <RichBtn icon={List} />
        <RichBtn icon={ListOrdered} />
        <span className="h-4 w-px bg-ink-900/10 mx-1" />
        <RichBtn icon={Quote} />
        <RichBtn icon={Filter} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[760px] mx-auto px-12 py-10">
          <h1 className="font-editorial text-[34px] text-ink-900 leading-tight mb-3">
            Working notes - research program
          </h1>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full min-h-[600px] resize-none outline-none text-[14px] leading-[1.7] text-ink-800 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function RichBtn({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <button className="h-6 w-6 grid place-items-center rounded hover:bg-white text-ink-700">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

/* ---------- shared ---------- */

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-400 font-medium">
      {children}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="inline-flex h-7 items-center gap-1.5 rounded border border-ink-900/12 bg-white px-2 w-[260px]">
      <Search className="h-3 w-3 text-ink-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-[11.5px] text-ink-800 bg-transparent"
      />
    </div>
  );
}

export const TOOL_IDS = Object.keys(TOOL_REGISTRY);
