import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { getCurrentUser } from "@/features/auth/utils/authStorage";

import MainFooter from "./Footer";
import MainHeader from "./Header";
import MainSidebar from "./Sidebar";

export default function MainLayout() {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (
    currentUser?.role === AUTH_ROLES.ADMIN &&
    location.pathname === ROUTES.DASHBOARD
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
