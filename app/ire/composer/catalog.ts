import {
  Sparkles,
  Wrench,
  Cpu,
  FileText,
  ListChecks,
  GitBranch,
  Zap,
  Brain,
  BookOpen,
  Network,
  ScrollText,
  FlaskConical,
  Compass,
  Radar,
  SigmaSquare,
  Code2,
  Calculator,
  PenLine,
  Microscope,
  LineChart,
  Camera,
  Database,
  Quote,
  ImageIcon,
  Hammer,
  Eye,
  GraduationCap,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

export type Category =
  | "skill"
  | "tool"
  | "mode"
  | "agent"
  | "template"
  | "action";

export type CatalogEntry = {
  id: string;
  category: Category;
  label: string;
  hint: string;
  icon: LucideIcon;
  keywords: string[];
};

export const CATEGORY_ORDER: Category[] = [
  "skill",
  "tool",
  "mode",
  "agent",
  "template",
  "action",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  skill: "Skills",
  tool: "Tools",
  mode: "Modes",
  agent: "Agents",
  template: "Templates",
  action: "Actions",
};

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  skill: Sparkles,
  tool: Wrench,
  mode: Cpu,
  agent: Brain,
  template: FileText,
  action: Zap,
};

export const CATALOG: CatalogEntry[] = [
  // Skills - domain-neutral methodological capabilities
  { id: "synthesize", category: "skill", label: "Synthesize literature", hint: "Read across sources, produce a structured review", icon: BookOpen, keywords: ["review", "lit", "summary"] },
  { id: "find-contradictions", category: "skill", label: "Find contradictions", hint: "Surface conflicting claims across cited work", icon: AlertCircle, keywords: ["disagree", "conflict"] },
  { id: "design-method", category: "skill", label: "Design method", hint: "Draft a methodology for the active question", icon: Microscope, keywords: ["protocol", "plan"] },
  { id: "stat-analyze", category: "skill", label: "Statistical analysis", hint: "Choose tests, run them, write up results", icon: SigmaSquare, keywords: ["t-test", "anova", "regression", "stats"] },
  { id: "draft-figure", category: "skill", label: "Draft figure", hint: "Generate a publication-ready figure from data", icon: LineChart, keywords: ["plot", "chart", "viz"] },
  { id: "draft-manuscript", category: "skill", label: "Draft manuscript section", hint: "Write methods, results, or discussion", icon: PenLine, keywords: ["write", "paper", "section"] },
  { id: "peer-review", category: "skill", label: "Peer-review simulation", hint: "Critique like a tough but fair reviewer", icon: Eye, keywords: ["review", "critique"] },
  { id: "draft-grant", category: "skill", label: "Draft grant section", hint: "Specific aims, significance, approach", icon: GraduationCap, keywords: ["proposal", "nih", "nsf"] },
  { id: "replicate", category: "skill", label: "Replication check", hint: "Identify steps needed to reproduce a result", icon: Hammer, keywords: ["reproduce"] },
  { id: "rank-hypotheses", category: "skill", label: "Rank hypotheses", hint: "Score by evidence, novelty, feasibility", icon: ListChecks, keywords: ["score", "compare"] },
  { id: "extract-claims", category: "skill", label: "Extract claims", hint: "Pull atomic claims with citations from a paper", icon: Quote, keywords: ["pull", "extract", "claims"] },

  // Tools - concrete environments
  { id: "python", category: "tool", label: "Python REPL", hint: "Run Python with NumPy / Pandas / SciPy preloaded", icon: Code2, keywords: ["py", "jupyter", "code"] },
  { id: "r", category: "tool", label: "R REPL", hint: "Statistical computing - run R inline", icon: Code2, keywords: ["rstats"] },
  { id: "julia", category: "tool", label: "Julia", hint: "High-performance numerics", icon: Code2, keywords: ["scientific computing"] },
  { id: "latex", category: "tool", label: "LaTeX compile", hint: "Compile a snippet, get the PDF back", icon: FileText, keywords: ["tex", "math", "pdf"] },
  { id: "math", category: "tool", label: "Symbolic math", hint: "Algebra, calculus, equations - exact answers", icon: Calculator, keywords: ["sympy", "wolfram", "cas"] },
  { id: "viz", category: "tool", label: "Viz studio", hint: "Compose interactive figures from a dataset", icon: LineChart, keywords: ["plot", "chart"] },
  { id: "canvas", category: "tool", label: "Canvas", hint: "Spatial workspace for diagrams and notes", icon: ImageIcon, keywords: ["whiteboard"] },
  { id: "cite", category: "tool", label: "Citation manager", hint: "Insert formatted citations in your style", icon: Quote, keywords: ["zotero", "mendeley", "bib"] },
  { id: "data-explorer", category: "tool", label: "Data explorer", hint: "Browse, filter, profile a tabular dataset", icon: Database, keywords: ["pandas", "duckdb"] },

  // Modes - behavioural settings
  { id: "suggest", category: "mode", label: "Suggest", hint: "Propose, never execute - you approve every step", icon: Eye, keywords: ["readonly", "review"] },
  { id: "semi-auto", category: "mode", label: "Semi-auto", hint: "Run trusted actions; pause for risk", icon: Zap, keywords: ["balanced"] },
  { id: "full-auto", category: "mode", label: "Full-auto", hint: "Run end-to-end with provenance trace", icon: Cpu, keywords: ["autonomous"] },
  { id: "pair", category: "mode", label: "Pair", hint: "Two-way back-and-forth, synchronous", icon: Compass, keywords: ["paired"] },
  { id: "plan-only", category: "mode", label: "Plan only", hint: "Produce a step-by-step plan, no execution", icon: ListChecks, keywords: ["dry-run"] },
  { id: "critique", category: "mode", label: "Critique", hint: "Tear apart your own argument first", icon: Eye, keywords: ["red-team"] },

  // Agents - field-agnostic team
  { id: "compass", category: "agent", label: "Compass · orchestrator", hint: "Routes work across the team, tracks progress", icon: Compass, keywords: ["pi", "lead"] },
  { id: "brain", category: "agent", label: "Brain · hypothesist", hint: "Generates and ranks competing hypotheses", icon: Brain, keywords: ["ideate"] },
  { id: "sigma", category: "agent", label: "Sigma · analyst", hint: "Statistics, modelling, uncertainty", icon: SigmaSquare, keywords: ["stats"] },
  { id: "scroll", category: "agent", label: "Scroll · writer", hint: "Drafts manuscripts, grants, reports", icon: ScrollText, keywords: ["write"] },
  { id: "network", category: "agent", label: "Network · grapher", hint: "Builds and queries the knowledge graph", icon: Network, keywords: ["kg"] },
  { id: "radar", category: "agent", label: "Radar · anomaly hunter", hint: "Watches runs and flags drift", icon: Radar, keywords: ["watch"] },
  { id: "witness", category: "agent", label: "Witness · auditor", hint: "Checks reproducibility and provenance", icon: Eye, keywords: ["audit", "reproducibility"] },
  { id: "kepler", category: "agent", label: "Kepler · experiment designer", hint: "Designs experiments with power analysis", icon: FlaskConical, keywords: ["doe"] },

  // Templates - starters
  { id: "tpl-protocol", category: "template", label: "Protocol", hint: "Start a step-by-step protocol document", icon: ListChecks, keywords: ["procedure", "method"] },
  { id: "tpl-manuscript", category: "template", label: "Manuscript", hint: "IMRaD scaffold with figure slots", icon: FileText, keywords: ["paper"] },
  { id: "tpl-grant", category: "template", label: "Grant proposal", hint: "Aims, significance, approach, budget", icon: GraduationCap, keywords: ["nih", "nsf", "erc"] },
  { id: "tpl-figure", category: "template", label: "Figure layout", hint: "Multi-panel figure with caption block", icon: ImageIcon, keywords: ["plot"] },
  { id: "tpl-poster", category: "template", label: "Conference poster", hint: "Standard 36×48 poster scaffold", icon: PenLine, keywords: ["pdf"] },
  { id: "tpl-prereg", category: "template", label: "Preregistration", hint: "Hypothesis, design, analysis plan", icon: ListChecks, keywords: ["osf"] },
  { id: "tpl-report", category: "template", label: "Lab report", hint: "Concise internal write-up", icon: FileText, keywords: ["memo"] },

  // Actions - verbs
  { id: "run-experiment", category: "action", label: "Run experiment", hint: "Queue the active experiment on compute", icon: FlaskConical, keywords: ["execute"] },
  { id: "queue-job", category: "action", label: "Queue job", hint: "Submit a long-running job to your cluster", icon: Cpu, keywords: ["hpc"] },
  { id: "preregister", category: "action", label: "Preregister", hint: "Sign and timestamp the current plan", icon: GitBranch, keywords: ["osf", "stamp"] },
  { id: "export", category: "action", label: "Export", hint: "Bundle artifacts into a portable package", icon: FileText, keywords: ["zip", "share"] },
  { id: "share", category: "action", label: "Share with collaborator", hint: "Generate a sharable read-only link", icon: GitBranch, keywords: ["invite"] },
  { id: "snapshot", category: "action", label: "Snapshot project", hint: "Pin a versioned snapshot for citation", icon: Camera, keywords: ["pin", "version"] },
];

export function filterCatalog(query: string): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG;
  return CATALOG.filter((e) => {
    if (e.id.toLowerCase().includes(q)) return true;
    if (e.label.toLowerCase().includes(q)) return true;
    if (e.hint.toLowerCase().includes(q)) return true;
    if (e.keywords.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function groupByCategory(
  entries: CatalogEntry[]
): { category: Category; entries: CatalogEntry[] }[] {
  const map = new Map<Category, CatalogEntry[]>();
  for (const e of entries) {
    if (!map.has(e.category)) map.set(e.category, []);
    map.get(e.category)!.push(e);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
    category: c,
    entries: map.get(c)!,
  }));
}
