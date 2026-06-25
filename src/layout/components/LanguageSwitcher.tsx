import { useTranslation } from "react-i18next";

import { LANGUAGE_STORAGE_KEY, LANGUAGES, type Language } from "@/app/i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language) as Language;

  function handleChangeLanguage(language: Language) {
    void i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  return (
    <div className="flex h-10 min-w-28 items-center justify-center gap-1 rounded-lg border border-black bg-white px-3 text-xs font-semibold shadow-sm">
      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.VI)}
        className={[
          "flex h-7 min-w-9 items-center justify-center rounded px-2 transition",
          currentLanguage === LANGUAGES.VI
            ? "bg-red-600 text-yellow-300 shadow-sm"
            : "text-slate-600 hover:bg-red-100 hover:text-red-600",
        ].join(" ")}
      >
        VI
      </button>

      <span className="text-gray-700 font-black"> | </span>

      <button
        type="button"
        onClick={() => handleChangeLanguage(LANGUAGES.EN)}
        className={[
          "flex h-7 min-w-9 items-center justify-center rounded px-2 transition",
          currentLanguage === LANGUAGES.EN
            ? "bg-blue-900 text-white shadow-sm"
            : "text-gray-600 hover:bg-blue-100 hover:text-blue-900",
        ].join(" ")}
      >
        EN
      </button>
    </div>
  );
}
