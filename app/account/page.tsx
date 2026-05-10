"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, ShieldAlert, ExternalLink, Trash2 } from "lucide-react";
import { useSession, updateProfile, signOut, deleteAccount } from "@/lib/store/auth";
import type { UserProfile } from "@/lib/store/auth";
import { cn } from "@/lib/cn";

type Tab = "profile" | "activity" | "connections" | "danger";

export default function AccountPage() {
  const { user, loading } = useSession();
  const [tab, setTab] = React.useState<Tab>("profile");

  if (loading) {
    return <div className="min-h-[60vh] bg-parchment-50" />;
  }
  if (!user) {
    return null;
  }

  return (
    <div className="font-marketing not-italic text-ink-900 bg-parchment-50">
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:px-10">
        <Header user={user} />
        <Tabs tab={tab} setTab={setTab} />
        <div className="mt-8">
          {tab === "profile" && <ProfileTab user={user} />}
          {tab === "activity" && <ActivityTab />}
          {tab === "connections" && <ConnectionsTab />}
          {tab === "danger" && <DangerTab />}
        </div>
      </div>
    </div>
  );
}

function Header({ user }: { user: UserProfile }) {
  const initials = (user.preferredName || user.email)
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-5 border-b border-ink-900/8 pb-7">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-beacon-500 to-signal-violet text-white grid place-items-center text-[20px] font-semibold">
        {user.avatarDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarDataUrl} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
          Account
        </div>
        <h1 className="mt-1.5 font-editorial text-[36px] leading-[1.05] text-ink-900">
          {user.preferredName || user.fullName || user.email.split("@")[0]}
        </h1>
        <div className="mt-1 text-[13.5px] text-ink-500">
          {user.email}
          {user.affiliation && <span> · {user.affiliation}</span>}
        </div>
      </div>
    </div>
  );
}

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "activity", label: "Activity" },
    { id: "connections", label: "Connections" },
    { id: "danger", label: "Danger zone" },
  ];
  return (
    <div className="mt-6 flex items-center gap-1 border-b border-ink-900/8" role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={tab === it.id}
          onClick={() => setTab(it.id)}
          className={cn(
            "h-9 px-3 -mb-px text-[13px] border-b-2 transition-colors",
            tab === it.id
              ? "border-ink-900 text-ink-900"
              : "border-transparent text-ink-500 hover:text-ink-900"
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function ProfileTab({ user }: { user: UserProfile }) {
  const [draft, setDraft] = React.useState<UserProfile>(user);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => setDraft(user), [user]);

  function field<K extends keyof UserProfile>(k: K, v: UserProfile[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      field("avatarDataUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function onSave() {
    updateProfile({
      preferredName: draft.preferredName,
      fullName: draft.fullName,
      role: draft.role,
      careerStage: draft.careerStage,
      affiliation: draft.affiliation,
      lab: draft.lab,
      labUrl: draft.labUrl,
      orcid: draft.orcid,
      hIndex: draft.hIndex,
      bio: draft.bio,
      avatarDataUrl: draft.avatarDataUrl,
      timezone: draft.timezone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-xl border border-ink-900/10 bg-white p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            Avatar
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-beacon-500 to-signal-violet text-white grid place-items-center text-[16px] font-semibold overflow-hidden">
              {draft.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.avatarDataUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (draft.preferredName || draft.email)
                  .split(" ")
                  .map((s) => s[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              )}
            </div>
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-ink-900/12 bg-white px-3 text-[12.5px] hover:bg-ink-50">
              <Camera className="h-3.5 w-3.5" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-500">
            PNG or JPG, square works best. Stored locally in this browser.
          </p>
        </div>
      </aside>

      <div className="space-y-6">
        <Section title="Identity">
          <Grid>
            <FieldText
              label="Preferred name"
              value={draft.preferredName ?? ""}
              onChange={(v) => field("preferredName", v)}
            />
            <FieldText
              label="Full name"
              value={draft.fullName ?? ""}
              onChange={(v) => field("fullName", v)}
            />
            <FieldText
              label="Role"
              value={draft.role ?? ""}
              onChange={(v) => field("role", v)}
              placeholder="PI · Postdoc · Researcher · Engineer"
            />
            <FieldText
              label="Career stage"
              value={draft.careerStage ?? ""}
              onChange={(v) => field("careerStage", v)}
              placeholder="PhD · Postdoc · Junior PI"
            />
          </Grid>
        </Section>

        <Section title="Affiliation">
          <Grid>
            <FieldText
              label="Institution"
              value={draft.affiliation ?? ""}
              onChange={(v) => field("affiliation", v)}
            />
            <FieldText
              label="Lab / group"
              value={draft.lab ?? ""}
              onChange={(v) => field("lab", v)}
            />
            <FieldText
              label="Lab URL"
              value={draft.labUrl ?? ""}
              onChange={(v) => field("labUrl", v)}
              placeholder="https://"
            />
            <FieldText
              label="Timezone"
              value={draft.timezone ?? ""}
              onChange={(v) => field("timezone", v)}
            />
          </Grid>
        </Section>

        <Section title="Scholarly">
          <Grid>
            <FieldText
              label="ORCID"
              value={draft.orcid ?? ""}
              onChange={(v) => field("orcid", v)}
              placeholder="0000-0000-0000-0000"
            />
            <FieldText
              label="h-index"
              value={draft.hIndex != null ? String(draft.hIndex) : ""}
              onChange={(v) => field("hIndex", v ? Number(v) : undefined)}
              placeholder="—"
            />
          </Grid>
        </Section>

        <Section title="Bio">
          <textarea
            rows={5}
            value={draft.bio ?? ""}
            onChange={(e) => field("bio", e.target.value)}
            placeholder="A few sentences on what you work on and what you care about."
            className="w-full rounded-lg border border-ink-900/12 bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink-900 outline-none transition focus:border-ink-900"
          />
        </Section>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-[12.5px] text-emerald-700">Saved.</span>
          )}
          <button
            onClick={onSave}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink-900 px-4 text-[13.5px] font-medium text-parchment-50 hover:bg-ink-800"
          >
            <Save className="h-3.5 w-3.5" /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function FieldText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-ink-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-lg border border-ink-900/12 bg-white px-3 text-[14px] text-ink-900 outline-none transition focus:border-ink-900"
      />
    </label>
  );
}

function ActivityTab() {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-8 text-center">
      <div className="text-[13.5px] text-ink-500">
        Your recent activity (commits, runs, manuscript edits, agent threads)
        will show up here once you start working in the IRE.
      </div>
    </div>
  );
}

function ConnectionsTab() {
  const items = [
    { name: "Google", connected: false },
    { name: "GitHub", connected: false },
    { name: "ORCID", connected: false },
    { name: "Zotero", connected: false },
    { name: "Overleaf", connected: false },
    { name: "Hugging Face", connected: false },
  ];
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.name}
          className="flex items-center justify-between rounded-lg border border-ink-900/10 bg-white px-4 py-3"
        >
          <div>
            <div className="text-[13.5px] font-medium">{it.name}</div>
            <div className="text-[12px] text-ink-500">
              {it.connected ? "Connected" : "Not connected"}
            </div>
          </div>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-900/12 bg-white px-3 text-[12.5px] hover:bg-ink-50">
            {it.connected ? "Disconnect" : "Connect"}
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function DangerTab() {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState("");

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  function onDelete() {
    if (confirm !== "DELETE") return;
    deleteAccount();
    router.replace("/");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ink-900/10 bg-white p-5">
        <div className="text-[14px] font-medium">Sign out</div>
        <div className="mt-1 text-[12.5px] text-ink-500">
          You can sign back in any time with your email and password.
        </div>
        <button
          onClick={onSignOut}
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-ink-900/12 bg-white px-3 text-[13px] hover:bg-ink-50"
        >
          Sign out
        </button>
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
        <div className="inline-flex items-center gap-2 text-[14px] font-medium text-rose-800">
          <ShieldAlert className="h-4 w-4" /> Delete account
        </div>
        <div className="mt-1 text-[12.5px] text-rose-700">
          This wipes your account and every project from this browser.
          Type DELETE to confirm.
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE"
            className="h-9 w-48 rounded-md border border-rose-300 bg-white px-3 text-[13px] outline-none focus:border-rose-500"
          />
          <button
            onClick={onDelete}
            disabled={confirm !== "DELETE"}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-rose-700 px-3 text-[13px] font-medium text-white hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
