import BreadcrumbBar from "../components/BreadcrumbBar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MainHeaderAccount from "./MainHeaderAccount";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white px-6 py-3">
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
