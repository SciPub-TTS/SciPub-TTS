import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

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
  const { currentUser: user, isAuthenticated: loggedIn } = useAuthSession();
  const displayName = user?.fullName ?? "User";
  const initials = getInitials(displayName) || "U";

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.LOGIN}
          className="flex h-10 min-w-24 items-center justify-center rounded-lg border border-black bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-[#059669] hover:bg-emerald-100 hover:text-[#059669]"
        >
          Login
        </Link>

        <Link
          to={ROUTES.REGISTER}
          className="flex h-10 min-w-24 items-center justify-center rounded-lg border border-emerald-500 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-800 hover:bg-emerald-800"
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
