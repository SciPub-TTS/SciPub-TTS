import axios from "axios";

import {
    clearAuthStorage,
    getAccessToken, setAccessToken
} from "@/features/auth/utils/authStorage";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import type {ApiResponse} from "@/types/common.types.ts";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const requestUrl = originalRequest?.url ?? "";

        const skipRefreshUrls = [
            "/auth/login",
            "/auth/register",
            "/auth/register/google/preview",
            "/auth/register/google/complete",
            "/auth/refresh",
            "/auth/forgot-password",
            "/auth/reset-password",
        ];

        const shouldSkipRefresh = skipRefreshUrls.some((url) =>
            requestUrl.includes(url)
        );

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            shouldSkipRefresh
        ) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        refreshPromise ??= refreshClient
            .post<ApiResponse<AuthResponse>>("/auth/refresh")
            .then((res) => {
                const newAccessToken = res.data.data?.accessToken ?? null;

                // if (newAccessToken) {
                //     setAccessToken(newAccessToken);
                // }

                return newAccessToken;
            })
            .catch((refreshError) => {
                clearAuthStorage();
                throw refreshError;
            })
            .finally(() => {
                refreshPromise = null;
            });

        const newAccessToken = await refreshPromise;



        if (!newAccessToken) {
            clearAuthStorage();
            return Promise.reject(error);
        }

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Thực hiện lại request bị lỗi ban đầu
    })