import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { mapApiWorkToPaperResult } from "@/features/search/services/searchWorksMapper";
import type { SearchWorksApiItem } from "@/features/search/services/types";
import type {
  FeedArticle,
  FeedExactMatchFilter,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic
} from "../types";

type FeedArticleApiItem = SearchWorksApiItem & {
  reason: string;
  relevance: number | null;
  tabMatches: string[] | null;
};

// Helper to strip any full OpenAlex URL prefixes to keep route navigation clean
function extractRawId(id: string): string {
  if (!id) return "";
  return id.split("/").pop() || id;
}

export const apiService = {
  async getFollowedTopics(): Promise<FollowedTopic[]> {
    try {
      const response = await http.get<ApiResponse<FollowedTopic[]>>(
          "/api/feed/followed-topics",
      );
      const data = response.data.data || [];
      return data.map((topic) => ({
        ...topic,
        id: extractRawId(topic.id),
      }));
    } catch {
      return [];
    }
  },

  async getFollowedAuthors(): Promise<FollowedAuthor[]> {
    try {
      const response = await http.get<ApiResponse<FollowedAuthor[]>>(
          "/api/feed/followed-authors",
      );
      const data = response.data.data || [];
      return data.map((author) => ({
        ...author,
        id: extractRawId(author.id),
      }));
    } catch {
      return [];
    }
  },

  async getSuggestedTopics(): Promise<SuggestedTopic[]> {
    try {
      const response = await http.get<ApiResponse<SuggestedTopic[]>>(
          "/api/feed/suggested-topics",
      );
      const data = response.data.data || [];
      return data.map((topic) => ({
        ...topic,
        id: extractRawId(topic.id),
      }));
    } catch {
      return [];
    }
  },

  async getFeed(
    tabKey: string,
    page: number = 0,
    pageSize: number = 10,
    exactMatch: FeedExactMatchFilter | null = null,
  ): Promise<{
    items: FeedArticle[];
    totalItems: number
  }> {
    const backendEnumTab = tabKey.toUpperCase().replace("-", "_");
    try {
      const response = await http.get<
        ApiResponse<{
          items: FeedArticleApiItem[];
          totalItems: number;
        }>
      >("/api/feed", {
        params: {
          feedTab: backendEnumTab,
          page: page,
          pageSize: pageSize,
          exactMatchType: exactMatch?.type,
          exactMatchId: exactMatch?.id,
          exactMatchName: exactMatch?.name,
        },
      });

      const data = response.data.data;

      if (!data || !data.items || data.items.length === 0) {
        return { items: [], totalItems: 0 };
      }


      const items = data.items.map((item) => ({
          ...mapApiWorkToPaperResult({
            ...item,
            id: extractRawId(item.id),
            authorRefs: (item.authorRefs || []).map((authorRef) => ({
              ...authorRef,
              id: authorRef.id ? extractRawId(authorRef.id) : null,
            })),
            topicRef: item.topicRef
              ? {
                ...item.topicRef,
                id: item.topicRef.id ? extractRawId(item.topicRef.id) : null,
              }
              : null,
          }),
          reason: item.reason || "Recommended based on your followed profile filters.",
          relevance: item.relevance ?? 0,
          tabMatches: (item.tabMatches || []).filter(
            (tabMatch): tabMatch is FeedArticle["tabMatches"][number] =>
              tabMatch === "all"
              || tabMatch === "matched-topic"
              || tabMatch === "matched-author",
          ),
        }));

      const exactMatchedItems = exactMatch
        ? items.filter((item) =>
          item.reason.trim().toLocaleLowerCase().includes(
            exactMatch.name.trim().toLocaleLowerCase(),
          ),
        )
        : items;

      return {
        items: exactMatchedItems,
        totalItems: data.totalItems
      };

    } catch {
      return { items: [], totalItems: 0 };
    }
  }
}
