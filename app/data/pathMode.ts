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



/** Effective path mode for generator / Today (legacy classId fallback). */

export function getPathModeFromProfile(

  profile: Profile | null | undefined

): PathMode | null {

  if (!profile) return null;

  if (profile.pathMode) return profile.pathMode;

  return classIdToPathMode(profile.classId);

}



/** User explicitly chose a path mode in onboarding or profile. */

export function hasPathModeSelected(profile: Profile | null | undefined): boolean {

  return Boolean(profile?.pathMode);

}



const LEGACY_PATH_MODE_AT = "1970-01-01T00:00:00.000Z";

/** One-time: old profiles with classId but no pathMode get pathMode inferred. */
export function migrateLegacyPathMode(profile: Profile): Profile {
  if (profile.pathMode) {
    if (profile.pathModeChangedAt) return profile;

    const fromClass = classIdToPathMode(profile.classId);
    if (fromClass && profile.pathMode === fromClass) {
      return {
        ...profile,
        pathModeChangedAt: profile.classChangedAt ?? LEGACY_PATH_MODE_AT,
      };
    }

    const { pathMode: _pm, classId: _cid, pathModeChangedAt: _at, ...rest } = profile;
    return rest;
  }

  const fromClass = classIdToPathMode(profile.classId);
  if (!fromClass) return profile;

  return {
    ...profile,
    pathMode: fromClass,
    classId: profile.classId ?? pathModeToClassId(fromClass),
    pathModeChangedAt: profile.classChangedAt ?? LEGACY_PATH_MODE_AT,
  };
}



/** Sync classId from explicit pathMode (save / confirm only). */

export function applyPathModeToProfile(

  profile: Profile,

  pathMode: PathMode,

  pathModeChangedAt?: string | null

): Profile {

  return {

    ...profile,

    pathMode,

    classId: pathModeToClassId(pathMode),

    ...(pathModeChangedAt !== undefined ? { pathModeChangedAt } : {}),

  };

}



/** @deprecated Use applyPathModeToProfile when pathMode is set. */

export function normalizeProfilePath(profile: Profile): Profile {

  if (!profile.pathMode) return profile;

  return applyPathModeToProfile(profile, profile.pathMode, profile.pathModeChangedAt);

}


