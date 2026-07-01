import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
} from "@/features/auth/utils/authStorage";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import type { ApiResponse } from "@/types/common.types.ts";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const publicHttp = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

function shouldSkipRefresh(url?: string) {
  if (!url) return true;

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/forgot-password")
  );
}

http.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function wait(ms: number) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function isRetriableRefreshError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
}

function isTerminalRefreshError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return status === 400 || status === 401 || status === 403;
}

async function requestRefreshedAccessToken() {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response =
        await refreshClient.post<ApiResponse<AuthResponse>>("/auth/refresh");
      const nextToken = response.data.data?.accessToken ?? null;

      if (nextToken) {
        setAccessToken(nextToken);
      }

      return nextToken;
    } catch (error) {
      lastError = error;

      if (!isRetriableRefreshError(error) || attempt === 1) {
        if (isTerminalRefreshError(error)) {
          clearAuthStorage();
        }

        throw error;
      }

      await wait(600);
    }
  }

  throw lastError;
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= requestRefreshedAccessToken()
      .finally(() => {
        refreshPromise = null;
      });

    const nextToken = await refreshPromise;

    if (!nextToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${nextToken}`;

    return http(originalRequest);
  },
);

//User gọi API
//     ↓
// Request interceptor lấy access token
//     ↓
// Gắn Authorization: Bearer accessToken
//     ↓
// Gửi request đến backend
//     ↓
// Nếu response OK
//     ↓
// Trả data về UI
//
// Nếu response 401
//     ↓
// Kiểm tra có được refresh không
//     ↓
// Gọi /auth/refresh bằng refreshClient
//     ↓
// Backend kiểm tra refresh token trong cookie
//     ↓
// Trả access token mới
//     ↓
// Lưu access token mới
//     ↓
// Gắn token mới vào request cũ
//     ↓
// Retry request cũ
//     ↓
// Trả data về UI
