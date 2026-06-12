"use client";

import { useEffect, useState } from "react";
import {
  getTelegramWebApp,
  type TelegramWebAppInitUser,
} from "../utils/telegram";

const FALLBACK_DISPLAY_NAME = "Путник";

export type TelegramUser = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  languageCode?: string;
  displayName: string;
  isTelegramUser: boolean;
};

function trimValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function getTelegramDisplayName(
  user: TelegramWebAppInitUser | null | undefined
): string {
  const firstName = trimValue(user?.first_name);
  const lastName = trimValue(user?.last_name);

  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  if (firstName) {
    return firstName;
  }

  const username = trimValue(user?.username);
  if (username) {
    return username.startsWith("@") ? username : `@${username}`;
  }

  return FALLBACK_DISPLAY_NAME;
}

function mapTelegramUser(raw: TelegramWebAppInitUser): TelegramUser {
  return {
    id: raw.id,
    username: trimValue(raw.username),
    firstName: trimValue(raw.first_name),
    lastName: trimValue(raw.last_name),
    photoUrl: trimValue(raw.photo_url),
    languageCode: trimValue(raw.language_code),
    displayName: getTelegramDisplayName(raw),
    isTelegramUser: true,
  };
}

const EMPTY_TELEGRAM_USER: TelegramUser = {
  displayName: FALLBACK_DISPLAY_NAME,
  isTelegramUser: false,
};

function readTelegramUser(): TelegramUser {
  if (typeof window === "undefined") {
    return EMPTY_TELEGRAM_USER;
  }

  try {
    const raw = getTelegramWebApp()?.initDataUnsafe?.user;

    if (!raw?.id) {
      return EMPTY_TELEGRAM_USER;
    }

    return mapTelegramUser(raw);
  } catch {
    return EMPTY_TELEGRAM_USER;
  }
}

export function useTelegramUser(): TelegramUser {
  const [user, setUser] = useState<TelegramUser>(EMPTY_TELEGRAM_USER);

  useEffect(() => {
    setUser(readTelegramUser());
  }, []);

  return user;
}
