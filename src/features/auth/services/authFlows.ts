import { ROUTES } from "@/app/router";
import { AUTH_ROLES, type AuthRole } from "@/features/auth/constants/roles";
import { authApi } from "@/features/auth/services/auth.api";
import type {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterLocalRequest,
    ResetPasswordRequest,
    VerifyResetCodeRequest,
} from "@/features/auth/types/auth.types";

import {
    clearAuthStorage,
    clearPasswordRecoveryState,
    getCurrentUser,
    getPasswordRecoveryEmail,
    getPasswordRecoveryGrantToken,
    setAuthSession,
    setCurrentUser,
    setPasswordRecoveryEmail,
    setPasswordRecoveryGrantToken,
} from "@/features/auth/utils/authStorage";

function resolvePostLoginPath(role: AuthRole, requestedPath?: string) {
    if (
        requestedPath &&
        requestedPath !== ROUTES.LOGIN &&
        requestedPath !== ROUTES.REGISTER
    ) {
        return requestedPath;
    }

    return role === AUTH_ROLES.ADMIN
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.HOME;
}

export async function submitRegister(payload: RegisterLocalRequest) {
    return authApi.register(payload);
}

export async function submitLogin(
    payload: LoginRequest,
    requestedPath?: string,
) {
    const loginResponse = await authApi.login(payload);

    setAuthSession(loginResponse.data);

    try {
        const meResponse = await authApi.me();
        setCurrentUser(meResponse.data);
    } catch {
        if (loginResponse.data?.user) {
            setCurrentUser(loginResponse.data.user);
        }
    }

    const user = getCurrentUser();

    if (!user) {
        throw new Error("Không thể khởi tạo phiên đăng nhập sau khi login.");
    }

    return {
        message: loginResponse.message,
        user,
        redirectTo: resolvePostLoginPath(user.role, requestedPath),
    };
}

export async function bootstrapCurrentUser() {
    const response = await authApi.me();
    setCurrentUser(response.data);
    return response.data;
}

export async function submitLogout() {
    try {
        await authApi.logout();
    } finally {
        clearAuthStorage();
        clearPasswordRecoveryState();
    }
}

export async function submitForgotPasswordRequest(
    payload: ForgotPasswordRequest,
) {
    const response = await authApi.requestForgotPassword(payload);
    setPasswordRecoveryEmail(payload.email);
    setPasswordRecoveryGrantToken("");
    return response;
}

export async function submitVerifyResetCode(
    payload: VerifyResetCodeRequest,
) {
    const email = payload.email || getPasswordRecoveryEmail();

    if (!email) {
        throw new Error("Thiếu email để xác thực mã reset password.");
    }

    const response = await authApi.verifyResetCode({
        email,
        code: payload.code,
    });

    setPasswordRecoveryEmail(email);
    setPasswordRecoveryGrantToken(response.data.resetGrantToken);

    return response;
}

export async function submitResetPassword(
    payload: Omit<ResetPasswordRequest, "resetGrantToken"> & {
        resetGrantToken?: string;
    },
) {
    const resetGrantToken =
        payload.resetGrantToken || getPasswordRecoveryGrantToken();

    if (!resetGrantToken) {
        throw new Error("Thiếu resetGrantToken để đặt lại mật khẩu.");
    }

    const response = await authApi.resetPassword({
        resetGrantToken,
        newPassword: payload.newPassword,
        confirmNewPassword: payload.confirmNewPassword,
    });

    clearPasswordRecoveryState();

    return response;
}

export async function submitChangePassword(
    payload: ChangePasswordRequest,
) {
    const response = await authApi.changePassword(payload);

    clearAuthStorage();

    return response;
}
