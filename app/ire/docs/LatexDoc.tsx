"use client";

import * as React from "react";
import {
  History,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Sigma,
  FileText,
  Download,
  Settings2,
  Code2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/cn";

const SAMPLE_LATEX = `\\documentclass[a4,notitlepage,12pt]{jedm}
%\\usepackage[sc,sf,small]{titlesec}\\subsection{Subsection Title}
\\usepackage[table]{xcolor}
\\usepackage{url}
% \\usepackage{acmtrans}

\\begin{document}

\\title{Submission Instructions}
\\date{}

\\author{{\\large Author One}\\\\Institution of Author one\\\\email.of@author.dom \\and
{\\large Second Author}\\\\Affiliation\\\\email@xx.xx \\and {\\large Third
Author}\\\\Affiliation\\\\email@xx.xx }

\\maketitle

\\begin{abstract}
This document serves both as JEDM submission instruction and as a template file.
This is the abstract. It should contain from 100 to 250 words.
\\end{abstract}

\\section{Paper format}

Manuscripts should be formatted for A4 sized paper, one side only, leaving 2.75cm
margins on the right and left sides and 2.25cm on the top and bottom. Body font
should be Times Roman 12pt and sections, title, and authors font should be
Helvetica.

\\section{Style files}

For LaTeX, a style file named \\texttt{jedm.cls} is provided on the journal's web
site. An MS Word file containing this example text is also provided,
\\texttt{jedm.doc}, which can be used as a template.

\\section{Figures and tables}

Each figure and table must be mentioned in the text, and must be numbered
consecutively in order of appearance (with captions in lower case). For the review
process, the figures should be integrated into the text rather than being inserted
at the end of the document.
\\end{document}
`;

export function LatexDoc({ name }: { name: string }) {
  const [src, setSrc] = React.useState(SAMPLE_LATEX);
  const [view, setView] = React.useState<"split" | "code" | "preview">("split");

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <Toolbar view={view} setView={setView} name={name} />
      <div className="flex-1 min-h-0 flex">
        {view !== "preview" && (
          <CodePane src={src} onChange={setSrc} full={view === "code"} />
        )}
        {view === "split" && <div className="w-px bg-ink-900/8" />}
        {view !== "code" && <PreviewPane full={view === "preview"} />}
      </div>
    </div>
  );
}

function Toolbar({
  view,
  setView,
  name,
}: {
  view: "split" | "code" | "preview";
  setView: (v: "split" | "code" | "preview") => void;
  name: string;
}) {
  return (
    <div className="h-10 shrink-0 flex items-center gap-1 px-3 border-b border-ink-900/8 bg-white text-[12px]">
      <ToolbarBtn icon={History} label="History" />
      <Sep />
      <ToolbarBtn icon={Undo2} label="Undo" />
      <ToolbarBtn icon={Redo2} label="Redo" />
      <Sep />
      <ToolbarBtn icon={Bold} label="Bold" />
      <ToolbarBtn icon={Italic} label="Italic" />
      <ToolbarBtn icon={Underline} label="Underline" />
      <Sep />
      <select className="h-7 px-2 rounded border border-ink-900/10 bg-white text-[11.5px] text-ink-700">
        <option>Normal text</option>
        <option>Section</option>
        <option>Subsection</option>
        <option>Subsubsection</option>
      </select>
      <Sep />
      <ToolbarBtn icon={Sigma} label="Equation" />
      <ToolbarBtn icon={FileText} label="Citation" />

      <div className="ml-auto flex items-center gap-1">
        <span className="text-[11px] text-ink-400 font-mono mr-2 truncate max-w-[200px]">
          {name}.tex
        </span>
        <ViewToggle view={view} setView={setView} />
        <button className="h-7 inline-flex items-center gap-1 rounded border border-ink-900/10 bg-white px-2 text-[11.5px] text-ink-700 hover:bg-parchment-50">
          <Settings2 className="h-3 w-3" /> LaTeX options
        </button>
        <button className="h-7 inline-flex items-center gap-1 rounded bg-ink-900 text-parchment-50 px-2.5 text-[11.5px] font-medium hover:bg-ink-800">
          <Download className="h-3 w-3" /> Recompile
        </button>
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  setView,
}: {
  view: "split" | "code" | "preview";
  setView: (v: "split" | "code" | "preview") => void;
}) {
  return (
    <div className="inline-flex h-7 items-center rounded border border-ink-900/10 bg-white overflow-hidden">
      {(
        [
          { id: "code", icon: Code2, label: "Code" },
          { id: "split", icon: null, label: "Split" },
          { id: "preview", icon: Eye, label: "Preview" },
        ] as const
      ).map((b) => (
        <button
          key={b.id}
          onClick={() => setView(b.id)}
          className={cn(
            "h-full px-2 text-[11px] inline-flex items-center gap-1",
            view === b.id ? "bg-ink-900 text-parchment-50" : "text-ink-700 hover:bg-parchment-50"
          )}
        >
          {b.icon ? <b.icon className="h-3 w-3" /> : null}
          {b.label}
        </button>
      ))}
    </div>
  );
}

