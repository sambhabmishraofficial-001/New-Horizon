"use client";

import * as React from "react";
import { getJSON, setJSON, subscribe } from "./persist";
import { useSession } from "./auth";

export type Theme = "light" | "dark" | "sepia" | "system";
export type Density = "compact" | "comfortable";
export type FontSize = "sm" | "md" | "lg";
export type Autonomy = "suggest" | "semi-auto" | "full-auto";
export type Reasoning = "always" | "summary" | "hidden";
export type Cadence = "instant" | "digest" | "weekly" | "never";
export type CitationStyle =
  | "APA"
  | "MLA"
  | "Chicago"
  | "IEEE"
  | "Nature"
  | "Vancouver"
  | "BibTeX";
export type WritingTone = "concise" | "academic" | "narrative" | "journalistic";
export type KeyboardLayout = "default" | "vim";

export type UserPrefs = {
  general: {
    displayName: string;
    language: string;
    timezone: string;
    defaultLanding: "/atrium" | "/ire" | "/library";
  };
  appearance: {
    theme: Theme;
    fontSize: FontSize;
    density: Density;
    reduceMotion: boolean;
  };
  notifications: {
    emailCadence: Cadence;
    inApp: boolean;
    mentions: boolean;
    runCompletion: boolean;
    anomalies: boolean;
  };
  keyboard: {
    layout: KeyboardLayout;
    overrides: Record<string, string>;
  };
  agents: {
    defaultAutonomy: Autonomy;
    defaultReasoning: Reasoning;
    autoSpawn: string[];
    requireApproval: string[];
  };
  integrations: Record<string, boolean>;
  writing: {
    tone: WritingTone;
    citationStyle: CitationStyle;
  };
  labs: Record<string, boolean>;
};

export const DEFAULT_PREFS: UserPrefs = {
  general: {
    displayName: "",
    language: "en",
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC",
    defaultLanding: "/atrium",
  },
  appearance: {
    theme: "light",
    fontSize: "md",
    density: "comfortable",
    reduceMotion: false,
  },
  notifications: {
    emailCadence: "digest",
    inApp: true,
    mentions: true,
    runCompletion: true,
    anomalies: true,
  },
  keyboard: { layout: "default", overrides: {} },
  agents: {
    defaultAutonomy: "semi-auto",
    defaultReasoning: "summary",
    autoSpawn: ["orchestrator", "literature"],
    requireApproval: ["publish", "instrument-dispatch", "irreversible"],
  },
  integrations: {},
  writing: { tone: "academic", citationStyle: "APA" },
  labs: {},
};

function prefsKey(userId: string) {
  return `nh.prefs.${userId}`;
}

function deepMerge<T>(base: T, patch: Partial<T>): T {
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return (patch as T) ?? base;
  }
  const out: any = { ...base };
  for (const k in patch) {
    const v = (patch as any)[k];
    if (v !== undefined && v !== null && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge((base as any)[k] ?? {}, v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

export function useUserPrefs(): {
  prefs: UserPrefs;
  setPrefs: (patch: Partial<UserPrefs>) => void;
  ready: boolean;
} {
  const { user } = useSession();
  const userId = user?.id ?? null;
  const [prefs, setPrefsState] = React.useState<UserPrefs>(DEFAULT_PREFS);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!userId) {
      setPrefsState(DEFAULT_PREFS);
      setReady(true);
      return;
    }
    const key = prefsKey(userId);
    const stored = getJSON<UserPrefs>(key, DEFAULT_PREFS);
    setPrefsState(deepMerge(DEFAULT_PREFS, stored));
    setReady(true);
    const unsub = subscribe(key, () => {
      setPrefsState(deepMerge(DEFAULT_PREFS, getJSON<UserPrefs>(key, DEFAULT_PREFS)));
    });
    return unsub;
  }, [userId]);

  const setPrefs = React.useCallback(
    (patch: Partial<UserPrefs>) => {
      if (!userId) return;
      const next = deepMerge(prefs, patch);
      setJSON(prefsKey(userId), next);
      setPrefsState(next);
    },
    [prefs, userId]
  );

  return { prefs, setPrefs, ready };
}
