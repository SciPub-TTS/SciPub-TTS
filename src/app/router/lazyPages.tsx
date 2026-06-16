import { lazy } from "react";

export const LoginPage = lazy(() => import("@/features/auth/components/pages/LoginPage.tsx"));
export const RegisterPage = lazy(() => import("@/features/auth/components/pages/RegisterPage.tsx"));
export const LandingPage = lazy(() => import("@/features/landing/components/LandingPage"));
export const GuideHelpPage = lazy(() => import("@/features/guide/components/GuideHelpPage"));
export const SearchPage = lazy(() => import("@/features/search/components/SearchPage"));
export const PaperDetailPage = lazy(() => import("@/features/detail/works/components/PaperDetailPage"));
export const AuthorDetailPage = lazy(() => import("@/features/detail/entities/components/AuthorDetailPage"));
export const TopicDetailPage = lazy(() => import("@/features/detail/entities/components/TopicDetailPage"));
export const ProfilePage = lazy(() => import("@/features/profile/components/ProfilePage"));
export const FeedPage = lazy(() => import("@/features/newfeeds/components/FeedPage"));
export const ReportPage = lazy(() => import("@/features/reports/components/ReportPage"));
export const AdminDashboardPage = lazy(() => import("@/features/admin/components/AdminDashboardPage.tsx"));
export const AdminUsersPage = lazy(() => import("@/features/admin/pages/AdminUsersPage.tsx"));
export const ForgotPasswordPage = lazy(() => import("@/features/auth/components/pages/ForgotPasswordPage.tsx"));
export const VerifyResetCodePage = lazy(() => import("@/features/auth/components/pages/VerifyResetCodePage.tsx"));
export const ResetPasswordPage = lazy(() => import("@/features/auth/components/pages/ResetPasswordPage.tsx"));
export const ChangePasswordPage = lazy(() => import("@/features/profile/components/ChangePasswordPage.tsx"));
export const OAuth2SuccessPage = lazy(() => import("@/features/auth/components/pages/OAuth2SuccessPage.tsx"));
export const TopicDashboardPage = lazy(() => import("@/features/dashboard/topic/TopicDashboardPage.tsx"));
export const KeywordDashboardPage = lazy(() =>
  import("@/features/dashboard/keyword/KeywordDashboard.tsx").then((module) => ({
    default: module.KeywordDashboardPage,
  })),
);
export const BookmarkLibraryPage = lazy(() => import("@/features/bookmarks/components/BookmarkLibraryPage.tsx"));
export const GoogleRegisterCompletePage = lazy(() => import("@/features/auth/components/pages/GoogleRegisterCompletePage.tsx"));
