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
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import {
  clearAuthStorage,
  getCurrentUser,
} from "@/features/auth/utils/authStorage";

const workspaceMenuItems = [
  { label: "Trending Topic", path: ROUTES.TRENDING_TOPIC, icon: LayoutDashboard },
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const loggedIn = Boolean(currentUser);
  const displayName = currentUser?.fullName ?? "Guest";
  const displayEmail = currentUser?.email ?? "Sign in to manage your profile";
  const initials = getInitials(displayName) || "G";

  function handleLogout() {
    clearAuthStorage();
    navigate(ROUTES.LOGIN);
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex h-screen w-56 flex-col bg-[#000000] text-slate-200">
      <Link
        to={ROUTES.HOME}
        className="flex min-h-[76px] items-center gap-3 border-b-2 border-[#3c8534] px-4"
      >
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
          <img
            src={logoImage}
            alt="Owlreka logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-brand truncate text-xl font-normal text-white">
            Owlreka
          </h1>
        </div>
      </Link>

      <div className="flex-1 px-2.5 py-5">
        <p className="mb-2 px-2 text-[14px] font-bold uppercase tracking-wider text-white">
          Workspace
        </p>

        <nav className="space-y-1">
          {workspaceMenuItems.map((item) => {
            const Icon = item.icon;
            const isSearchSectionActive =
              item.path === ROUTES.SEARCH &&
              (location.pathname === ROUTES.SEARCH ||
                location.pathname.startsWith("/papers/"));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                    isActive || isSearchSectionActive
                      ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300/40"
                      : "text-slate-300 ",
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

      <div className="border-t-2 border-[#3c8534] px-2.5 py-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-400">
              {displayEmail}
            </p>
          </div>
        </div>

        <p className="mb-2 px-2 text-[14px] font-bold uppercase tracking-wider text-white">
          Account
        </p>

        <nav className="space-y-1">
          {accountMenuItems.map((item) => {
            const Icon = item.icon;
            const targetPath = loggedIn ? item.path : ROUTES.LOGIN;

            return (
              <NavLink
                key={item.path}
                to={targetPath}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                    loggedIn && isActive
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

          {loggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-100"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="truncate">Log out</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
