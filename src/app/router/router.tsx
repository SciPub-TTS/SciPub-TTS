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
import RegisterPage from "@/features/auth/components/RegisterPage";

import LandingPage from "@/features/landing/components/LandingPage";
import GuideHelpPage from "@/features/guide/components/GuideHelpPage";
import SearchPage from "@/features/search/components/SearchPage";
import DashboardPage from "@/features/dashboard/components/DashboardPage";
import PaperDetailPage from "@/features/detailpapers/components/PaperDetailPage";

import ProfilePage from "@/features/profile/components/ProfilePage";
import BookmarksPage from "@/features/bookmarks/components/BookmarksPage";
import FeedPage from "@/features/newfeeds/components/FeedPage";
import ReportPage from "@/features/reports/components/ReportPage";

import AdminDashboardPage from "@/features/admin/components/AdminDashboardPage";

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
    ],
  },

  {
    path: ROUTES.HOME,
    element: <LandingPage />,
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
            element: (
              <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
                <h1 className="text-2xl font-semibold text-slate-900">
                  Admin Users
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  This page is being built.
                </p>
              </section>
            ),
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_FIELDS,
            element: (
              <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
                <h1 className="text-2xl font-semibold text-slate-900">
                  Admin Fields
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  This page is being built.
                </p>
              </section>
            ),
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_SYNC,
            element: (
              <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
                <h1 className="text-2xl font-semibold text-slate-900">
                  Admin Sync
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  This page is being built.
                </p>
              </section>
            ),
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
