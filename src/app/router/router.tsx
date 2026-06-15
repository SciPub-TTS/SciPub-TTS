import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, type ReactNode } from "react";

import { ROUTES } from "./routes";
import { ROUTE_SEGMENTS } from "./routeSegments";
import type {AppRouteHandle} from "@/app/router/breadcrumbs.ts";
import PlaceholderPage from "./PlaceholderPage";
import {
  AdminDashboardPage,
  AdminUsersPage,
  BookmarkLibraryPage,
  ChangePasswordPage,
  FeedPage,
  ForgotPasswordPage,
  GoogleRegisterCompletePage,
  GuideHelpPage,
  KeywordDashboardPage,
  LandingPage,
  LoginPage,
  OAuth2SuccessPage,
  PaperDetailPage,
  ProfilePage,
  RegisterPage,
  ReportPage,
  ResetPasswordPage,
  SearchPage,
  TopicDashboardPage,
  VerifyResetCodePage,
} from "./lazyPages";

import MainLayout from "@/layout/main/MainLayout";
import AdminLayout from "@/layout/admin/AdminLayout";

import GuestOnlyRoute from "@/features/auth/components/GuestOnlyRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import {
  AUTH_ROLES,
  AUTHENTICATED_ROLES,
} from "@/features/auth/constants/roles";
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

const routeFallback = (
  <div className="px-6 py-10 text-sm font-medium text-slate-500">
    Loading page...
  </div>
);

function withSuspense(page: ReactNode) {
  return <Suspense fallback={routeFallback}>{page}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: withSuspense(<LoginPage />),
      },
      {
        path: ROUTES.REGISTER,
        element: withSuspense(<RegisterPage />),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: withSuspense(<ForgotPasswordPage />),
      },
      {
        path: ROUTES.FORGOT_PASSWORD_VERIFY,
        element: withSuspense(<VerifyResetCodePage />),
      },
      {
        path: ROUTES.FORGOT_PASSWORD_RESET,
        element: withSuspense(<ResetPasswordPage />),
      },
      {
        path: ROUTES.GOOGLE_REGISTER_COMPLETE,
        element: withSuspense(<GoogleRegisterCompletePage />),
      }
    ],
  },

  {
    path: ROUTES.HOME,
    element: withSuspense(<LandingPage />),
  },

  {
    path: "/oauth2/success",
    element: withSuspense(<OAuth2SuccessPage />),
  },

  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        path: ROUTE_SEGMENTS.GUIDE,
        element: withSuspense(<GuideHelpPage />),
        handle: {
          breadcrumb: "Guide",
        },
      },
      {
        path: ROUTE_SEGMENTS.SEARCH,
        element: withSuspense(<SearchPage />),
        handle: {
          breadcrumb: "Search",
        },
      },
      {
        path: ROUTE_SEGMENTS.TRENDING_TOPIC,
        element: withSuspense(<TopicDashboardPage />),
      },
      {
        path: ROUTE_SEGMENTS.TRENDING_KEYWORD,
        element: withSuspense(<KeywordDashboardPage />),
      },
      {
        path: ROUTE_SEGMENTS.PAPER_DETAIL,
        element: withSuspense(<PaperDetailPage />),
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
            element: withSuspense(<FeedPage />),
            handle: {
              breadcrumb: "Feed",
            },
          },
          {
            path: ROUTE_SEGMENTS.REPORT,
            element: withSuspense(<ReportPage />),
            handle: {
              breadcrumb: "Reports",
            },
          },
          {
            path: ROUTE_SEGMENTS.PROFILE,
            element: withSuspense(<ProfilePage />),
            handle: {
              breadcrumb: ({ location }: { location: Location }) =>
                getProfileBreadcrumb(location.search),
            },
          },
          {
            path: ROUTE_SEGMENTS.PROFILE_SECURITY,
            element: withSuspense(<ChangePasswordPage />),
            handle: {
              breadcrumb: [
                { label: "Profile", to: ROUTES.PROFILE },
                { label: "Security" },
              ],
            },
          },
          {
            path: ROUTES.BOOKMARKS,
            element: withSuspense(<BookmarkLibraryPage />),
            handle: {
              breadcrumb: "Bookmarks",
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
            element: withSuspense(<AdminDashboardPage />),
            handle: {
              breadcrumb: "Dashboard",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_USERS,
            element: withSuspense(<AdminUsersPage />),
            handle: {
              breadcrumb: "User Management",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_FIELDS,
            element: withSuspense(<PlaceholderPage title="Admin Fields" />),
            handle: {
              breadcrumb: "Fields",
            },
          },
          {
            path: ROUTE_SEGMENTS.ADMIN_SYNC,
            element: withSuspense(<PlaceholderPage title="Admin Sync" />),
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
