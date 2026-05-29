"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarketingAnnouncementBanner } from "@/components/marketing/MarketingAnnouncementBanner";
import { AvatarMenu } from "@/components/shell/AvatarMenu";
import { cn } from "@/lib/cn";
import { prefetchIreDemoPreview } from "@/lib/ire-demo-preview";
import { useMarketingBannerDismissed } from "@/lib/hooks/useMarketingBannerDismissed";
import { useSession } from "@/lib/store/auth";

type Variant = "dark" | "light";

const links: { label: string; href: string }[] = [
  { label: "Products", href: "/products" },
  { label: "Playground", href: "/playground" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function isNavLinkActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

export function MarketingNav({
  variant = "light",
  hideOnScroll = false,
  showBanner = true,
  showSpacer = true,
  ignoreBannerDismiss = false,
}: {
  variant?: Variant;
  hideOnScroll?: boolean;
  showBanner?: boolean;
  showSpacer?: boolean;
  ignoreBannerDismiss?: boolean;
}) {
  const isDark = variant === "dark";
  const pathname = usePathname() ?? "/";
  const { user, loading } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sessionBannerDismissed, setSessionBannerDismissed] = useState(false);
  const { dismissed: bannerDismissed, ready: bannerReady, dismiss } =
    useMarketingBannerDismissed();
  const bannerVisible =
    showBanner &&
    !sessionBannerDismissed &&
    (ignoreBannerDismiss || (bannerReady ? !bannerDismissed : true));
  const lastScrollY = useRef(0);

  function handleBannerDismiss() {
    dismiss();
    setSessionBannerDismissed(true);
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const current = window.scrollY;
        setIsScrolled(current > 8);

        if (!hideOnScroll) {
          setHidden(false);
        } else if (current <= 72) {
          setHidden(false);
        } else if (current > lastScrollY.current + 6) {
          setHidden(true);
          setMenuOpen(false);
        } else if (current < lastScrollY.current - 6) {
          setHidden(false);
        }

        lastScrollY.current = current;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [hideOnScroll]);

  const shellClass = cn(
    "marketing-nav-shell relative w-full transition-[background-color,border-color,box-shadow] duration-300",
    isDark
      ? cn(
          "border-b border-white/[0.08]",
          isScrolled
            ? "bg-[#0a0a0a]/92 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
            : "bg-[#0a0a0a]/72 backdrop-blur-md",
        )
      : cn(
          "border-b border-ink-900/[0.06]",
          isScrolled
            ? "bg-white/95 shadow-[0_1px_0_rgba(17,17,16,0.04)] backdrop-blur-xl"
            : "bg-white/90 backdrop-blur-md",
        ),
  );

  const linkClass = (href: string) => {
    const active = isNavLinkActive(pathname, href);
    return cn(
      "marketing-nav-link",
      isDark
        ? active
          ? "text-white"
          : "text-white/55 hover:text-white"
        : active
          ? "text-ink-900"
          : "text-ink-500 hover:text-ink-900",
    );
  };

  const navOffset = bannerVisible ? "top-[6.75rem]" : "top-16";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-transform duration-300 ease-out will-change-transform",
          hideOnScroll && hidden && "-translate-y-full pointer-events-none",
        )}
      >
        {bannerVisible ? (
          <MarketingAnnouncementBanner onDismiss={handleBannerDismiss} />
        ) : null}

        <nav data-state={menuOpen ? "active" : undefined} className={shellClass}>
          <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8 lg:px-10">
            <Link
              href="/"
              className={cn(
                "marketing-nav-wordmark shrink-0 font-marketing text-[15px] font-medium tracking-[-0.03em] transition-opacity hover:opacity-75",
                isDark ? "text-white" : "text-ink-900",
              )}
              onClick={() => setMenuOpen(false)}
            >
              New Horizon
            </Link>

            <ul className="hidden items-center justify-center gap-8 lg:flex xl:gap-10">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={linkClass(item.href)}
                    aria-current={
                      isNavLinkActive(pathname, item.href) ? "page" : undefined
                    }
                    onMouseEnter={
                      item.href === "/products"
                        ? () => prefetchIreDemoPreview()
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-end gap-3 sm:gap-4">
              {!loading && user ? (
                <AvatarMenu variant={variant} showCaret />
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "hidden font-marketing text-[13px] tracking-[-0.01em] transition-colors sm:inline-flex",
                      isDark
                        ? "text-white/60 hover:text-white"
                        : "text-ink-500 hover:text-ink-900",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="mailto:contact@newhorizon.dev?subject=Contact%20%E2%80%94%20New%20Horizon"
                    className={cn(
                      "btn-xai h-9 px-4 text-[13px]",
                      isDark
                        ? "border-white/20 bg-transparent text-white hover:border-white/35 hover:bg-white/[0.06]"
                        : "btn-xai-primary",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden",
                  isDark
                    ? "border-white/15 text-white hover:bg-white/10"
                    : "border-ink-900/10 text-ink-900 hover:bg-ink-900/5",
                )}
              >
                {menuOpen ? (
                  <X className="size-4" aria-hidden />
                ) : (
                  <Menu className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div
            aria-hidden
            className={cn(
              "marketing-nav-accent h-[2px] w-full",
              isDark ? "opacity-90" : "opacity-80",
            )}
          />
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <div
        className={cn(
          "fixed inset-x-0 z-[58] max-h-[calc(100dvh-4rem)] overflow-y-auto border-b transition-[opacity,transform] duration-300 lg:hidden",
          navOffset,
          isDark
            ? "border-white/10 bg-[#0a0a0a]/98 backdrop-blur-xl"
            : "border-ink-900/8 bg-white/98 backdrop-blur-xl",
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-3 font-marketing text-[22px] tracking-[-0.03em] transition-colors",
                    isDark
                      ? "text-white/80 hover:bg-white/5 hover:text-white"
                      : "text-ink-700 hover:bg-ink-900/5 hover:text-ink-900",
                    isNavLinkActive(pathname, item.href) &&
                      (isDark ? "text-white" : "text-ink-900"),
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {!loading && !user ? (
            <div
              className={cn(
                "mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row",
                isDark ? "border-white/10" : "border-ink-900/8",
              )}
            >
              <Link
                href="/login"
                className={cn(
                  "btn-xai h-10 w-full justify-center sm:w-auto",
                  isDark
                    ? "border-white/20 bg-transparent text-white hover:border-white/35 hover:bg-white/[0.06]"
                    : "btn-xai-secondary",
                )}
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="mailto:contact@newhorizon.dev?subject=Contact%20%E2%80%94%20New%20Horizon"
                className={cn(
                  "btn-xai h-10 w-full justify-center sm:w-auto",
                  isDark ? "border-white bg-white text-ink-900 hover:bg-white/90" : "btn-xai-primary",
                )}
                onClick={() => setMenuOpen(false)}
              >
                Contact
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {showSpacer ? (
        <div
          aria-hidden
          className={cn(
            "marketing-header-spacer shrink-0",
            bannerVisible ? "marketing-header-spacer--with-banner" : undefined,
          )}
        />
      ) : null}
    </>
  );
}

export { MarketingNav as Header };
