// src/features/auth/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router";
import type { AuthRole } from "@/features/auth/constants/roles";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { getCurrentUser, isAuthenticated } from "@/features/auth/utils/authStorage";

type ProtectedRouteProps = {
    allowedRoles: AuthRole[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const currentUser = getCurrentUser();

    if (!isAuthenticated() || !currentUser) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(currentUser.role)) {
        const fallback =
            currentUser.role === AUTH_ROLES.ADMIN
                ? ROUTES.ADMIN_DASHBOARD
                : ROUTES.TRENDING_TOPIC;

        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
}
