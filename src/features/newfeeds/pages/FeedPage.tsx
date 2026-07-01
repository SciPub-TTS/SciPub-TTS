import {
    FeedArticleCard,
    FeedExactMatchFilter,
    FeedHeader,
    FeedSidebar,
    FeedTabs,
} from "../components";
import {useResearchFeedPage} from "../hooks";
import {useCallback} from "react";
import {useInfiniteScroll} from "@/features/newfeeds/hooks/UseInfiniteScroll.ts";

export default function ResearchFeedPage() {
    const {
        activeTab,
        setActiveTab,
        setExactMatch,
        articles,
        exactMatch,
        isLoading,
        setPage,
        totalItems,
        feedData,
    } = useResearchFeedPage();

    const hasMore = articles.length < totalItems;

    // 2. Hàm gọi khi cuộn tới đáy
    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isLoading, hasMore, setPage]);

    const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore);

  return (
    <div className="space-y-6">
      <FeedHeader />
      <FeedTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={feedData.tabs}
      />
      <FeedExactMatchFilter
        activeTab={activeTab}
        authors={feedData.followedAuthors}
        selectedMatch={exactMatch}
        topics={feedData.followedTopics}
        onMatchChange={setExactMatch}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main
          className={`space-y-5 transition-opacity duration-200 ${isLoading ? "opacity-60" : "opacity-100"}`}
        >
            {articles.length === 0 && !isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        No articles match this tab profile.
                    </p>
                </div>
            ) : (
                <>
                    {articles.map((article) => (
                        <FeedArticleCard article={article} key={article.id}/>
                    ))}

                    {hasMore && (
                        <div ref={sentinelRef} className="py-4 text-center">
                            {isLoading ? (
                                <p className="text-sm text-slate-400 animate-pulse">Loading more articles...</p>
                            ) : (
                                <div className="h-4"/>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>

        <FeedSidebar
          authors={feedData.followedAuthors}
          suggestedTopics={feedData.suggestedTopics}
          topics={feedData.followedTopics}
        />
      </div>
    </div>
  );
}
