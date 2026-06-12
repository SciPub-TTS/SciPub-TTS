export const ROUTE_SEGMENTS = {
  // Children of "/"
  GUIDE: "guide",
  SEARCH: "search",
  TRENDING_TOPIC: "trending-topic",
  PAPER_DETAIL: "papers/:paperId",

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

  // Children of dashboard
    TOPIC_DASHBOARD: "/topic_dashboard",
    KEYWORD_DASHBOARD: "/keyword_dashboard",
} as const;
