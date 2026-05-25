import { Navigate, Outlet } from "react-router-dom";

import { getRedirectPathByRole, isAuthenticated } from "../utils/authGuard";

export default function GuestOnlyRoute() {
  if (isAuthenticated()) {
    return <Navigate to={getRedirectPathByRole()} replace />;
  }

  return <Outlet />;
}
