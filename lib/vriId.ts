/**
 * Deterministic VRI institute ID credentials - unique per user, stable across sessions.
 */

export type VriIdCredentials = {
  memberId: string;
  cardLast4: string;
  cardDisplay: string;
  activationCode: string;
  validThru: string;
  holderLabel: string;
};

function hashUserId(userId: string): number {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h << 5) - h + userId.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function segmentFromHash(seed: number, offset: number, length: number): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let n = seed + offset * 7919;
  let out = "";
  for (let i = 0; i < length; i++) {
    n = (n * 1103515245 + 12345) | 0;
    out += chars[Math.abs(n) % chars.length];
  }
  return out;
}

export function getVriIdCredentials(
  userId: string,
  holderName?: string
): VriIdCredentials {
  const seed = hashUserId(userId);
  const blockA = segmentFromHash(seed, 1, 4);
  const blockB = segmentFromHash(seed, 2, 4);
  const last4 = segmentFromHash(seed, 3, 4).slice(0, 4);
  const memberId = `VRI-${blockA}-${blockB}`;
  const activationCode = `${blockA}${blockB}`.toUpperCase();

  const issueYear = 26 + (seed % 3);
  const issueMonth = 1 + (seed % 12);

  return {
    memberId,
    cardLast4: last4,
    cardDisplay: `•••• •••• •••• ${last4}`,
    activationCode,
    validThru: `${String(issueMonth).padStart(2, "0")}/${issueYear}`,
    holderLabel: (holderName || "Researcher").trim().slice(0, 24),
  };
}

export function verifyVriActivationCode(
  userId: string,
  code: string
): boolean {
  const normalized = code.trim().replace(/\s+/g, "").toUpperCase();
  if (!normalized) return false;
  const expected = getVriIdCredentials(userId).activationCode;
  return normalized === expected;
}
