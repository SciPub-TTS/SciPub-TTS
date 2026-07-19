import { useCallback, useEffect, useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router";
import {
  buildDetailTrailUrl,
  persistRootDetailNavigation,
} from "@/features/detail/detailTrail";
import { http } from "@/services/http";
import { useInfiniteScroll } from "../hooks/UseInfiniteScroll";

import type {
  FollowedAuthor,
  FollowedTopic,
} from "../types";

type FeedSidebarProps = {
  authors: FollowedAuthor[];
  topics: FollowedTopic[];
};

export function FeedSidebar({
  authors,
  topics,
}: FeedSidebarProps) {
  return (
    <aside className="space-y-4">
      <FollowedTopicsCard topics={topics} />
      <FollowedAuthorsCard authors={authors} />
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const recentTopics = topics.slice(0, 3);

    return (
        <>
            <SidebarCard title="Followed Topics">
                {recentTopics.length > 0 ? (
                    <div className="space-y-2">
                        {recentTopics.map((topic) => (
                            <TopicRowItem key={topic.id} topic={topic} />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-500">You are not following any topics yet.</p>
                )}
                <button
                    className="mt-4 block w-full text-center text-xs font-bold text-blue-600 transition hover:text-blue-700"
                    onClick={() => setIsDialogOpen(true)}
                    type="button"
                >
                    View all followed topics ({topics.length})
                </button>
            </SidebarCard>

            {isDialogOpen && (
                <FollowedTopicsDialog
                    onClose={() => setIsDialogOpen(false)}
                    topics={topics}
                />
            )}
        </>
    );
}

const FOLLOWED_ITEMS_BATCH_SIZE = 20;

function FollowedTopicsDialog({
    onClose,
    topics,
}: {
    onClose: () => void;
    topics: FollowedTopic[];
}) {
    const [visibleCount, setVisibleCount] = useState(FOLLOWED_ITEMS_BATCH_SIZE);
    const hasMore = visibleCount < topics.length;

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const loadMore = useCallback(() => {
        setVisibleCount((current) => Math.min(current + FOLLOWED_ITEMS_BATCH_SIZE, topics.length));
    }, [topics.length]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
            onMouseDown={onClose}
        >
            <section
                aria-labelledby="followed-topics-title"
                aria-modal="true"
                className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
            >
                <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 id="followed-topics-title" className="text-base font-bold text-slate-900">
                            Followed Topics
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {topics.length} {topics.length === 1 ? "topic" : "topics"}
                        </p>
                    </div>
                    <button
                        aria-label="Close followed topics"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {topics.length > 0 ? (
                        <div className="space-y-2">
                            {topics.slice(0, visibleCount).map((topic) => (
                                <TopicRowItem key={topic.id} topic={topic} />
                            ))}
                            {hasMore && (
                                <div ref={sentinelRef} className="py-3 text-center text-xs text-slate-400">
                                    Loading more topics...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-sm text-slate-500">
                            You are not following any topics yet.
                        </div>
                    )}
                </div>

                <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-center">
                    <Link
                        className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                        onClick={onClose}
                        state={{ initialEntityType: "topics" }}
                        to={ROUTES.SEARCH}
                    >
                        + Follow more topics
                    </Link>
                </footer>
            </section>
        </div>
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
                to={buildDetailTrailUrl("topics", topic.id, [], "newfeed")}
                onClick={() => {
                    persistRootDetailNavigation("topics", topic.id, "newfeed");
                }}
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const recentAuthors = authors.slice(0, 3);

    return (
        <>
            <SidebarCard title="Followed Authors">
                {recentAuthors.length > 0 ? (
                    <div className="space-y-2">
                        {recentAuthors.map((author) => (
                            <AuthorRowItem key={author.id} author={author} />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-500">You are not following any authors yet.</p>
                )}
                <button
                    className="mt-4 block w-full text-center text-xs font-bold text-blue-600 transition hover:text-blue-700"
                    onClick={() => setIsDialogOpen(true)}
                    type="button"
                >
                    View all followed authors ({authors.length})
                </button>
            </SidebarCard>

            {isDialogOpen && (
                <FollowedAuthorsDialog
                    authors={authors}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </>
    );
}

function FollowedAuthorsDialog({
    authors,
    onClose,
}: {
    authors: FollowedAuthor[];
    onClose: () => void;
}) {
    const [visibleCount, setVisibleCount] = useState(FOLLOWED_ITEMS_BATCH_SIZE);
    const hasMore = visibleCount < authors.length;

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const loadMore = useCallback(() => {
        setVisibleCount((current) => Math.min(current + FOLLOWED_ITEMS_BATCH_SIZE, authors.length));
    }, [authors.length]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
            onMouseDown={onClose}
        >
            <section
                aria-labelledby="followed-authors-title"
                aria-modal="true"
                className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
            >
                <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 id="followed-authors-title" className="text-base font-bold text-slate-900">
                            Followed Authors
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {authors.length} {authors.length === 1 ? "author" : "authors"}
                        </p>
                    </div>
                    <button
                        aria-label="Close followed authors"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {authors.length > 0 ? (
                        <div className="space-y-2">
                            {authors.slice(0, visibleCount).map((author) => (
                                <AuthorRowItem key={author.id} author={author} />
                            ))}
                            {hasMore && (
                                <div ref={sentinelRef} className="py-3 text-center text-xs text-slate-400">
                                    Loading more authors...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-sm text-slate-500">
                            You are not following any authors yet.
                        </div>
                    )}
                </div>

                <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-center">
                    <Link
                        className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                        onClick={onClose}
                        state={{ initialEntityType: "authors" }}
                        to={ROUTES.SEARCH}
                    >
                        + Follow more authors
                    </Link>
                </footer>
            </section>
        </div>
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
                to={buildDetailTrailUrl("authors", author.id, [], "newfeed")}
                onClick={() => {
                    persistRootDetailNavigation("authors", author.id, "newfeed");
                }}
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

