import { sitePath } from "./sitePath";

export const LATTICE_SECTIONS = [
  { id: "lattice-overview", label: "Overview" },
  { id: "lattice-workspace", label: "Studio" },
  { id: "lattice-primitives", label: "Primitives" },
  { id: "lattice-start", label: "Get started" },
] as const;

/** Lattice is a standalone product — not part of VRI / New Horizon institute. */
export const LATTICE_PATHS = {
  home: "/lattice",
  workspace: "/lattice",
  marketing: "/products?lattice=1",
  docs: "/lattice?docs=1",
} as const;

export const LATTICE_PRODUCT_QUERY = "lattice=1";

export function latticeProductHref(): string {
  return sitePath(`${LATTICE_PATHS.home}/`);
}

export function latticeMarketingHref(): string {
  return `${sitePath("/products/")}?${LATTICE_PRODUCT_QUERY}`;
}

export function isLatticeProductOpen(
  searchParams: URLSearchParams | null,
): boolean {
  return searchParams?.get("lattice") === "1";
}

export function scrollToLatticeSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
