"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/store/auth";
import { AvatarMenu } from "@/components/shell/AvatarMenu";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";

type Variant = "dark" | "light";

const links: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
];

export function MarketingNav({ variant = "light" }: { variant?: Variant }) {
  const isDark = variant === "dark";
  const { user, loading } = useSession();

  const wordmarkColor = isDark ? "text-white" : "text-ink-900";
  const linkColor = isDark
    ? "text-white/55 hover:text-white"
    : "text-ink-500 hover:text-ink-900";
  const ctaClass = isDark
    ? "border-white bg-white text-ink-900 hover:bg-white/90"
    : "border-ink-900 bg-ink-900 text-white hover:bg-ink-800";
  const signInColor = isDark
    ? "text-white/70 hover:text-white"
    : "text-ink-600 hover:text-ink-900";
  const containerBorder = isDark ? "border-white/10" : "border-ink-900/10";
  const containerBg = isDark ? "bg-transparent" : "bg-white";

  return (
    <header className={`relative z-30 border-b ${containerBorder} ${containerBg}`}>
      <div className="mx-auto grid h-20 max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center px-5 font-marketing sm:px-7 lg:px-8 xl:px-10">
        <Link
          href="/"
          className={`group inline-flex items-center gap-3 justify-self-start ${wordmarkColor}`}
        >
          <span
            className={`font-marketing text-[19px] font-light leading-none tracking-[0.12em] ${
              isDark ? "text-white" : "text-ink-900"
            }`}
            aria-hidden
          >
            [NH]
          </span>
          <span className="font-marketing text-[17px] font-medium leading-none tracking-[0.01em]">
            New Horizon
          </span>
        </Link>

        <nav className="hidden items-center gap-5 justify-self-center text-[11px] font-medium uppercase tracking-[0.16em] lg:gap-6 xl:gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkColor}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-3 justify-self-end">
          <ThemeToggle variant={variant} />
          {!loading && user ? (
            <AvatarMenu variant={variant} showCaret />
          ) : (
            <>
              <Link
                href="/login"
                className={`hidden font-marketing text-[12px] font-medium uppercase tracking-[0.04em] md:inline-flex ${signInColor}`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`btn-soft inline-flex h-12 items-center gap-2.5 rounded-xl border px-5 font-marketing text-[12px] font-normal uppercase tracking-[0.04em] not-italic xl:gap-3 xl:px-6 ${ctaClass}`}
              >
                Sign Up
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
