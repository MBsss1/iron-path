"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { safeGet, safeSet } from "../utils/storage";
import {
  LANGUAGE_STORAGE_KEY,
  translate,
  type Locale,
  type TranslationParams,
} from "./index";

export type LanguageContextValue = {
  locale: Locale;
  languageChosen: boolean;
  loaded: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru";
}

type Props = {
  children: ReactNode;
};

export default function LanguageProvider({ children }: Props) {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = safeGet<unknown>(LANGUAGE_STORAGE_KEY, null);
    const resolved = isLocale(stored) ? stored : null;

    queueMicrotask(() => {
      setLocaleState(resolved);
      setLoaded(true);
      if (resolved && typeof document !== "undefined") {
        document.documentElement.lang = resolved;
      }
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    safeSet(LANGUAGE_STORAGE_KEY, next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const activeLocale: Locale = locale ?? "en";

  const t = useCallback(
    (key: string, params?: TranslationParams) =>
      translate(activeLocale, key, params),
    [activeLocale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale: activeLocale,
      languageChosen: locale !== null,
      loaded,
      setLocale,
      t,
    }),
    [activeLocale, locale, loaded, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
