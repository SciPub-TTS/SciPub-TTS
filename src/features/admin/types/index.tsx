export type AdminUsersSort = "RECENT";

export type AdminUserRole = "ADMIN" | "LECTURER" | "RESEARCHER" | "STUDENT";

export type AdminUserApi = {
  banned: boolean;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  googleLinked: boolean;
  id: string;
  lastName: string;
  role: AdminUserRole;
};

export type AdminUsersPageData = {
  hasNext: boolean;
  items: AdminUserApi[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminUserBanSummary = {
  active: number;
  activePercentage: number;
  banned: number;
  bannedPercentage: number;
  total: number;
};

export type AdminTopApiConsumer = {
  callCount: number;
  email: string;
};

export type AdminApiUsagePoint = {
  callCount: number;
  date: string;
};
