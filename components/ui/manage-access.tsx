"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Link2,
  ChevronDown,
  X,
  Copy,
  Check,
  UserPlus,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Primitives";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export type Role = "owner" | "editor" | "viewer";
export type AccessLevel = "private" | "link";

export interface AccessUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

interface ManageAccessProps {
  users: AccessUser[];
  fileUrl: string;
  onInvite: (email: string, role: Role) => void;
  onRoleChange: (userId: string, newRole: Role) => void;
  onRemoveUser: (userId: string) => void;
  onAccessChange: (level: AccessLevel) => void;
  className?: string;
}

const ROLE_LABELS: Record<Exclude<Role, "owner">, string> = {
  editor: "Can edit",
  viewer: "Can view",
};

function RoleMenu({
  value,
  options,
  onChange,
  triggerClassName,
}: {
  value: Exclude<Role, "owner">;
  options: Array<Exclude<Role, "owner">>;
  onChange: (role: Exclude<Role, "owner">) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn("w-[120px] justify-between", triggerClassName)}
        onClick={() => setOpen((current) => !current)}
      >
        {ROLE_LABELS[value]}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[120px] overflow-hidden rounded-lg border border-ink-900/10 bg-white py-1 shadow-[0_8px_24px_rgba(17,17,16,0.12)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-[13px] text-ink-800 hover:bg-ink-900/[0.04]",
                value === option && "bg-beacon-50/80 text-beacon-800"
              )}
            >
              {ROLE_LABELS[option]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ManageAccess({
  users,
  fileUrl,
  onInvite,
  onRoleChange,
  onRemoveUser,
  onAccessChange,
  className,
}: ManageAccessProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<Role, "owner">>("viewer");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("private");
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInvite(inviteEmail.trim(), inviteRole);
    setInviteEmail("");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl overflow-hidden shadow-[0_12px_40px_rgba(17,17,16,0.08)]", className)}>
      <div className="border-b border-ink-900/8 px-6 py-5">
        <h2 className="font-display text-[18px] text-ink-900">Share &amp; access</h2>
        <p className="mt-1 text-[13px] text-ink-500">
          Invite collaborators or share a link to this workspace session.
        </p>
      </div>

      <div className="space-y-6 px-6 py-5">
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="Email, name..."
            className="flex-1"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleInvite();
            }}
          />
          <RoleMenu
            value={inviteRole}
            options={["viewer", "editor"]}
            onChange={setInviteRole}
          />
          <Button type="button" onClick={handleInvite} disabled={!inviteEmail.trim()}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink-500">
            General access
          </h3>
          <button
            type="button"
            className={cn(
              "flex w-full items-center rounded-xl border p-3 text-left transition-colors",
              accessLevel === "private"
                ? "border-beacon-500/40 bg-beacon-50/50"
                : "border-ink-900/10 hover:bg-ink-900/[0.02]"
            )}
            onClick={() => {
              setAccessLevel("private");
              onAccessChange("private");
            }}
          >
            <Users className="mr-4 h-8 w-8 shrink-0 text-ink-400" />
            <div>
              <p className="font-medium text-ink-900">Only those invited</p>
              <p className="text-[13px] text-ink-500">{users.length} people</p>
            </div>
          </button>
          <button
            type="button"
            className={cn(
              "flex w-full items-center rounded-xl border p-3 text-left transition-colors",
              accessLevel === "link"
                ? "border-beacon-500/40 bg-beacon-50/50"
                : "border-ink-900/10 hover:bg-ink-900/[0.02]"
            )}
            onClick={() => {
              setAccessLevel("link");
              onAccessChange("link");
            }}
          >
            <Link2 className="mr-4 h-8 w-8 shrink-0 text-ink-400" />
            <div>
              <p className="font-medium text-ink-900">Link access</p>
              <p className="text-[13px] text-ink-500">
                Anyone with the link can view
              </p>
            </div>
          </button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink-500">
            People with access
          </h3>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{user.name}</p>
                      <p className="truncate text-[13px] text-ink-500">{user.email}</p>
                    </div>
                  </div>

                  {user.role === "owner" ? (
                    <div className="flex shrink-0 items-center text-[13px] text-ink-500">
                      Owner
                      <Check className="ml-2 h-4 w-4 text-beacon-700" />
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2">
                      <AnimatePresence mode="wait" initial={false}>
                        {removingUserId === user.id ? (
                          <motion.div
                            key="remove"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                onRemoveUser(user.id);
                                setRemovingUserId(null);
                              }}
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setRemovingUserId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <RoleMenu
                              value={user.role}
                              options={["viewer", "editor"]}
                              onChange={(role) => onRoleChange(user.id, role)}
                              triggerClassName="w-[110px] text-ink-600"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setRemovingUserId(user.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-900/8 bg-ink-900/[0.02] px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link2 className="h-4 w-4 shrink-0 text-ink-400" />
          <p className="truncate text-[13px] text-ink-500">{fileUrl}</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleCopyLink}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
    </Card>
  );
}
