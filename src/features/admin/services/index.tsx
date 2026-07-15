import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type {
  AdminApiUsagePoint,
  AdminDashboardStatistics,
  AdminTopApiConsumer,
  AdminUserApi,
  AdminUserDetail,
  AdminUserSearchHistoryPage,
  AdminUsersPageData,
  AdminUsersSort,
} from "../types";

type GetAdminUsersParams = {
  page: number;
  size: number;
  sort?: AdminUsersSort;
};

const ADMIN_API_BASE = "/api/admin";

export function getAdminUsers({
  page,
  size,
  sort = "RECENT",
}: GetAdminUsersParams) {
  return http
    .get<ApiResponse<AdminUsersPageData>>(`${ADMIN_API_BASE}/users`, {
      params: {
        page,
        size,
        sort,
      },
    })
    .then((response) => response.data.data);
}

export function getAdminDashboardStatistics() {
  return http
    .get<ApiResponse<AdminDashboardStatistics>>(
      `${ADMIN_API_BASE}/dashboard/statistics`,
    )
    .then((response) => response.data.data);
}

export function getAdminTopApiConsumers() {
  return http
    .get<ApiResponse<AdminTopApiConsumer[]>>(
      `${ADMIN_API_BASE}/dashboard/api-calls/top-users`,
    )
    .then((response) => response.data.data);
}

export function getAdminApiUsageOverTime() {
  return http
    .get<ApiResponse<AdminApiUsagePoint[]>>(
      `${ADMIN_API_BASE}/dashboard/api-calls/usage-over-time`,
    )
    .then((response) => response.data.data);
}

export function getAdminUserDetail(userId: string) {
  return http
    .get<ApiResponse<AdminUserDetail>>(
      `${ADMIN_API_BASE}/users/${encodeURIComponent(userId)}`,
    )
    .then((response) => response.data.data);
}

export function getAdminUserSearchHistory({
  page,
  size,
  userId,
}: {
  page: number;
  size: number;
  userId: string;
}) {
  return http
    .get<ApiResponse<AdminUserSearchHistoryPage>>(
      `${ADMIN_API_BASE}/users/${encodeURIComponent(userId)}/search-history`,
      {
        params: {
          page,
          size,
        },
      },
    )
    .then((response) => response.data.data);
}

export function banAdminUser(userId: string) {
  return http
    .patch<ApiResponse<AdminUserApi>>(
      `${ADMIN_API_BASE}/users/${encodeURIComponent(userId)}/ban`,
    )
    .then((response) => response.data.data);
}

export function unbanAdminUser(userId: string) {
  return http
    .patch<ApiResponse<AdminUserApi>>(
      `${ADMIN_API_BASE}/users/${encodeURIComponent(userId)}/unban`,
    )
    .then((response) => response.data.data);
}


