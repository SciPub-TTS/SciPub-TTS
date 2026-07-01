import { useEffect, useMemo, useState, useCallback } from "react";
import { apiService } from "../services";
import type {
  FeedArticle,
  FeedExactMatchFilter,
  FeedTabKey,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic,
  ResearchFeedData,
  FeedTab,
} from "../types";

const FEED_TABS: FeedTab[] = [
  { key: "all", label: "All" },
  { key: "matched-topic", label: "Matched Topic" },
  { key: "matched-author", label: "Matched Author" },
];

export function useResearchFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTabKey>("all");
  const [exactMatch, setExactMatch] = useState<FeedExactMatchFilter | null>(null);

  // Thêm state quản lý phân trang
  const [page, setPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [followedTopics, setFollowedTopics] = useState<FollowedTopic[]>([]);
  const [followedAuthors, setFollowedAuthors] = useState<FollowedAuthor[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>([]);
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleTabChange = (tab: FeedTabKey) => {
    setActiveTab(tab);
    setPage(0);
    setExactMatch((currentMatch) => {
      if (tab === "matched-author" && currentMatch?.type === "TOPIC") {
        return null;
      }

      if (tab === "matched-topic" && currentMatch?.type === "AUTHOR") {
        return null;
      }

      return currentMatch;
    });
  };

  const handleExactMatchChange = (nextMatch: FeedExactMatchFilter | null) => {
    setExactMatch(nextMatch);
    setPage(0);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [topics, authors, suggested, feedResponse] = await Promise.all([
        apiService.getFollowedTopics(),
        apiService.getFollowedAuthors(),
        apiService.getSuggestedTopics(),
        apiService.getFeed(activeTab, page, 10, exactMatch),
      ]);

      setFollowedTopics(topics);
      setFollowedAuthors(authors);
      setSuggestedTopics(suggested);

      if (page === 0) {
        setArticles(feedResponse.items);
      } else {
        setArticles((prevArticles) => {
          const newItems = feedResponse.items.filter(
            (newItem) =>
              !prevArticles.some((oldItem) => oldItem.id === newItem.id),
          );
          return [...prevArticles, ...newItems];
        });
      }

      setTotalItems(feedResponse.totalItems);
    } catch (err) {
      console.warn("Lỗi load data.", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, exactMatch, page]);

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, [loadData]);

  const feedData: ResearchFeedData = useMemo(() => {
    return {
      articles: articles,
      followedAuthors,
      followedTopics,
      suggestedTopics,
      tabs: FEED_TABS,
    };
  }, [articles, followedAuthors, followedTopics, suggestedTopics]);

  return {
    activeTab,
    articles,
    exactMatch,
    totalItems,
    page,
    setPage,
    feedData,
    isLoading,
    setExactMatch: handleExactMatchChange,
    setActiveTab: handleTabChange,
  };
}
