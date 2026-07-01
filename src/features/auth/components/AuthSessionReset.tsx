import { useEffect, useRef } from "react";
import axios from "axios";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { authApi } from "@/features/auth/services/auth.api";
import {
  getAccessToken,
  clearAuthStorage,
  getCurrentUser,
  hasLogoutMarker,
  setAuthSession,
  setAuthSessionRestoring,
  setCurrentUser,
} from "@/features/auth/utils/authStorage";

const CALLBACK_PATHS = new Set([
  "/oauth2/success",
  "/register/complete",
]);
const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60 * 1000;
const MIN_REFRESH_DELAY_MS = 5 * 1000;
const WAKE_RESTORE_THROTTLE_MS = 15 * 1000;

function shouldSkipBootstrap(pathname: string) {
  return CALLBACK_PATHS.has(pathname);
}

function isRetriableAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
}

function isTerminalAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return status === 400 || status === 401 || status === 403;
}

async function wait(ms: number) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function withTransientRetry<T>(task: () => Promise<T>) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (!isRetriableAuthError(error) || attempt === 1) {
        throw error;
      }

      await wait(600);
    }
  }

  throw lastError;
}

export async function restoreAuthSession() {
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

  setAuthSessionRestoring(true);

  try {
    const refreshResponse = await withTransientRetry(() => authApi.refresh());
    const authSession = refreshResponse.data;
    const nextToken = authSession?.accessToken;

    if (!nextToken) {
      clearAuthStorage();
      return;
    }

    setAuthSession(authSession);

    const meResponse = await withTransientRetry(() => authApi.me());
    setCurrentUser(meResponse.data);
  } catch (error) {
    if (isTerminalAuthError(error)) {
      clearAuthStorage();
      return;
    }
  } finally {
    setAuthSessionRestoring(false);
  }
}

export default function AuthSessionReset() {
  const { accessToken, accessTokenExpiresAt, currentUser } = useAuthSession();
  const hasBootstrappedRef = useRef(false);
  const restorePromiseRef = useRef<Promise<void> | null>(null);
  const refreshTimerIdRef = useRef<number | null>(null);
  const lastWakeRestoreAtRef = useRef(0);

  function clearRefreshTimer() {
    if (refreshTimerIdRef.current === null) {
      return;
    }

    window.clearTimeout(refreshTimerIdRef.current);
    refreshTimerIdRef.current = null;
  }

  function runRestore() {
    if (restorePromiseRef.current) {
      return restorePromiseRef.current;
    }

    const restorePromise = restoreAuthSession()
      .finally(() => {
        restorePromiseRef.current = null;
      });

    restorePromiseRef.current = restorePromise;
    return restorePromise;
  }

  function scheduleSilentRefresh() {
    clearRefreshTimer();

    if (!accessTokenExpiresAt) {
      return;
    }

    const delayMs = Math.max(
      MIN_REFRESH_DELAY_MS,
      accessTokenExpiresAt - Date.now() - ACCESS_TOKEN_REFRESH_BUFFER_MS,
    );

    refreshTimerIdRef.current = window.setTimeout(() => {
      void runRestore();
    }, delayMs);
  }

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    void runRestore();
  }, []);

  useEffect(() => {
    scheduleSilentRefresh();

    function handleWakeUpRestore() {
      if (!getCurrentUser() && !getAccessToken()) {
        return;
      }

      if (document.visibilityState === "hidden") {
        return;
      }

      const now = Date.now();

      if (now - lastWakeRestoreAtRef.current < WAKE_RESTORE_THROTTLE_MS) {
        return;
      }

      lastWakeRestoreAtRef.current = now;
      void runRestore();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        handleWakeUpRestore();
      }
    }

    window.addEventListener("focus", handleWakeUpRestore);
    window.addEventListener("online", handleWakeUpRestore);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearRefreshTimer();
      window.removeEventListener("focus", handleWakeUpRestore);
      window.removeEventListener("online", handleWakeUpRestore);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [accessToken, accessTokenExpiresAt, currentUser]);

  return null;
}
