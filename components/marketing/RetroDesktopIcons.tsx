import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

function RetroIconFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("retro-icon", className)} aria-hidden>
      {children}
    </span>
  );
}

/** Classic Windows "My Computer" monitor icon. */
export function MyComputerIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <defs>
          <linearGradient id="retro-pc-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ece9d8" />
            <stop offset="100%" stopColor="#c8c4b8" />
          </linearGradient>
          <linearGradient id="retro-pc-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a90e2" />
            <stop offset="100%" stopColor="#1e5799" />
          </linearGradient>
        </defs>
        <rect x="4" y="3" width="24" height="17" rx="1.5" fill="url(#retro-pc-bezel)" stroke="#8a8678" strokeWidth="0.8" />
        <rect x="6.5" y="5.5" width="19" height="12" rx="0.5" fill="url(#retro-pc-screen)" />
        <rect x="8" y="7" width="7" height="5" rx="0.5" fill="#fff" opacity="0.92" />
        <rect x="16" y="7" width="7" height="2" rx="0.5" fill="#fff" opacity="0.75" />
        <rect x="16" y="10" width="5" height="2" rx="0.5" fill="#fff" opacity="0.55" />
        <rect x="10" y="21" width="12" height="3" rx="0.8" fill="#b8b4a8" stroke="#8a8678" strokeWidth="0.6" />
        <rect x="13" y="24" width="6" height="2.5" rx="0.5" fill="#a8a49a" />
      </svg>
    </RetroIconFrame>
  );
}

/** Classic Windows yellow folder. */
export function FolderIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <defs>
          <linearGradient id="retro-folder-tab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe680" />
            <stop offset="100%" stopColor="#f5c842" />
          </linearGradient>
          <linearGradient id="retro-folder-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffdf5c" />
            <stop offset="100%" stopColor="#e8a820" />
          </linearGradient>
        </defs>
        <path
          d="M4 10 C4 9 4.8 8.5 6 8.5 L12 8.5 C13 8.5 13.5 8 14 7.5 L15.5 6 C16 5.5 16.8 5 18 5 L24 5 C25.5 5 26.5 6 26.5 7.5 L26.5 24 C26.5 25.2 25.7 26 24.5 26 L7.5 26 C6.3 26 5.5 25.2 5.5 24 L5.5 10 Z"
          fill="url(#retro-folder-body)"
          stroke="#c48810"
          strokeWidth="0.7"
        />
        <path
          d="M5.5 10 L5.5 9 C5.5 8 6.3 7.5 7 7.5 L13 7.5 C14 7.5 14.5 7 15 6.5 L16 5.5 C16.5 5 17.2 4.5 18 4.5 L22 4.5 C23.2 4.5 24 5.3 24 6.5 L24 10 Z"
          fill="url(#retro-folder-tab)"
          stroke="#c48810"
          strokeWidth="0.6"
        />
      </svg>
    </RetroIconFrame>
  );
}

/** Documents folder with paper peeking out. */
export function DocumentsFolderIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <defs>
          <linearGradient id="retro-docs-tab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe680" />
            <stop offset="100%" stopColor="#f5c842" />
          </linearGradient>
          <linearGradient id="retro-docs-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffdf5c" />
            <stop offset="100%" stopColor="#e8a820" />
          </linearGradient>
        </defs>
        <rect x="10" y="4" width="12" height="15" rx="0.8" fill="#fff" stroke="#b8b4a8" strokeWidth="0.7" />
        <rect x="12" y="7" width="8" height="1.2" rx="0.3" fill="#94a3b8" />
        <rect x="12" y="10" width="8" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="12" y="13" width="6" height="1.2" rx="0.3" fill="#cbd5e1" />
        <path
          d="M4 12 C4 11 4.8 10.5 6 10.5 L11 10.5 C12 10.5 12.5 10 13 9.5 L14.5 8 C15 7.5 15.8 7 17 7 L24 7 C25.5 7 26.5 8 26.5 9.5 L26.5 25 C26.5 26.2 25.7 27 24.5 27 L7.5 27 C6.3 27 5.5 26.2 5.5 25 L5.5 12 Z"
          fill="url(#retro-docs-body)"
          stroke="#c48810"
          strokeWidth="0.7"
        />
        <path
          d="M5.5 12 L5.5 11 C5.5 10 6.3 9.5 7 9.5 L12 9.5 C13 9.5 13.5 9 14 8.5 L15 7.5 C15.5 7 16.2 6.5 17 6.5 L21 6.5 C22.2 6.5 23 7.3 23 8.5 L23 12 Z"
          fill="url(#retro-docs-tab)"
          stroke="#c48810"
          strokeWidth="0.6"
        />
      </svg>
    </RetroIconFrame>
  );
}

