export type AdminUserRole = "ADMIN" | "LECTURER" | "RESEARCHER" | "STUDENT";

export type AdminUserSort = "RECENT" | "OLDEST" | "EMAIL_ASC" | "EMAIL_DESC";

export type AdminUserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminUserRole | string;
  emailVerified: boolean;
  googleLinked: boolean;
  banned: boolean;
  createdAt: string;
};

export type AdminUserPageResponse = {
  items: AdminUserResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type GetAdminUsersParams = {
  page: number;
  size: number;
  sort?: AdminUserSort;
};

export type AdminStatisticCard<T> = {
  value: T;
  description: string;
  delta: string | null;
};

export type AdminDashboardStatisticsResponse = {
  totalUsers: AdminStatisticCard<number>;
  activeTrends: AdminStatisticCard<number>;
  bannedUsers: AdminStatisticCard<number>;
  apiCallsUsed: AdminStatisticCard<number>;
  apiCallsToday: AdminStatisticCard<number>;
  totalApiCredit: AdminStatisticCard<number>;
  totalSubfields: AdminStatisticCard<number>;
  totalTopics: AdminStatisticCard<number>;
  lastSynchronization: AdminStatisticCard<string | null>;
};

export type AdminUserBanSummaryResponse = {
  active: number;
  banned: number;
  total: number;
  activePercentage: number;
  bannedPercentage: number;
};

export type AdminApiUsageDailyResponse = {
  date: string;
  callCount: number;
};

export type AdminApiCallConsumerResponse = {
  email: string;
  callCount: number;
};
