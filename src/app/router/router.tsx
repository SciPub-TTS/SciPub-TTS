import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "./routes";
import { ROUTE_SEGMENTS } from "./routeSegments";

import MainLayout from "@/layout/main/MainLayout";
import AdminLayout from "@/layout/admin/AdminLayout";

import GuestOnlyRoute from "@/features/auth/components/GuestOnlyRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import {
  AUTH_ROLES,
  AUTHENTICATED_ROLES,
} from "@/features/auth/constants/roles";

import LoginPage from "@/features/auth/components/LoginPage";
import RegisterPage from "@/features/auth/components/pages/RegisterPage.tsx";

import LandingPage from "@/features/landing/components/LandingPage";
import GuideHelpPage from "@/features/guide/components/GuideHelpPage";
import SearchPage from "@/features/search/components/SearchPage";
import PaperDetailPage from "@/features/detailpapers/components/PaperDetailPage";

import ProfilePage from "@/features/profile/components/ProfilePage";
import BookmarksPage from "@/features/bookmarks/components/BookmarksPage";
import FeedPage from "@/features/newfeeds/components/FeedPage";
import ReportPage from "@/features/reports/components/ReportPage";

//import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import DashboardPage from "@/features/dashboard/DashboardPage.tsx";
import AdminDashboardPage from "@/features/admin/components/AdminDashboardPage.tsx";
import ForgotPasswordPage from "@/features/auth/components/ForgotPasswordPage.tsx";
import VerifyResetCodePage from "@/features/auth/components/VerifyResetCodePage.tsx";
import ResetPasswordPage from "@/features/auth/components/ResetPasswordPage.tsx";
import VerifyEmailSuccessPage from "@/features/auth/components/VerifyEmailResultPage.tsx";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage.tsx";
import OAuth2SuccessPage from "@/features/auth/components/OAuth2SuccessPage.tsx";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This page is being built.</p>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD_VERIFY,
        element: <VerifyResetCodePage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD_RESET,
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },

  {
    path: ROUTES.VERIFY_EMAIL_SUCCESS,
    element: <VerifyEmailSuccessPage />,
  },
  // {
  //   path: ROUTES.VERIFY_EMAIL_ERROR,
  //   element: <VerifyEmailErrorPage />,
  // },


  {
    path: "/oauth2/success",
    element: <OAuth2SuccessPage />,
  },

  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        path: ROUTE_SEGMENTS.GUIDE,
        element: <GuideHelpPage />,
      },
      {
        path: ROUTE_SEGMENTS.SEARCH,
        element: <SearchPage />,
      },
      {
        path: ROUTE_SEGMENTS.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTE_SEGMENTS.PAPER_DETAIL,
        element: <PaperDetailPage />,
      },

      {
        element: <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES} />,
        children: [
          {
            path: ROUTE_SEGMENTS.FEED,
            element: <FeedPage />,
          },
          {
            path: ROUTE_SEGMENTS.BOOKMARKS,
            element: <BookmarksPage />,
          },
          {
            path: ROUTE_SEGMENTS.REPORT,
            element: <ReportPage />,
          },
          {
            path: ROUTE_SEGMENTS.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: ROUTE_SEGMENTS.PROFILE_SECURITY,
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[AUTH_ROLES.ADMIN]} />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_DASHBOARD,
            element: <AdminDashboardPage />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_USERS,
            element: <PlaceholderPage title="Admin Users" />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_FIELDS,
            element: <PlaceholderPage title="Admin Fields" />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_SYNC,
            element: <PlaceholderPage title="Admin Sync" />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
