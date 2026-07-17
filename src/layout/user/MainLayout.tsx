import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

import MainFooter from "../global/Footer";
import MainHeader from "../global/Header";
import MainSidebar from "./Sidebar";

export default function MainLayout() {
  const location = useLocation();
  const { currentUser } = useAuthSession();

  if (
    currentUser?.role === AUTH_ROLES.ADMIN &&
    location.pathname === ROUTES.TRENDING
  ) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MainSidebar />

      <div className="ml-56 flex min-h-screen flex-col">
        <MainHeader />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <MainFooter />
      </div>
    </div>
  );
}
