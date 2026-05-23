"use client";

import * as React from "react";
import type { TeamMember } from "@/app/ire/data";
import {
  ManageAccess,
  type AccessLevel,
  type AccessUser,
  type Role,
} from "@/components/ui/manage-access";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

function memberEmail(member: TeamMember): string {
  const slug = member.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return `${slug || member.id}@vri.institute`;
}

function memberAccessRole(member: TeamMember, team: TeamMember[]): Role {
  if (member.role === "PI") {
    const firstPi = team.find((entry) => entry.role === "PI");
    return firstPi?.id === member.id ? "owner" : "editor";
  }
  if (member.role === "Collaborator") return "viewer";
  return "editor";
}

export function teamToAccessUsers(team: TeamMember[]): AccessUser[] {
  return team.map((member) => ({
    id: member.id,
    name: member.name,
    email: memberEmail(member),
    avatarUrl: avatarUrl(member.name),
    role: memberAccessRole(member, team),
  }));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function WorkspaceAccessDialog({
  open,
  onOpenChange,
  team,
  workspaceTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamMember[];
  workspaceTitle: string;
}) {
  const [users, setUsers] = React.useState<AccessUser[]>(() =>
    teamToAccessUsers(team)
  );

  React.useEffect(() => {
    setUsers(teamToAccessUsers(team));
  }, [team]);

  const fileUrl = `https://vri.institute/ire/session/${slugify(workspaceTitle) || "workspace"}`;

  const handleInvite = (email: string, role: Role) => {
    const name = email.split("@")[0]?.replace(/\./g, " ") || email;
    setUsers((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        avatarUrl: avatarUrl(email),
        role: role === "owner" ? "editor" : role,
      },
    ]);
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId && user.role !== "owner"
          ? { ...user, role: newRole }
          : user
      )
    );
  };

  const handleRemoveUser = (userId: string) => {
    setUsers((current) => current.filter((user) => user.id !== userId));
  };

  const handleAccessChange = (_level: AccessLevel) => {
    // Demo state only - workspace policy would sync here in production.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-ink-900/10 p-0 sm:rounded-2xl">
        <ManageAccess
          users={users}
          fileUrl={fileUrl}
          onInvite={handleInvite}
          onRoleChange={handleRoleChange}
          onRemoveUser={handleRemoveUser}
          onAccessChange={handleAccessChange}
          className="border-0 shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
}
