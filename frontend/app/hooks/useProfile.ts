"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

export type Profile = {
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
  watchType: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const saved = safeGet<any>("iron-path-profile", null);

    if (!saved) return;

    // If saved already has a version, use its profile field
    if (typeof saved === "object" && (saved.version || saved.v)) {
      const p = saved.profile ?? saved.data ?? null;
      if (p) setProfile(p);
      return;
    }

    // Legacy format: raw Profile object. Migrate to versioned format.
    try {
      setProfile(saved as Profile);
      safeSet("iron-path-profile", { version: 1, profile: saved });
    } catch (e) {
      setProfile(saved as Profile);
    }
  }, []);

  const saveProfile = (profile: Profile) => {
    // Save using versioned format
    safeSet("iron-path-profile", { version: 1, profile });
    setProfile(profile);
  };

  const clearProfile = () => {
    // Clear stored profile (keep key absent / null)
    safeSet("iron-path-profile", null);
    setProfile(null);
  };

  return {
    profile,
    saveProfile,
    clearProfile,
  };
}