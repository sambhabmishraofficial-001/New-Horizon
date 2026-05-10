"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, BookOpen, GraduationCap, type LucideIcon } from "lucide-react";
import { useSignupDraft, clearDraft } from "@/lib/store/signup";
import { getCurrentUser } from "@/lib/store/auth";
import { ProgressDots } from "@/components/signup/WizardShell";
import { STEPS } from "@/lib/store/signup";

export default function SignupDoneStep() {
  const router = useRouter();
  const { draft } = useSignupDraft();

  React.useEffect(() => {
    if (!getCurrentUser()) router.replace("/signup/account");
  }, [router]);

  React.useEffect(() => {
    return () => {
      // do not clear on unmount; only clear on explicit nav-out via the CTAs
    };
  }, []);

  function leave(href: string) {
    clearDraft();
    router.push(href);
  }

  const name =
    draft.account.preferredName ||
    draft.account.fullName.split(" ")[0] ||
    "Researcher";
  const totalSubstantive = STEPS.filter((s) => s.id !== "done").length;

  return (
    <div className="min-h-screen bg-parchment-50 font-marketing not-italic text-ink-900">
      <div className="border-b border-ink-900/8 bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6 sm:px-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-ink-900">
            <span className="font-marketing text-[17px] font-light leading-none tracking-[0.12em]">
              [NH]
            </span>
            <span className="font-marketing text-[15px] font-medium leading-none">
              New Horizon
            </span>
          </Link>
          <ProgressDots index={totalSubstantive} total={totalSubstantive} />
          <span />
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-6 pb-24 pt-16 sm:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Ready
        </div>
        <h1 className="mt-3 font-editorial text-[38px] leading-[1.05] text-ink-900 sm:text-[44px]">
          Welcome to the institute, {name}.
        </h1>
        <p className="mt-4 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-600">
          Your account is set up. The first project is staged with the template you picked, the agents
          configured for your discipline, and a rules file seeded from your preferences. Pick where you
          want to start.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
          <ChoiceCard
            icon={GraduationCap}
            title="Take the tour"
            description="A guided walkthrough of every panel, icon, and shortcut in the IRE."
            onClick={() => leave("/ire?tour=1")}
            primary
          />
          <ChoiceCard
            icon={Compass}
            title="Open the IRE"
            description="Skip the tour and step into the workspace cold. The tour stays in the avatar menu."
            onClick={() => leave("/ire")}
          />
          <ChoiceCard
            icon={BookOpen}
            title="Browse templates"
            description="See the full catalogue of starters across every discipline before committing."
            onClick={() => leave("/templates")}
          />
        </div>

        <div className="mt-10 text-[12.5px] text-ink-500">
          Need to revise something? Your profile and defaults live in{" "}
          <Link href="/account" className="text-ink-900 underline underline-offset-2">
            Account
          </Link>{" "}
          and{" "}
          <Link href="/settings/general" className="text-ink-900 underline underline-offset-2">
            Settings
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  description,
  onClick,
  primary,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "group flex h-full flex-col items-start gap-2 rounded-xl border p-5 text-left transition-colors " +
        (primary
          ? "border-ink-900 bg-ink-900 text-parchment-50 hover:bg-ink-800"
          : "border-ink-900/10 bg-white hover:border-ink-900/30")
      }
    >
      <Icon
        className={
          "h-5 w-5 " + (primary ? "text-parchment-50" : "text-ink-700")
        }
        strokeWidth={1.5}
      />
      <div
        className={
          "mt-1 font-editorial text-[20px] leading-tight " +
          (primary ? "text-parchment-50" : "text-ink-900")
        }
      >
        {title}
      </div>
      <div
        className={
          "text-[13px] leading-relaxed " +
          (primary ? "text-parchment-50/85" : "text-ink-600")
        }
      >
        {description}
      </div>
      <div
        className={
          "mt-auto inline-flex items-center gap-1.5 pt-2 text-[12.5px] font-medium " +
          (primary ? "text-parchment-50" : "text-ink-700 group-hover:text-ink-900")
        }
      >
        Continue
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
