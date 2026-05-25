import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import {
  clearAuthStorage,
  getCurrentUser,
} from "@/features/auth/utils/authStorage";
import BreadcrumbBar from "../components/BreadcrumbBar";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AdminHeader() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    clearAuthStorage();
    navigate(ROUTES.LOGIN);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <BreadcrumbBar variant="dark" />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="hidden text-right text-sm md:block">
            <p className="font-medium text-white">
              {user?.fullName ?? "Admin"}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email ?? "Admin Console"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
