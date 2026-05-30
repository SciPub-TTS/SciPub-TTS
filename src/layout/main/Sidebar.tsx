import {
  Bookmark,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LogOut,
  Rss,
  Search,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import {
  clearAuthStorage,
  getCurrentUser,
} from "@/features/auth/utils/authStorage";

const workspaceMenuItems = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "New Feed", path: ROUTES.FEED, icon: Rss },
  { label: "Search Papers", path: ROUTES.SEARCH, icon: Search },
  { label: "Bookmarks", path: ROUTES.BOOKMARKS, icon: Bookmark },
  { label: "Export Reports", path: ROUTES.REPORT, icon: FileText },
  { label: "Help Guide", path: ROUTES.GUIDE, icon: CircleHelp },
];

const accountMenuItems = [
  { label: "User Profile", path: ROUTES.PROFILE, icon: User },
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

export default function MainSidebar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const displayName = currentUser?.fullName ?? "Nguyen Van A";
  const displayEmail = currentUser?.email ?? "nguyenvana@email.com";
  const initials = getInitials(displayName) || "NV";

  function handleLogout() {
    clearAuthStorage();
    navigate(ROUTES.LOGIN);
  }

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col bg-[#03120a] text-slate-400">
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
          <img
            src={logoImage}
            alt="Owlreka logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-white">Owlreka</h1>
        </div>
      </div>

      <div className="flex-1 px-2.5 py-5">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          Workspace
        </p>

        <nav className="space-y-1">
          {workspaceMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
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
        <div className="border-t border-white/5 px-2.5 py-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-white/[0.06] px-2.5 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {displayEmail}
              </p>
            </div>
          </div>

          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Account
          </p>

          <nav className="space-y-1">
            {accountMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="truncate">Log out</span>
            </button>
          </nav>
        </div>
      )}
    </aside>
  );
}
