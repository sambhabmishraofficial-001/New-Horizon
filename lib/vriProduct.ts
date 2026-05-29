import { sitePath } from "./sitePath";

/** In-page sections on the VRI product experience */
export const VRI_SECTIONS = [
  { id: "vri-overview", label: "Overview" },
  { id: "vri-workspace", label: "Workspace" },
  { id: "vri-institute", label: "Institute" },
  { id: "vri-how-it-works", label: "How it works" },
  { id: "vri-corpus", label: "Corpus" },
  { id: "vri-start", label: "Get started" },
] as const;

export const VRI_PATHS = {
  signup: "/signup",
  workspace: "/ire",
  products: "/products",
} as const;

export const VRI_PRODUCT_QUERY = "vri=1";

export function vriProductHref(): string {
  return `${sitePath(`${VRI_PATHS.products}/`)}?${VRI_PRODUCT_QUERY}`;
}

export function isVriProductOpen(searchParams: URLSearchParams | null): boolean {
  return searchParams?.get("vri") === "1";
}

export function scrollToVriSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
