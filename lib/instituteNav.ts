import type { LucideIcon } from "lucide-react";
import {
  Home,
  SquareTerminal,
  Library,
  Sparkles,
  Network,
  Telescope,
  FlaskConical,
  Cpu,
  Users,
  GraduationCap,
} from "lucide-react";

/** Primary VRI institute surfaces - always shown in the same order. */
export type InstituteFeature = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const INSTITUTE_FEATURES: InstituteFeature[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/ire",
    icon: Home,
    description: "Programs, twins, and institute feed",
  },
  {
    id: "workspace",
    label: "Workspace",
    href: "/ire",
    icon: SquareTerminal,
    description: "Integrated research environment",
  },
  {
    id: "library",
    label: "Library",
    href: "/library",
    icon: Library,
    description: "Papers, datasets, artifacts",
  },
];

export type DiscoveryFeature = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const DISCOVERY_FEATURES: DiscoveryFeature[] = [
  { label: "Research Twins", href: "/twins", icon: Sparkles },
  { label: "Canvas", href: "/canvas", icon: Network },
  { label: "Invariants", href: "/invariants", icon: Telescope },
  { label: "Environments", href: "/environments", icon: FlaskConical },
  { label: "Studio", href: "/studio", icon: Cpu },
  { label: "Faculty", href: "/faculty", icon: Users },
  { label: "Enrol", href: "/enrol", icon: GraduationCap },
];

export function institutePathActive(pathname: string, href: string): boolean {
  const n = pathname.replace(/\/+$/, "") || "/";
  const h = href.replace(/\/+$/, "") || "/";
  if (h === "/lattice") return n === "/lattice";
  if (h === "/ire") return n === "/ire" || n === "/workspace";
  return n === h || n.startsWith(`${h}/`);
}

export function currentInstituteFeature(pathname: string): InstituteFeature | undefined {
  return INSTITUTE_FEATURES.find((f) => institutePathActive(pathname, f.href));
}
