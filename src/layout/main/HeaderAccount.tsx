import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { getCurrentUser } from "@/features/auth/utils/authStorage";
import { isAuthenticated } from "@/features/auth/utils/authGuard";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function MainHeaderAccount() {
  const user = getCurrentUser();
  const loggedIn = isAuthenticated();
  const displayName = user?.fullName ?? "User";
  const initials = getInitials(displayName) || "U";

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.LOGIN}
          className="flex h-10 min-w-24 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700"
        >
          Login
        </Link>

        <Link
          to={ROUTES.REGISTER}
          className="flex h-10 min-w-24 items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-700 hover:bg-emerald-700"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <Link
      to={ROUTES.PROFILE}
      aria-label="Open user profile"
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white"
    >
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </Link>
  );
}
