"use client";

import * as React from "react";
import {
  SettingsHeader,
  SettingsSection,
  Row,
  TextInput,
  Button,
  Toggle,
} from "@/components/settings/SettingsKit";
import { changePassword } from "@/lib/store/auth";

type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

const SESSIONS: Session[] = [
  {
    id: "s1",
    device: "MacBook Pro · Chrome 122",
    location: "Cambridge, MA",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15 · Safari",
    location: "Cambridge, MA",
    lastActive: "12 minutes ago",
  },
  {
    id: "s3",
    device: "Linux · Firefox 124",
    location: "London, UK",
    lastActive: "3 days ago",
  },
];

type Token = { id: string; name: string; created: string; lastUsed: string };

const TOKENS: Token[] = [
  { id: "t1", name: "Local notebook", created: "Apr 14, 2026", lastUsed: "2 hours ago" },
  { id: "t2", name: "CI runner", created: "Mar 02, 2026", lastUsed: "Yesterday" },
];

export default function SecuritySettings() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [msg, setMsg] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [pending, setPending] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);

  async function onChangePassword() {
    setMsg(null);
    if (next !== confirm) {
      setMsg({ tone: "err", text: "New passwords don't match." });
      return;
    }
    setPending(true);
    const res = await changePassword(current, next);
    setPending(false);
    if (res.ok) {
      setMsg({ tone: "ok", text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      setMsg({ tone: "err", text: res.error });
    }
  }

  return (
    <div>
      <SettingsHeader
        title="Security"
        description="Password, multi-factor, sessions, and API tokens."
      />

      <SettingsSection title="Password">
        <Row label="Current password">
          <TextInput type="password" value={current} onChange={setCurrent} />
        </Row>
        <Row label="New password" description="At least 6 characters. We hash before persisting.">
          <TextInput type="password" value={next} onChange={setNext} />
        </Row>
        <Row label="Confirm new password">
          <TextInput type="password" value={confirm} onChange={setConfirm} />
        </Row>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="primary" onClick={onChangePassword} disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </Button>
          {msg && (
            <span
              className={
                "text-[12.5px] " +
                (msg.tone === "ok" ? "text-emerald-700" : "text-rose-700")
              }
            >
              {msg.text}
            </span>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Two-factor authentication">
        <Row
          label="Authenticator app"
          description="Time-based one-time codes via 1Password, Authy, or Google Authenticator."
        >
          <Toggle checked={twoFactor} onChange={setTwoFactor} />
        </Row>
        {twoFactor && (
          <div className="mt-3 rounded-xl border border-ink-900/10 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="grid h-32 w-32 shrink-0 place-items-center rounded-md border border-ink-900/15 bg-ink-50 font-mono text-[10px] text-ink-500">
                QR placeholder
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink-900">
                  Scan with your authenticator
                </div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                  Or paste the secret manually:
                </div>
                <div className="mt-2 inline-block rounded-md border border-ink-900/10 bg-ink-50 px-2 py-1 font-mono text-[11.5px] text-ink-700">
                  JBSW Y3DP EHPK 3PXP
                </div>
                <div className="mt-3">
                  <Button variant="outline" onClick={() => {}}>
                    Verify code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="Active sessions">
        <div className="rounded-xl border border-ink-900/10 bg-white">
          {SESSIONS.map((s, i) => (
            <div
              key={s.id}
              className={
                "flex items-center justify-between gap-4 px-4 py-3 " +
                (i < SESSIONS.length - 1 ? "border-b border-ink-900/6" : "")
              }
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink-900">
                  {s.device}
                  {s.current && (
                    <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-emerald-700">
                      this device
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-500">
                  {s.location} · {s.lastActive}
                </div>
              </div>
              {!s.current && (
                <Button variant="outline" onClick={() => {}}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button variant="danger" onClick={() => {}}>
            Sign out of all other sessions
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="API tokens">
        <div className="rounded-xl border border-ink-900/10 bg-white">
          {TOKENS.map((t, i) => (
            <div
              key={t.id}
              className={
                "flex items-center justify-between gap-4 px-4 py-3 " +
                (i < TOKENS.length - 1 ? "border-b border-ink-900/6" : "")
              }
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink-900">{t.name}</div>
                <div className="mt-0.5 text-[12px] text-ink-500">
                  Created {t.created} · last used {t.lastUsed}
                </div>
              </div>
              <Button variant="outline" onClick={() => {}}>
                Revoke
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button variant="primary" onClick={() => {}}>
            Generate new token
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
