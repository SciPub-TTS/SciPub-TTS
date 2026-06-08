export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  GUIDE: "/guide",
  SEARCH: "/search",
  DASHBOARD: "/dashboard",
  TOPIC_DASHBOARD: "/topic_dashboard",

  // Paper
  PAPER_DETAIL: "/papers/:paperId",

  // User protected
  PROFILE: "/profile",
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
  dashboard: () => ROUTES.DASHBOARD,

  paperDetail: (paperId: string | number) =>
    `/papers/${encodeURIComponent(String(paperId))}`,

  profile: () => ROUTES.PROFILE,
  bookmarks: () => ROUTES.BOOKMARKS,
  feed: () => ROUTES.FEED,
  report: () => ROUTES.REPORT,

  adminDashboard: () => ROUTES.ADMIN_DASHBOARD,
  adminUsers: () => ROUTES.ADMIN_USERS,
  adminFields: () => ROUTES.ADMIN_FIELDS,
  adminSync: () => ROUTES.ADMIN_SYNC,
};
