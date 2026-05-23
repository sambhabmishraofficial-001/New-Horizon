import type { FileKind, InsightRecord } from "./data";
import type { WorkspaceBundle } from "./workspace-model";

export type ActivityItem =
  | "explorer"
  | "search"
  | "program"
  | "hypotheses"
  | "experiments"
  | "data"
  | "literature"
  | "protocols"
  | "lineage";

export type PinnedContext = {
  label: string;
  path?: string;
  kind?: FileKind;
  entityType?: "hypothesis" | "experiment" | "paper" | "dataset" | "protocol";
  entityId?: string;
};

export type InsightNavigation = {
  activity?: ActivityItem;
  path?: string;
  name?: string;
  kind?: FileKind;
  pin?: PinnedContext;
};

function findHypothesis(bundle: WorkspaceBundle, ref: string) {
  return bundle.hypotheses.find(
    (h) => h.id === ref || h.path.includes(ref) || h.title.includes(ref)
  );
}

function findExperiment(bundle: WorkspaceBundle, ref: string) {
  return bundle.experiments.find(
    (e) => e.id === ref || e.path.includes(ref) || e.title.includes(ref)
  );
}

function extractId(text: string, prefix: string): string | null {
  const re = new RegExp(`${prefix}-\\d{3}`, "i");
  const match = text.match(re);
  return match ? match[0].toUpperCase() : null;
}

/** Map agent insight actions to IRE navigation - bundle-aware, no hard-coded vendor copy. */
export function resolveInsightNavigation(
  insight: InsightRecord,
  bundle: WorkspaceBundle
): InsightNavigation | null {
  const text = `${insight.title} ${insight.body} ${insight.action ?? ""}`;

  const hypRef =
    extractId(text, "H") ??
    bundle.hypotheses.find((h) => text.includes(h.id))?.id;
  if (hypRef) {
    const hyp = findHypothesis(bundle, hypRef);
    if (hyp) {
      return {
        activity: insight.source === "lit" ? "literature" : "hypotheses",
        path: hyp.path,
        name: hyp.id,
        kind: "hyp",
        pin: {
          label: hyp.id,
          path: hyp.path,
          kind: "hyp",
          entityType: "hypothesis",
          entityId: hyp.id,
        },
      };
    }
  }

  const expRef =
    extractId(text, "EXP") ??
    bundle.experiments.find((e) => text.includes(e.id))?.id;
  if (expRef || insight.source === "exp") {
    const exp = expRef ? findExperiment(bundle, expRef) : bundle.experiments[0];
    if (exp) {
      return {
        activity: "experiments",
        path: exp.path,
        name: exp.id,
        kind: "planner",
        pin: {
          label: exp.id,
          path: exp.path,
          kind: "planner",
          entityType: "experiment",
          entityId: exp.id,
        },
      };
    }
  }

  if (insight.source === "kg" || insight.action?.toLowerCase().includes("gap")) {
    const map = bundle.tree
      .flatMap(function flatten(n): { path: string; name: string; kind?: string }[] {
        const row = n.kind
          ? [{ path: n.path, name: n.name, kind: n.kind }]
          : [];
        return [...row, ...(n.children?.flatMap(flatten) ?? [])];
      })
      .find((n) => n.kind === "map" || n.kind === "canvas");

    return {
      activity: "program",
      path: map?.path ?? bundle.hypotheses[0]?.path,
      name: map?.name ?? "program-map",
      kind: (map?.kind as FileKind) ?? "map",
      pin: { label: "Program map", entityType: "hypothesis", entityId: hypRef ?? undefined },
    };
  }

  if (insight.source === "protocol") {
    const proto = bundle.protocols[0];
    if (proto) {
      return {
        activity: "protocols",
        path: proto.path,
        name: proto.id,
        kind: "protocol",
        pin: {
          label: proto.id,
          path: proto.path,
          kind: "protocol",
          entityType: "protocol",
          entityId: proto.id,
        },
      };
    }
  }

  if (insight.source === "writing") {
    const ms = bundle.tree
      .flatMap(function flatten(n): { path: string; name: string; kind?: string }[] {
        const row = n.kind
          ? [{ path: n.path, name: n.name, kind: n.kind }]
          : [];
        return [...row, ...(n.children?.flatMap(flatten) ?? [])];
      })
      .find((n) => n.kind === "manuscript");

    if (ms) {
      return {
        activity: "explorer",
        path: ms.path,
        name: ms.name,
        kind: "manuscript",
        pin: { label: ms.name, path: ms.path, kind: "manuscript" },
      };
    }
  }

  if (insight.source === "analysis") {
    const ds = bundle.datasets[0];
    if (ds) {
      return {
        activity: "data",
        path: ds.path,
        name: ds.id,
        kind: "dataset",
        pin: {
          label: ds.id,
          path: ds.path,
          kind: "dataset",
          entityType: "dataset",
          entityId: ds.id,
        },
      };
    }
  }

  return { activity: "program" };
}

export type ProgramLink = {
  hypothesisId: string;
  hypothesisTitle: string;
  hypothesisPath: string;
  status: string;
  confidence: number;
  experiments: { id: string; title: string; path: string; status: string }[];
};

export function buildProgramLinks(bundle: WorkspaceBundle): ProgramLink[] {
  return bundle.hypotheses.map((h) => ({
    hypothesisId: h.id,
    hypothesisTitle: h.title,
    hypothesisPath: h.path,
    status: h.status,
    confidence: h.confidence,
    experiments: bundle.experiments
      .filter((e) => e.hypothesis === h.id || h.linked.includes(e.id))
      .map((e) => ({
        id: e.id,
        title: e.title,
        path: e.path,
        status: e.status,
      })),
  }));
}

export type ProvenanceStep = {
  id: string;
  label: string;
  detail: string;
  kind: "hypothesis" | "experiment" | "dataset";
  path?: string;
  fileKind?: FileKind;
};

export function buildProvenanceTrace(bundle: WorkspaceBundle): ProvenanceStep[] {
  const steps: ProvenanceStep[] = [];

  for (const h of bundle.hypotheses.slice(0, 4)) {
    steps.push({
      id: `prov-${h.id}`,
      label: h.id,
      detail: h.title.slice(0, 72) + (h.title.length > 72 ? "…" : ""),
      kind: "hypothesis",
      path: h.path,
      fileKind: "hyp",
    });
    for (const expId of h.linked.slice(0, 2)) {
      const exp = bundle.experiments.find((e) => e.id === expId);
      if (exp) {
        steps.push({
          id: `prov-${exp.id}`,
          label: exp.id,
          detail: `${exp.status} · ${exp.owner}`,
          kind: "experiment",
          path: exp.path,
          fileKind: "planner",
        });
      }
    }
  }

  for (const ds of bundle.datasets.slice(0, 2)) {
    steps.push({
      id: `prov-${ds.id}`,
      label: ds.id,
      detail: ds.provenance?.slice(0, 64) ?? ds.name,
      kind: "dataset",
      path: ds.path,
      fileKind: "dataset",
    });
  }

  return steps;
}
