export type AnalyticsEvent =
  | "onboarding_completed"
  | "nutrition_test_completed"
  | "workout_started"
  | "workout_completed"
  | "day_completed"
  | "weight_updated";

type AnalyticsPayload = Record<string, unknown>;

const listeners = new Set<
  (event: AnalyticsEvent, payload?: AnalyticsPayload) => void
>();

export function subscribeAnalytics(
  listener: (event: AnalyticsEvent, payload?: AnalyticsPayload) => void
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function track(eventName: AnalyticsEvent, payload?: AnalyticsPayload): void {
  for (const listener of listeners) {
    try {
      listener(eventName, payload);
    } catch {
      // Analytics must never break gameplay flows.
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", eventName, payload ?? {});
  }
}
