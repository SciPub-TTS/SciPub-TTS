import axios from "axios";

import {
    clearAuthStorage,
    getAccessToken
} from "@/features/auth/utils/authStorage";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import type {ApiResponse} from "@/types/common.types.ts";

const API_URL = (import.meta.env.VITE_API_URL ?? "").trim();
const API_BASE_URL = `${API_URL.replace(/\/$/, "")}/api`;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: API_BASE_URL,
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

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/forgot-password")
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
    })
