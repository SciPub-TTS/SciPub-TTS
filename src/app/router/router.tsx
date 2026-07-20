import { createBrowserRouter, Navigate } from "react-router-dom";

import type { DetailTitleEntityType } from "@/features/detail/store/detailTitleStore";
import { getDetailTitle } from "@/features/detail/store/detailTitleStore";

import { ROUTES } from "./routes";
import type { AppRouteHandle } from "@/app/router/breadcrumbs.ts";

import MainLayout from "@/layout/user/MainLayout";
import AdminLayout from "@/layout/admin/AdminLayout";

import AdminRestrictedRoute from "@/features/auth/components/AdminRestrictedRoute";
import GuestOnlyRoute from "@/features/auth/components/GuestOnlyRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import {
  AUTH_ROLES,
  AUTHENTICATED_ROLES,
} from "@/features/auth/constants/roles";
import {
  buildDetailTrailUrl,
  getDetailNavigationState,
  type DetailTrailEntityType,
} from "@/features/detail/detailTrail";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import LoginPage from "@/features/auth/components/pages/LoginPage.tsx";
import RegisterPage from "@/features/auth/components/pages/RegisterPage.tsx";
import GuideHelpPage from "@/features/guide/components/GuideHelpPage";
import SearchPage from "@/features/search/components/SearchPage";
import PaperDetailPage from "@/features/detail/works/components/PaperDetailPage";
import AuthorDetailPage from "@/features/detail/authors/components/AuthorDetailPage";
import TopicDetailPage from "@/features/detail/topics/components/TopicDetailPage";
import ProfilePage from "@/features/profile/components/ProfilePage";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage.tsx";
import FeedPage from "@/features/newfeeds/pages/FeedPage";
import ReportPage from "@/features/reports/components/ReportPage";
import AdminDashboardPage from "@/features/admin/components/AdminDashboardPage.tsx";
import AdminSystemSettingsPage from "@/features/admin/pages/AdminSystemSettingsPage.tsx";
import AdminUserDetailPage from "@/features/admin/pages/AdminUserDetailPage.tsx";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage.tsx";
import ForgotPasswordPage from "@/features/auth/components/pages/ForgotPasswordPage.tsx";
import VerifyResetCodePage from "@/features/auth/components/pages/VerifyResetCodePage.tsx";
import ResetPasswordPage from "@/features/auth/components/pages/ResetPasswordPage.tsx";
import OAuth2SuccessPage from "@/features/auth/components/pages/OAuth2SuccessPage.tsx";
import TopicDashboardPage from "@/features/dashboard/topic/TopicDashboardPage.tsx";
import BookmarkLibraryPage from "@/features/bookmarks/components/BookmarkLibraryPage.tsx";
import GoogleRegisterCompletePage from "@/features/auth/components/pages/GoogleRegisterCompletePage.tsx";
import SocialHubPage from "@/features/social/components/SocialHubPage.tsx";
import { ENABLE_SOCIAL_HUB } from "@/features/social/socialFeature";
import LandingPage from "@/features/landing/components/LandingPage";

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
    return [{ label: "Profile", to: ROUTES.PROFILE }, { label: "Security" }];
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
  return (
    getDetailTitle(entityType, entityId) || getDetailFallbackLabel(entityType)
  );
}

