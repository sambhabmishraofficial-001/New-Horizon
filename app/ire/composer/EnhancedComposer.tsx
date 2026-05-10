"use client";

import * as React from "react";
import { Lightbulb, Send, AtSign, Slash } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWorkspaceBundle } from "../workspace-context";
import {
  CATALOG,
  CATEGORY_LABEL,
  filterCatalog,
  groupByCategory,
  type CatalogEntry,
} from "./catalog";

type Mention = {
  id: string;
  category:
    | "agent"
    | "hypothesis"
    | "experiment"
    | "dataset"
    | "paper"
    | "protocol"
    | "team";
  label: string;
  hint: string;
  token: string;
};

const MENTION_LABEL: Record<Mention["category"], string> = {
  agent: "Agents",
  hypothesis: "Hypotheses",
  experiment: "Experiments",
  dataset: "Datasets",
  paper: "Papers",
  protocol: "Protocols",
  team: "Team",
};

const MENTION_ORDER: Mention["category"][] = [
  "agent",
  "hypothesis",
  "experiment",
  "dataset",
  "paper",
  "protocol",
  "team",
];

export function EnhancedComposer() {
  const bundle = useWorkspaceBundle();
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState("");
  const [menu, setMenu] = React.useState<null | {
    kind: "slash" | "mention";
    triggerStart: number;
    query: string;
  }>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const mentions: Mention[] = React.useMemo(() => {
    const out: Mention[] = [];
    for (const a of bundle.agents)
      out.push({ id: a.id, category: "agent", label: a.name, hint: a.role, token: `@agent:${a.id}` });
    for (const h of bundle.hypotheses)
      out.push({ id: h.id, category: "hypothesis", label: h.id, hint: h.title, token: `@hyp:${h.id}` });
    for (const e of bundle.experiments)
      out.push({ id: e.id, category: "experiment", label: e.id, hint: e.title, token: `@exp:${e.id}` });
    for (const d of bundle.datasets)
      out.push({ id: d.id, category: "dataset", label: d.name, hint: `${d.rows ?? "—"} rows`, token: `@data:${d.id}` });
    for (const p of bundle.papers)
      out.push({ id: p.id, category: "paper", label: p.title.slice(0, 64), hint: p.authors ?? "", token: `@paper:${p.id}` });
    for (const pr of bundle.protocols)
      out.push({ id: pr.id, category: "protocol", label: pr.name, hint: pr.version ?? "", token: `@proto:${pr.id}` });
    for (const t of bundle.team)
      out.push({ id: t.id, category: "team", label: t.name, hint: t.role, token: `@${t.initials.toLowerCase()}` });
    return out;
  }, [bundle]);

  // Slash & mention items based on current query
  const slashItems = React.useMemo(
    () => (menu?.kind === "slash" ? filterCatalog(menu.query) : []),
    [menu]
  );
  const mentionItems = React.useMemo(() => {
    if (menu?.kind !== "mention") return [];
    const q = menu.query.trim().toLowerCase();
    return mentions.filter(
      (m) => !q || m.label.toLowerCase().includes(q) || m.hint.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
    );
  }, [menu, mentions]);

  // Group items for display
  const slashGroups = React.useMemo(() => groupByCategory(slashItems), [slashItems]);
  const mentionGroups = React.useMemo(() => {
    const map = new Map<Mention["category"], Mention[]>();
    for (const m of mentionItems) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return MENTION_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      entries: map.get(c)!,
    }));
  }, [mentionItems]);

  // Flatten the visible items in display order for keyboard nav
  const flatSlash: CatalogEntry[] = React.useMemo(
    () => slashGroups.flatMap((g) => g.entries),
    [slashGroups]
  );
  const flatMention: Mention[] = React.useMemo(
    () => mentionGroups.flatMap((g) => g.entries),
    [mentionGroups]
  );

  const closeMenu = () => {
    setMenu(null);
    setActiveIndex(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    const caret = e.target.selectionStart ?? v.length;
    // Find a trigger char ('/' or '@') at start of line or after whitespace
    let triggerStart = -1;
    let kind: "slash" | "mention" | null = null;
    for (let i = caret - 1; i >= 0; i--) {
      const ch = v[i];
      if (ch === "/" || ch === "@") {
        const before = i === 0 ? " " : v[i - 1];
        if (/\s/.test(before) || i === 0) {
          triggerStart = i;
          kind = ch === "/" ? "slash" : "mention";
        }
        break;
      }
      if (/\s/.test(ch)) break;
    }
    if (kind && triggerStart >= 0) {
      const query = v.slice(triggerStart + 1, caret);
      // No spaces allowed in the query
      if (/\s/.test(query)) {
        closeMenu();
      } else {
        setMenu({ kind, triggerStart, query });
        setActiveIndex(0);
      }
    } else {
      closeMenu();
    }
  };

  const insertSelection = (text: string) => {
    if (!menu || !taRef.current) return;
    const ta = taRef.current;
    const caret = ta.selectionStart ?? value.length;
    const before = value.slice(0, menu.triggerStart);
    const after = value.slice(caret);
    const inserted = `${text} `;
    const next = before + inserted + after;
    setValue(next);
    closeMenu();
    requestAnimationFrame(() => {
      const pos = (before + inserted).length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape" && menu) {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (!menu) return;
    const total =
      menu.kind === "slash" ? flatSlash.length : flatMention.length;
    if (total === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + total) % total);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (menu.kind === "slash") {
        const item = flatSlash[activeIndex];
        if (item) insertSelection(`/${item.id}`);
      } else {
        const item = flatMention[activeIndex];
        if (item) insertSelection(item.token);
      }
    }
  };

  return (
    <div
      data-tour="composer"
      className="rounded-md border border-ink-900/10 bg-white font-marketing not-italic transition-colors focus-within:border-ink-900/30 relative"
    >
      <textarea
        ref={taRef}
        rows={2}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder="Ask anything. Type / for actions, @ to reference an artifact."
        className="w-full resize-none bg-transparent outline-none px-2.5 py-2 font-marketing text-[12px] leading-snug not-italic text-ink-900 placeholder:text-ink-400"
      />

      {menu && menu.kind === "slash" && slashGroups.length > 0 && (
        <SlashMenuPopover
          groups={slashGroups}
          flat={flatSlash}
          activeIndex={activeIndex}
          onPick={(item) => insertSelection(`/${item.id}`)}
          query={menu.query}
        />
      )}

      {menu && menu.kind === "mention" && mentionGroups.length > 0 && (
        <MentionMenuPopover
          groups={mentionGroups}
          flat={flatMention}
          activeIndex={activeIndex}
          onPick={(item) => insertSelection(item.token)}
          query={menu.query}
        />
      )}

      {menu && menu.kind === "slash" && slashGroups.length === 0 && (
        <EmptyMenu label={`No matches for /${menu.query}`} />
      )}
      {menu && menu.kind === "mention" && mentionGroups.length === 0 && (
        <EmptyMenu label={`No matches for @${menu.query}`} />
      )}

      <div className="flex items-center justify-between px-2 py-1 border-t border-ink-900/6 font-marketing text-[10.5px] not-italic text-ink-500">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-600" />
            context · open artifacts
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-ink-400">
            <Kbd>/</Kbd> actions
            <Kbd>@</Kbd> mention
          </span>
        </div>
        <button
          onClick={() => {
            // Submit no-op for now: clear
            setValue("");
            closeMenu();
          }}
          disabled={!value.trim()}
          className="h-5 rounded bg-ink-900 px-2 font-marketing not-italic text-parchment-50 inline-flex items-center gap-1 disabled:opacity-40"
        >
          <Send className="h-2.5 w-2.5" /> send
        </button>
      </div>
    </div>
  );
}