function ToolbarBtn({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      title={label}
      className="h-7 w-7 grid place-items-center rounded text-ink-600 hover:bg-parchment-50"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function Sep() {
  return <span className="h-5 w-px bg-ink-900/10 mx-0.5" />;
}

function CodePane({
  src,
  onChange,
  full,
}: {
  src: string;
  onChange: (v: string) => void;
  full: boolean;
}) {
  const lines = src.split("\n");
  return (
    <div className={cn("min-h-0 overflow-y-auto", full ? "flex-1" : "flex-1 basis-1/2")}>
      <div className="flex font-mono text-[12.5px] leading-[1.7]">
        <div className="select-none text-right text-ink-400 bg-parchment-50 border-r border-ink-900/8 py-3 px-3 min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          spellCheck={false}
          value={src}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 py-3 px-4 outline-none resize-none text-ink-800 bg-white"
          style={{ minHeight: "100%", lineHeight: "1.7" }}
          rows={lines.length + 4}
        />
      </div>
    </div>
  );
}

function PreviewPane({ full }: { full: boolean }) {
  return (
    <div
      className={cn(
        "min-h-0 overflow-y-auto bg-parchment-50",
        full ? "flex-1" : "flex-1 basis-1/2"
      )}
    >
      <div className="flex items-center justify-between h-10 px-4 border-b border-ink-900/8 bg-white text-[11.5px] text-ink-600 sticky top-0 z-10">
        <span>PDF preview</span>
        <span className="font-mono text-[10.5px] text-ink-400">words 670 · 1/3</span>
      </div>
      <div className="px-8 py-8">
        <div className="mx-auto max-w-[640px] bg-white shadow-page border border-ink-900/8 rounded-sm px-12 py-14 text-ink-900">
          <h1 className="text-[22px] font-semibold leading-tight">
            Submission Instructions
          </h1>
          <div className="mt-6 grid grid-cols-3 gap-4 text-[10.5px]">
            {["Author One", "Second Author", "Third Author"].map((a, i) => (
              <div key={a}>
                <div className="font-semibold">{a}</div>
                <div className="text-ink-500">
                  {i === 0 ? "Institution of Author one" : "Affiliation"}
                </div>
                <div className="text-ink-500 font-mono">
                  {i === 0 ? "email.of@author.dom" : "email@xx.xx"}
                </div>
              </div>
            ))}
          </div>
          <hr className="my-5 border-ink-900/15" />
          <p className="text-[10.5px] leading-relaxed">
            This document serves both as JEDM submission instruction and as a
            template file. This is the abstract. It should contain from 100 to 250
            words.
          </p>
          <h2 className="mt-6 text-[12px] font-semibold uppercase tracking-wider">
            1. Paper format
          </h2>
          <p className="mt-1.5 text-[10.5px] leading-relaxed">
            Manuscripts should be formatted for A4 sized paper, one side only,
            leaving 2.75cm margins on the right and left sides and 2.25cm on the
            top and bottom. Body font should be Times Roman 12pt and sections,
            title, and authors font should be Helvetica.
          </p>
          <h2 className="mt-5 text-[12px] font-semibold uppercase tracking-wider">
            2. Style files
          </h2>
          <p className="mt-1.5 text-[10.5px] leading-relaxed">
            For LaTeX, a style file named{" "}
            <span className="font-mono">jedm.cls</span> is provided on the
            journal&rsquo;s web site. An MS Word file containing this example text
            is also provided, <span className="font-mono">jedm.doc</span>, which
            can be used as a template.
          </p>
          <h2 className="mt-5 text-[12px] font-semibold uppercase tracking-wider">
            3. Figures and tables
          </h2>
          <p className="mt-1.5 text-[10.5px] leading-relaxed">
            Each figure and table must be mentioned in the text, and must be
            numbered consecutively in order of appearance (with captions in lower
            case).
          </p>
          <table className="mt-4 text-[10.5px] border-collapse">
            <thead>
              <tr className="border-b border-ink-900/30">
                <th className="text-left pr-6 py-1">Margin</th>
                <th className="text-left py-1">Size</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["left", "2.75cm"],
                ["right", "2.75cm"],
                ["top", "2.25cm"],
                ["bottom", "2.25cm"],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-ink-900/10">
                  <td className="pr-6 py-1">{k}</td>
                  <td className="py-1 font-mono">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-8 text-center text-[9px] text-ink-400 font-mono">1</p>
        </div>
      </div>
    </div>
  );
}
