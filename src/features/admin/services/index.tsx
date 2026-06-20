import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type {
  AdminApiUsagePoint,
  AdminTopApiConsumer,
  AdminUserBanSummary,
  AdminUserApi,
  AdminUsersPageData,
  AdminUsersSort,
} from "../types";

type GetAdminUsersParams = {
  page: number;
  size: number;
  sort?: AdminUsersSort;
};

export function getAdminUsers({
  page,
  size,
  sort = "RECENT",
}: GetAdminUsersParams) {
  return http
    .get<ApiResponse<AdminUsersPageData>>("/admin/users", {
      params: {
        page,
        size,
        sort,
      },
    })
    .then((response) => response.data.data);
}

export function getAdminUserBanSummary() {
  return http
    .get<ApiResponse<AdminUserBanSummary>>("/admin/users/ban-summary")
    .then((response) => response.data.data);
}

export function getAdminTopApiConsumers() {
  return http
    .get<ApiResponse<AdminTopApiConsumer[]>>(
      "/admin/dashboard/api-calls/top-users",
    )
    .then((response) => response.data.data);
}

export function getAdminApiUsageOverTime() {
  return http
    .get<ApiResponse<AdminApiUsagePoint[]>>(
      "/admin/dashboard/api-calls/usage-over-time",
    )
    .then((response) => response.data.data);
}

export function banAdminUser(userId: string) {
  return http
    .patch<ApiResponse<AdminUserApi>>(
      `/admin/users/${encodeURIComponent(userId)}/ban`,
    )
    .then((response) => response.data.data);
}

export function unbanAdminUser(userId: string) {
  return http
    .patch<ApiResponse<AdminUserApi>>(
      `/admin/users/${encodeURIComponent(userId)}/unban`,
    )
    .then((response) => response.data.data);
}
