export const ROUTE_SEGMENTS = {
  // Children of "/"
  GUIDE: "guide",
  SEARCH: "search",
  DASHBOARD: "dashboard",
  PAPER_DETAIL: "papers/:paperId",

  PROFILE: "profile",
  BOOKMARKS: "bookmarks",
  FEED: "feed",
  REPORT: "report",

  // Children of "/admin"
  ADMIN_DASHBOARD: "dashboard",
  ADMIN_USERS: "users",
  ADMIN_FIELDS: "fields",
  ADMIN_SYNC: "sync",
} as const;
