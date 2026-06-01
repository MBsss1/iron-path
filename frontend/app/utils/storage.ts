export function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`storage.safeGet failed for ${key}`, e);
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`storage.safeSet failed for ${key}`, e);
  }
}
