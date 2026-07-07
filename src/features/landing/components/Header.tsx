import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { ENABLE_SOCIAL_HUB } from "@/features/social/socialFeature";

const publicNavLinks = [
  { label: "Trending Topics", to: ROUTES.TRENDING_TOPIC },
  { label: "Trending Keywords", to: ROUTES.TRENDING_KEYWORD },
  { label: "Guide", to: ROUTES.GUIDE },
] as const;

const workspaceLinks = [
  { label: "Feed", to: ROUTES.FEED },
  { label: "Bookmarks", to: ROUTES.BOOKMARKS },
  { label: "Report", to: ROUTES.REPORT },
  ...(ENABLE_SOCIAL_HUB ? [{ label: "Social Hub", to: ROUTES.SOCIAL_HUB }] : []),
] as const;

export function Header() {
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuthSession();

  const profilePath =
    currentUser?.role === AUTH_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.PROFILE;
  const displayName = currentUser?.fullName ?? "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="Owlreka logo"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="font-brand text-3xl font-normal">Owlreka</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex xl:gap-6">
          <Link
            to={ROUTES.SEARCH}
            className="rounded-full bg-slate-50 px-4 py-2 whitespace-nowrap text-black transition hover:text-emerald-700"
          >
            Discovery
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsExploreMenuOpen((isOpen) => !isOpen);
                setIsWorkspaceMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
            >
              Explore
              <ChevronDown
                className={`h-4 w-4 transition ${
                  isExploreMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExploreMenuOpen ? (
              <div className="absolute left-0 top-12 z-30 w-64 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                {publicNavLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsExploreMenuOpen(false)}
                    className="mb-1.5 flex items-center border-b border-black px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsWorkspaceMenuOpen((isOpen) => !isOpen);
                setIsExploreMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
            >
              Workspace
              <ChevronDown
                className={`h-4 w-4 transition ${
                  isWorkspaceMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isWorkspaceMenuOpen ? (
              <div className="absolute left-0 top-12 z-30 w-60 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                {workspaceLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={isAuthenticated ? link.to : ROUTES.LOGIN}
                    onClick={() => setIsWorkspaceMenuOpen(false)}
                    className="mb-1.5 flex items-center border-b border-black px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        {isAuthenticated ? (
          <Link
            to={profilePath}
            aria-label="Open user profile"
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-base font-bold text-white ring-2 ring-emerald-100">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || "U"
              )}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold text-slate-900">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {currentUser?.email ?? "Signed in account"}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="rounded-lg bg-[#14532D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#166534]"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
