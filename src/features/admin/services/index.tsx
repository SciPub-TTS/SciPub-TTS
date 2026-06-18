import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  AdminApiCallConsumerResponse,
  AdminApiUsageDailyResponse,
  AdminDashboardStatisticsResponse,
  AdminUserBanSummaryResponse,
  AdminUserPageResponse,
  AdminUserResponse,
  GetAdminUsersParams,
} from "@/features/admin/types";

const ADMIN_DASHBOARD_BASE = "/api/admin/dashboard";
const ADMIN_USERS_BASE = "/api/admin/users";

export const adminDashboardApi = {
  getStatistics() {
    return http
      .get<ApiResponse<AdminDashboardStatisticsResponse>>(
        `${ADMIN_DASHBOARD_BASE}/statistics`,
      )
      .then((res) => res.data);
  },

  getBanSummary() {
    return http
      .get<ApiResponse<AdminUserBanSummaryResponse>>(
        `${ADMIN_USERS_BASE}/ban-summary`,
      )
      .then((res) => res.data);
  },

  getApiUsageOverTime() {
    return http
      .get<ApiResponse<AdminApiUsageDailyResponse[]>>(
        `${ADMIN_DASHBOARD_BASE}/api-calls/usage-over-time`,
      )
      .then((res) => res.data);
  },

  getTopApiConsumers() {
    return http
      .get<ApiResponse<AdminApiCallConsumerResponse[]>>(
        `${ADMIN_DASHBOARD_BASE}/api-calls/top-users`,
      )
      .then((res) => res.data);
  },
};

export const adminUsersApi = {
  getUsers({ page, size, sort = "RECENT" }: GetAdminUsersParams) {
    return http
      .get<ApiResponse<AdminUserPageResponse>>(ADMIN_USERS_BASE, {
        params: { page, size, sort },
      })
      .then((res) => res.data);
  },

  banUser(userId: string) {
    return http
      .patch<ApiResponse<AdminUserResponse>>(
        `${ADMIN_USERS_BASE}/${encodeURIComponent(userId)}/ban`,
      )
      .then((res) => res.data);
  },

  unbanUser(userId: string) {
    return http
      .patch<ApiResponse<AdminUserResponse>>(
        `${ADMIN_USERS_BASE}/${encodeURIComponent(userId)}/unban`,
      )
      .then((res) => res.data);
  },
};
