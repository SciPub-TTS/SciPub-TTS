export type AdminUsersSort = "RECENT" | "OLDEST" | "EMAIL_ASC" | "EMAIL_DESC";

export type AdminUserRole = "ADMIN" | "LECTURER" | "RESEARCHER" | "STUDENT";

export type AdminUserApi = {
  authorCount: number;
  banned: boolean;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  googleLinked: boolean;
  id: string;
  lastName: string;
  role: AdminUserRole;
  topicCount: number;
};

export type AdminUserDetail = {
  activity: {
    authorCount: number;
    bookmarkCount: number;
    searchCount: number;
    topicCount: number;
  };
  profile: {
    country: string | null;
    createdAt: string | null;
    department: string | null;
    institution: string | null;
    updatedAt: string | null;
  };
  user: {
    avatarUrl: string | null;
    banned: boolean;
    createdAt: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    googleLinked: boolean;
    id: string;
    lastName: string | null;
    role: AdminUserRole;
    username: string | null;
  };
};

export type AdminUserSearchHistoryItem = {
  keyword: string;
  searchedAt: string;
};

export type AdminUserSearchHistoryPage = {
  hasNext: boolean;
  items: AdminUserSearchHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
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
