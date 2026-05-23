"use client";

import * as React from "react";
import { ChevronDown, Clock, FolderKanban, FileText, File } from "lucide-react";
import { cn } from "@/lib/cn";
import { useClientQueryFlag } from "@/lib/hooks/useClientSearchParams";
import {
  AnimatedFolder,
  type FolderProject,
} from "@/components/ui/animated-folder";
import { type FileKind, type TreeNode } from "@/app/ire/data";
import { useIreNavigation, useWorkspaceBundle } from "@/app/ire/workspace-context";
import { useScaffoldDemoLoop } from "@/components/ire/useScaffoldDemoLoop";

const CREATE_OPTIONS = [
  {
    id: "workspace",
    label: "Workspace",
    hint: "Blank scientific program",
    icon: FolderKanban,
    path: "/sci/prog/readme",
    name: "README",
    kind: "manuscript" as const,
  },
  {
    id: "file",
    label: "File",
    hint: "Hypothesis, run, or dataset",
    icon: File,
    path: "/sci/prog/hyp/H-S001",
    name: "H-S001 · mechanism under study",
    kind: "hyp" as const,
  },
  {
    id: "document",
    label: "Document",
    hint: "Outline or manuscript",
    icon: FileText,
    path: "/sci/prog/ms/outline",
    name: "working-outline",
    kind: "manuscript" as const,
  },
] as const;

function findFolderChildren(tree: TreeNode[], folderId: string): TreeNode[] {
  const program = tree.find((node) => node.id === "sci-root");
  const folder = program?.children?.find((node) => node.id === folderId);
  return folder?.children ?? [];
}

function nodesToProjects(nodes: TreeNode[]): FolderProject[] {
  return nodes
    .filter((node) => node.kind && node.kind !== "home")
    .map((node) => ({
      id: node.id,
      title: node.name,
      path: node.path,
      kind: node.kind as FileKind,
    }));
}

function CreateMenu({
  onSelect,
  forceOpen,
  demoMode = false,
}: {
  onSelect: (option: (typeof CREATE_OPTIONS)[number]) => void;
  forceOpen?: boolean;
  demoMode?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isOpen = forceOpen ?? open;

  React.useEffect(() => {
    if (!isOpen || demoMode) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen, demoMode]);

  return (
    <div ref={rootRef} className="relative mx-auto mt-8 inline-flex">
      <button
        type="button"
        onClick={() => {
          if (!demoMode) setOpen((value) => !value);
        }}
        className="ire-scaffold-create"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Create
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div className="ire-scaffold-create-menu" role="menu">
          {CREATE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitem"
                className="ire-scaffold-create-menu__item"
                onClick={() => {
                  onSelect(option);
                  if (!demoMode) setOpen(false);
                }}
              >
                <span className="ire-scaffold-create-menu__icon">
                  <Icon className="h-4 w-4" strokeWidth={1.65} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="ire-scaffold-create-menu__label">
                    {option.label}
                  </span>
                  <span className="ire-scaffold-create-menu__hint">
                    {option.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ProgramScaffoldHome() {
  const isDemo = useClientQueryFlag("demo");
  const demo = useScaffoldDemoLoop(isDemo);
  const { tree, hypotheses, experiments, datasets, papers, protocols } =
    useWorkspaceBundle();
  const { openDoc } = useIreNavigation();

  const methodCount = experiments.length + protocols.length;

  const openProject = (project: FolderProject) => {
    if (project.path && project.kind) {
      openDoc(project.path, project.title, project.kind);
    }
  };

  const questionProjects = nodesToProjects(findFolderChildren(tree, "sci-hyp"));
  const methodProjects = nodesToProjects([
    ...findFolderChildren(tree, "sci-exp"),
    ...findFolderChildren(tree, "sci-proto"),
  ]);
  const evidenceProjects = nodesToProjects([
    ...findFolderChildren(tree, "sci-data"),
    ...findFolderChildren(tree, "sci-lit"),
  ]);

  const handleCreate = (option: (typeof CREATE_OPTIONS)[number]) => {
    openDoc(option.path, option.name, option.kind);
  };

  return (
    <div className={cn("ire-scaffold-home", isDemo && "ire-scaffold-home--demo")}>
      <div aria-hidden className="ire-scaffold-home__dot-grid" />

      <div className="relative mx-auto max-w-[900px] px-8 py-12 pb-20">
        <div className="text-center">
          <h1 className="ire-scaffold-home__title mx-auto max-w-[520px]">
            Good morning, Sam
          </h1>
          <p className="ire-scaffold-home__lead mx-auto max-w-[440px]">
            Create a workspace, file, or document to begin.
          </p>
          <CreateMenu
            onSelect={handleCreate}
            forceOpen={isDemo ? demo.createOpen : undefined}
            demoMode={isDemo}
          />
        </div>

        <section className="mt-16">
          <h2 className="ire-scaffold-home__section-title mb-5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Recently opened
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedFolder
              title="Question"
              subtitle={`${hypotheses.length} hypotheses`}
              projects={questionProjects}
              gradient="linear-gradient(135deg, #2a58be, #5b8def)"
              className="ire-animated-folder ire-animated-folder--question w-full"
              onOpenProject={openProject}
              demoExpanded={isDemo ? demo.expandedFolder === "question" : undefined}
              demoVisibleCount={
                isDemo && demo.expandedFolder === "question"
                  ? demo.visibleDocCount
                  : undefined
              }
            />
            <AnimatedFolder
              title="Method"
              subtitle={`${methodCount} protocols + runs`}
              projects={methodProjects}
              gradient="linear-gradient(135deg, #b9740c, #e8a020)"
              className="ire-animated-folder ire-animated-folder--method w-full"
              onOpenProject={openProject}
              demoExpanded={isDemo ? demo.expandedFolder === "method" : undefined}
              demoVisibleCount={
                isDemo && demo.expandedFolder === "method"
                  ? demo.visibleDocCount
                  : undefined
              }
            />
            <AnimatedFolder
              title="Evidence"
              subtitle={`${datasets.length} datasets · ${papers.length} papers`}
              projects={evidenceProjects}
              gradient="linear-gradient(135deg, #12785a, #2ea87a)"
              className="ire-animated-folder ire-animated-folder--evidence w-full sm:col-span-2 lg:col-span-1"
              onOpenProject={openProject}
              demoExpanded={isDemo ? demo.expandedFolder === "evidence" : undefined}
              demoVisibleCount={
                isDemo && demo.expandedFolder === "evidence"
                  ? demo.visibleDocCount
                  : undefined
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
