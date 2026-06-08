"use client";

import { useEffect, useState } from "react";
import { safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { migrateProfile, saveVersionedProfile } from "../utils/migrations";

import type { ClassId } from "../data/classes";
import type { PathMode } from "../data/pathMode";

export type Profile = {
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
  avatarId?: string;
  /** Legacy; kept for XP bonuses. Synced from pathMode on save. */
  classId?: ClassId;
  classChangedAt?: string | null;
  pathMode?: PathMode;
  pathModeChangedAt?: string | null;
  nutritionLevel?: "undereating" | "basic" | "good" | "advanced";
  nutritionAssessmentCompletedAt?: string | null;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const migrated = migrateProfile();
    queueMicrotask(() => {
      if (migrated) {
        setProfile(migrated);
      }
      setLoaded(true);
    });
  }, []);

  const saveProfile = (profile: Profile) => {
    saveVersionedProfile(profile);
    setProfile(profile);
  };

  const clearProfile = () => {
    safeSet(STORAGE_KEYS.profile, null);
    setProfile(null);
  };

  return {
    profile,
    loaded,
    saveProfile,
    clearProfile,
  };
}
