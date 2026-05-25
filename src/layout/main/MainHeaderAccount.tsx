import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { getCurrentUser } from "@/features/auth/utils/authStorage";
import { clearAuthStorage } from "@/features/auth/utils/authStorage";
import { isAuthenticated } from "@/features/auth/utils/authGuard";

export default function MainHeaderAccount() {
  const user = getCurrentUser();
  const loggedIn = isAuthenticated();

  function handleLogout() {
    clearAuthStorage();
    window.location.href = ROUTES.LOGIN;
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.LOGIN}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Login
        </Link>

        <Link
          to={ROUTES.REGISTER}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
        {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
      </div>

      <div className="hidden text-sm md:block">
        <p className="font-medium text-slate-800">{user?.fullName ?? "User"}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        Logout
      </button>
    </div>
  );
}
