"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Bot,
  ChevronDown,
  Command,
  Compass,
  GitBranch,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import {
  LATTICE_ARTIFACTS,
  LATTICE_COMMANDS,
  LATTICE_EXPERIMENTS,
  LATTICE_LABS,
  LATTICE_MESSAGES,
  LATTICE_NAV,
  STATUS_LABEL,
  artifactsForExperiment,
  experimentsForLab,
  type GraphNode,
  type LatticeArtifact,
  type LatticeExperiment,
  type LatticeNavId,
  type StudioView,
} from "@/lib/lattice-studio-model";
import { LatticeStudioGraph } from "./LatticeStudioGraph";
import "@/app/lattice/lattice-studio.css";

const NAV_ICONS: Record<LatticeNavId, React.ElementType> = {
  overview: LayoutGrid,
  guide: Sparkles,
  graph: GitBranch,
  agent: Bot,
  explore: Compass,
  sources: BookOpen,
  skills: Wrench,
  cli: Terminal,
};

const MODES = ["Research", "Biology", "Write", "Flywheel"] as const;
const INBOX_FILTERS = ["All", "Running", "Blocked", "Done"] as const;

type GraphFilter = "all" | "repro" | "contradicted";

function statusClass(status: LatticeExperiment["status"]) {
  return `lattice-studio__pill lattice-studio__pill--${status}`;
}

