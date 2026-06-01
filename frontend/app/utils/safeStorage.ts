export function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("safeGet failed for", key, e);
    return fallback;
  }
}

export function safeSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("safeSet failed for", key, e);
  }
}
