export type CookieSameSite = "Strict" | "Lax" | "None";

export type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: CookieSameSite;
};

const ONE_YEAR = 60 * 60 * 24 * 365;

export const COOKIE_MAX_AGE = {
  session: 60 * 60 * 24 * 7,
  preference: ONE_YEAR,
  consent: ONE_YEAR,
} as const;

function encode(value: string): string {
  return encodeURIComponent(value);
}

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function defaultOptions(options: CookieOptions = {}): Required<
  Pick<CookieOptions, "path" | "sameSite" | "secure">
> &
  CookieOptions {
  const secure =
    options.secure ??
    (typeof window !== "undefined" && window.location.protocol === "https:");

  return {
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "Lax",
    secure,
    ...options,
  };
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${encode(name)}=`;
  const parts = document.cookie.split(";");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decode(trimmed.slice(prefix.length));
    }
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (typeof document === "undefined") return;

  const resolved = defaultOptions(options);
  const segments = [
    `${encode(name)}=${encode(value)}`,
    `path=${resolved.path}`,
  ];

  if (resolved.maxAge != null) {
    segments.push(`max-age=${resolved.maxAge}`);
  }

  if (resolved.expires) {
    segments.push(`expires=${resolved.expires.toUTCString()}`);
  }

  if (resolved.domain) {
    segments.push(`domain=${resolved.domain}`);
  }

  segments.push(`SameSite=${resolved.sameSite}`);

  if (resolved.secure) {
    segments.push("Secure");
  }

  document.cookie = segments.join("; ");
}

export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, "path" | "domain"> = {},
): void {
  setCookie(name, "", {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
}

export function parseCookieHeader(header: string): Record<string, string> {
  const out: Record<string, string> = {};

  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = decode(trimmed.slice(0, eq));
    const value = decode(trimmed.slice(eq + 1));
    out[key] = value;
  }

  return out;
}
