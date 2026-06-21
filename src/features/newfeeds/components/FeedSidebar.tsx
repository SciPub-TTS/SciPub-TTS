import { Plus } from "lucide-react";

import type {
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic,
} from "../types";

type FeedSidebarProps = {
  authors: FollowedAuthor[];
  suggestedTopics: SuggestedTopic[];
  topics: FollowedTopic[];
};

export function FeedSidebar({
  authors,
  suggestedTopics,
  topics,
}: FeedSidebarProps) {
  return (
    <aside className="space-y-4">
      <FollowedTopicsCard topics={topics} />
      <FollowedAuthorsCard authors={authors} />
      <SuggestedTopicsCard topics={suggestedTopics} />
    </aside>
  );
}

function SidebarCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FollowedTopicsCard({ topics }: { topics: FollowedTopic[] }) {
  return (
    <SidebarCard title="Followed Topics">
      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            key={topic.name}
          >
            <span className="truncate text-xs font-semibold text-slate-700">
              {topic.name}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <span className={getTopicStatusClassName(topic.status)}>
                {topic.status}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Following
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700"
        type="button"
      >
        + Follow more topics
      </button>
    </SidebarCard>
  );
}

function FollowedAuthorsCard({ authors }: { authors: FollowedAuthor[] }) {
  return (
    <SidebarCard title="Followed Authors">
      <div className="space-y-2">
        {authors.map((author) => (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            key={author.name}
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-700">
                {author.name}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-400">
                {author.field}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
              Following
            </span>
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700"
        type="button"
      >
        + Follow more authors
      </button>
    </SidebarCard>
  );
}

function SuggestedTopicsCard({ topics }: { topics: SuggestedTopic[] }) {
  return (
    <SidebarCard title="Suggested Topics">
      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            className="flex items-center justify-between gap-3"
            key={topic.name}
          >
            <span className="min-w-0 truncate text-xs font-semibold text-slate-600">
              {topic.name}
            </span>
            <button
              aria-label={`Follow ${topic.name}`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </SidebarCard>
  );
}

function getTopicStatusClassName(status: FollowedTopic["status"]) {
  if (status === "Rising") {
    return "rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700";
  }

  return "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500";
}
