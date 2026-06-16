import { useMemo, useState } from "react";

import { getMockResearchFeed } from "../services";
import type { FeedTabKey } from "../types";

export function useResearchFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTabKey>("all");
  const feedData = useMemo(() => getMockResearchFeed(), []);
  const articles = useMemo(() => {
    if (activeTab === "all") {
      return feedData.articles;
    }

    return feedData.articles.filter((article) =>
      article.tabMatches.includes(activeTab),
    );
  }, [activeTab, feedData.articles]);

  return {
    activeTab,
    articles,
    feedData,
    setActiveTab,
  };
}
