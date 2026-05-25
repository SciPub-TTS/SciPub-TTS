import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "./routes";
import { ROUTE_SEGMENTS } from "./routeSegments";

import MainLayout from "@/layouts/main/MainLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";

import GuestOnlyRoute from "@/features/auth/components/GuestOnlyRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import {
  AUTH_ROLES,
  AUTHENTICATED_ROLES,
} from "@/features/auth/constants/roles";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import LandingPage from "@/pages/LandingPage";
import GuideHelpPage from "@/pages/GuideHelpPage";
import SearchPage from "@/pages/SearchPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PaperDetailPage from "@/pages/PaperDetailPage";

import ProfilePage from "@/pages/profile/ProfilePage";
import BookmarksPage from "@/pages/bookmarks/BookmarksPage";
import FeedPage from "@/pages/feed/FeedPage";
import ReportPage from "@/pages/report/ReportPage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminFieldsPage from "@/pages/admin/AdminFieldsPage";
import AdminSyncPage from "@/pages/admin/AdminSyncPage";

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
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
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
            element: <AdminUsersPage />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_FIELDS,
            element: <AdminFieldsPage />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_SYNC,
            element: <AdminSyncPage />,
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