/** New Horizon / Virtual Research Institute application icon. */
export function VriAppIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg" aria-hidden>
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="4.5"
          fill="#ffffff"
          stroke="#e5e5e5"
          strokeWidth="0.8"
        />

        <g fill="#111110">
          <rect x="7.4" y="11.2" width="1.25" height="9.6" rx="0.15" />
          <rect x="7.4" y="11.2" width="2" height="1.1" rx="0.15" />
          <rect x="7.4" y="19.7" width="2" height="1.1" rx="0.15" />

          <rect x="10.65" y="11.2" width="1.25" height="9.6" rx="0.15" />
          <polygon points="10.65,11.2 15.35,20.3 14.05,20.3 10.65,14.45" />
          <rect x="14.05" y="11.2" width="1.25" height="9.6" rx="0.15" />

          <rect x="17.3" y="11.2" width="1.25" height="9.6" rx="0.15" />
          <rect x="17.3" y="15.45" width="4.75" height="1.15" rx="0.15" />
          <rect x="20.8" y="11.2" width="1.25" height="9.6" rx="0.15" />

          <rect x="24.55" y="11.2" width="1.25" height="9.6" rx="0.15" />
          <rect x="23.8" y="11.2" width="2" height="1.1" rx="0.15" />
          <rect x="23.8" y="19.7" width="2" height="1.1" rx="0.15" />
        </g>
      </svg>
    </RetroIconFrame>
  );
}

/** SciDuck pixel mascot app icon. */
export function SciDuckAppIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg" shapeRendering="crispEdges">
        <defs>
          <linearGradient id="retro-duck-sky" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4F0FF" />
            <stop offset="1" stopColor="#6BB8E8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="3" fill="url(#retro-duck-sky)" />
        <rect x="18" y="4" width="8" height="2" fill="#fff" opacity="0.95" />
        <rect x="16" y="6" width="12" height="4" fill="#fff" opacity="0.9" />
        <rect x="20" y="10" width="6" height="2" fill="#fff" opacity="0.85" />
        <rect x="10" y="16" width="14" height="10" fill="#F5C518" />
        <rect x="8" y="18" width="18" height="8" fill="#F5C518" />
        <rect x="6" y="8" width="12" height="12" fill="#F5C518" />
        <rect x="2" y="12" width="6" height="4" fill="#E8871E" />
        <rect x="8" y="10" width="4" height="4" fill="#111110" />
        <rect x="10" y="12" width="2" height="2" fill="#fff" />
        <rect x="16" y="22" width="4" height="4" fill="#E8871E" />
        <rect x="20" y="24" width="4" height="4" fill="#E8871E" />
      </svg>
    </RetroIconFrame>
  );
}

/** Lattice grid application icon. */
export function LatticeAppIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <defs>
          <linearGradient id="retro-lattice-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="url(#retro-lattice-bg)" stroke="#1e40af" strokeWidth="0.7" />
        <path
          d="M8 8 H24 M8 13 H24 M8 18 H24 M8 23 H24 M8 8 V23 M13 8 V23 M18 8 V23 M23 8 V23"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.2"
        />
        <circle cx="13" cy="13" r="2.2" fill="#93c5fd" stroke="#fff" strokeWidth="0.8" />
        <circle cx="18" cy="18" r="2.2" fill="#bfdbfe" stroke="#fff" strokeWidth="0.8" />
        <circle cx="23" cy="13" r="2.2" fill="#60a5fa" stroke="#fff" strokeWidth="0.8" />
      </svg>
    </RetroIconFrame>
  );
}

/** Neural network / model stack icon. */
export function ModelStackIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <defs>
          <linearGradient id="retro-model-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="url(#retro-model-bg)" stroke="#1e40af" strokeWidth="0.7" />
        <rect x="7" y="8" width="18" height="4" rx="1" fill="#60a5fa" opacity="0.9" />
        <rect x="7" y="14" width="18" height="4" rx="1" fill="#93c5fd" opacity="0.85" />
        <rect x="7" y="20" width="18" height="4" rx="1" fill="#bfdbfe" opacity="0.8" />
        <circle cx="11" cy="10" r="1.2" fill="#fff" />
        <circle cx="16" cy="10" r="1.2" fill="#fff" />
        <circle cx="21" cy="10" r="1.2" fill="#fff" />
        <circle cx="11" cy="16" r="1.2" fill="#1e3a8a" />
        <circle cx="16" cy="16" r="1.2" fill="#1e3a8a" />
        <circle cx="21" cy="16" r="1.2" fill="#1e3a8a" />
        <circle cx="11" cy="22" r="1.2" fill="#1e3a8a" />
        <circle cx="16" cy="22" r="1.2" fill="#1e3a8a" />
        <circle cx="21" cy="22" r="1.2" fill="#1e3a8a" />
      </svg>
    </RetroIconFrame>
  );
}

