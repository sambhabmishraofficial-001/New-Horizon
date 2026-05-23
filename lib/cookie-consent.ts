import {
  COOKIE_MAX_AGE,
  deleteCookie,
  getCookie,
  setCookie,
} from "@/lib/cookies";

export const CONSENT_COOKIE = "nh_consent";
export const CONSENT_VERSION = 1;

export type CookieCategory = "necessary" | "functional" | "analytics";

export type CookieConsent = {
  version: number;
  necessary: true;
  functional: boolean;
  analytics: boolean;
  decidedAt: number;
};

export type CookieConsentInput = Pick<
  CookieConsent,
  "functional" | "analytics"
>;

const subscribers = new Set<(consent: CookieConsent | null) => void>();

function notify(consent: CookieConsent | null) {
  for (const cb of subscribers) cb(consent);
}

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.necessary !== true) return null;
    if (typeof parsed.functional !== "boolean") return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.decidedAt !== "number") return null;

    return {
      version: CONSENT_VERSION,
      necessary: true,
      functional: parsed.functional,
      analytics: parsed.analytics,
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function readConsent(): CookieConsent | null {
  return parseConsent(getCookie(CONSENT_COOKIE));
}

export function hasDecidedConsent(): boolean {
  return readConsent() != null;
}

export function hasCategoryConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;

  const consent = readConsent();
  if (!consent) return false;

  return category === "functional" ? consent.functional : consent.analytics;
}

export function writeConsent(input: CookieConsentInput): CookieConsent {
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    necessary: true,
    functional: input.functional,
    analytics: input.analytics,
    decidedAt: Date.now(),
  };

  setCookie(CONSENT_COOKIE, JSON.stringify(consent), {
    maxAge: COOKIE_MAX_AGE.consent,
    sameSite: "Lax",
  });

  notify(consent);
  return consent;
}

export function acceptAllCookies(): CookieConsent {
  return writeConsent({ functional: true, analytics: true });
}

export function rejectNonEssentialCookies(): CookieConsent {
  return writeConsent({ functional: false, analytics: false });
}

export function clearConsent(): void {
  deleteCookie(CONSENT_COOKIE);
  notify(null);
}

export function subscribeConsent(
  cb: (consent: CookieConsent | null) => void,
): () => void {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export const COOKIE_INVENTORY = [
  {
    name: "nh_consent",
    kind: "Cookie",
    category: "necessary" as const,
    purpose: "Stores your cookie preference choices.",
    duration: "1 year",
  },
  {
    name: "nh-marketing-banner-dismissed",
    kind: "Cookie",
    category: "functional" as const,
    purpose: "Remembers when you dismiss the site announcement banner.",
    duration: "1 year",
  },
  {
    name: "theme",
    kind: "Local storage",
    category: "functional" as const,
    purpose: "Remembers light or dark appearance.",
    duration: "Until cleared",
  },
  {
    name: "nh.session",
    kind: "Local storage",
    category: "necessary" as const,
    purpose: "Keeps you signed in during your visit.",
    duration: "Until sign out",
  },
  {
    name: "nh.users",
    kind: "Local storage",
    category: "necessary" as const,
    purpose: "Stores account data for signed-in users in this demo environment.",
    duration: "Until account deletion",
  },
] as const;

export const OPEN_COOKIE_PREFERENCES_EVENT = "nh:open-cookie-preferences";

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}

export function subscribeOpenCookiePreferences(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, cb);
  return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, cb);
}
