import en from "./en";
import ru from "./ru";

export type Locale = "en" | "ru";

export const LANGUAGE_STORAGE_KEY = "language";

export type Messages = typeof en;

export const dictionaries: Record<Locale, Messages> = {
  en,
  ru: ru as unknown as Messages,
};

export type TranslationParams = Record<string, string | number>;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

function applyParams(
  template: string,
  params?: TranslationParams
): string {
  if (!params) return template;

  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams
): string {
  const dictionary = dictionaries[locale] ?? dictionaries.en;
  const value = getNestedValue(
    dictionary as unknown as Record<string, unknown>,
    key
  );

  if (typeof value !== "string") {
    const fallback = getNestedValue(
      dictionaries.en as unknown as Record<string, unknown>,
      key
    );
    if (typeof fallback !== "string") {
      return key;
    }
    return applyParams(fallback, params);
  }

  return applyParams(value, params);
}

export function getLocaleLabel(locale: Locale): string {
  return locale === "ru"
    ? dictionaries.ru.lang.russian
    : dictionaries.en.lang.english;
}
