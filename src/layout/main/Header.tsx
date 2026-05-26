import BreadcrumbBar from "../components/BreadcrumbBar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MainHeaderAccount from "./HeaderAccount";

export default function MainHeader() {
  return (
    <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-6 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <BreadcrumbBar />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <MainHeaderAccount />
        </div>
      </div>
    </header>
  );
}
