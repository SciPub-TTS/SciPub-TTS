import { useSyncExternalStore } from "react";

import {
  getAccessToken,
  getAccessTokenExpiresAt,
  getAuthSessionRestoring,
  getCurrentUser,
  isAuthenticated,
  subscribeAuthState,
} from "@/features/auth/utils/authStorage";

function getSnapshot() {
  const currentUser = getCurrentUser();

  return JSON.stringify({
    accessToken: getAccessToken(),
    accessTokenExpiresAt: getAccessTokenExpiresAt(),
    currentUser,
    isAuthSessionRestoring: getAuthSessionRestoring(),
    isAuthenticated: isAuthenticated(),
  });
}

export function useAuthSession() {
  const snapshot = useSyncExternalStore(
    subscribeAuthState,
    getSnapshot,
    getSnapshot,
  );

  return JSON.parse(snapshot) as {
    accessToken: string | null;
    accessTokenExpiresAt: number | null;
    currentUser: ReturnType<typeof getCurrentUser>;
    isAuthSessionRestoring: boolean;
    isAuthenticated: boolean;
  };
}
