import type { ClassId } from "./classes";
import type { Profile } from "../hooks/useProfile";

export type PathMode = "sport" | "self_development" | "balance";

export const PATH_MODES: PathMode[] = ["sport", "self_development", "balance"];

export function classIdToPathMode(classId: ClassId | string | undefined): PathMode | null {
  switch (classId) {
    case "warrior":
      return "sport";
    case "scholar":
    case "operator":
      return "self_development";
    case "monk":
      return "balance";
    default:
      return null;
  }
}

export function pathModeToClassId(pathMode: PathMode): ClassId {
  switch (pathMode) {
    case "sport":
      return "warrior";
    case "self_development":
      return "scholar";
    case "balance":
      return "monk";
  }
}

export function getPathModeFromProfile(
  profile: Profile | null | undefined
): PathMode | null {
  if (!profile) return null;
  if (profile.pathMode) return profile.pathMode;
  return classIdToPathMode(profile.classId);
}

export function normalizeProfilePath(profile: Profile): Profile {
  const pathMode = getPathModeFromProfile(profile) ?? "balance";
  const classId = profile.classId ?? pathModeToClassId(pathMode);
  return {
    ...profile,
    pathMode,
    classId,
  };
}

export function hasPathModeSelected(profile: Profile | null | undefined): boolean {
  return Boolean(profile?.pathMode || profile?.classId);
}
