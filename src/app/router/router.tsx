import { createBrowserRouter, Navigate, type Location } from "react-router-dom";

import type { AppRouteHandle } from "./breadcrumbs";
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

import LoginPage from "@/features/auth/components/pages/LoginPage.tsx";
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
import TrendingTopicPage from "@/features/dashboard/TrendingTopicPage.tsx";
import AdminDashboardPage from "@/features/admin/components/AdminDashboardPage.tsx";
import ForgotPasswordPage from "@/features/auth/components/pages/ForgotPasswordPage.tsx";
import VerifyResetCodePage from "@/features/auth/components/pages/VerifyResetCodePage.tsx";
import ResetPasswordPage from "@/features/auth/components/pages/ResetPasswordPage.tsx";
// import VerifyEmailSuccessPage from "@/features/auth/components/VerifyEmailResultPage.tsx";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage.tsx";
import OAuth2SuccessPage from "@/features/auth/components/pages/OAuth2SuccessPage.tsx";
import { getPaperTitle } from "@/features/detailpapers/paperTitleStore";
import {
  buildPaperDetailTrailUrl,
  parseWorkTrail,
} from "@/features/detailpapers/workTrail";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";

function getPaperBreadcrumbLabel(paperId: string) {
  return getPaperTitle(paperId) || "Paper Detail";
}

function getPaperBreadcrumb(location: Location, paperId: string) {
  const workTrail = parseWorkTrail(location.search);
  const trailItems = workTrail.map((trailPaperId, index) => ({
    label: getPaperBreadcrumbLabel(trailPaperId),
    to:
      index === 0
        ? buildPaperDetailTrailUrl(trailPaperId, [])
        : buildPaperDetailTrailUrl(trailPaperId, workTrail.slice(0, index)),
  }));

  return [
    {
      label: "Search",
      to: ROUTES.SEARCH,
      onClick: markSearchPageRestorePending,
    },
    ...trailItems,
    { label: getPaperBreadcrumbLabel(paperId) },
  ];
}

function getProfileBreadcrumb(search: string): AppRouteHandle["breadcrumb"] {
  const params = new URLSearchParams(search);
  const activeTab = params.get("tab");

  if (activeTab === "interests") {
    return [
      { label: "Profile", to: ROUTES.PROFILE },
      { label: "Research Interests" },
    ];
  }

  if (activeTab === "security") {
    return [
      { label: "Profile", to: ROUTES.PROFILE },
      { label: "Security" },
    ];
  }

  return "Profile";
}

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
        handle: {
          breadcrumb: "Guide",
        },
      },
      {
        path: ROUTE_SEGMENTS.SEARCH,
        element: <SearchPage />,
        handle: {
          breadcrumb: "Search",
        },
      },
      {
        path: ROUTE_SEGMENTS.TRENDING_TOPIC,
        element: <TrendingTopicPage />,
        handle: {
          breadcrumb: "Trending Topic",
        },
      },
      {
        path: ROUTE_SEGMENTS.PAPER_DETAIL,
        element: <PaperDetailPage />,
        handle: {
          breadcrumb: ({
            location,
            match,
          }: {
            location: Location;
            match: {
              params: {
                paperId?: string;
              };
            };
          }) => getPaperBreadcrumb(location, match.params.paperId || ""),
        },
      },

      {
        element: <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES} />,
        children: [
          {
            path: ROUTE_SEGMENTS.FEED,
            element: <FeedPage />,
            handle: {
              breadcrumb: "Feed",
            },
          },
          {
            path: ROUTE_SEGMENTS.BOOKMARKS,
            element: <BookmarksPage />,
            handle: {
              breadcrumb: "Bookmarks",
            },
          },
          {
            path: ROUTE_SEGMENTS.REPORT,
            element: <ReportPage />,
            handle: {
              breadcrumb: "Reports",
            },
          },
          {
            path: ROUTE_SEGMENTS.PROFILE,
            element: <ProfilePage />,
            handle: {
              breadcrumb: ({ location }: { location: Location }) =>
                getProfileBreadcrumb(location.search),
            },
          },
          {
            path: ROUTE_SEGMENTS.PROFILE_SECURITY,
            element: <ChangePasswordPage />,
            handle: {
              breadcrumb: [
                { label: "Profile", to: ROUTES.PROFILE },
                { label: "Security" },
              ],
            },
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
        handle: {
          breadcrumb: "Admin",
        },
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_DASHBOARD,
            element: <AdminDashboardPage />,
            handle: {
              breadcrumb: "Dashboard",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_USERS,
            element: <PlaceholderPage title="Admin Users" />,
            handle: {
              breadcrumb: "User Management",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_FIELDS,
            element: <PlaceholderPage title="Admin Fields" />,
            handle: {
              breadcrumb: "Fields",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_SYNC,
            element: <PlaceholderPage title="Admin Sync" />,
            handle: {
              breadcrumb: "Sync",
            },
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
