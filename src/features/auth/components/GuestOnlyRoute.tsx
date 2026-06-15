import { Navigate, Outlet } from "react-router-dom";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getRedirectPathByRole } from "../utils/authGuard";

export default function GuestOnlyRoute() {
  const { currentUser, isAuthenticated: loggedIn } = useAuthSession();

  if (!loggedIn) {
    return <Outlet />;
  }

  return (
      <Navigate
          to={getRedirectPathByRole(currentUser)}
          replace
      />
  );
}