function SlashMenuPopover({
  groups,
  flat,
  activeIndex,
  onPick,
  query,
}: {
  groups: { category: import("./catalog").Category; entries: CatalogEntry[] }[];
  flat: CatalogEntry[];
  activeIndex: number;
  onPick: (e: CatalogEntry) => void;
  query: string;
}) {
  return (
    <MenuShell title={query ? `Filter · ${query}` : "Actions"} icon={<Slash className="h-3 w-3" />}>
      {groups.map((g) => (
        <div key={g.category} className="border-b border-ink-900/5 last:border-b-0 pb-1.5 last:pb-0">
          <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink-400 font-medium">
            {CATEGORY_LABEL[g.category]}
          </div>
          {g.entries.map((entry) => {
            const idx = flat.indexOf(entry);
            const active = idx === activeIndex;
            return (
              <button
                key={entry.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(entry);
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 px-2 py-1.5 text-left",
                  active ? "bg-beacon-50 text-ink-900" : "text-ink-700 hover:bg-parchment-50"
                )}
              >
                <entry.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium truncate">{entry.label}</span>
                    <span className="font-mono text-[10px] text-ink-400 truncate">/{entry.id}</span>
                  </div>
                  <div className="text-[11px] text-ink-500 truncate">{entry.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </MenuShell>
  );
}

function MentionMenuPopover({
  groups,
  flat,
  activeIndex,
  onPick,
  query,
}: {
  groups: { category: Mention["category"]; entries: Mention[] }[];
  flat: Mention[];
  activeIndex: number;
  onPick: (m: Mention) => void;
  query: string;
}) {
  return (
    <MenuShell title={query ? `Mention · ${query}` : "Reference"} icon={<AtSign className="h-3 w-3" />}>
      {groups.map((g) => (
        <div key={g.category} className="border-b border-ink-900/5 last:border-b-0 pb-1.5 last:pb-0">
          <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink-400 font-medium">
            {MENTION_LABEL[g.category]}
          </div>
          {g.entries.map((entry) => {
            const idx = flat.indexOf(entry);
            const active = idx === activeIndex;
            return (
              <button
                key={`${entry.category}-${entry.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(entry);
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 px-2 py-1.5 text-left",
                  active ? "bg-beacon-50 text-ink-900" : "text-ink-700 hover:bg-parchment-50"
                )}
              >
                <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-ink-900/8 font-mono text-[9px] text-ink-600">
                  {entry.category[0].toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-medium truncate">{entry.label}</span>
                    <span className="font-mono text-[10px] text-ink-400 truncate">{entry.token}</span>
                  </div>
                  <div className="text-[11px] text-ink-500 truncate">{entry.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </MenuShell>
  );
}

function MenuShell({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute left-0 right-0 bottom-full mb-1 z-30 rounded-md border border-ink-900/10 bg-white shadow-lift overflow-hidden max-h-[320px] flex flex-col">
      <div className="flex items-center gap-1.5 border-b border-ink-900/8 bg-parchment-50 px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
        {icon}
        {title}
      </div>
      <div className="overflow-y-auto py-1">{children}</div>
    </div>
  );
}

function EmptyMenu({ label }: { label: string }) {
  return (
    <div className="absolute left-0 right-0 bottom-full mb-1 z-30 rounded-md border border-ink-900/10 bg-white shadow-lift px-3 py-2.5 text-[12px] text-ink-500">
      {label}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded border border-ink-900/15 bg-parchment-50 px-1 font-mono text-[10px] leading-none text-ink-700 h-4 min-w-[14px]">
      {children}
    </span>
  );
}
