import { ROUTES } from "@/app/router";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { authApi } from "@/features/auth/services/auth.api";
import type {
    ChangePasswordRequest,
    CompleteGoogleRegisterRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterLocalRequest,
    ResetPasswordRequest,
    VerifyResetCodeRequest,
} from "@/features/auth/types/auth.types";
import {
    clearAuthStorage,
    markLoggedOut,
    clearPasswordRecoveryState,
    getPasswordRecoveryEmail,
    getPasswordRecoveryGrantToken,
    setAuthSession,
    setCurrentUser,
    setPasswordRecoveryEmail,
    setPasswordRecoveryGrantToken,
} from "@/features/auth/utils/authStorage";
import {getAppBaseUrl} from "@/features/auth/utils/getAppBaseUrl.ts";

export async function submitRegister(
    payload: Omit<RegisterLocalRequest, "appBaseUrl">,
) {
    return authApi.register({
        ...payload,
        appBaseUrl: getAppBaseUrl(),
    });
}

export async function submitLogin(payload: LoginRequest, requestedPath?: string) {
    const loginResponse = await authApi.login(payload);
    setAuthSession(loginResponse.data);

    const meResponse = await authApi.me();
    setCurrentUser(meResponse.data);

    const role = meResponse.data.role;
    const isAdmin = role === AUTH_ROLES.ADMIN;
    const redirectTo = isAdmin
        ? requestedPath?.startsWith(ROUTES.ADMIN)
            ? requestedPath
            : ROUTES.ADMIN_DASHBOARD
        : requestedPath?.startsWith(ROUTES.ADMIN)
            ? ROUTES.HOME
            : requestedPath ?? ROUTES.HOME;

    return {
        redirectTo,
        user: meResponse.data,
    };
}

export async function submitPreviewGoogleRegister(token: string) {
    return authApi.previewGoogleRegister(token);
}

export async function submitCompleteGoogleRegister(
    payload: CompleteGoogleRegisterRequest,
) {
    const response = await authApi.completeGoogleRegister(payload);
    setAuthSession(response.data);

    const meResponse = await authApi.me();
    setCurrentUser(meResponse.data);

    const role = meResponse.data.role;

    return {
        response,
        redirectTo: role === AUTH_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME,
    }
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
        markLoggedOut();
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
