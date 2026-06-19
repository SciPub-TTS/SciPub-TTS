import { useEffect, useMemo, useState, useCallback } from "react";
import { apiService, fallbackResearchFeedData } from "../services";
import type {
  FeedArticle,
  FeedTabKey,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic,
  ResearchFeedData,
} from "../types";

export function useResearchFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTabKey>("all");

  const [followedTopics, setFollowedTopics] = useState<FollowedTopic[]>(
    fallbackResearchFeedData.followedTopics,
  );
  const [followedAuthors, setFollowedAuthors] = useState<FollowedAuthor[]>(
    fallbackResearchFeedData.followedAuthors,
  );
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>(
    fallbackResearchFeedData.suggestedTopics,
  );
  const [allArticles, setAllArticles] = useState<FeedArticle[]>(
    fallbackResearchFeedData.articles,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [topics, authors, suggested, fetchedArticles] = await Promise.all([
        apiService.getFollowedTopics(),
        apiService.getFollowedAuthors(),
        apiService.getSuggestedTopics(),
        apiService.getFeed(activeTab),
      ]);

      setFollowedTopics(topics);
      setFollowedAuthors(authors);
      setSuggestedTopics(suggested);
      setAllArticles(fetchedArticles);
    } catch (err) {
      console.warn(
        "Error resolving live endpoint payloads. Reverting to stub fallback.",
        err,
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const articles = useMemo(() => {
    if (activeTab === "all") {
      return allArticles;
    }

    return allArticles.filter((article) =>
      article.tabMatches ? article.tabMatches.includes(activeTab) : true,
    );
  }, [activeTab, allArticles]);

  const feedData: ResearchFeedData = useMemo(() => {
    return {
      articles: allArticles,
      followedAuthors,
      followedTopics,
      suggestedTopics,
      tabs: fallbackResearchFeedData.tabs,
    };
  }, [allArticles, followedAuthors, followedTopics, suggestedTopics]);

  return {
    activeTab,
    articles,
    feedData,
    setActiveTab,
    isLoading,
  };
}
