import { http } from "@/services/http";
import type {
    AuthResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterLocalRequest,
    ResetPasswordRequest,
    UserPrincipal,
    VerifyResetCodeRequest,
    VerifyResetCodeResponse,
} from "@/features/auth/types/auth.types";
import { googleAuthUrl } from "@/config/appConfig";
import type { ApiResponse } from "@/types/common.types.ts";

const AUTH_BASE = "/auth";
const FORGOT_PASSWORD_BASE = "/auth/forgot-password";

const CHANGE_PASSWORD_PATH =
  import.meta.env.VITE_CHANGE_PASSWORD_PATH ?? "/account/change-password";

export const authApi = {
  register(payload: RegisterLocalRequest) {
    return http
      .post<ApiResponse<null>>(`${AUTH_BASE}/register`, payload)
      .then((res) => res.data);
  },

  login(payload: LoginRequest) {
    return http
      .post<ApiResponse<AuthResponse>>(`${AUTH_BASE}/login`, payload)
      .then((res) => res.data);
  },

  refresh() {
    return http
      .post<ApiResponse<AuthResponse>>(`${AUTH_BASE}/refresh`)
      .then((res) => res.data);
  },

  logout() {
    return http
      .post<ApiResponse<null>>(`${AUTH_BASE}/logout`)
      .then((res) => res.data);
  },

    me() {
        return http
            .get<ApiResponse<UserPrincipal>>(`${AUTH_BASE}/me`)
            .then((res) => res.data);
    },

    previewGoogleRegister(token: string) {
        return http
            .get<ApiResponse<GoogleSignupPreviewResponse>>(
                `${AUTH_BASE}/register/google/preview`,
                {
                    params: { token },
                },
            )
            .then((res) => res.data);
    },

    completeGoogleRegister(payload: CompleteGoogleRegisterRequest) {
        return http
            .post<ApiResponse<AuthResponse>>(
                `${AUTH_BASE}/register/google/complete`,
                payload,
            )
            .then((res) => res.data);
    },

  changePassword(payload: ChangePasswordRequest) {
    return http
      .post<ApiResponse<null>>(CHANGE_PASSWORD_PATH, payload)
      .then((res) => res.data);
  },

  requestForgotPassword(payload: ForgotPasswordRequest) {
    return http
      .post<ApiResponse<null>>(`${FORGOT_PASSWORD_BASE}/request`, payload)
      .then((res) => res.data);
  },

  verifyResetCode(payload: VerifyResetCodeRequest) {
    return http
      .post<ApiResponse<VerifyResetCodeResponse>>(
        `${FORGOT_PASSWORD_BASE}/verify-code`,
        payload,
      )
      .then((res) => res.data);
  },

  resetPassword(payload: ResetPasswordRequest) {
    return http
      .post<ApiResponse<null>>(`${FORGOT_PASSWORD_BASE}/reset`, payload)
      .then((res) => res.data);
  },

  startGoogleLogin() {
    const targetUrl = new URL(googleAuthUrl, window.location.origin);
    window.location.href = targetUrl.toString();
  },
};
