export type AvatarId =
  | "rookie"
  | "disciplined"
  | "street-athlete"
  | "strongman"
  | "iron-legend";

export const AVATAR_OPTIONS: {
  id: AvatarId;
  label: string;
  src: string;
  minLevel: number;
}[] = [
  { id: "rookie", label: "Rookie", src: "/avatars/rookie.png", minLevel: 1 },
  {
    id: "disciplined",
    label: "Disciplined",
    src: "/avatars/disciplined.png",
    minLevel: 5,
  },
  {
    id: "street-athlete",
    label: "Street Athlete",
    src: "/avatars/street-athlete.png",
    minLevel: 10,
  },
  {
    id: "strongman",
    label: "Strongman",
    src: "/avatars/strongman.png",
    minLevel: 15,
  },
  {
    id: "iron-legend",
    label: "Iron Legend",
    src: "/avatars/iron-legend.png",
    minLevel: 20,
  },
];

export function getAvatarByLevel(level: number) {
  if (level >= 20) return "/avatars/iron-legend.png";
  if (level >= 15) return "/avatars/strongman.png";
  if (level >= 10) return "/avatars/street-athlete.png";
  if (level >= 5) return "/avatars/disciplined.png";
  return "/avatars/rookie.png";
}

export function getAvatar(level: number, avatarId?: string) {
  if (avatarId) {
    const selected = AVATAR_OPTIONS.find((option) => option.id === avatarId);
    if (selected) return selected.src;
  }

  return getAvatarByLevel(level);
}

export function getDefaultAvatarId(level: number): AvatarId {
  if (level >= 20) return "iron-legend";
  if (level >= 15) return "strongman";
  if (level >= 10) return "street-athlete";
  if (level >= 5) return "disciplined";
  return "rookie";
}
