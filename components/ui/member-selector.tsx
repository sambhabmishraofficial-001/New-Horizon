"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Plus, Search, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  online?: boolean;
}

export interface MemberSelectorProps {
  members: Member[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  maxVisible?: number;
  label?: string;
  compact?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AvatarProps {
  member: Member;
  isSelected: boolean;
  compact?: boolean;
  onClick: () => void;
}

function Avatar({ member, isSelected, compact, onClick }: AvatarProps) {
  const size = compact ? "w-8 h-8" : "w-12 h-12";
  const plusOffset = compact ? "bottom-4 right-0" : "bottom-5 right-0";

  return (
    <motion.button
      type="button"
      layoutId={`member-${member.id}`}
      onClick={onClick}
      title={member.name}
      className={cn(
        "group relative flex flex-col items-center outline-none cursor-pointer",
        compact ? "gap-0" : "gap-1.5"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden transition-all duration-200",
          size,
          "group-focus-visible:ring-2 group-focus-visible:ring-beacon-500/40 group-focus-visible:ring-offset-2",
          !isSelected && "opacity-50 hover:opacity-80"
        )}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-200",
              !isSelected && "grayscale"
            )}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center font-medium transition-colors duration-200",
              compact ? "text-[10px]" : "text-sm",
              isSelected
                ? "bg-beacon-50 text-beacon-800"
                : "bg-ink-900/[0.06] text-ink-500"
            )}
          >
            {getInitials(member.name)}
          </div>
        )}
        {member.online ? (
          <span
            className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"
            aria-hidden
          />
        ) : null}
      </div>

      <AnimatePresence>
        {!isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "absolute w-3.5 h-3.5 rounded-full bg-ink-900 flex items-center justify-center shadow-sm",
              plusOffset
            )}
          >
            <Plus className="w-2 h-2 text-white" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {!compact ? (
        <motion.span
          layoutId={`member-name-${member.id}`}
          className={cn(
            "text-xs font-medium truncate max-w-[60px] transition-colors duration-200",
            isSelected ? "text-ink-900" : "text-ink-500"
          )}
        >
          {member.name.split(" ")[0]}
        </motion.span>
      ) : null}
    </motion.button>
  );
}

function AddButton({
  onClick,
  isOpen,
  compact,
}: {
  onClick: () => void;
  isOpen: boolean;
  compact?: boolean;
}) {
  const size = compact ? "w-8 h-8" : "w-12 h-12";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center outline-none cursor-pointer",
        compact ? "gap-0" : "gap-1.5"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          "rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200",
          size,
          "group-focus-visible:ring-2 group-focus-visible:ring-beacon-500/40 group-focus-visible:ring-offset-2",
          isOpen
            ? "border-beacon-600 bg-beacon-50"
            : "border-ink-900/20 hover:border-ink-900/35 hover:bg-ink-900/[0.03]"
        )}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus
            className={cn(
              compact ? "w-3.5 h-3.5" : "w-5 h-5",
              "transition-colors duration-200",
              isOpen ? "text-beacon-700" : "text-ink-400"
            )}
          />
        </motion.div>
      </div>
      {!compact ? (
        <span
          className={cn(
            "text-xs font-medium transition-colors duration-200",
            isOpen ? "text-beacon-700" : "text-ink-500"
          )}
        >
          Add
        </span>
      ) : null}
    </motion.button>
  );
}

function Dropdown({
  members,
  selected,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  members: Member[];
  selected: string[];
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredMembers = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
  }, [members, selected, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-ink-900/10 bg-white shadow-[0_12px_40px_rgba(17,17,16,0.12)] overflow-hidden z-50"
    >
      <div className="p-3 border-b border-ink-900/8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-ink-900/[0.03] border border-transparent rounded-lg outline-none focus:border-beacon-500/30 focus:bg-white placeholder:text-ink-400 transition-colors"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {filteredMembers.map((member, index) => {
          const isSelected = selected.includes(member.id);
          return (
            <motion.button
              key={member.id}
              type="button"
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: index * 0.02, duration: 0.15 }}
              onClick={() => onSelect(member.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors text-left",
                isSelected ? "bg-beacon-50/80 hover:bg-beacon-50" : "hover:bg-ink-900/[0.03]"
              )}
            >
              <div
                className={cn(
                  "relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 transition-all duration-200",
                  !isSelected && "grayscale opacity-65"
                )}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center text-xs font-medium",
                      isSelected
                        ? "bg-beacon-50 text-beacon-800"
                        : "bg-ink-900/[0.06] text-ink-500"
                    )}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                {member.online ? (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-sm font-medium truncate",
                    isSelected ? "text-ink-900" : "text-ink-800"
                  )}
                >
                  {member.name}
                </div>
                {member.email ? (
                  <div className="text-xs text-ink-500 truncate">{member.email}</div>
                ) : null}
              </div>

              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  isSelected ? "bg-ink-900" : "border-2 border-ink-900/15"
                )}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                ) : null}
              </div>
            </motion.button>
          );
        })}

        {filteredMembers.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-ink-500">No members found</div>
        ) : null}
      </div>
    </motion.div>
  );
}

const MemberSelector = React.forwardRef<HTMLDivElement, MemberSelectorProps>(
  (
    {
      members,
      selected,
      onChange,
      max,
      maxVisible = 5,
      label,
      compact = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortedMembers = React.useMemo(() => {
      return [...members].sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
    }, [members, selected]);

    const visibleMembers = sortedMembers.slice(0, maxVisible);

    const toggleMember = (id: string) => {
      const isCurrentlySelected = selected.includes(id);

      if (isCurrentlySelected) {
        onChange(selected.filter((s) => s !== id));
      } else {
        if (max && selected.length >= max) return;
        onChange([...selected, id]);
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        {label ? (
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500 mb-2">
            {label}
          </div>
        ) : null}
        <div ref={containerRef} className="flex items-center gap-2">
          <LayoutGroup>
            {visibleMembers.map((member) => (
              <Avatar
                key={member.id}
                member={member}
                compact={compact}
                isSelected={selected.includes(member.id)}
                onClick={() => toggleMember(member.id)}
              />
            ))}

            <div className="relative">
              <AddButton
                compact={compact}
                isOpen={isOpen}
                onClick={() => setIsOpen((open) => !open)}
              />

              <AnimatePresence>
                {isOpen ? (
                  <Dropdown
                    members={members}
                    selected={selected}
                    onSelect={toggleMember}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </div>
      </div>
    );
  }
);

MemberSelector.displayName = "MemberSelector";

export { MemberSelector };
