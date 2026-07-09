import type { AuthRole } from "@/features/auth/constants/roles.ts";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterLocalRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  appBaseUrl: string;
}

export interface CompleteGoogleRegisterRequest {
  googleSignupToken: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  appBaseUrl?: string;
}

export interface GoogleSignupPreviewResponse {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  resetGrantToken: string;
}

export interface ResetPasswordRequest {
  resetGrantToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserPrincipal {
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string | null;
  institution?: string | null;
  department?: string | null;
  country?: string | null;
  googleLinked?: boolean;
  role: AuthRole;
  authorities?: string[] | Array<{ authority: string }>;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  expiresInSeconds?: number;
  expiresAt?: string;
  user?: UserPrincipal;
}

export interface AuthUser {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: AuthRole;
}
