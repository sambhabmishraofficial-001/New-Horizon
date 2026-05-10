"use client";

import * as React from "react";
import { getJSON, setJSON, removeKey, subscribe } from "./persist";

const SESSION_KEY = "nh.session";
const USERS_KEY = "nh.users";

export type DomainGroup =
  | "life"
  | "physical"
  | "math-cs"
  | "engineering"
  | "social"
  | "humanities"
  | "other";

export type UserProfile = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;

  preferredName?: string;
  fullName?: string;
  role?: string;
  careerStage?: string;
  affiliation?: string;
  lab?: string;
  labUrl?: string;
  orcid?: string;
  hIndex?: number;
  bio?: string;
  avatarDataUrl?: string;
  timezone?: string;

  primaryDomain?: string;
  primaryDomainGroup?: DomainGroup;
  secondaryDomains?: string[];
  subfield?: string;
  methods?: string[];
};

type UsersMap = Record<string, UserProfile>;

type Session = { userId: string } | null;

async function hashPassword(password: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return `mock:${password}`;
  }
  const enc = new TextEncoder().encode(password);
  const buf = await window.crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): UsersMap {
  return getJSON<UsersMap>(USERS_KEY, {});
}

function writeUsers(users: UsersMap) {
  setJSON(USERS_KEY, users);
}

function readSession(): Session {
  return getJSON<Session>(SESSION_KEY, null);
}

function writeSession(s: Session) {
  if (s) setJSON(SESSION_KEY, s);
  else removeKey(SESSION_KEY);
}

function newId(): string {
  return `u_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export type SignUpInput = {
  email: string;
  password: string;
  preferredName?: string;
  fullName?: string;
};

export async function signUp(
  input: SignUpInput
): Promise<{ ok: true; user: UserProfile } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!input.password || input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  const users = readUsers();
  if (Object.values(users).some((u) => u.email === email)) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const passwordHash = await hashPassword(input.password);
  const id = newId();
  const user: UserProfile = {
    id,
    email,
    passwordHash,
    createdAt: Date.now(),
    preferredName: input.preferredName?.trim() || email.split("@")[0],
    fullName: input.fullName?.trim() || input.preferredName?.trim() || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  users[id] = user;
  writeUsers(users);
  writeSession({ userId: id });
  return { ok: true, user };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ ok: true; user: UserProfile } | { ok: false; error: string }> {
  const lower = email.trim().toLowerCase();
  const users = readUsers();
  const user = Object.values(users).find((u) => u.email === lower);
  if (!user) return { ok: false, error: "No account with that email." };
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) return { ok: false, error: "Wrong password." };
  writeSession({ userId: user.id });
  return { ok: true, user };
}

export function signOut() {
  writeSession(null);
}

export function getCurrentUser(): UserProfile | null {
  const session = readSession();
  if (!session) return null;
  const users = readUsers();
  return users[session.userId] ?? null;
}

export function updateProfile(patch: Partial<UserProfile>): UserProfile | null {
  const session = readSession();
  if (!session) return null;
  const users = readUsers();
  const current = users[session.userId];
  if (!current) return null;
  const next = { ...current, ...patch, id: current.id, email: current.email, passwordHash: current.passwordHash };
  users[session.userId] = next;
  writeUsers(users);
  return next;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = readSession();
  if (!session) return { ok: false, error: "Not signed in." };
  if (newPassword.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const users = readUsers();
  const u = users[session.userId];
  if (!u) return { ok: false, error: "Account not found." };
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== u.passwordHash) return { ok: false, error: "Current password is wrong." };
  u.passwordHash = await hashPassword(newPassword);
  users[session.userId] = u;
  writeUsers(users);
  return { ok: true };
}

export function deleteAccount(): void {
  const session = readSession();
  if (!session) return;
  const users = readUsers();
  delete users[session.userId];
  writeUsers(users);
  writeSession(null);
}

export function useSession(): {
  user: UserProfile | null;
  loading: boolean;
} {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
    const u1 = subscribe(SESSION_KEY, () => setUser(getCurrentUser()));
    const u2 = subscribe(USERS_KEY, () => setUser(getCurrentUser()));
    return () => {
      u1();
      u2();
    };
  }, []);

  return { user, loading };
}
