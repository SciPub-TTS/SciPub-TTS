import {
  FeedArticleCard,
  FeedHeader,
  FeedSidebar,
  FeedTabs,
} from "../components";
import { useResearchFeedPage } from "../hooks";

export default function FeedPage() {
  const { activeTab, articles, feedData, setActiveTab, isLoading } =
    useResearchFeedPage();

  return (
    <div className="space-y-6">
      <FeedHeader />
      <FeedTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={feedData.tabs}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main
          className={`space-y-5 transition-opacity duration-200 ${isLoading ? "opacity-60" : "opacity-100"}`}
        >
          {articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                No articles matches this tab profile.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <FeedArticleCard article={article} key={article.id} />
            ))
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
