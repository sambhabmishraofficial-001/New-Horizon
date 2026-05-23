"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FileKind } from "./data";

type Integration = {
  id: string;
  label: string;
  short: string;
  group: "Documents" | "References" | "Code & data" | "Storage" | "Slides";
  kind: FileKind;
};

const INTEGRATIONS: Integration[] = [
  // Documents (native editors)
  { id: "word", label: "Word document", short: "Word", group: "Documents", kind: "word" },
  { id: "overleaf", label: "LaTeX project", short: "LaTeX", group: "Documents", kind: "latex" },
  { id: "docs", label: "Rich-text doc", short: "Doc", group: "Documents", kind: "tool" },
  { id: "notion", label: "Notion-style page", short: "Notion", group: "Documents", kind: "tool" },

  // Slides
  { id: "ppt", label: "PowerPoint", short: "PPT", group: "Slides", kind: "tool" },
  { id: "slides", label: "Google Slides", short: "Slides", group: "Slides", kind: "tool" },

  // References
  { id: "zotero", label: "Zotero library", short: "Zotero", group: "References", kind: "tool" },
  { id: "mendeley", label: "Mendeley library", short: "Mendeley", group: "References", kind: "tool" },
  { id: "endnote", label: "EndNote", short: "EndNote", group: "References", kind: "tool" },
  { id: "papers", label: "Papers", short: "Papers", group: "References", kind: "tool" },
  { id: "scholar", label: "Scholar search", short: "Scholar", group: "References", kind: "tool" },

  // Code & data
  { id: "github", label: "GitHub repository", short: "GitHub", group: "Code & data", kind: "tool" },
  { id: "colab", label: "Colab notebook", short: "Colab", group: "Code & data", kind: "tool" },
  { id: "jupyter", label: "Jupyter notebook", short: "Jupyter", group: "Code & data", kind: "tool" },
  { id: "huggingface", label: "Hugging Face", short: "HF", group: "Code & data", kind: "tool" },
  { id: "kaggle", label: "Kaggle", short: "Kaggle", group: "Code & data", kind: "tool" },
  { id: "wandb", label: "Weights & Biases", short: "W&B", group: "Code & data", kind: "tool" },

  // Storage
  { id: "drive", label: "Google Drive", short: "Drive", group: "Storage", kind: "tool" },
  { id: "onedrive", label: "OneDrive", short: "OneDrive", group: "Storage", kind: "tool" },
  { id: "dropbox", label: "Dropbox", short: "Dropbox", group: "Storage", kind: "tool" },
  { id: "zenodo", label: "Zenodo", short: "Zenodo", group: "Storage", kind: "tool" },
  { id: "figshare", label: "Figshare", short: "Figshare", group: "Storage", kind: "tool" },
  { id: "osf", label: "OSF", short: "OSF", group: "Storage", kind: "tool" },
  { id: "protocols", label: "protocols.io", short: "protocols", group: "Storage", kind: "tool" },
];

const PINNED_DEFAULT = ["word", "overleaf", "zotero", "github", "drive"];

const GROUP_ORDER: Integration["group"][] = [
  "Documents",
  "Slides",
  "References",
  "Code & data",
  "Storage",
];

export type OpenToolFn = (id: string, label: string, kind: FileKind) => void;

export function IntegrationsToolbar({ onOpenTool }: { onOpenTool: OpenToolFn }) {
  const [pinned] = React.useState<string[]>(PINNED_DEFAULT);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const openTab = (it: Integration) => {
    onOpenTool(it.id, it.label, it.kind);
    setOpen(false);
  };

  const pinnedItems = pinned
    .map((id) => INTEGRATIONS.find((i) => i.id === id))
    .filter((i): i is Integration => Boolean(i));

  return (
    <div className="h-9 shrink-0 flex items-center gap-1 border-b border-[var(--ire-border)] bg-[var(--ire-surface-muted)] px-3 text-[12px]">
      <span className="inline-flex items-center gap-1.5 ire-label pr-1 normal-case tracking-[0.1em] text-[10px]">
        <Plus className="h-3 w-3" /> new
      </span>
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {pinnedItems.map((it) => (
          <Chip key={it.id} integration={it} onOpen={openTab} />
        ))}
      </div>
      <div className="ml-auto" />
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-7 items-center gap-1 rounded px-2 text-[11.5px] text-ink-700 hover:bg-parchment-50"
        >
          More <ChevronDown className="h-3 w-3" />
        </button>
        {open && (
          <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-[320px] rounded-md border border-ink-900/10 bg-white shadow-lift overflow-hidden">
            <div className="px-3 py-2 border-b border-ink-900/6 text-[10.5px] uppercase tracking-[0.16em] text-ink-500">
              Open as tab
            </div>
            <div className="max-h-[420px] overflow-y-auto py-1">
              {GROUP_ORDER.map((g) => (
                <div key={g} className="border-b border-ink-900/5 last:border-b-0 pb-1.5 last:pb-0">
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink-400 font-medium">
                    {g}
                  </div>
                  {INTEGRATIONS.filter((i) => i.group === g).map((it) => (
                    <button
                      key={it.id}
                      onClick={() => openTab(it)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-[12.5px] text-ink-700 hover:bg-parchment-50 text-left"
                    >
                      <span className="flex-1 truncate">{it.label}</span>
                      <span className="font-mono text-[10px] text-ink-400">tab</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  integration,
  onOpen,
}: {
  integration: Integration;
  onOpen: (i: Integration) => void;
}) {
  return (
    <button
      onClick={() => onOpen(integration)}
      title={`Open ${integration.label}`}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded px-2 text-[11.5px] text-ink-700 border border-transparent hover:border-ink-900/12 hover:bg-parchment-50"
      )}
    >
      {integration.short}
    </button>
  );
}
