import { sitePath } from "@/lib/sitePath";

const STORAGE_KEY = "nh.windowsInvite.redeemed";

/** Demo invite codes - replace with server validation in production. */
const VALID_INVITE_CODES = new Set([
  "LATTICE",
  "NH-COHORT01",
  "VRI-INVITE",
  "WINDOWS-2026",
]);

export const WINDOWS_INSTALLER_PATH = sitePath("/downloads/Lattice-Windows.zip");

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "-");
}

export function validateWindowsInviteCode(code: string): boolean {
  const normalized = normalizeInviteCode(code);
  return normalized.length > 0 && VALID_INVITE_CODES.has(normalized);
}

export function markWindowsInviteRedeemed(code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      code: normalizeInviteCode(code),
      at: Date.now(),
    })
  );
}

export function hasWindowsDownloadAccess(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) != null;
}

export function triggerWindowsDownload(): void {
  const anchor = document.createElement("a");
  anchor.href = WINDOWS_INSTALLER_PATH;
  anchor.download = "Lattice-Windows.zip";
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
