export type TelegramImpactStyle =
  | "light"
  | "medium"
  | "heavy"
  | "rigid"
  | "soft";

export type TelegramNotificationType = "error" | "success" | "warning";

export type TelegramThemeParams = Record<string, string>;

type TelegramHapticFeedback = {
  impactOccurred: (style: TelegramImpactStyle) => void;
  notificationOccurred: (type: TelegramNotificationType) => void;
  selectionChanged: () => void;
};

export type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  themeParams?: Record<string, string | undefined>;
  HapticFeedback?: TelegramHapticFeedback;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;

  const webApp = window.Telegram?.WebApp;
  return webApp ?? null;
}

export function isTelegramWebApp(): boolean {
  return getTelegramWebApp() !== null;
}

export function telegramReady(): void {
  try {
    getTelegramWebApp()?.ready();
  } catch {
    // safe no-op outside Telegram WebView
  }
}

export function telegramExpand(): void {
  try {
    getTelegramWebApp()?.expand();
  } catch {
    // safe no-op outside Telegram WebView
  }
}

export function telegramHapticImpact(style: TelegramImpactStyle = "medium"): void {
  try {
    const haptic = getTelegramWebApp()?.HapticFeedback;
    if (!haptic?.impactOccurred) return;
    haptic.impactOccurred(style);
  } catch {
    // safe no-op
  }
}

export function telegramHapticNotification(
  type: TelegramNotificationType = "success"
): void {
  try {
    const haptic = getTelegramWebApp()?.HapticFeedback;
    if (!haptic?.notificationOccurred) return;
    haptic.notificationOccurred(type);
  } catch {
    // safe no-op
  }
}

export function getTelegramThemeParams(): TelegramThemeParams {
  try {
    const params = getTelegramWebApp()?.themeParams;
    if (!params) return {};

    const theme: TelegramThemeParams = {};
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") {
        theme[key] = value;
      }
    }
    return theme;
  } catch {
    return {};
  }
}
