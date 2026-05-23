import {
  Home,
  Sparkles,
  Network,
  Telescope,
  FlaskConical,
  Cpu,
  Users,
  GraduationCap,
  Library,
  SquareTerminal,
  Microscope,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  kbd?: string;
  description: string;
  section: "Institute" | "Discovery" | "Systems" | "People";
};

export const NAV: NavItem[] = [
  {
    label: "Overview",
    href: "/lattice",
    icon: Home,
    kbd: "1",
    description: "Institute overview - programs, twins, and feed.",
    section: "Institute",
  },
  {
    label: "Workspace",
    href: "/ire",
    icon: SquareTerminal,
    kbd: "W",
    description: "Integrated Research Environment - your daily workstation.",
    section: "Institute",
  },
  {
    label: "Virtual Labs",
    href: "/virtual-labs",
    icon: Microscope,
    kbd: "L",
    description: "Digital lab spaces - benches, instruments, protocols, and live runs.",
    section: "Institute",
  },
  {
    label: "Research Twins",
    href: "/twins",
    icon: Sparkles,
    kbd: "2",
    description: "Deployable AI co-scientists with reasoning chains.",
    section: "Discovery",
  },
  {
    label: "Canvas",
    href: "/canvas",
    icon: Network,
    kbd: "3",
    description: "Neurosymbolic research graph - hypotheses to proofs.",
    section: "Discovery",
  },
  {
    label: "Invariants & Anomalies",
    href: "/invariants",
    icon: Telescope,
    kbd: "4",
    description: "Surface invariants across runs; triage anomalies.",
    section: "Discovery",
  },
  {
    label: "Environments",
    href: "/environments",
    icon: FlaskConical,
    kbd: "5",
    description: "In-silico RL environments and rollouts.",
    section: "Systems",
  },
  {
    label: "Studio",
    href: "/studio",
    icon: Cpu,
    kbd: "6",
    description: "Train, fine-tune, and evaluate models.",
    section: "Systems",
  },
  {
    label: "Faculty",
    href: "/faculty",
    icon: Users,
    kbd: "7",
    description: "Labs, researchers, permissions, compute nodes.",
    section: "People",
  },
  {
    label: "Enrol",
    href: "/enrol",
    icon: GraduationCap,
    kbd: "8",
    description: "Enrol a researcher, lab, or an AI Investigator (AID).",
    section: "People",
  },
  {
    label: "Library",
    href: "/library",
    icon: Library,
    kbd: "9",
    description: "Artifacts, datasets, papers, sequences.",
    section: "Institute",
  },
];

export const BRAND = {
  name: "New Horizon",
  tagline: "Virtual Research Institute",
  version: "0.9.0 · Institute",
  logo: "[NH]",
};
