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
    <div className="flex h-10 min-w-28 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold shadow-sm">
      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.VI)}
        className={[
          "flex h-7 min-w-9 items-center justify-center rounded px-2 transition",
          currentLanguage === LANGUAGES.VI
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
        ].join(" ")}
      >
        VI
      </button>

      <span className="text-slate-300">|</span>

      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.EN)}
        className={[
          "flex h-7 min-w-9 items-center justify-center rounded px-2 transition",
          currentLanguage === LANGUAGES.EN
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
        ].join(" ")}
      >
        EN
      </button>
    </div>
  );
}
