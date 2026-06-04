import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export function hasIntroSeen(): boolean {
  return safeGet<boolean>(STORAGE_KEYS.introSeen, false) === true;
}

export function markIntroSeen(): void {
  safeSet(STORAGE_KEYS.introSeen, true);
}
