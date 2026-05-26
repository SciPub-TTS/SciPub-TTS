import { useTranslation } from "react-i18next";

import { LANGUAGE_STORAGE_KEY, LANGUAGES, type Language } from "@/app/i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  function handleChangeLanguage(language: Language) {
    void i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.VI)}
        className={[
          "rounded px-2 py-1 transition",
          currentLanguage === LANGUAGES.VI
            ? "bg-emerald-50 font-semibold text-emerald-600"
            : "text-slate-500 hover:bg-slate-100",
        ].join(" ")}
      >
        VI
      </button>

      <span className="text-slate-300">|</span>

      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.EN)}
        className={[
          "rounded px-2 py-1 transition",
          currentLanguage === LANGUAGES.EN
            ? "bg-emerald-50 font-semibold text-emerald-600"
            : "text-slate-500 hover:bg-slate-100",
        ].join(" ")}
      >
        EN
      </button>
    </div>
  );
}
