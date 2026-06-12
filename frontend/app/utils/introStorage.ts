import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export function hasIntroSeen(): boolean {
  try {
    return safeGet<boolean>(STORAGE_KEYS.introSeen, false) === true;
  } catch {
    return false;
  }
}

/** Persists intro completion; never throws. */
export function markIntroSeen(): void {
  try {
    safeSet(STORAGE_KEYS.introSeen, true);
  } catch {
    /* localStorage unavailable — intro still must not block the app */
  }
}
