"use client";

import * as React from "react";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  forwardRef,
} from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { FILE_META, type FileKind } from "@/app/ire/data";

export interface FolderProject {
  id: string;
  title: string;
  path?: string;
  kind?: FileKind;
  image?: string;
}

interface ProjectCardProps {
  title: string;
  kind?: FileKind;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

function DocKindIcon({ kind, compact }: { kind?: FileKind; compact?: boolean }) {
  const meta = kind ? FILE_META[kind] : null;
  const Icon = meta?.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5",
        compact ? "mx-auto h-16 w-16 rounded-xl border border-[var(--ire-border)]" : "h-full w-full p-2"
      )}
      style={{
        backgroundColor: meta?.bg ?? "var(--ire-surface-muted)",
      }}
    >
      {Icon ? (
        <Icon
          className={compact ? "h-6 w-6" : "h-5 w-5"}
          strokeWidth={1.65}
          style={{ color: meta.color }}
        />
      ) : null}
      {!compact ? (
        <p className="line-clamp-3 text-center text-[8px] font-medium leading-tight text-[var(--ire-text)]">
          {meta?.label ?? "Document"}
        </p>
      ) : null}
    </div>
  );
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    { title, kind, delay, isVisible, index, totalCount, onClick, isSelected },
    ref
  ) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    const rotation = factor * 22;
    const translationX = factor * 80;

    return (
      <div
        ref={ref}
        className={cn("absolute h-28 w-20 cursor-pointer group/card", isSelected && "opacity-0")}
        style={{
          transform: isVisible
            ? `translateY(-96px) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.45)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-lg border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] shadow-lg",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/card:-translate-y-5 group-hover/card:scale-[1.18] group-hover/card:shadow-xl group-hover/card:ring-2 group-hover/card:ring-[var(--ire-accent)]"
          )}
        >
          <DocKindIcon kind={kind} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--ire-surface-elevated)] via-[var(--ire-surface-elevated)]/90 to-transparent px-1.5 pb-1.5 pt-4">
            <p className="truncate text-[8px] font-semibold uppercase tracking-tight text-[var(--ire-text)]">
              {title}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  onOpenProject,
}: {
  projects: FolderProject[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  onOpenProject?: (project: FolderProject) => void;
}) {
  const [animationPhase, setAnimationPhase] = useState<
    "initial" | "animating" | "complete"
  >("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = window.setTimeout(() => {
        setInternalIndex(currentIndex);
        setIsSliding(false);
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    window.setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 450);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowRight") navigateNext();
      if (event.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimationPhase("animating"));
      });
      const timer = window.setTimeout(() => setAnimationPhase("complete"), 650);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, sourceRect]);

  if (!shouldRender || !currentProject) return null;

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};
    const targetWidth = Math.min(760, window.innerWidth - 64);
    const targetHeight = Math.min(window.innerHeight * 0.82, 560);
    const targetX = (window.innerWidth - targetWidth) / 2;
    const targetY = (window.innerHeight - targetHeight) / 2;
    const scale = Math.max(
      sourceRect.width / targetWidth,
      sourceRect.height / targetHeight
    );
    const translateX =
      sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2);
    const translateY =
      sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2);
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 0.55,
    };
  };

  const currentStyles =
    animationPhase === "initial" && !isClosing
      ? getInitialStyles()
      : { transform: "translate(0, 0) scale(1)", opacity: 1 };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 450ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 bg-[rgba(17,17,16,0.72)] backdrop-blur-xl"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 500ms ease",
        }}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        className="absolute right-5 top-5 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-[var(--ire-text)] shadow-lg"
      >
        <X className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          navigatePrev();
        }}
        disabled={!hasPrev || isSliding}
        className="absolute left-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-[var(--ire-text)] disabled:opacity-0 md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          navigateNext();
        }}
        disabled={!hasNext || isSliding}
        className="absolute right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-[var(--ire-text)] disabled:opacity-0 md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="relative z-[85] w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.94)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
          transformOrigin: "center center",
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] shadow-2xl">
          <div className="relative aspect-[16/10] overflow-hidden">
            <div
              className="flex h-full w-full"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding
                  ? "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex h-full w-full min-w-full flex-shrink-0 items-center justify-center bg-[var(--ire-surface-muted)] p-8"
                >
                  <div className="w-full max-w-sm rounded-xl border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] p-6 text-center shadow-sm">
                    <DocKindIcon kind={project.kind} compact />
                    <h4 className="mt-4 truncate text-[15px] font-semibold text-[var(--ire-text)]">
                      {project.title}
                    </h4>
                    {project.kind ? (
                      <p className="mt-1 text-[11px] text-[var(--ire-text-muted)]">
                        {FILE_META[project.kind].label}
                        {FILE_META[project.kind].ext}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--ire-border)] px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-[var(--ire-text)]">
                  {currentProject.title}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--ire-text-muted)]">
                  {internalIndex + 1} / {totalProjects}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentProject) onOpenProject?.(currentProject);
                  handleClose();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ire-accent,#2a58be)] px-4 py-2.5 text-[12px] font-medium text-white"
              >
                Open in workspace
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface AnimatedFolderProps {
  title: string;
  subtitle?: string;
  projects: FolderProject[];
  className?: string;
  gradient?: string;
  onOpenProject?: (project: FolderProject) => void;
  /** When set, controls fan-out instead of hover (used by preview demo loop). */
  demoExpanded?: boolean;
  /** In demo mode, reveals doc cards one-by-one up to this count. */
  demoVisibleCount?: number;
}

export function AnimatedFolder({
  title,
  subtitle,
  projects,
  className,
  gradient,
  onOpenProject,
  demoExpanded,
  demoVisibleCount,
}: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isControlled = demoExpanded !== undefined;
  const isExpanded = isControlled ? demoExpanded : isHovered;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewProjects = projects.slice(0, 5);

  const handleProjectClick = (project: FolderProject, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(project.id);
  };

  return (
    <>
      <div
        className={cn(
          "ire-animated-folder group/folder",
          isControlled && "ire-animated-folder--demo",
          className
        )}
        style={{
          perspective: "1200px",
          transform: isExpanded ? "scale(1.03) rotate(-1deg)" : undefined,
          transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={() => {
          if (!isControlled) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isControlled) setIsHovered(false);
        }}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500",
            isExpanded ? "opacity-100" : "opacity-0 group-hover/folder:opacity-100"
          )}
          style={{
            background: gradient
              ? `radial-gradient(circle at 50% 70%, ${
                  gradient.match(/#[a-fA-F0-9]{3,8}/)?.[0] ?? "var(--ire-accent)"
                }22 0%, transparent 72%)`
              : "radial-gradient(circle at 50% 70%, color-mix(in srgb, var(--ire-accent) 18%, transparent) 0%, transparent 72%)",
          }}
        />

        <div
          className="relative mb-4 flex items-center justify-center"
          style={{ height: "160px", width: "200px" }}
        >
          <div
            className="ire-animated-folder__back absolute h-24 w-32 rounded-lg border border-[var(--ire-border)] shadow-md"
            style={{
              background: gradient || "var(--ire-folder-back)",
              transformOrigin: "bottom center",
              transform: isExpanded ? "rotateX(-18deg) scaleY(1.04)" : "rotateX(0deg)",
              transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 10,
            }}
          />
          <div
            className="ire-animated-folder__tab absolute h-4 w-12 rounded-t-md border border-b-0 border-[var(--ire-border)]"
            style={{
              background: gradient || "var(--ire-folder-tab)",
              top: "calc(50% - 48px - 12px)",
              left: "calc(50% - 64px + 16px)",
              transformOrigin: "bottom center",
              transform: isExpanded
                ? "rotateX(-26deg) translateY(-2px)"
                : "rotateX(0deg)",
              transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 10,
            }}
          />

          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: isExpanded ? 40 : 20,
            }}
          >
            {previewProjects.map((project, index) => {
              const cardVisible =
                isExpanded &&
                (demoVisibleCount === undefined || index < demoVisibleCount);

              return (
              <ProjectCard
                key={project.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                kind={project.kind}
                title={project.title}
                delay={isControlled ? 0 : index * 45}
                isVisible={cardVisible}
                index={index}
                totalCount={previewProjects.length}
                onClick={() => handleProjectClick(project, index)}
                isSelected={hiddenCardId === project.id}
              />
            );
            })}
          </div>

          <div
            className="ire-animated-folder__front absolute h-24 w-32 rounded-lg border border-[var(--ire-border-strong)] shadow-lg"
            style={{
              background: gradient || "var(--ire-folder-front)",
              top: "calc(50% - 48px + 4px)",
              transformOrigin: "bottom center",
              transform: isExpanded
                ? "rotateX(32deg) translateY(10px)"
                : "rotateX(0deg)",
              transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 30,
            }}
          />
          <div
            className="pointer-events-none absolute h-24 w-32 overflow-hidden rounded-lg"
            style={{
              top: "calc(50% - 48px + 4px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 58%)",
              transformOrigin: "bottom center",
              transform: isExpanded
                ? "rotateX(32deg) translateY(10px)"
                : "rotateX(0deg)",
              transition: "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 31,
            }}
          />
        </div>

        <div className="text-center">
          <h3 className="text-[15px] font-semibold text-[var(--ire-text)]">{title}</h3>
          <p className="mt-1 text-[12px] text-[var(--ire-text-muted)]">
            {subtitle ?? `${projects.length} artifacts`}
          </p>
        </div>

        <p
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.16em] text-[var(--ire-text-muted)] opacity-60 transition-opacity",
            (isExpanded || isControlled) && "opacity-0",
            "group-hover/folder:opacity-0"
          )}
        >
          Hover to preview
        </p>
      </div>

      <ImageLightbox
        projects={projects}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={() => {
          setSelectedIndex(null);
          setSourceRect(null);
        }}
        sourceRect={sourceRect}
        onCloseComplete={() => setHiddenCardId(null)}
        onNavigate={(index) => {
          setSelectedIndex(index);
          setHiddenCardId(projects[index]?.id ?? null);
        }}
        onOpenProject={onOpenProject}
      />
    </>
  );
}
