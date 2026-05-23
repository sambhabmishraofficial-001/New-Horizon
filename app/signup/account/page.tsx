"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  WizardShell,
  FieldGroup,
  FieldInput,
  ErrorBanner,
} from "@/components/signup/WizardShell";
import { useSignupDraft } from "@/lib/store/signup";
import { signUp, getCurrentUser } from "@/lib/store/auth";

export default function SignupAccountStep() {
  const router = useRouter();
  const { draft, ready, update } = useSignupDraft();
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (ready && getCurrentUser()) {
      router.replace("/signup/you");
    }
  }, [ready, router]);

  const a = draft.account;
  const setField = (patch: Partial<typeof a>) => update({ account: { ...a, ...patch } });

  const valid =
    a.fullName.trim().length > 1 &&
    /.+@.+\..+/.test(a.email) &&
    a.password.length >= 6;

  async function onContinue() {
    setError("");
    if (!valid) {
      setError("Fill in name, a valid email, and a password of 6+ characters.");
      return;
    }
    setPending(true);
    const res = await signUp({
      email: a.email,
      password: a.password,
      preferredName: a.preferredName || a.fullName.split(" ")[0],
      fullName: a.fullName,
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/signup/you");
  }

  return (
    <WizardShell
      step="account"
      title="Create your account."
      description="A working email is enough. You can fill in the rest of your profile after the wizard, or now."
      onNext={onContinue}
      nextLabel={pending ? "Creating account…" : "Continue"}
      nextDisabled={pending}
      showSkip={false}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldGroup label="Full name" required>
          <FieldInput
            value={a.fullName}
            onChange={(v) => setField({ fullName: v })}
            autoComplete="name"
            placeholder="Ada Lovelace"
          />
        </FieldGroup>
        <FieldGroup label="Preferred name" hint="What we'll call you">
          <FieldInput
            value={a.preferredName}
            onChange={(v) => setField({ preferredName: v })}
            placeholder="Ada"
          />
        </FieldGroup>
        <FieldGroup label="Email" required>
          <FieldInput
            type="email"
            value={a.email}
            onChange={(v) => setField({ email: v })}
            autoComplete="email"
            placeholder="ada@example.edu"
          />
        </FieldGroup>
        <FieldGroup label="Password" required hint="At least 6 characters">
          <FieldInput
            type="password"
            value={a.password}
            onChange={(v) => setField({ password: v })}
            autoComplete="new-password"
          />
        </FieldGroup>
        <div className="sm:col-span-2">
          <FieldGroup label="ORCID" hint="Optional - used for identity verification later">
            <FieldInput
              value={a.orcid || ""}
              onChange={(v) => setField({ orcid: v })}
              placeholder="0000-0002-1825-0097"
            />
          </FieldGroup>
        </div>
      </div>

      {error && (
        <div className="mt-5">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      )}

      <div className="mt-6 text-[12px] leading-relaxed text-ink-500">
        By continuing you agree to the institute&rsquo;s acceptable-use policy. We do not share your data;
        all of this lives in your browser until a real backend is connected.
      </div>
    </WizardShell>
  );
}
