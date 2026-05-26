import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router";
import {
  getRedirectPathByRole,
  hasAllowedRole,
  isAuthenticated,
} from "../utils/authGuard";

type ProtectedRouteProps = {
  allowedRoles?: ReadonlyArray<string>;
  redirectTo?: string;
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (!hasAllowedRole(allowedRoles)) {
    return <Navigate to={getRedirectPathByRole()} replace />;
  }

  return <Outlet />;
}
