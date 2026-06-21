export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  GUIDE: "/guide",
  SEARCH: "/search",
  TRENDING_TOPIC: "/trending-topic",
  TRENDING_KEYWORD: "/trending-keyword",

  GOOGLE_REGISTER_COMPLETE: "/register/complete",

  // Auth
  FORGOT_PASSWORD: "/forgot-password",
  FORGOT_PASSWORD_VERIFY: "/forgot-password/verify-code",
  FORGOT_PASSWORD_RESET: "/forgot-password/reset",

  // Paper
  PAPER_DETAIL: "/papers/:paperId",
  AUTHOR_DETAIL: "/authors/:authorId",
  TOPIC_DETAIL: "/topics/:topicId",

  // User protected
  PROFILE: "/profile",
  PROFILE_SECURITY: "/profile/security",
  BOOKMARKS: "/bookmarks",
  FEED: "/feed",
  REPORT: "/report",
  SOCIAL_HUB: "/social-hub",

  // Admin
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
} as const;

function encodePathSegment(value: string | number) {
  return encodeURIComponent(String(value));
}

export const routePaths = {
  paperDetail: (paperId: string | number) =>
    `/papers/${encodePathSegment(paperId)}`,
  authorDetail: (authorId: string | number) =>
    `/authors/${encodePathSegment(authorId)}`,
  topicDetail: (topicId: string | number) =>
    `/topics/${encodePathSegment(topicId)}`,
};
