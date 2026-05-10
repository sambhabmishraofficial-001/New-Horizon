"use client";

import * as React from "react";
import { getJSON, setJSON, removeKey } from "./persist";
import type { DomainGroup } from "@/data/catalogue/domains";
import type { Autonomy, CitationStyle, WritingTone } from "./preferences";

const KEY = "nh.signup.draft";

export type SignupDraft = {
  account: {
    fullName: string;
    preferredName: string;
    email: string;
    password: string;
    orcid?: string;
  };
  identity: {
    role: string;
    careerStage: string;
    institution: string;
    lab: string;
    labUrl: string;
    timezone: string;
    bio: string;
    avatarDataUrl?: string;
  };
  domain: {
    primaryDomain: string;
    primaryDomainGroup: DomainGroup | "";
    secondaryDomains: string[];
    subfield: string;
    methods: string[];
  };
  workspace: {
    projectName: string;
    focus: string;
    templateId: string;
    invites: string;
    compute: "byo" | "cloud" | "local";
  };
  preferences: {
    writingTone: WritingTone;
    citationStyle: CitationStyle;
    autonomy: Autonomy;
    reasoning: "always" | "summary" | "hidden";
    emailCadence: "instant" | "digest" | "weekly" | "never";
  };
};

export const STEPS = [
  { id: "account", label: "Account", index: 0 },
  { id: "you", label: "You", index: 1 },
  { id: "domain", label: "Discipline", index: 2 },
  { id: "workspace", label: "Workspace", index: 3 },
  { id: "preferences", label: "Preferences", index: 4 },
  { id: "done", label: "Ready", index: 5 },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const EMPTY_DRAFT: SignupDraft = {
  account: { fullName: "", preferredName: "", email: "", password: "", orcid: "" },
  identity: {
    role: "",
    careerStage: "",
    institution: "",
    lab: "",
    labUrl: "",
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
    bio: "",
  },
  domain: {
    primaryDomain: "",
    primaryDomainGroup: "",
    secondaryDomains: [],
    subfield: "",
    methods: [],
  },
  workspace: { projectName: "", focus: "", templateId: "blank", invites: "", compute: "cloud" },
  preferences: {
    writingTone: "academic",
    citationStyle: "APA",
    autonomy: "semi-auto",
    reasoning: "summary",
    emailCadence: "digest",
  },
};

export function readDraft(): SignupDraft {
  return getJSON<SignupDraft>(KEY, EMPTY_DRAFT);
}

export function writeDraft(d: SignupDraft) {
  setJSON(KEY, d);
}

export function clearDraft() {
  removeKey(KEY);
}

export function useSignupDraft() {
  const [draft, setDraft] = React.useState<SignupDraft>(EMPTY_DRAFT);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setDraft(readDraft());
    setReady(true);
  }, []);

  const update = React.useCallback(
    (patch: Partial<SignupDraft>) => {
      setDraft((prev) => {
        const next = mergeDraft(prev, patch);
        writeDraft(next);
        return next;
      });
    },
    []
  );

  return { draft, ready, update, clear: clearDraft };
}

function mergeDraft(base: SignupDraft, patch: Partial<SignupDraft>): SignupDraft {
  const out: SignupDraft = { ...base };
  for (const k in patch) {
    const key = k as keyof SignupDraft;
    const v = (patch as any)[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      (out as any)[key] = { ...(base as any)[key], ...v };
    } else if (v !== undefined) {
      (out as any)[key] = v;
    }
  }
  return out;
}
