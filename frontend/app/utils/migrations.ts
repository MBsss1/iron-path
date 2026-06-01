import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";
import type { Profile } from "../hooks/useProfile";

const CURRENT_VERSION = 1;

type VersionedProfile = {
  version: number;
  profile: Profile;
};

export function migrateProfile(): Profile | null {
  const saved = safeGet<VersionedProfile | Profile | null>(
    STORAGE_KEYS.profile,
    null
  );

  if (!saved) return null;

  if (typeof saved === "object" && "version" in saved && saved.profile) {
    return saved.profile;
  }

  const legacy = saved as Profile;
  safeSet(STORAGE_KEYS.profile, { version: CURRENT_VERSION, profile: legacy });
  return legacy;
}

export function saveVersionedProfile(profile: Profile) {
  safeSet(STORAGE_KEYS.profile, { version: CURRENT_VERSION, profile });
}

export function migratePlayerData<T extends Record<string, unknown>>(
  fallback: T
): T {
  const saved = safeGet<Record<string, unknown> | null>(
    STORAGE_KEYS.player,
    null
  );

  if (!saved) return fallback;

  return { ...fallback, ...saved } as T;
}
