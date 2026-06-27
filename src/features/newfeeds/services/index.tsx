import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  FeedArticle,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic
} from "../types";

type FeedArticleApiItem = Omit<FeedArticle, "source"> & {
  venue: string;
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

  async getFeed(tabKey: string, page: number = 0, pageSize: number = 10): Promise<{
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
        },
      });

      const data = response.data.data;

      if (!data || !data.items || data.items.length === 0) {
        return { items: [], totalItems: 0 };
      }


      return {
        items: data.items.map((item) => ({
          ...item,
          id: extractRawId(item.id),
          source: item.venue,
        })),
        totalItems: data.totalItems
      };

    } catch {
      return { items: [], totalItems: 0 };
    }
  }
}
