import type { TeamMember } from "@/app/ire/data";
import type { Member } from "@/components/ui/member-selector";

function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function teamToMembers(team: TeamMember[]): Member[] {
  return team.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.role,
    avatar: avatarUrl(t.name),
    online: t.online,
  }));
}

export function defaultSelectedTeamIds(team: TeamMember[]): string[] {
  const online = team.filter((t) => t.online).map((t) => t.id);
  return online.length > 0 ? online : team.slice(0, 3).map((t) => t.id);
}
