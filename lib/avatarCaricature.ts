/** Deterministic seed for illustrated caricature avatars. */
export function getCaricatureSeed(userId: string, avatarDataUrl?: string | null): string {
  if (avatarDataUrl) {
    let h = 0;
    const s = avatarDataUrl.slice(0, 120);
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return `${userId}-${Math.abs(h)}`;
  }
  return userId;
}

/** DiceBear illustrated portrait - unique caricature-like face per researcher. */
export function getCaricatureAvatarUrl(
  userId: string,
  avatarDataUrl?: string | null
): string {
  const seed = encodeURIComponent(getCaricatureSeed(userId, avatarDataUrl));
  return `https://api.dicebear.com/9.x/big-smile/png?seed=${seed}&size=256&backgroundColor=transparent`;
}
