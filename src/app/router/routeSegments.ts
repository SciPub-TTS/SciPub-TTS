export const ROUTE_SEGMENTS = {
  // Children of "/"
  GUIDE: "guide",
  SEARCH: "search",
  TRENDING_TOPIC: "trending-topic",
  PAPER_DETAIL: "papers/:paperId",
  PAPER_ENTITY_DETAIL: "papers/:paperId/entities",

  PROFILE: "profile",
  PROFILE_SECURITY: "profile/security",
  BOOKMARKS: "bookmarks",
  FEED: "feed",
  REPORT: "report",

  // Children of "/admin"
  ADMIN_DASHBOARD: "dashboard",
  ADMIN_USERS: "users",
  ADMIN_FIELDS: "fields",
  ADMIN_SYNC: "sync",
} as const;
