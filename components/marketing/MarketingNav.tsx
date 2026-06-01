"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Equal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarketingAnnouncementBanner } from "@/components/marketing/MarketingAnnouncementBanner";
import { AvatarMenu } from "@/components/shell/AvatarMenu";
import { cn } from "@/lib/cn";
import { prefetchIreDemoPreview } from "@/lib/ire-demo-preview";
import { useMarketingBannerDismissed } from "@/lib/hooks/useMarketingBannerDismissed";
import { useSession } from "@/lib/store/auth";

type Variant = "dark" | "light";

const links: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
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
  hideOnScroll = true,
  showBanner = true,
  showSpacer = true,
}: {
  variant?: Variant;
  hideOnScroll?: boolean;
  showBanner?: boolean;
  showSpacer?: boolean;
}) {
  const isDark = variant === "dark";
  const pathname = usePathname() ?? "/";
  const { user, loading } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { dismissed: bannerDismissed, ready: bannerReady, dismiss } =
    useMarketingBannerDismissed();
  const bannerVisible = showBanner && bannerReady && !bannerDismissed;
  const lastScrollY = useRef(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const current = window.scrollY;
        setIsScrolled(current > 50);

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

  const wordmarkColor = isDark ? "text-white" : "text-ink-900";
  const linkColor = isDark
    ? "text-white/60 hover:text-white"
    : "text-ink-600 hover:text-ink-900";

  const navCtaBase =
    "btn-xai shrink-0 px-4 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/15";

  const loginButtonClass = cn(
    navCtaBase,
    "btn-xai-secondary h-9",
    isDark && "btn-xai-on-dark",
  );

  const contactButtonClass = cn(
    navCtaBase,
    "btn-xai-primary h-9",
    isDark && "border-white bg-white text-ink-900 hover:bg-parchment-50 hover:border-white"
  );

  const linkClass = (href: string) => {
    const active = isNavLinkActive(pathname, href);
    return cn(
      "font-marketing text-[13px] font-normal leading-[1.6] tracking-[-0.012em] transition-[color,border-color] duration-300 ease-out",
      "border-b-2 pb-0.5",
      active
        ? cn(
            "border-[#2563eb]",
            isDark ? "text-white" : "text-ink-900"
          )
        : cn("border-transparent", linkColor)
    );
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out will-change-transform",
          hideOnScroll && hidden && "-translate-y-full pointer-events-none"
        )}
      >
        {showBanner && bannerVisible ? (
          <MarketingAnnouncementBanner
            onDismiss={dismiss}
          />
        ) : null}
        <nav
          data-state={menuOpen ? "active" : undefined}
          className="w-full px-3 sm:px-4"
        >
          <div
            className={cn(
              "mx-auto mt-3 max-w-[1360px] px-4 transition-all duration-300 sm:px-6 lg:px-8",
              isScrolled &&
                (isDark
                  ? "max-w-4xl rounded-2xl border border-white/10 bg-ink-900/55 px-5 shadow-lift backdrop-blur-xl lg:px-6"
                  : "max-w-4xl rounded-2xl border border-ink-900/8 bg-white/55 px-5 shadow-lift backdrop-blur-xl lg:px-6")
            )}
          >
            <div className="relative flex flex-wrap items-center justify-between gap-4 py-2.5 lg:gap-0 lg:py-2">
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                href="/"
                className={cn(
                  "group inline-flex items-center gap-2",
                  wordmarkColor
                )}
                onClick={() => setMenuOpen(false)}
              >
                <span
                  className="font-marketing text-[19px] font-light leading-none tracking-[0.12em]"
                  aria-hidden
                >
                  [NH]
                </span>
                <span className="font-marketing text-[17px] font-medium leading-none tracking-[0.01em]">
                  New Horizon
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden",
                  isDark ? "text-white" : "text-ink-900"
                )}
              >
                <Equal
                  className={cn(
                    "m-auto size-6 duration-200",
                    menuOpen && "scale-0 opacity-0"
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 duration-200",
                    menuOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex items-center gap-6 xl:gap-8">
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
            </div>

            <div
              className={cn(
                "mb-2 w-full flex-wrap items-center justify-end gap-3 lg:mb-0 lg:flex lg:w-fit",
                menuOpen ? "flex" : "hidden lg:flex",
                menuOpen &&
                  (isDark
                    ? "rounded-2xl border border-white/10 bg-ink-900/80 p-4 shadow-lift backdrop-blur-xl"
                    : "rounded-2xl border border-ink-900/8 bg-white/80 p-4 shadow-lift backdrop-blur-xl")
              )}
            >
              <ul className="mb-4 w-full space-y-4 lg:hidden">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn("block", linkClass(item.href))}
                      aria-current={
                        isNavLinkActive(pathname, item.href) ? "page" : undefined
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {!loading && user ? (
                <AvatarMenu variant={variant} showCaret />
              ) : (
                <>
                  <div
                    className="mb-4 h-px w-full bg-ink-900/8 lg:hidden"
                    aria-hidden
                  />
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <Link
                      href="/login"
                      className={cn(loginButtonClass, "w-full sm:w-auto")}
                      onClick={() => setMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="mailto:contact@newhorizon.dev?subject=Contact%20%E2%80%94%20New%20Horizon"
                      className={cn(contactButtonClass, "w-full sm:w-auto")}
                      onClick={() => setMenuOpen(false)}
                    >
                      Contact
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      </header>
      {showSpacer ? (
        <div
          aria-hidden
          className={cn(
            "marketing-header-spacer shrink-0",
            bannerVisible ? "marketing-header-spacer--with-banner" : undefined
          )}
        />
      ) : null}
    </>
  );
}

export { MarketingNav as Header };
