export const AUTH_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export const AUTHENTICATED_ROLES = [AUTH_ROLES.USER, AUTH_ROLES.ADMIN] as const;
