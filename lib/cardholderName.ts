import type { UserProfile } from "@/lib/store/auth";

const OAUTH_PLACEHOLDER_NAMES = /^(google|github|orcid|microsoft|apple|facebook)$/i;

/** Display name for VRI ID - avoids OAuth provider labels like "Google". */
export function resolveCardholderName(user: UserProfile): string {
  const full = user.fullName?.trim();
  const preferred = user.preferredName?.trim();

  if (full && !/demo user$/i.test(full)) {
    const first = full.split(/\s+/)[0];
    if (first && !OAUTH_PLACEHOLDER_NAMES.test(first)) return formatName(first);
    if (full.length <= 24) return formatName(full);
  }

  if (preferred && !OAUTH_PLACEHOLDER_NAMES.test(preferred)) {
    return formatName(preferred);
  }

  const local = user.email.split("@")[0]?.replace(/[._+-]/g, " ").trim();
  if (local) {
    const first = local.split(/\s+/)[0];
    return formatName(first);
  }

  return "Researcher";
}

function formatName(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
