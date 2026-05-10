"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthShell, AuthField, AuthSubmit } from "@/components/auth/AuthShell";

export default function ForgotPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password."
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-ink-900 underline underline-offset-2 hover:text-beacon-700">
            Sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-[14px] leading-[1.6] text-ink-700">
            If an account with that email exists, we've sent a reset link. Check
            your inbox in a few minutes.
          </p>
          <p className="text-[12.5px] text-ink-500">
            For the demo, password reset is mocked. You can sign in with your
            existing password from this browser.
          </p>
        </div>
      ) : (
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
          <AuthSubmit>
            Send reset link <ArrowRight className="h-3.5 w-3.5" />
          </AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
}
