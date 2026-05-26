import { ROUTES } from "@/app/router";
import { AUTH_ROLES } from "../constants/roles";
import type { AuthUser } from "../types/auth.types";
import { getAccessToken, getCurrentUser } from "./authStorage";

function normalizeRole(role?: string | null) {
  return role?.trim().toLowerCase() ?? "";
}

export function isAuthenticated() {
  const token = getAccessToken();
  const user = getCurrentUser();

  return Boolean(token && user);
}

export function getUserRole(user: AuthUser | null = getCurrentUser()) {
  return normalizeRole(user?.role);
}

export function hasAllowedRole(allowedRoles?: ReadonlyArray<string>) {
  if (!allowedRoles || allowedRoles.length === 0) return true;

  const currentRole = getUserRole();

  return allowedRoles.map(normalizeRole).includes(currentRole);
}

export function getRedirectPathByRole(
  user: AuthUser | null = getCurrentUser(),
) {
  const role = getUserRole(user);

  if (role === AUTH_ROLES.ADMIN) {
    return ROUTES.ADMIN_DASHBOARD;
  }

  return ROUTES.HOME;
}
