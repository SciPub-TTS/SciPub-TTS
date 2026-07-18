import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  clearAuthStorage,
  getAccessToken,
  getAccessTokenExpiresAt,
  setAccessTokenExpiry,
  setAccessToken
} from "@/features/auth/utils/authStorage";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import type { ApiResponse } from "@/types/common.types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Axios dùng cho các API cần đăng nhập
export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Axios chỉ dùng để gọi /auth/refresh
// Không dùng http để tránh vòng lặp interceptor
const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Axios cho các API public (login, register,...)
export const publicHttp = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

function getUsableAccessToken() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  const expiresAt = getAccessTokenExpiresAt();

  if (expiresAt !== null && expiresAt <= Date.now()) {
    return null;
  }

  return accessToken;
}

function shouldSkipRefresh(url?: string) {
  if (!url) return true;

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/forgot-password")
  );
}

// ================= REQUEST INTERCEPTOR =================

// Trước mỗi request, tự động gắn access token vào header
http.interceptors.request.use((config) => {
  const accessToken = getUsableAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

publicHttp.interceptors.request.use((config) => {
  const accessToken = getUsableAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

type RefreshedAccessSession = {
  accessToken: string | null;
  expiresInSeconds?: number;
};

// Lưu promise refresh hiện tại để nhiều request 401
// chỉ gọi /auth/refresh đúng một lần
let refreshPromise: Promise<RefreshedAccessSession> | null = null;

// Kiểm tra lỗi có nên thử refresh lại không
// Retry khi:
// - Mất mạng
// - Lỗi server (5xx)
function isRetriableRefreshError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  // Không có response => lỗi mạng
  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
}

// Gọi API refresh để lấy access token mới
async function requestRefreshedAccessToken() {
  let lastError: unknown = null;

  // Thử tối đa 2 lần
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response =
        await refreshClient.post<ApiResponse<AuthResponse>>("/auth/refresh");

      const nextToken = response.data.data?.accessToken ?? null;
      const expiresInSeconds = response.data.data?.expiresInSeconds;

      // Nếu refresh thành công thì lưu token mới
      if (nextToken) {
        setAccessToken(nextToken);
        setAccessTokenExpiry(expiresInSeconds);
      }

      return {
        accessToken: nextToken,
        expiresInSeconds,
      };
    } catch (error) {
      lastError = error;

      // Nếu không nên retry hoặc đã retry đủ 2 lần
      if (!isRetriableRefreshError(error) || attempt === 1) {
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;

        // Refresh token hết hạn => logout
        if (status === 400 || status === 401 || status === 403) {
          clearAuthStorage();
        }

        throw error;
      }

      // Đợi 600ms rồi thử refresh lại
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError;
}

// ================= RESPONSE INTERCEPTOR =================

http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Không phải lỗi 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Không có request gốc
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Request đã retry rồi
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Không refresh cho login, register,...
    if (shouldSkipRefresh(originalRequest.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Nếu chưa có request refresh nào thì tạo mới
    if (!refreshPromise) {
      refreshPromise = requestRefreshedAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    // Chờ refresh hoàn thành
    const refreshedSession = await refreshPromise;
    const nextToken = refreshedSession.accessToken;

    if (!nextToken) {
      return Promise.reject(error);
    }

    // Gắn access token mới vào request cũ
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${nextToken}`;

    // Gửi lại request ban đầu
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
