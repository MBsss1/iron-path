export function getAvatar(level: number) {
  if (level >= 20) return "/avatars/iron-legend.png";
  if (level >= 15) return "/avatars/strongman.png";
  if (level >= 10) return "/avatars/street-athlete.png";
  if (level >= 5) return "/avatars/disciplined.png";

  return "/avatars/rookie.png";
}