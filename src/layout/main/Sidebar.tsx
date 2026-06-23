import {
  Bookmark,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Rss,
  Search,
  User,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { submitLogout } from "@/features/auth/services/authFlows";
import { parseDetailOrigin } from "@/features/detail/detailTrail";

const workspaceMenuItems = [
  { label: "Discovery", path: ROUTES.SEARCH, icon: Search },
  { label: "Trending", path: ROUTES.TRENDING_TOPIC, icon: LayoutDashboard },
  { label: "Bookmarks", path: ROUTES.BOOKMARKS, icon: Bookmark },
  { label: "New Feed", path: ROUTES.FEED, icon: Rss },
  { label: "Social Hub", path: ROUTES.SOCIAL_HUB, icon: MessagesSquare },
  { label: "Report", path: ROUTES.REPORT, icon: FileText },
  { label: "Guide & Help", path: ROUTES.GUIDE, icon: CircleHelp },
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
  const { currentUser, isAuthenticated: loggedIn } = useAuthSession();
  const displayName = currentUser?.fullName ?? "Guest";
  const displayEmail = currentUser?.email ?? "Sign in to manage your profile";
  const initials = getInitials(displayName) || "G";
  const detailOrigin = parseDetailOrigin(location.search);
  const isDetailPage =
    location.pathname.startsWith("/papers/") ||
    location.pathname.startsWith("/authors/") ||
    location.pathname.startsWith("/topics/");

  async function handleLogout() {
    await submitLogout();
    navigate(ROUTES.LOGIN, { replace: true });
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
        <p className="mb-3 px-2 text-[17px] font-extrabold tracking-wider text-white">
          WORKSPACE
        </p>

        <nav className="space-y-1">
          {workspaceMenuItems.map((item) => {
            const Icon = item.icon;
            const isSearchSectionActive =
              item.path === ROUTES.SEARCH &&
              (location.pathname === ROUTES.SEARCH ||
                (isDetailPage && detailOrigin === "search"));
            const isBookmarksSectionActive =
              item.path === ROUTES.BOOKMARKS &&
              (location.pathname === ROUTES.BOOKMARKS ||
                (isDetailPage && detailOrigin === "bookmarks"));
            const isSocialHubSectionActive =
              item.path === ROUTES.SOCIAL_HUB &&
              (location.pathname === ROUTES.SOCIAL_HUB ||
                (isDetailPage && detailOrigin === "social-hub"));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition",
                    isActive ||
                    isSearchSectionActive ||
                    isBookmarksSectionActive ||
                    isSocialHubSectionActive
                      ? "bg-emerald-600 text-white"
                      : "text-white hover:bg-emerald-500/15 hover:text-emerald-300",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t-2 border-[#3c8534] px-2.5 py-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {displayEmail}
            </p>
          </div>
        </div>

        <p className="mb-3 px-2 text-[17px] font-extrabold tracking-wider text-white">
          ACCOUNT
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                    loggedIn && isActive
                      ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600"
                      : "text-white hover:bg-emerald-500/15 hover:text-emerald-300",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}

          {loggedIn && (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-100"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="truncate">Log out</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
