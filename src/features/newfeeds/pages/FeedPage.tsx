import {
  FeedArticleCard,
  FeedHeader,
  FeedSidebar,
  FeedTabs,
} from "../components";
import { useResearchFeedPage } from "../hooks";

export default function FeedPage() {
  const { activeTab, articles, feedData, setActiveTab } = useResearchFeedPage();

  return (
    <div className="space-y-6">
      <FeedHeader />
      <FeedTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={feedData.tabs}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-5">
          {articles.map((article) => (
            <FeedArticleCard article={article} key={article.id} />
          ))}
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
