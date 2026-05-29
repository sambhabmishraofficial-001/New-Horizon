"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  AuthShell,
  AuthField,
  AuthSubmit,
  AuthError,
  AuthDivider,
  OAuthButton,
} from "@/components/auth/AuthShell";
import {
  GitHubIcon,
  GoogleIcon,
  OrcidIcon,
} from "@/components/auth/OAuthProviderIcons";
import { signIn, signUp } from "@/lib/store/auth";

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-parchment-50" />}>
      <LoginPageInner />
    </React.Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/ire";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await signIn(email, password);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.replace(next);
  }

  async function mockOAuth(provider: string) {
    const fakeEmail = "contact@newhorizon.dev";
    const fakePassword = "oauth-mock-pw";
    setPending(true);
    setError("");
    let res = await signIn(fakeEmail, fakePassword);
    if (!res.ok) {
      const localName =
        fakeEmail.split("@")[0]?.replace(/[._+-]/g, " ") ?? "Researcher";
      const preferredName =
        localName.charAt(0).toUpperCase() + localName.slice(1).toLowerCase();
      res = await signUp({
        email: fakeEmail,
        password: fakePassword,
        preferredName,
        fullName: preferredName,
      });
    }
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.replace(next);
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-ink-900 underline underline-offset-2 hover:text-beacon-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between text-[12.5px]">
          <label className="inline-flex items-center gap-2 text-ink-600">
            <input type="checkbox" className="rounded border-ink-900/15" defaultChecked />
            Keep me signed in
          </label>
          <Link href="/forgot" className="text-ink-600 hover:text-ink-900">
            Forgot password?
          </Link>
        </div>
        <AuthError>{error}</AuthError>
        <AuthSubmit disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
          <ArrowRight className="h-3.5 w-3.5" />
        </AuthSubmit>
      </form>

      <AuthDivider>or</AuthDivider>

      <div className="space-y-2">
        <OAuthButton
          label="Continue with Google"
          onClick={() => mockOAuth("google")}
          icon={<GoogleIcon />}
        />
        <OAuthButton
          label="Continue with GitHub"
          onClick={() => mockOAuth("github")}
          icon={<GitHubIcon />}
        />
        <OAuthButton
          label="Continue with ORCID"
          onClick={() => mockOAuth("orcid")}
          icon={<OrcidIcon />}
        />
      </div>
    </AuthShell>
  );
}
