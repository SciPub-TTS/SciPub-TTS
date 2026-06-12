export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  GUIDE: "/guide",
  SEARCH: "/search",
  DASHBOARD: "/dashboard",
  TOPIC_DASHBOARD: "/topic_dashboard",
  TRENDING_TOPIC: "/trending-topic",

  //Auth
  FORGOT_PASSWORD: "/forgot-password",
  FORGOT_PASSWORD_VERIFY: "/forgot-password/verify-code",
  FORGOT_PASSWORD_RESET: "/forgot-password/reset",

  VERIFY_EMAIL_SUCCESS: "/verify-email/success",
  VERIFY_EMAIL_ERROR: "/verify-email/error",

  // Paper
  PAPER_DETAIL: "/papers/:paperId",

  // User protected
  PROFILE: "/profile",
  PROFILE_SECURITY: "/profile/security",
  BOOKMARKS: "/bookmarks",
  FEED: "/feed",
  REPORT: "/report",

  // Admin
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_FIELDS: "/admin/fields",
  ADMIN_SYNC: "/admin/sync",
} as const;

export const routePaths = {
  home: () => ROUTES.HOME,
  login: () => ROUTES.LOGIN,
  register: () => ROUTES.REGISTER,
  guide: () => ROUTES.GUIDE,
  search: () => ROUTES.SEARCH,
  trendingTopic: () => ROUTES.TRENDING_TOPIC,

  paperDetail: (paperId: string | number) =>
    `/papers/${encodeURIComponent(String(paperId))}`,

  profile: () => ROUTES.PROFILE,
  profileTab: (tab: "profile" | "interests" | "security" = "profile") =>
      `${ROUTES.PROFILE}?tab=${encodeURIComponent(tab)}`,
  profileSecurity: () => ROUTES.PROFILE_SECURITY,

  bookmarks: () => ROUTES.BOOKMARKS,
  feed: () => ROUTES.FEED,
  report: () => ROUTES.REPORT,

  adminDashboard: () => ROUTES.ADMIN_DASHBOARD,
  adminUsers: () => ROUTES.ADMIN_USERS,
  adminFields: () => ROUTES.ADMIN_FIELDS,
  adminSync: () => ROUTES.ADMIN_SYNC,
};
