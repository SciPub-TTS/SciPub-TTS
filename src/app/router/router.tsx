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

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import LandingPage from "@/pages/landing/LandingPage";
import GuideHelpPage from "@/pages/guide/GuideHelpPage";
import SearchPage from "@/pages/search/SearchPage";
import DashboardPage from "@/features/dashboard/DashboardPage.tsx";
import PaperDetailPage from "@/pages/papers/PaperDetailPage";

import ProfilePage from "@/pages/profile";
import BookmarksPage from "@/pages/bookmarks/BookMarkLibraryPage";
import FeedPage from "@/pages/feed";
import ReportPage from "@/pages/report";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

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
