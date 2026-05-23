"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { hasCategoryConsent } from "@/lib/cookie-consent";

type Theme = "light" | "dark";

export function ThemeToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const initial =
      (typeof document !== "undefined" &&
        (document.documentElement.getAttribute("data-theme") as Theme | null)) ||
      "light";
    setTheme(initial === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    if (typeof document !== "undefined") {
      if (next === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.style.colorScheme = "light";
      }
    }
    try {
      if (hasCategoryConsent("functional")) {
        localStorage.setItem("theme", next);
      }
    } catch {}
  };

  const isDarkVariant = variant === "dark";
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors";
  const colors = isDarkVariant
    ? "border-white/20 text-white/75 hover:border-white/40 hover:text-white"
    : "border-ink-900/12 text-ink-600 hover:border-ink-900/30 hover:text-ink-900";

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => apply(theme === "dark" ? "light" : "dark")}
      className={`${base} ${colors}`}
      suppressHydrationWarning
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" strokeWidth={1.6} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.6} />
      )}
    </button>
  );
}
