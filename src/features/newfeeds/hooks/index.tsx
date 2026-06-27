import { useEffect, useMemo, useState, useCallback } from "react";
import { apiService } from "../services";
import type {
  FeedArticle,
  FeedTabKey,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic,
  ResearchFeedData,
  FeedTab
} from "../types";

const FEED_TABS: FeedTab[] = [
  { key: "all", label: "All" },
  { key: "matched-topic", label: "Matched Topic" },
  { key: "matched-author", label: "Matched Author" },
  { key: "matched-both", label: "Matched Both" },
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "most-relevant", label: "Most Relevant" },
];

export function useResearchFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTabKey>("all");

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
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [topics, authors, suggested, feedResponse] = await Promise.all([
        apiService.getFollowedTopics(),
        apiService.getFollowedAuthors(),
        apiService.getSuggestedTopics(),
        apiService.getFeed(activeTab, page, 10),
      ]);

      setFollowedTopics(topics);
      setFollowedAuthors(authors);
      setSuggestedTopics(suggested);

      if (page === 0) {
        setArticles(feedResponse.items);
      } else {
        setArticles((prevArticles) => {
          const newItems = feedResponse.items.filter(
              (newItem) => !prevArticles.some((oldItem) => oldItem.id === newItem.id)
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
  }, [activeTab, page]);

  // useEffect(() => {
  //   setPage(0);
  // }, [activeTab]);

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
    totalItems,
    page,
    setPage,
    feedData,
    isLoading,
    setActiveTab: handleTabChange,
  };
}