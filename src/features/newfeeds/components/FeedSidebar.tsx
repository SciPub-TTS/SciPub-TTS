import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router";
import { http } from "@/services/http";

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
                    <TopicRowItem key={topic.id} topic={topic} />
                ))}
            </div>
            <Link
                to="/search"
                className="mt-4 block w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700"
            >
                + Follow more topics
            </Link>
        </SidebarCard>
    );
}

function TopicRowItem({ topic }: { topic: FollowedTopic }) {
    const [isFollowed, setIsFollowed] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowed) {
                await http.delete("/api/follows", {
                    params: {
                        targetType: "TOPIC",
                        targetOpenAlexId: topic.id,
                    },
                });
                setIsFollowed(false);
            } else {
                await http.post("/api/follows", {
                    targetType: "TOPIC",
                    targetOpenalexId: topic.id,
                    displayName: topic.name,
                });
                setIsFollowed(true);
            }
        } catch (err) {
            console.error("Failed to toggle follow topic:", err);
        } finally {
            setLoading(false);
        }
    };

    const followButtonClassName = isFollowed
        ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
        : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

    return (
        <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Link
                to={routePaths.topicDetail(topic.id)}
                className="truncate text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:underline"
            >
                {topic.name}
            </Link>
            <button
                onClick={handleToggleFollow}
                disabled={loading}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition duration-200 ${followButtonClassName} ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="button"
            >
                {isFollowed ? (
                    <>
                        <Check className="h-3 w-3" />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-3 w-3" />
                        <span>Follow</span>
                    </>
                )}
            </button>
        </div>
    );
}

function FollowedAuthorsCard({ authors }: { authors: FollowedAuthor[] }) {
    return (
        <SidebarCard title="Followed Authors">
            <div className="space-y-2">
                {authors.map((author) => (
                    <AuthorRowItem key={author.id} author={author} />
                ))}
            </div>
            <Link
                to="/search"
                className="mt-4 block w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700"
            >
                + Follow more authors
            </Link>
        </SidebarCard>
    );
}

function AuthorRowItem({ author }: { author: FollowedAuthor }) {
    const [isFollowed, setIsFollowed] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowed) {
                await http.delete("/api/follows", {
                    params: {
                        targetType: "AUTHOR",
                        targetOpenAlexId: author.id,
                    },
                });
                setIsFollowed(false);
            } else {
                await http.post("/api/follows", {
                    targetType: "AUTHOR",
                    targetOpenalexId: author.id,
                    displayName: author.name,
                });
                setIsFollowed(true);
            }
        } catch (err) {
            console.error("Failed to toggle follow author:", err);
        } finally {
            setLoading(false);
        }
    };

    const followButtonClassName = isFollowed
        ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
        : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="min-w-0">
              <Link
                to={routePaths.authorDetail(author.id)}
                className="truncate text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:underline block"
              >
                {author.name}
              </Link>
            </div>
            <button
                onClick={handleToggleFollow}
                disabled={loading}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition duration-200 ${followButtonClassName} ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="button"
            >
                {isFollowed ? (
                    <>
                        <Check className="h-3 w-3" />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-3 w-3" />
                        <span>Follow</span>
                    </>
                )}
            </button>
        </div>
    );
}

function SuggestedTopicsCard({ topics }: { topics: SuggestedTopic[] }) {
    return (
        <SidebarCard title="Suggested Topics">
            <div className="space-y-2">
                {topics.map((topic) => (
                    <SuggestedTopicRowItem key={topic.id} topic={topic} />
                ))}
            </div>
        </SidebarCard>
    );
}

function SuggestedTopicRowItem({ topic }: { topic: SuggestedTopic }) {
    const [isFollowed, setIsFollowed] = useState(false); // Gợi ý mặc định là chưa follow
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowed) {
                await http.delete(`/api/topics/${topic.id}/follow`);
                setIsFollowed(false);
            } else {
                await http.post(`/api/topics/${topic.id}/follow`);
                setIsFollowed(true);
            }
        } catch (err) {
            console.error("Failed to toggle follow suggested topic:", err);
        } finally {
            setLoading(false);
        }
    };

    const followButtonClassName = isFollowed
        ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
        : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

    return (
        <div className="flex items-center justify-between gap-3">
            <Link
              to={routePaths.topicDetail(topic.id)}
              className="min-w-0 truncate text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:underline"
            >
              {topic.name}
            </Link>
            <button
                aria-label={`Follow ${topic.name}`}
                onClick={handleToggleFollow}
                disabled={loading}
                className={`inline-flex h-7 px-2.5 items-center justify-center rounded-full text-xs font-bold transition duration-200 ${followButtonClassName} ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="button"
            >
                {isFollowed ? (
                    <Check className="h-3.5 w-3.5" />
                ) : (
                    <Plus className="h-3.5 w-3.5" />
                )}
            </button>
          </div>
  );
}