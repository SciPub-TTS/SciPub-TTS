import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import { SOCIAL_BOOKMARK_OPTIONS_PAGE_SIZE } from "@/features/social/constants/socialHub.constants";
import type { FeedTab, SocialPostSummary, SortMode } from "@/features/social/types/social.types";
import { normalizeIdentityValue } from "@/features/social/utils/socialQueryUtils";
import { getDisplayTime, normalizeSocialOpenAlexId, normalizeTags, normalizeTopicLabel } from "@/features/social/utils/socialFormatters";

export function normalizeSocialPost(post: SocialPostSummary): SocialPostSummary {
  const fallbackId = post.id || crypto.randomUUID();
  const authorId = post.author?.id ? String(post.author.id) : fallbackId;
  const authorName =
    typeof post.author?.fullName === "string" && post.author.fullName.trim()
      ? post.author.fullName
      : "Unknown user";

  return {
    ...post,
    author: {
      id: authorId,
      fullName: authorName,
      avatarUrl: post.author?.avatarUrl ?? null,
    },
    createdAt: post.createdAt || new Date().toISOString(),
    references: Array.isArray(post.references)
      ? post.references.map((reference) => ({
          ...reference,
          authorOpenAlexIdsSnapshot: Array.isArray(
            reference.authorOpenAlexIdsSnapshot,
          )
            ? reference.authorOpenAlexIdsSnapshot
            : [],
          workTypeSnapshot: reference.workTypeSnapshot ?? null,
          topicOpenAlexIdSnapshot: reference.topicOpenAlexIdSnapshot ?? null,
          topicSnapshot: reference.topicSnapshot ?? null,
        }))
      : [],
    topicTag: Array.isArray(post.topicTag) ? post.topicTag : [],
    updatedAt: post.updatedAt ?? null,
  };
}

export function buildTopicLabelsFromBookmarks(bookmarks: BookmarkResponse[]) {
  const uniqueTopics = new Set<string>();

  for (const bookmark of bookmarks) {
    const topic = normalizeTopicLabel(bookmark.topic);

    if (topic && !uniqueTopics.has(topic)) {
      uniqueTopics.add(topic);
    }
  }

  return Array.from(uniqueTopics);
}

export function buildTopicTagValue(topics: string[]) {
  if (topics.length === 0) {
    return null;
  }

  return topics.join(",");
}

export async function fetchSocialBookmarkOptions() {
  const items: BookmarkResponse[] = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await bookmarkApi.getList({
      page,
      size: SOCIAL_BOOKMARK_OPTIONS_PAGE_SIZE,
    });

    items.push(...response.data.items);
    hasNext = response.data.hasNext;
    page += 1;
  }

  return items;
}

export function sortPosts(posts: SocialPostSummary[], sortMode: SortMode) {
  const nextPosts = [...posts];

  if (sortMode === "most-liked") {
    nextPosts.sort((left, right) => {
      if (right.likeCount !== left.likeCount) {
        return right.likeCount - left.likeCount;
      }

      const rightTime = new Date(
        getDisplayTime(right.createdAt, right.updatedAt),
      ).getTime();
      const leftTime = new Date(
        getDisplayTime(left.createdAt, left.updatedAt),
      ).getTime();

      return rightTime - leftTime;
    });
    return nextPosts;
  }

  nextPosts.sort((left, right) => {
    const rightTime = new Date(
      getDisplayTime(right.createdAt, right.updatedAt),
    ).getTime();
    const leftTime = new Date(
      getDisplayTime(left.createdAt, left.updatedAt),
    ).getTime();

    return rightTime - leftTime;
  });

  return nextPosts;
}

export function filterPosts(
  posts: SocialPostSummary[],
  tab: FeedTab,
  query: string,
  currentUserId?: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCurrentUserId = normalizeIdentityValue(currentUserId);

  return posts.filter((post) => {
    const matchesTab =
      tab === "all" ||
      (tab === "my-posts" && normalizedCurrentUserId
        ? normalizeIdentityValue(post.author.id) === normalizedCurrentUserId
        : false);

    const tags = normalizeTags(post.topicTag);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.author.fullName.toLowerCase().includes(normalizedQuery) ||
      post.bodyPreview.toLowerCase().includes(normalizedQuery) ||
      tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesTab && matchesQuery;
  });
}

export function findSelectedBookmarks(
  bookmarks: BookmarkResponse[],
  selectedOpenAlexIds: string[],
) {
  return bookmarks.filter((bookmark) =>
    selectedOpenAlexIds.includes(normalizeSocialOpenAlexId(bookmark.openAlexId)),
  );
}
