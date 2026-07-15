import { LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import { SafeActionDialog } from "@/layout/global/SafeActionDialog";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { submitLogout } from "@/features/auth/services/authFlows";

const adminMenuItems = [
  {
    label: "Dashboard",
    path: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    path: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    label: "System Settings",
    path: ROUTES.ADMIN_SYSTEM_SETTINGS,
    icon: Settings,
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
  const { currentUser } = useAuthSession();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = currentUser?.fullName ?? "Admin";
  const displayEmail = currentUser?.email ?? "Admin console access";
  const initials = getInitials(displayName) || "AD";

  async function handleConfirmLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await submitLogout();
    } finally {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-56 flex-col bg-[#000000] text-slate-200">
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
            <p className="font-subtext mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Admin Console
            </p>
          </div>
        </Link>

        <div className="flex-1 px-2.5 py-5">
          <p className="mb-3 px-2 text-[17px] font-extrabold tracking-wider text-white">
            WORKSPACE
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition",
                      isActive
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

        {currentUser && (
          <div className="border-t-2 border-[#3c8534] px-2.5 py-4">
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.08] px-2.5 py-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white">
                {currentUser.avatarUrl ? (
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

            <button
              type="button"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-100"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="truncate">Log out</span>
            </button>
          </div>
        )}
      </aside>

      <SafeActionDialog
        confirmLabel="Log out"
        description="You will be signed out from the admin console and returned to the login page."
        isPending={isLoggingOut}
        onClose={() => {
          if (!isLoggingOut) {
            setIsLogoutDialogOpen(false);
          }
        }}
        onConfirm={() => {
          void handleConfirmLogout();
        }}
        open={isLogoutDialogOpen}
        pendingLabel="Logging out..."
        title="Log out of the admin console?"
        variant="logout"
      />
    </>
  );
}
