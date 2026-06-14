import { useSyncExternalStore } from "react";

import {
  getAccessToken,
  getCurrentUser,
  isAuthenticated,
  subscribeAuthState,
} from "@/features/auth/utils/authStorage";

function getSnapshot() {
  const currentUser = getCurrentUser();

  return JSON.stringify({
    accessToken: getAccessToken(),
    currentUser,
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
    currentUser: ReturnType<typeof getCurrentUser>;
    isAuthenticated: boolean;
  };
}
