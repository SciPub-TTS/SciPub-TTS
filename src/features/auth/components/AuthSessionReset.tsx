import { authApi } from "@/features/auth/services/auth.api";
import {
  clearAuthStorage,
  hasLogoutMarker,
  setAccessToken,
  setCurrentUser,
} from "@/features/auth/utils/authStorage";

const CALLBACK_PATHS = new Set([
  "/oauth2/success",
  "/register/complete",
]);

function shouldSkipBootstrap(pathname: string) {
  return CALLBACK_PATHS.has(pathname);
}

export async function bootstrapAuthSessionOnAppLoad() {
  if (typeof window === "undefined") {
    return;
  }

  if (shouldSkipBootstrap(window.location.pathname)) {
    return;
  }

  if (hasLogoutMarker()) {
    clearAuthStorage();
    return;
  }

  try {
    const refreshResponse = await authApi.refresh();
    const nextToken = refreshResponse.data?.accessToken;

    if (!nextToken) {
      clearAuthStorage();
      return;
    }

    setAccessToken(nextToken);

    const meResponse = await authApi.me();
    setCurrentUser(meResponse.data);
  } catch {
    clearAuthStorage();
  }
}
