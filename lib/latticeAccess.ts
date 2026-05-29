export const LATTICE_ACCESS_PASSWORD = "1234567";
export const LATTICE_ACCESS_STORAGE_KEY = "lattice-access-unlocked";

export function isLatticeUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(LATTICE_ACCESS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockLattice(): void {
  try {
    sessionStorage.setItem(LATTICE_ACCESS_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function checkLatticePassword(password: string): boolean {
  return password.trim() === LATTICE_ACCESS_PASSWORD;
}
