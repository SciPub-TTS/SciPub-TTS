// import { AUTH_STORAGE_KEYS } from "../constants/storageKeys";
// import type { AuthUser } from "../types/auth.types";
//
// function canUseLocalStorage() {
//   return typeof window !== "undefined" && Boolean(window.localStorage);
// }
//
// export function getAccessToken() {
//   if (!canUseLocalStorage()) return null;
//
//   return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
// }
//
// export function getCurrentUser(): AuthUser | null {
//   if (!canUseLocalStorage()) return null;
//
//   const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
//
//   if (!rawUser) return null;
//
//   try {
//     return JSON.parse(rawUser) as AuthUser;
//   } catch {
//     localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
//     return null;
//   }
// }
//
// export function saveAuthToStorage(token: string, user: AuthUser) {
//   if (!canUseLocalStorage()) return;
//
//   localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
//   localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
// }
//
// export function clearAuthStorage() {
//   if (!canUseLocalStorage()) return;
//
//   localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
//   localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
// }


import { AUTH_ROLES, normalizeRole, type AuthRole } from "@/features/auth/constants/roles";
import type { AuthResponse, UserPrincipal } from "@/features/auth/types/auth.types";

const ACCESS_TOKEN_KEY = "owlreka.access_token";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "owlreka.access_token_expires_at";
const CURRENT_USER_KEY = "owlreka.current_user";
const PASSWORD_RECOVERY_EMAIL_KEY = "owlreka.password_recovery.email";
const PASSWORD_RECOVERY_GRANT_TOKEN_KEY = "owlreka.password_recovery.grant_token";
const LOGOUT_MARKER_KEY = "owlreka.logged_out";
const AUTH_STATE_EVENT = "owlreka-auth-state";
const DICEBEAR_ADVENTURER_BASE_URL = "https://api.dicebear.com/9.x/adventurer/svg";
let isAuthSessionRestoring = false;

function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function firstArrayValue(value: unknown): unknown {
  return Array.isArray(value) && value.length > 0 ? value[0] : undefined;
}

function normalizeAuthorities(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "authority" in item) {
          return String((item as { authority: unknown }).authority);
        }
        return "";
      })
      .filter(Boolean);
}

function buildDefaultAvatarUrl(userId: string | number | null | undefined) {
  if (userId === null || userId === undefined) return null;

  const seed = String(userId).trim();

  if (!seed) return null;

  return `${DICEBEAR_ADVENTURER_BASE_URL}?seed=${encodeURIComponent(seed)}`;
}

function resolveRole(source: Record<string, unknown>): AuthRole {
  const authorities = normalizeAuthorities(source.authorities);
  return (
      normalizeRole(source.role) ??
      normalizeRole(firstArrayValue(source.roles)) ??
      normalizeRole(firstArrayValue(authorities)) ??
      AUTH_ROLES.USER
  );
}

export function normalizeCurrentUser(input: unknown): UserPrincipal {
  const source = (input ?? {}) as Record<string, unknown>;
  const userId = (source.id ?? source.userId ?? "") as string | number;
  const firstName = typeof source.firstName === "string" ? source.firstName : "";
  const lastName = typeof source.lastName === "string" ? source.lastName : "";
  const fullName =
      (typeof source.fullName === "string" && source.fullName) ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      (typeof source.email === "string" ? source.email : "User");
  const avatarUrl =
    typeof source.avatarUrl === "string" && source.avatarUrl.trim()
      ? source.avatarUrl
      : buildDefaultAvatarUrl(userId);

  return {
    id: userId,
    email: typeof source.email === "string" ? source.email : "",
    firstName,
    lastName,
    fullName,
    avatarUrl,
    role: resolveRole(source),
    authorities: normalizeAuthorities(source.authorities),
    institution: typeof source.institution === "string" ? source.institution : "",
    department: typeof source.department === "string" ? source.department : "",
    country: typeof source.country === "string" ? source.country : "",
    googleLinked: typeof source.googleLinked === "boolean" ? source.googleLinked : false,
  };
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthStateChanged();
}

export function setAccessTokenExpiry(expiresInSeconds?: number) {
  if (!expiresInSeconds || expiresInSeconds <= 0) {
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
    notifyAuthStateChanged();
    return;
  }

  const expiresAt = Date.now() + (expiresInSeconds * 1000);
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  notifyAuthStateChanged();
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAccessTokenExpiresAt() {
  const rawValue = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);

  if (!rawValue) {
    return null;
  }

  const numericValue = Number(rawValue);

  return Number.isFinite(numericValue) ? numericValue : null;
}

export function setCurrentUser(user: unknown) {
  const normalized = normalizeCurrentUser(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
  notifyAuthStateChanged();
}

export function getCurrentUser(): UserPrincipal | null {
  return safeParse<UserPrincipal>(localStorage.getItem(CURRENT_USER_KEY));
}

export function setAuthSession(data: AuthResponse) {
  clearLogoutMarker();
  if (data.accessToken) setAccessToken(data.accessToken);
  setAccessTokenExpiry(data.expiresInSeconds);
  if (data.user) setCurrentUser(data.user);
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  isAuthSessionRestoring = false;
  notifyAuthStateChanged();
}

export function setAuthSessionRestoring(nextValue: boolean) {
  if (isAuthSessionRestoring === nextValue) {
    return;
  }

  isAuthSessionRestoring = nextValue;
  notifyAuthStateChanged();
}

export function getAuthSessionRestoring() {
  return isAuthSessionRestoring;
}

export function markLoggedOut() {
  localStorage.setItem(LOGOUT_MARKER_KEY, "1");
}

export function clearLogoutMarker() {
  localStorage.removeItem(LOGOUT_MARKER_KEY);
}

export function hasLogoutMarker() {
  return localStorage.getItem(LOGOUT_MARKER_KEY) === "1";
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getCurrentUser());
}

export function subscribeAuthState(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === ACCESS_TOKEN_KEY
      || event.key === CURRENT_USER_KEY
      || event.key === null
    ) {
      listener();
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setPasswordRecoveryEmail(email: string) {
  sessionStorage.setItem(PASSWORD_RECOVERY_EMAIL_KEY, email);
}

export function getPasswordRecoveryEmail() {
  return sessionStorage.getItem(PASSWORD_RECOVERY_EMAIL_KEY);
}

export function setPasswordRecoveryGrantToken(token: string) {
  sessionStorage.setItem(PASSWORD_RECOVERY_GRANT_TOKEN_KEY, token);
}

export function getPasswordRecoveryGrantToken() {
  return sessionStorage.getItem(PASSWORD_RECOVERY_GRANT_TOKEN_KEY);
}

export function clearPasswordRecoveryState() {
  sessionStorage.removeItem(PASSWORD_RECOVERY_EMAIL_KEY);
  sessionStorage.removeItem(PASSWORD_RECOVERY_GRANT_TOKEN_KEY);
}
