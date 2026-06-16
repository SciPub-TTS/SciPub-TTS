import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, type ReactNode } from "react";

import type { DetailTitleEntityType } from "@/store/detailTitleStore";
import { getDetailTitle } from "@/store/detailTitleStore";

import { ROUTES } from "./routes";
import { ROUTE_SEGMENTS } from "./routeSegments";
import type {AppRouteHandle} from "@/app/router/breadcrumbs.ts";
import PlaceholderPage from "./PlaceholderPage";
import {
  AdminDashboardPage,
  AdminUsersPage,
  AuthorDetailPage,
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
  TopicDetailPage,
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
import {
  buildDetailTrailUrl,
  parseDetailTrail,
  type DetailTrailEntityType,
} from "@/features/detail/detailTrail";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";

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

function getDetailFallbackLabel(entityType: DetailTitleEntityType) {
  if (entityType === "works") {
    return "Paper Detail";
  }

  if (entityType === "authors") {
    return "Author Detail";
  }

  return "Topic Detail";
}

function getDetailBreadcrumbLabel(
  entityType: DetailTitleEntityType,
  entityId: string,
) {
  return getDetailTitle(entityType, entityId) || getDetailFallbackLabel(entityType);
}

function getDetailBreadcrumb(
  location: Location,
  entityType: DetailTrailEntityType,
  entityId: string,
): AppRouteHandle["breadcrumb"] {
  const detailTrail = parseDetailTrail(location.search);
  const trailItems = detailTrail.map((trailEntry, index) => ({
    label: getDetailBreadcrumbLabel(trailEntry.entityType, trailEntry.entityId),
    to: buildDetailTrailUrl(
      trailEntry.entityType,
      trailEntry.entityId,
      detailTrail.slice(0, index),
    ),
  }));

  return [
    {
      label: "Search",
      to: ROUTES.SEARCH,
      onClick: markSearchPageRestorePending,
    },
    ...trailItems,
    { label: getDetailBreadcrumbLabel(entityType, entityId) },
  ];
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
          }) => getDetailBreadcrumb(location, "works", match.params.paperId || ""),
        },
      },
      {
        path: ROUTE_SEGMENTS.AUTHOR_DETAIL,
        element: withSuspense(<AuthorDetailPage />),
        handle: {
          breadcrumb: ({
            location,
            match,
          }: {
            location: Location;
            match: { params: { authorId?: string } };
          }) =>
            getDetailBreadcrumb(location, "authors", match.params.authorId || ""),
        },
      },
      {
        path: ROUTE_SEGMENTS.TOPIC_DETAIL,
        element: withSuspense(<TopicDetailPage />),
        handle: {
          breadcrumb: ({
            location,
            match,
          }: {
            location: Location;
            match: { params: { topicId?: string } };
          }) =>
            getDetailBreadcrumb(location, "topics", match.params.topicId || ""),
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
