"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ChevronRight,
  Compass,
  FileSearch,
  FolderOpen,
  LayoutGrid,
  Search,
  Sparkles,
  Telescope,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV } from "@/lib/nav";
import { Kbd } from "@/components/ui/Primitives";

type CommandGroup = "Jump to" | "Ask the institute" | "Actions";

type InstituteCommand = {
  id: string;
  label: string;
  hint?: string;
  group: CommandGroup;
  icon: LucideIcon;
  run: () => void;
};

type Shortcut = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

function SpotlightFilter() {
  return (
    <svg width="0" height="0" aria-hidden>
      <filter id="institute-spotlight-blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -9
          "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
}

function SpotlightPlaceholder({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "pointer-events-none absolute z-10 flex items-center text-ink-400",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          layoutId={`institute-placeholder-${text}`}
          key={`institute-placeholder-${text}`}
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-[15px]"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function SpotlightInput({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  placeholderClassName,
}: {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholderClassName?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex h-16 w-full items-center justify-start gap-3 px-6">
      <motion.div layoutId="institute-search-icon">
        <Search className="h-5 w-5 text-ink-500" strokeWidth={1.75} />
      </motion.div>
      <div className="relative flex-1 text-[15px] text-ink-900">
        {!hidePlaceholder ? (
          <SpotlightPlaceholder text={placeholder} className={placeholderClassName} />
        ) : null}
        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none ring-0"
          aria-label="Search the institute"
        />
      </div>
      <div className="hidden items-center gap-1 sm:flex">
        <Kbd>esc</Kbd>
      </div>
    </div>
  );
}

function ShortcutButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full opacity-35 transition-[opacity,transform,box-shadow] duration-200 hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_8px_24px_rgba(17,17,16,0.12)]"
    >
      <div className="flex size-16 items-center justify-center">{icon}</div>
    </button>
  );
}

function SearchResultCard({
  icon: Icon,
  label,
  description,
  active,
  isLast,
  onClick,
  onMouseEnter,
}: {
  icon: InstituteCommand["icon"];
  label: string;
  description?: string;
  active: boolean;
  isLast: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "group/card flex w-full items-center justify-start gap-3 overflow-hidden px-2 py-2 text-left transition-colors",
        active
          ? "bg-beacon-50/80"
          : "hover:bg-[var(--ire-surface-elevated)]",
        isLast && "rounded-b-[28px]"
      )}
    >
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border",
          active
            ? "border-beacon-300 bg-white text-beacon-700"
            : "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-ink-600"
        )}
      >
        <Icon className="size-4" strokeWidth={1.65} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink-900">{label}</p>
        {description ? (
          <p className="truncate text-[11px] text-ink-500">{description}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "flex items-center justify-end transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"
        )}
      >
        <ChevronRight className="size-5 text-ink-400" />
      </div>
    </button>
  );
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { label: "Jump to", icon: <LayoutGrid strokeWidth={1.4} />, href: "/lattice" },
  { label: "Twins", icon: <Sparkles strokeWidth={1.4} />, href: "/twins" },
  { label: "Invariants", icon: <Telescope strokeWidth={1.4} />, href: "/invariants" },
  { label: "Library", icon: <FolderOpen strokeWidth={1.4} />, href: "/library" },
];

