export const LANGUAGES = {
  VI: "vi",
  EN: "en",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const DEFAULT_LANGUAGE: Language = LANGUAGES.EN;

export const LANGUAGE_STORAGE_KEY = "app_language";