export function LatticeStudioShell({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = React.useState<StudioView>("studio");
  const [nav, setNav] = React.useState<LatticeNavId>("overview");
  const [mode, setMode] = React.useState<(typeof MODES)[number]>("Research");
  const [labId, setLabId] = React.useState("my-lab");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [inboxFilter, setInboxFilter] = React.useState<(typeof INBOX_FILTERS)[number]>("All");
  const [selectedArtifactId, setSelectedArtifactId] = React.useState<string | null>("a4");
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [paletteQuery, setPaletteQuery] = React.useState("");
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const [graphFilter, setGraphFilter] = React.useState<GraphFilter>("all");
  const [composer, setComposer] = React.useState("");
  const [homePrompt, setHomePrompt] = React.useState("");
  const [messages, setMessages] = React.useState(LATTICE_MESSAGES);
  const [reproToast, setReproToast] = React.useState<string | null>(null);

  const experiments = experimentsForLab(labId);
  const filteredInbox = experiments.filter((e) => {
    if (inboxFilter === "All") return true;
    if (inboxFilter === "Running") return e.status === "running";
    if (inboxFilter === "Blocked") return e.status === "blocked";
    if (inboxFilter === "Done") return e.status === "done";
    return true;
  });

  const selected =
    LATTICE_EXPERIMENTS.find((e) => e.id === selectedId) ?? null;
  const artifacts = selected ? artifactsForExperiment(selected.id) : LATTICE_ARTIFACTS;
  const showManager =
    view === "studio" &&
    nav !== "graph" &&
    !["sources", "skills", "explore", "guide", "cli"].includes(nav);
  const showDetailSplit = Boolean(selected) && (nav === "agent" || selectedId);

  const filteredCommands = LATTICE_COMMANDS.filter(
    (c) =>
      !paletteQuery ||
      c.label.toLowerCase().includes(paletteQuery.toLowerCase()) ||
      c.hint.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setView((v) => (v === "studio" ? "graph" : "studio"));
        if (view === "studio") setNav("graph");
      }
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view]);

  React.useEffect(() => {
    if (!paletteOpen) {
      setPaletteQuery("");
      setPaletteIndex(0);
    }
  }, [paletteOpen]);

  function runCommand(id: string) {
    setPaletteOpen(false);
    if (id === "graph") {
      setView("graph");
      setNav("graph");
      return;
    }
    if (id === "studio") {
      setView("studio");
      setNav("overview");
      return;
    }
    if (id === "replicate") {
      setReproToast("REPRO signed · cid:rep-new… against cid:91bd…04e");
      setTimeout(() => setReproToast(null), 3200);
      return;
    }
    if (id === "zenodo") {
      setReproToast("DOI mint queued via Zenodo · tag cid:8f3a…c21");
      setTimeout(() => setReproToast(null), 3200);
    }
  }

  function onPaletteKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPaletteIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setPaletteIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredCommands[paletteIndex]) {
      e.preventDefault();
      runCommand(filteredCommands[paletteIndex].id);
    }
  }

  function selectExperiment(exp: LatticeExperiment) {
    setSelectedId(exp.id);
    setNav("agent");
  }

  function selectNav(id: LatticeNavId) {
    setNav(id);
    if (id === "graph") {
      setView("graph");
    } else {
      setView("studio");
      if (id === "overview") setSelectedId(null);
    }
  }

  function submitComposer() {
    const text = composer.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, role: "user", content: text, time: "now" },
    ]);
    if (text.startsWith("/replicate")) runCommand("replicate");
    setComposer("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          content: "Updated artifact feed · verify with artifacts, not logs.",
          time: "now",
        },
      ]);
    }, 500);
  }

  function startFromHome() {
    if (!homePrompt.trim()) return;
    setSelectedId("exp-447");
    setNav("agent");
    setComposer(homePrompt);
    setHomePrompt("");
  }

  return (
    <div className={`lattice-studio${embedded ? " lattice-studio--embedded" : ""}`}>
      <header className="lattice-studio__topbar">
        <div className="lattice-studio__project">
          <span className="lattice-studio__logo">LT</span>
          <button type="button" className="lattice-studio__project-select">
            <span className="lattice-studio__project-name">K11 · ribozyme catalysis</span>
            <span className="lattice-studio__project-meta">Lattice project graph</span>
          </button>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--ls-text-faint)]" />
        </div>

        <div className="lattice-studio__modes" role="tablist" aria-label="Research modes">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              className="lattice-studio__mode"
              data-active={mode === m}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="lattice-studio__view-toggle">
          <button
            type="button"
            className="lattice-studio__view-btn"
            data-active={view === "studio"}
            onClick={() => {
              setView("studio");
              setNav("overview");
            }}
          >
            <MessageSquare className="h-3 w-3" />
            Manager
            <kbd className="font-mono text-[9px] opacity-50">⌘E</kbd>
          </button>
          <button
            type="button"
            className="lattice-studio__view-btn"
            data-active={view === "graph"}
            onClick={() => {
              setView("graph");
              setNav("graph");
            }}
          >
            <GitBranch className="h-3 w-3" />
            Graph
          </button>
        </div>

        <div className="lattice-studio__top-actions">
          <button
            type="button"
            className="lattice-studio__icon-btn"
            aria-label="Search"
            onClick={() => setPaletteOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="lattice-studio__icon-btn"
            aria-label="Command palette"
            onClick={() => setPaletteOpen(true)}
          >
            <Command className="h-3.5 w-3.5" />
          </button>
          {!embedded && (
            <Link href="/products?lattice=1" className="lattice-studio__btn">
              About
            </Link>
          )}
          <span className="lattice-studio__avatar">SM</span>
        </div>
      </header>

      <div className="lattice-studio__body">
        <nav className="lattice-studio__nav" aria-label="Atlas surfaces">
          {LATTICE_NAV.map((item) => {
            const Icon = NAV_ICONS[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className="lattice-studio__nav-item"
                data-active={nav === item.id}
                title={item.hint}
                onClick={() => selectNav(item.id)}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.65} />
                {item.label}
              </button>
            );
          })}
          <div className="lattice-studio__nav-spacer" />
        </nav>

        {view === "graph" || nav === "graph" ? (
          <LatticeStudioGraph
            filter={graphFilter}
            onFilterChange={setGraphFilter}
            selectedNodeId={null}
            onSelectNode={(node: GraphNode) => {
              setView("studio");
              setNav("agent");
              if (node.label.includes("447")) {
                setSelectedId("exp-447");
              }
            }}
          />
        ) : showManager ? (
          <div className="lattice-studio__manager">
            <aside className="lattice-studio__workspaces">
              <div className="lattice-studio__panel-head">
                <span>Workspaces</span>
                <button type="button" aria-label="New workspace">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="lattice-studio__workspace-list">
                {LATTICE_LABS.map((lab) => (
                  <button
                    key={lab.id}
                    type="button"
                    className="lattice-studio__workspace-btn"
                    data-active={labId === lab.id}
                    onClick={() => setLabId(lab.id)}
                  >
                    <span className="lattice-studio__workspace-dot" />
                    <span className="truncate">{lab.name}</span>
                  </button>
                ))}
              </div>
              <div className="lattice-studio__playground">
                <strong>Playground</strong>
                Ephemeral sandbox · data writes not versioned
              </div>
            </aside>

            <aside className="lattice-studio__inbox">
              <div className="lattice-studio__panel-head">
                <span>Inbox</span>
                <span className="normal-case tracking-normal font-normal text-[var(--ls-text-faint)]">
                  {filteredInbox.length}
                </span>
              </div>
              <div className="lattice-studio__inbox-filters">
                {INBOX_FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className="lattice-studio__inbox-filter"
                    data-active={inboxFilter === f}
                    onClick={() => setInboxFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="lattice-studio__inbox-list">
                {filteredInbox.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    className="lattice-studio__thread"
                    data-active={selectedId === exp.id}
                    onClick={() => selectExperiment(exp)}
                  >
                    <span className="lattice-studio__thread-avatar">
                      {exp.code.replace("exp-", "")}
                    </span>
                    <span className="lattice-studio__thread-body">
                      <span className="lattice-studio__thread-top">
                        <span className="lattice-studio__thread-title">{exp.title}</span>
                        <span className="lattice-studio__thread-time">{exp.updatedAt}</span>
                      </span>
                      <span className="lattice-studio__thread-preview">
                        {exp.program} · {exp.claimHash}
                      </span>
                      <span className="lattice-studio__thread-meta">
                        <span className={statusClass(exp.status)}>
                          {STATUS_LABEL[exp.status]}
                        </span>
                        {exp.reproCount > 0 && (
                          <span className="lattice-studio__pill lattice-studio__pill--done">
                            {exp.reproCount} repro
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="lattice-studio__detail">
              {showDetailSplit && selected ? (
                <AgentDetail
                  experiment={selected}
                  artifacts={artifacts}
                  messages={messages}
                  composer={composer}
                  selectedArtifactId={selectedArtifactId}
                  onComposerChange={setComposer}
                  onSubmit={submitComposer}
                  onSelectArtifact={setSelectedArtifactId}
                />
              ) : (
                <AtlasHome
                  homePrompt={homePrompt}
                  onHomePromptChange={setHomePrompt}
                  onStart={startFromHome}
                  onQuickAction={(id) => {
                    if (id === "graph") {
                      setView("graph");
                      setNav("graph");
                    } else if (id === "replicate") {
                      selectExperiment(
                        LATTICE_EXPERIMENTS.find((e) => e.id === "exp-447")!
                      );
                      runCommand("replicate");
                    } else {
                      selectExperiment(
                        LATTICE_EXPERIMENTS.find((e) => e.id === "exp-447")!
                      );
                    }
                  }}
                />
              )}
            </main>
          </div>
        ) : (
          <SurfacePanel nav={nav} />
        )}
      </div>

      {paletteOpen && (
        <>
          <button
            type="button"
            className="lattice-studio__palette-backdrop"
            aria-label="Close"
            onClick={() => setPaletteOpen(false)}
          />
          <div className="lattice-studio__palette" role="dialog">
            <input
              autoFocus
              className="lattice-studio__palette-input"
              placeholder="Search commands, workflows, nodes…"
              value={paletteQuery}
              onChange={(e) => {
                setPaletteQuery(e.target.value);
                setPaletteIndex(0);
              }}
              onKeyDown={onPaletteKeyDown}
            />
            <div className="max-h-[280px] overflow-y-auto py-1">
              {filteredCommands.map((cmd, i) => (
                <button
                  key={cmd.id}
                  type="button"
                  className="lattice-studio__palette-item"
                  data-active={i === paletteIndex}
                  onClick={() => runCommand(cmd.id)}
                >
                  <span className="text-[13px] font-medium">{cmd.label}</span>
                  <span className="text-[11px] text-[var(--ls-text-muted)]">{cmd.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {reproToast && <div className="lattice-studio__toast">{reproToast}</div>}
    </div>
  );
}

function AgentDetail({
  experiment,
  artifacts,
  messages,
  composer,
  selectedArtifactId,
  onComposerChange,
  onSubmit,
  onSelectArtifact,
}: {
  experiment: LatticeExperiment;
  artifacts: LatticeArtifact[];
  messages: typeof LATTICE_MESSAGES;
  composer: string;
  selectedArtifactId: string | null;
  onComposerChange: (v: string) => void;
  onSubmit: () => void;
  onSelectArtifact: (id: string) => void;
}) {
  return (
    <>
      <div className="lattice-studio__trust-row">
        <span className="lattice-studio__trust-chip">
          Compute <strong>Request review</strong>
        </span>
        <span className="lattice-studio__trust-chip">
          Data write <strong>Agent decides</strong>
        </span>
        <span className="lattice-studio__trust-chip">
          External API <strong>Request review</strong>
        </span>
        <span className="lattice-studio__trust-chip ml-auto">
          Cap <strong>$42 / $50</strong>
        </span>
      </div>

      <div className="lattice-studio__detail-head">
        <div className="min-w-0">
          <div className="lattice-studio__detail-title">{experiment.title}</div>
          <div className="lattice-studio__detail-sub">
            {experiment.runHash} · {experiment.reproCount} REPRO · {experiment.program}
          </div>
        </div>
        <div className="lattice-studio__act-rail">
          {(["hypothesis", "protocol", "run", "walkthrough"] as const).map((act, i) => (
            <span
              key={act}
              className="lattice-studio__act"
              data-done={i < 2}
              data-current={i === 2}
            >
              {act}
            </span>
          ))}
        </div>
      </div>

      <div className="lattice-studio__split">
        <div className="lattice-studio__chat-pane">
          <div className="lattice-studio__pane-head">
            <span>Agent thread</span>
            <span className="font-normal text-[var(--ls-text-faint)]">Verify with artifacts</span>
          </div>
          <div className="lattice-studio__chat-scroll">
            <div className="lattice-studio__chat">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`lattice-studio__msg lattice-studio__msg--${m.role}`}
                >
                  {m.content}
                </div>
              ))}
            </div>
          </div>
          <div className="lattice-studio__composer">
            <input
              className="lattice-studio__composer-input"
              placeholder="Message agent · /replicate · @node:exp-447"
              value={composer}
              onChange={(e) => onComposerChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            />
            <button
              type="button"
              className="lattice-studio__btn lattice-studio__btn--primary"
              onClick={onSubmit}
            >
              Send
            </button>
          </div>
          <div className="lattice-studio__composer-hint">
            ⌘K palette · highlight figure regions in artifact feed → inline comment
          </div>
        </div>

        <aside className="lattice-studio__artifact-pane">
          <div className="lattice-studio__pane-head">
            <span>Artifacts</span>
            <span className="font-normal text-[var(--ls-text-faint)]">
              {artifacts.length} typed
            </span>
          </div>
          <div className="lattice-studio__artifact-scroll">
            {artifacts.map((a) => (
              <button
                key={a.id}
                type="button"
                className="lattice-studio__artifact-card w-full text-left"
                data-selected={selectedArtifactId === a.id}
                onClick={() => onSelectArtifact(a.id)}
              >
                <div className="lattice-studio__artifact-type">{a.kind}</div>
                <div className="lattice-studio__artifact-title">{a.title}</div>
                <div className="lattice-studio__artifact-preview">{a.preview}</div>
                <div className="lattice-studio__hash mt-1">{a.hash}</div>
                {a.kind === "figure" && selectedArtifactId === a.id && (
                  <>
                    <div className="lattice-studio__figure-box">
                      <div className="lattice-studio__figure-highlight" />
                    </div>
                    <div className="lattice-studio__comment-pin">
                      Region comment · agent will iterate this subplot
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

function AtlasHome({
  homePrompt,
  onHomePromptChange,
  onStart,
  onQuickAction,
}: {
  homePrompt: string;
  onHomePromptChange: (v: string) => void;
  onStart: () => void;
  onQuickAction: (id: string) => void;
}) {
  return (
    <div className="lattice-studio__home">
      <h1 className="lattice-studio__home-greeting">What are we investigating?</h1>
      <p className="lattice-studio__home-sub">
        Orchestrate AI co-scientists — lit synthesis to reproducible walkthrough in one graph.
      </p>

      <div className="lattice-studio__home-composer">
        <textarea
          rows={2}
          className="lattice-studio__home-input"
          placeholder="Replicate Zhang '25 loop-3 under EDTA perturbation…"
          value={homePrompt}
          onChange={(e) => onHomePromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onStart();
            }
          }}
        />
        <div className="lattice-studio__home-actions">
          <button type="button" className="lattice-studio__btn lattice-studio__btn--primary" onClick={onStart}>
            Start experiment
          </button>
          <button type="button" className="lattice-studio__home-chip" onClick={() => onQuickAction("sources")}>
            Add sources
          </button>
          <button type="button" className="lattice-studio__home-chip" onClick={() => onQuickAction("graph")}>
            Open graph
          </button>
        </div>
      </div>

      <div className="lattice-studio__home-grid">
        {[
          {
            id: "agent",
            title: "Continue exp-447",
            body: "Mg²⁺ sweep running · 2 REPRO · awaiting API approval",
          },
          {
            id: "replicate",
            title: "/replicate",
            body: "Sign a REPRO object after successful re-run — earned endorsement",
          },
          {
            id: "graph",
            title: "Project graph",
            body: "RUNs, CLAIMs, contradicts & supersedes — no false merges",
          },
        ].map((card) => (
          <button
            key={card.id}
            type="button"
            className="lattice-studio__home-card"
            onClick={() => onQuickAction(card.id)}
          >
            <div className="text-[13px] font-semibold">{card.title}</div>
            <div className="mt-1 text-[12px] text-[var(--ls-text-muted)] leading-relaxed">
              {card.body}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SurfacePanel({ nav }: { nav: LatticeNavId }) {
  const titles: Record<string, { title: string; sub: string }> = {
    guide: {
      title: "Guide",
      sub: "Agentic onboarding — same role as Atlas Guide surface",
    },
    explore: {
      title: "Explore",
      sub: "Federated discovery · claims REPRO'd by independent labs",
    },
    sources: {
      title: "Sources",
      sub: "PDFs, notes, arXiv — content hashed on ingest",
    },
    skills: {
      title: "Skills",
      sub: "Invokable primitives · /replicate /contradict /sweep /figure",
    },
    cli: {
      title: "CLI",
      sub: "Terminal surface — same harness as Manager & Graph",
    },
  };

  const meta = titles[nav] ?? { title: nav, sub: "" };

  return (
    <div className="lattice-studio__surface">
      <h2 className="lattice-studio__surface-title">{meta.title}</h2>
      <p className="lattice-studio__surface-sub">{meta.sub}</p>

      {nav === "guide" && (
        <div className="lattice-studio__guide-card">
          <ol className="list-decimal space-y-2 pl-5 text-[13px] text-[var(--ls-text-muted)] leading-relaxed">
            <li>Upload sources → structured citation graph (not embeddings).</li>
            <li>Hypothesis → Protocol → Run → Walkthrough — four approval gates.</li>
            <li>Manager inbox tracks queued / running / blocked / drifting threads.</li>
            <li>Comment on artifact regions — Antigravity pattern for science.</li>
            <li>⌘E Manager ↔ Graph · ⌘K command palette.</li>
          </ol>
        </div>
      )}

      {nav === "explore" && (
        <div className="lattice-studio__explore-card">
          <div className="lattice-studio__hash">diffusion-models · 30d</div>
          <p className="mt-2 text-[13px]">
            CLAIM-8841 — LoRA rank &lt; 8 preserves FID — 4 independent REPRO
          </p>
        </div>
      )}

      {nav === "sources" &&
        [
          { name: "Zhang et al. 2025 · loop-3.pdf", hash: "cid:pdf-z25" },
          { name: "Okonkwo supplementary · notes.md", hash: "cid:note-ok" },
          { name: "arxiv:2401.12345", hash: "cid:arxiv-2401" },
        ].map((s) => (
          <div key={s.hash} className="lattice-studio__row">
            <span>{s.name}</span>
            <span className="lattice-studio__hash">{s.hash}</span>
          </div>
        ))}

      {nav === "skills" &&
        [
          { name: "/replicate", desc: "Spawn REPRO against target hash" },
          { name: "/contradict", desc: "Open adjudication thread" },
          { name: "/sweep", desc: "Parallel fan-out from composer" },
          { name: "/figure", desc: "Commentable figure artifact" },
        ].map((s) => (
          <div key={s.name} className="lattice-studio__row">
            <span className="lattice-studio__hash">{s.name}</span>
            <span className="text-[var(--ls-text-muted)]">{s.desc}</span>
          </div>
        ))}

      {nav === "cli" && (
        <pre className="mt-4 rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-muted)] p-4 font-mono text-[11px] leading-relaxed">
          {`curl -fsSL https://lattice.vriu.dev/install | sh
lattice auth:status
lattice nodes:list
lattice repro exp-447 --seed 7`}
        </pre>
      )}
    </div>
  );
}