function getDetailBreadcrumb(
  location: Location,
  entityType: DetailTrailEntityType,
  entityId: string,
): AppRouteHandle["breadcrumb"] {
  const { origin: detailOrigin, trail: detailTrail } = getDetailNavigationState(
    location.search,
    entityType,
    entityId,
  );
  const trailItems = detailTrail.map((trailEntry) => ({
    label: getDetailBreadcrumbLabel(trailEntry.entityType, trailEntry.entityId),
    to: buildDetailTrailUrl(
      trailEntry.entityType,
      trailEntry.entityId,
      detailOrigin,
    ),
  }));

  const rootItem =
    detailOrigin === "bookmarks"
      ? {
          label: "Bookmarks",
          to: ROUTES.BOOKMARKS,
        }
      : detailOrigin === "social-hub" && ENABLE_SOCIAL_HUB
        ? {
            label: "Social Hub",
            to: ROUTES.SOCIAL_HUB,
          }
        : detailOrigin === "trending"
          ? {
              label: "Trending",
              to: ROUTES.TRENDING,
            }
          : detailOrigin === "feed" || detailOrigin === "newfeed"
            ? {
                label: "New Feed",
                to: ROUTES.FEED,
              }
            : {
                label: "Discovery",
                to: ROUTES.SEARCH,
                onClick: markSearchPageRestorePending,
              };

  return [
    rootItem,
    ...trailItems,
    { label: getDetailBreadcrumbLabel(entityType, entityId) },
  ];
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
      {
        path: ROUTES.GOOGLE_REGISTER_COMPLETE,
        element: <GoogleRegisterCompletePage />,
      },
    ],
  },

  {
    element: <AdminRestrictedRoute />,
    children: [
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
    ],
  },

  {
    path: ROUTES.OAUTH2_SUCCESS,
    element: <OAuth2SuccessPage />,
  },

  {
    element: <AdminRestrictedRoute />,
    children: [
      {
        path: ROUTES.HOME,
        element: <MainLayout />,
        children: [
          {
            path: "guide",
            element: <GuideHelpPage />,
            handle: {
              breadcrumb: "Guide",
            },
          },
          {
            path: "search",
            element: <SearchPage />,
            handle: {
              breadcrumb: "Discovery",
            },
          },
          {
            path: "trending",
            element: <TopicDashboardPage />,
            handle: {
              breadcrumb: "Trending",
            },
          },

          {
            path: "papers/:paperId",
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
              }) =>
                getDetailBreadcrumb(
                  location,
                  "works",
                  match.params.paperId || "",
                ),
            },
          },
          {
            path: "authors/:authorId",
            element: <AuthorDetailPage />,
            handle: {
              breadcrumb: ({
                location,
                match,
              }: {
                location: Location;
                match: { params: { authorId?: string } };
              }) =>
                getDetailBreadcrumb(
                  location,
                  "authors",
                  match.params.authorId || "",
                ),
            },
          },
          {
            path: "topics/:topicId",
            element: <TopicDetailPage />,
            handle: {
              breadcrumb: ({
                location,
                match,
              }: {
                location: Location;
                match: { params: { topicId?: string } };
              }) =>
                getDetailBreadcrumb(
                  location,
                  "topics",
                  match.params.topicId || "",
                ),
            },
          },
          {
            element: <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES} />,
            children: [
              {
                path: "feed",
                element: <FeedPage />,
                handle: {
                  breadcrumb: "Feed",
                },
              },
              ...(ENABLE_SOCIAL_HUB
                ? [
                    {
                      path: "social-hub",
                      element: <SocialHubPage />,
                      handle: {
                        breadcrumb: "Social Hub",
                      },
                    },
                  ]
                : []),
              {
                path: "profile",
                element: <ProfilePage />,
                handle: {
                  breadcrumb: ({ location }: { location: Location }) =>
                    getProfileBreadcrumb(location.search),
                },
              },
              {
                path: "profile/security",
                element: <ChangePasswordPage />,
                handle: {
                  breadcrumb: [
                    { label: "Profile", to: ROUTES.PROFILE },
                    { label: "Security" },
                  ],
                },
              },
              {
                path: "bookmarks",
                element: <BookmarkLibraryPage />,
                handle: {
                  breadcrumb: "Bookmarks",
                },
              },
              {
                path: "report",
                element: <ReportPage />,
                handle: {
                  breadcrumb: "Reports",
                },
              },
            ],
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
            path: "dashboard",
            element: <AdminDashboardPage />,
            handle: {
              breadcrumb: "Dashboard",
            },
          },
          {
            path: "users",
            element: <AdminUsersPage />,
            handle: {
              breadcrumb: "User Management",
            },
          },
          {
            path: "system-settings",
            element: <AdminSystemSettingsPage />,
            handle: {
              breadcrumb: "System Settings",
            },
          },
          {
            path: "users/:userId",
            element: <AdminUserDetailPage />,
            handle: {
              breadcrumb: [
                { label: "User Management", to: ROUTES.ADMIN_USERS },
                { label: "User Detail" },
              ],
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
