import { LayoutDashboard, LogOut, Users } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import {
  clearAuthStorage,
  getCurrentUser,
} from "@/features/auth/utils/authStorage";

const adminMenuItems = [
  {
    label: "Admin Dashboard",
    path: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    path: ROUTES.ADMIN_USERS,
    icon: Users,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminSidebar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const displayName = currentUser?.fullName ?? "Admin";
  const initials = getInitials(displayName) || "AD";

  function handleLogout() {
    clearAuthStorage();
    navigate(ROUTES.LOGIN);
  }

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col bg-[#03120a] text-slate-200">
      <Link
        to={ROUTES.HOME}
        className="flex items-center gap-3 border-b border-emerald-400/20 px-4 py-5 transition hover:bg-emerald-500/10"
      >
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
          <img
            src={logoImage}
            alt="Owlreka logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-white">Owlreka</h1>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Admin Console
          </p>
        </div>
      </Link>

      <div className="flex-1 px-2.5 py-5">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Admin
        </p>

        <nav className="space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300/40"
                      : "text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-100",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {currentUser && (
        <div className="border-t border-emerald-400/20 px-2.5 py-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-100"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="truncate">Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
