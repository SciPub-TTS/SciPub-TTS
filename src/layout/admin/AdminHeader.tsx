import { useTranslation } from "react-i18next";

import { ROUTES } from "@/app/router";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import BreadcrumbBar from "../components/BreadcrumbBar";
import LanguageSwitcher from "../components/LanguageSwitcher";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminHeader() {
  const { t } = useTranslation();
  const { currentUser: user } = useAuthSession();
  const displayName = user?.fullName ?? t("admin.admin");
  const initials = getInitials(displayName) || "AD";

  return (
    <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-300 bg-white/95 px-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-950">
            {t("admin.controlPanel")}
          </h1>
          
          <div className="mt-4 max-w-2xl">
            <BreadcrumbBar homePath={ROUTES.ADMIN_DASHBOARD} />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <LanguageSwitcher />

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
