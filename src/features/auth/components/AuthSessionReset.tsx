import { useEffect, useRef } from "react";
import axios from "axios";

import { authApi } from "@/features/auth/services/auth.api";
import {
  clearAuthStorage,
  getCurrentUser,
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
    const refreshResponse = await withTransientRetry(() => authApi.refresh());
    const nextToken = refreshResponse.data?.accessToken;

    if (!nextToken) {
      clearAuthStorage();
      return;
    }

    setAccessToken(nextToken);

    const meResponse = await withTransientRetry(() => authApi.me());
    setCurrentUser(meResponse.data);
  } catch (error) {
    if (isTerminalAuthError(error)) {
      clearAuthStorage();
      return;
    }

    if (!getCurrentUser()) {
      clearAuthStorage();
    }
  }
}

export default function AuthSessionReset() {
  const hasBootstrappedRef = useRef(false);

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    void bootstrapAuthSessionOnAppLoad();
  }, []);

  return null;
}
