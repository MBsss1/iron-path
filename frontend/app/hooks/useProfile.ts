"use client";

import { useEffect, useState } from "react";
import { safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { migrateProfile, saveVersionedProfile } from "../utils/migrations";

import type { ClassId } from "../data/classes";

export type Profile = {
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
  watchType: string;
  avatarId?: string;
  classId?: ClassId;
  classChangedAt?: string | null;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const migrated = migrateProfile();
    if (migrated) setProfile(migrated);
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
    saveProfile,
    clearProfile,
  };
}