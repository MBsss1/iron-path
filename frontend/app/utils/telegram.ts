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

export type TelegramBackButton = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
};

export type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  themeParams?: Record<string, string | undefined>;
  HapticFeedback?: TelegramHapticFeedback;
  BackButton?: TelegramBackButton;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const MAIN_TAB_SCREENS = ["hero", "today", "training", "nutrition", "more"] as const;

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

export function applyTelegramTheme(): void {
  if (typeof document === "undefined") return;

  try {
    const root = document.documentElement;
    const params = getTelegramThemeParams();

    if (!isTelegramWebApp() || Object.keys(params).length === 0) {
      root.classList.remove("telegram-webapp");
      return;
    }

    root.classList.add("telegram-webapp");

    for (const [key, value] of Object.entries(params)) {
      const cssKey = key.replace(/_/g, "-");
      root.style.setProperty(`--tg-theme-${cssKey}`, value);
    }

    if (params.bg_color) {
      root.style.setProperty("--tg-bg-color", params.bg_color);
      root.style.setProperty("--background", params.bg_color);
    }

    if (params.text_color) {
      root.style.setProperty("--tg-text-color", params.text_color);
      root.style.setProperty("--foreground", params.text_color);
    }

    if (params.secondary_bg_color) {
      root.style.setProperty("--tg-secondary-bg-color", params.secondary_bg_color);
    }

    if (params.hint_color) {
      root.style.setProperty("--tg-hint-color", params.hint_color);
    }

    if (params.button_color) {
      root.style.setProperty("--tg-button-color", params.button_color);
    }

    if (params.button_text_color) {
      root.style.setProperty("--tg-button-text-color", params.button_text_color);
    }
  } catch {
    // safe no-op
  }
}

export function subscribeTelegramThemeChange(
  handler: () => void = applyTelegramTheme
): () => void {
  try {
    const webApp = getTelegramWebApp();
    if (!webApp?.onEvent) return () => {};

    webApp.onEvent("themeChanged", handler);

    return () => {
      webApp.offEvent?.("themeChanged", handler);
    };
  } catch {
    return () => {};
  }
}

export function getTelegramBackButtonTarget(
  screen: string,
  moreSubScreens: readonly string[]
): "more" | "hero" | null {
  if (moreSubScreens.includes(screen)) {
    return "more";
  }

  if (MAIN_TAB_SCREENS.includes(screen as (typeof MAIN_TAB_SCREENS)[number])) {
    return screen === "hero" ? null : "hero";
  }

  return null;
}

export function shouldShowTelegramBackButton(
  screen: string,
  moreSubScreens: readonly string[],
  appReady: boolean
): boolean {
  if (!appReady) return false;
  return getTelegramBackButtonTarget(screen, moreSubScreens) !== null;
}

export function configureTelegramBackButton(options: {
  visible: boolean;
  onClick: () => void;
}): () => void {
  try {
    const backButton = getTelegramWebApp()?.BackButton;
    if (!backButton) return () => {};

    const { visible, onClick } = options;

    if (visible) {
      backButton.show();
      backButton.onClick(onClick);
    } else {
      backButton.hide();
      backButton.offClick(onClick);
    }

    return () => {
      backButton.offClick(onClick);
    };
  } catch {
    return () => {};
  }
}