/** Fine-tune / adjustment icon. */
export function FineTuneIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#312e81" stroke="#4338ca" strokeWidth="0.7" />
        <rect x="8" y="9" width="16" height="14" rx="1.5" fill="#4f46e5" stroke="#818cf8" strokeWidth="0.6" />
        <rect x="10" y="11" width="12" height="2" rx="0.5" fill="#c7d2fe" />
        <rect x="10" y="15" width="8" height="2" rx="0.5" fill="#a5b4fc" />
        <rect x="10" y="19" width="10" height="2" rx="0.5" fill="#818cf8" />
        <path
          d="M22 20 L28 26 M24 18 L28 22"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="20" r="2.5" fill="#fbbf24" stroke="#fff" strokeWidth="0.8" />
      </svg>
    </RetroIconFrame>
  );
}

/** Leaderboard / podium icon. */
export function LeaderboardIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#14532d" stroke="#166534" strokeWidth="0.7" />
        <rect x="6" y="18" width="7" height="8" rx="0.8" fill="#86efac" stroke="#22c55e" strokeWidth="0.6" />
        <rect x="12.5" y="12" width="7" height="14" rx="0.8" fill="#4ade80" stroke="#16a34a" strokeWidth="0.6" />
        <rect x="19" y="15" width="7" height="11" rx="0.8" fill="#bbf7d0" stroke="#22c55e" strokeWidth="0.6" />
        <text x="9.5" y="17" textAnchor="middle" fontSize="5" fontWeight="700" fill="#14532d">
          3
        </text>
        <text x="16" y="11" textAnchor="middle" fontSize="5" fontWeight="700" fill="#14532d">
          1
        </text>
        <text x="22.5" y="14" textAnchor="middle" fontSize="5" fontWeight="700" fill="#14532d">
          2
        </text>
      </svg>
    </RetroIconFrame>
  );
}

/** Task suite / checklist icon. */
export function TaskSuiteIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#064e3b" stroke="#047857" strokeWidth="0.7" />
        <rect x="8" y="7" width="16" height="18" rx="1.5" fill="#fff" stroke="#94a3b8" strokeWidth="0.6" />
        <rect x="10" y="10" width="3" height="3" rx="0.5" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
        <path d="M10.6 11.6 L11.4 12.4 L13 10.8" fill="none" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
        <rect x="14.5" y="10.5" width="7" height="1.5" rx="0.4" fill="#cbd5e1" />
        <rect x="10" y="15" width="3" height="3" rx="0.5" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
        <path d="M10.6 16.6 L11.4 17.4 L13 15.8" fill="none" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
        <rect x="14.5" y="15.5" width="7" height="1.5" rx="0.4" fill="#cbd5e1" />
        <rect x="10" y="20" width="3" height="3" rx="0.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        <rect x="14.5" y="20.5" width="7" height="1.5" rx="0.4" fill="#cbd5e1" />
      </svg>
    </RetroIconFrame>
  );
}

/** Research corpus / stacked papers icon. */
export function CorpusIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="0.7" />
        <rect x="8" y="9" width="14" height="16" rx="1" fill="#fff" stroke="#b45309" strokeWidth="0.6" transform="rotate(-6 15 17)" />
        <rect x="9" y="8" width="14" height="16" rx="1" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" transform="rotate(3 16 16)" />
        <rect x="10" y="7" width="14" height="16" rx="1" fill="#fff" stroke="#92400e" strokeWidth="0.6" />
        <rect x="12" y="11" width="10" height="1.5" rx="0.4" fill="#fcd34d" />
        <rect x="12" y="14" width="8" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="12" y="17" width="9" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="12" y="20" width="6" height="1.2" rx="0.3" fill="#cbd5e1" />
      </svg>
    </RetroIconFrame>
  );
}

/** Preprint / document icon. */
export function PreprintIcon({ className }: IconProps) {
  return (
    <RetroIconFrame className={className}>
      <svg viewBox="0 0 32 32" className="retro-icon__svg">
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#451a03" stroke="#78350f" strokeWidth="0.7" />
        <rect x="8" y="6" width="16" height="20" rx="1.2" fill="#fff" stroke="#b45309" strokeWidth="0.6" />
        <rect x="10" y="9" width="12" height="2" rx="0.4" fill="#fbbf24" />
        <rect x="10" y="13" width="10" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="10" y="16" width="11" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="10" y="19" width="8" height="1.2" rx="0.3" fill="#cbd5e1" />
        <rect x="18" y="20" width="8" height="8" rx="1" fill="#f59e0b" stroke="#fff" strokeWidth="0.6" transform="rotate(12 22 24)" />
        <text x="22" y="25.5" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#fff" transform="rotate(12 22 24)">
          PDF
        </text>
      </svg>
    </RetroIconFrame>
  );
}
