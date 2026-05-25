import { AUTH_STORAGE_KEYS } from "../constants/storageKeys";
import type { AuthUser } from "../types/auth.types";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAccessToken() {
  if (!canUseLocalStorage()) return null;

  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

export function getCurrentUser(): AuthUser | null {
  if (!canUseLocalStorage()) return null;

  const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    return null;
  }
}

export function saveAuthToStorage(token: string, user: AuthUser) {
  if (!canUseLocalStorage()) return;

  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearAuthStorage() {
  if (!canUseLocalStorage()) return;

  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
}
