import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

export default function AdminRestrictedRoute() {
  const { currentUser, isAuthenticated, isAuthSessionRestoring } = useAuthSession();

  if (isAuthSessionRestoring) {
    return null;
  }

  if (isAuthenticated && currentUser?.role === AUTH_ROLES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <Outlet />;
}