export function InstituteSpotlight({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);
  const [hoveredResult, setHoveredResult] = React.useState<number | null>(null);
  const [hoveredShortcut, setHoveredShortcut] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);

  const close = React.useCallback(() => {
    setQuery("");
    setHovered(false);
    setHoveredResult(null);
    setHoveredShortcut(null);
    onClose();
  }, [onClose]);

  const commands = React.useMemo<InstituteCommand[]>(() => {
    const nav = NAV.map((n) => ({
      id: `nav-${n.href}`,
      label: n.label,
      hint: n.description,
      group: "Jump to" as const,
      icon: n.icon,
      run: () => {
        router.push(n.href);
        close();
      },
    }));

    const ask: InstituteCommand[] = [
      {
        id: "ask-invariants",
        label: query || "Which invariants broke in run-71a?",
        hint: "Route to Aletheia · explanation cone streamed to canvas",
        group: "Ask the institute",
        icon: FileSearch,
        run: () => {
          router.push("/invariants");
          close();
        },
      },
      {
        id: "ask-twin",
        label: query
          ? `Ask Halo-A about “${query}”`
          : "Summon a Research Twin for K11",
        hint: "Scoped twin with instruments and invariant rails",
        group: "Ask the institute",
        icon: Sparkles,
        run: () => {
          router.push("/twins");
          close();
        },
      },
      {
        id: "ask-program",
        label: "Open K11 · Ribozyme workspace",
        hint: "Helix Bio Group · run-71a traces and manuscript draft",
        group: "Ask the institute",
        icon: Compass,
        run: () => {
          router.push("/ire");
          close();
        },
      },
    ];

    const actions: InstituteCommand[] = [
      {
        id: "act-rollout",
        label: "Launch Mg²⁺ sweep rollout",
        hint: "Environments · Bench A1 · ~200k steps",
        group: "Actions",
        icon: Activity,
        run: () => {
          router.push("/environments");
          close();
        },
      },
      {
        id: "act-enrol",
        label: "Enrol a new AI Investigator",
        hint: "Configure scope, instruments, and invariants",
        group: "Actions",
        icon: Sparkles,
        run: () => {
          router.push("/enrol");
          close();
        },
      },
    ];

    return [...nav, ...ask, ...actions];
  }, [query, router, close]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      (c.label + " " + (c.hint ?? "")).toLowerCase().includes(q)
    );
  }, [commands, query]);

  React.useEffect(() => {
    if (!open) return;
    setIndex(0);
    setHoveredResult(null);
    setHoveredShortcut(null);
  }, [query, open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") close();
      if (!filtered.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(filtered.length - 1, i + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        filtered[index]?.run();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, filtered, index]);

  React.useEffect(() => {
    setHoveredResult(index);
  }, [index]);

  const placeholder =
    hoveredShortcut !== null
      ? DEFAULT_SHORTCUTS[hoveredShortcut].label
      : hoveredResult !== null
        ? filtered[hoveredResult]?.label ?? "Search the institute"
        : "Search the institute";

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          initial={{
            opacity: 0,
            filter: "blur(20px) url(#institute-spotlight-blob)",
            scaleX: 1.08,
            scaleY: 1.04,
            y: -8,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px) url(#institute-spotlight-blob)",
            scaleX: 1,
            scaleY: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            filter: "blur(20px) url(#institute-spotlight-blob)",
            scaleX: 1.08,
            scaleY: 1.04,
            y: 8,
          }}
          transition={{ type: "spring", stiffness: 550, damping: 50 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-ink-950/20 px-4 pt-[11vh] backdrop-blur-[2px]"
          onClick={close}
        >
          <SpotlightFilter />

          <div className="mb-3 flex items-center gap-1.5 text-[12px] text-parchment-100/75">
            <span>Helix Bio Group</span>
            <span className="text-parchment-100/35">/</span>
            <span className="font-medium text-parchment-50">K11 · Ribozyme</span>
          </div>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setHoveredShortcut(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ filter: "url(#institute-spotlight-blob)" }}
            className={cn(
              "group z-20 flex w-full max-w-3xl items-center justify-end gap-3",
              "[&>div]:rounded-[30px] [&>div]:backdrop-blur-xl",
              "[&_svg]:size-7 [&_svg]:stroke-[1.4]"
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                layoutId="institute-search-container"
                transition={{
                  layout: { duration: 0.5, type: "spring", bounce: 0.2 },
                }}
                className="relative z-10 flex h-full w-full flex-col items-center justify-start overflow-hidden border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] shadow-[0_24px_80px_-24px_rgba(17,17,16,0.28)]"
              >
                <SpotlightInput
                  placeholder={placeholder}
                  placeholderClassName={
                    hoveredResult !== null ? "text-ink-900" : "text-ink-400"
                  }
                  hidePlaceholder={!(hoveredResult !== null || !query)}
                  value={query}
                  onChange={setQuery}
                />

                {query ? (
                  <motion.div
                    layout
                    onMouseLeave={() => setHoveredResult(null)}
                    className="flex max-h-96 w-full flex-col overflow-y-auto border-t border-[var(--ire-border)] bg-[var(--ire-surface-muted)] py-2"
                  >
                    {filtered.length > 0 ? (
                      filtered.map((result, resultIndex) => (
                        <motion.div
                          key={result.id}
                          onMouseEnter={() => {
                            setHoveredResult(resultIndex);
                            setIndex(resultIndex);
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            delay: resultIndex * 0.04,
                            duration: 0.18,
                            ease: "easeOut",
                          }}
                        >
                          <SearchResultCard
                            icon={result.icon}
                            label={result.label}
                            description={result.hint}
                            active={index === resultIndex}
                            isLast={resultIndex === filtered.length - 1}
                            onClick={() => result.run()}
                            onMouseEnter={() => {
                              setHoveredResult(resultIndex);
                              setIndex(resultIndex);
                            }}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="px-6 py-8 text-center text-[13px] text-ink-500">
                        No matches. Try “invariant”, “twin”, “K11”, or “rollout”.
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </motion.div>

              {hovered && !query
                ? DEFAULT_SHORTCUTS.map((shortcut, shortcutIndex) => (
                    <motion.div
                      key={shortcut.label}
                      onMouseEnter={() => setHoveredShortcut(shortcutIndex)}
                      layout
                      initial={{ scale: 0.7, x: -1 * (64 * (shortcutIndex + 1)) }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{
                        scale: 0.7,
                        x:
                          16 * (DEFAULT_SHORTCUTS.length - shortcutIndex - 1) +
                          64 * (DEFAULT_SHORTCUTS.length - shortcutIndex - 1),
                      }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        bounce: 0.2,
                        delay: shortcutIndex * 0.05,
                      }}
                      className="rounded-full border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-ink-700"
                    >
                      <ShortcutButton
                        icon={shortcut.icon}
                        onClick={() => {
                          router.push(shortcut.href);
                          close();
                        }}
                      />
                    </motion.div>
                  ))
                : null}
            </AnimatePresence>
          </div>

          <p className="mt-4 text-[11px] text-parchment-100/45">
            Jump to modules, ask Aletheia, or run institute actions
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
