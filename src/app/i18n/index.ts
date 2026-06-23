import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./resources/en";
import vi from "./resources/vi";

export const LANGUAGES = {
  VI: "vi",
  EN: "en",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const DEFAULT_LANGUAGE: Language = LANGUAGES.EN;

export const LANGUAGE_STORAGE_KEY = "app_language";

function getInitialLanguage(): Language {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (savedLanguage === LANGUAGES.VI || savedLanguage === LANGUAGES.EN) {
    return savedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

void i18n.use(initReactI18next).init({
  resources: {
    [LANGUAGES.EN]: {
      translation: en,
    },
    [LANGUAGES.VI]: {
      translation: vi,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
