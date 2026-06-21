import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Heart,
  Pencil,
  Plus,
  Search,
  Trophy,
  X,
} from "lucide-react";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import { socialApi } from "@/features/social/services/social.api";
import type {
  CreateSocialPostRequest,
  SocialPostDetail,
  SocialPostSummary,
  UpdateSocialPostRequest,
} from "@/features/social/types/social.types";

type FeedTab = "all" | "my-posts";
type SortMode = "newest" | "most-liked";
type BlogModalMode = "create" | "edit";

type BlogFormState = {
  title: string;
  body: string;
  selectedOpenAlexIds: string[];
};

type BlogModalProps = {
  bookmarks: BookmarkResponse[];
  errorMessage: string | null;
  form: BlogFormState;
  isLoadingBookmarks: boolean;
  isSubmitting: boolean;
  mode: BlogModalMode;
  open: boolean;
  selectedKeywords: string[];
  onChangeBody: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleBookmark: (openAlexId: string) => void;
};

const HERO_GRADIENT =
  "bg-[radial-gradient(circle_at_top_right,_rgba(17,211,164,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(31,175,255,0.12),_transparent_28%),linear-gradient(180deg,#FFFFFF_0%,#FCFFFE_100%)]";

const tabs: { label: string; value: FeedTab }[] = [
  { label: "All Posts", value: "all" },
  { label: "My Posts", value: "my-posts" },
];

const DICEBEAR_ADVENTURER_BASE_URL = "https://api.dicebear.com/9.x/adventurer/svg";

const initialBlogForm: BlogFormState = {
  title: "",
  body: "",
  selectedOpenAlexIds: [],
};

function getAuthorInitials(fullName?: string | null) {
  if (!fullName) {
    return "U";
  }

  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function buildSocialAvatarUrl(seed?: string | null) {
  const normalizedSeed = String(seed ?? "").trim();

  if (!normalizedSeed) {
    return null;
  }

  return `${DICEBEAR_ADVENTURER_BASE_URL}?seed=${encodeURIComponent(normalizedSeed)}`;
}

function getDisplayTime(createdAt: string, updatedAt?: string | null) {
  return updatedAt ?? createdAt;
}

function formatPostedAt(createdAt: string, updatedAt?: string | null) {
  const displayTime = getDisplayTime(createdAt, updatedAt);
  const createdTime = new Date(displayTime).getTime();

  if (Number.isNaN(createdTime)) {
    return "Recently";
  }

  const differenceInMilliseconds = Date.now() - createdTime;
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60),
  );

  if (differenceInHours < 1) {
    return "Just now";
  }

  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  return new Date(displayTime).toLocaleDateString();
}

function normalizeTags(tags: string[] | null | undefined) {
  if (!tags) {
    return [];
  }

  return tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

function formatReferenceMetadata(authors: string, year: number | null) {
  if (authors && year) {
    return `${authors} • ${year}`;
  }

  if (authors) {
    return authors;
  }

  if (year) {
    return String(year);
  }

  return "Bookmarked paper";
}

function normalizeSocialPost(post: SocialPostSummary): SocialPostSummary {
  const fallbackId = post.id || crypto.randomUUID();
  const authorId = post.author?.id ? String(post.author.id) : fallbackId;
  const authorName =
    typeof post.author?.fullName === "string" && post.author.fullName.trim()
      ? post.author.fullName
      : "Unknown user";

  return {
    ...post,
    author: {
      id: authorId,
      fullName: authorName,
    },
    createdAt: post.createdAt || new Date().toISOString(),
    references: Array.isArray(post.references) ? post.references : [],
    topicTag: Array.isArray(post.topicTag) ? post.topicTag : [],
    updatedAt: post.updatedAt ?? null,
  };
}

function mergeSummaryWithDetail(
  post: SocialPostSummary,
  detail?: SocialPostDetail,
): SocialPostSummary {
  if (!detail) {
    return post;
  }

  return {
    ...post,
    references:
      post.references.length > 0 ? post.references : (detail.references ?? []),
    topicTag: post.topicTag.length > 0 ? post.topicTag : (detail.topicTag ?? []),
    updatedAt: detail.updatedAt ?? post.updatedAt,
  };
}

function SocialAvatar({
  fullName,
  seed,
  sizeClassName,
}: {
  fullName: string;
  seed: string;
  sizeClassName: string;
}) {
  const avatarUrl = buildSocialAvatarUrl(seed);
  const initials = getAuthorInitials(fullName) || "U";

  if (!avatarUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white ${sizeClassName}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-full bg-emerald-50 ${sizeClassName}`}>
      <img
        src={avatarUrl}
        alt={fullName}
        className="h-full w-full object-cover"
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLSpanElement | null;
          if (fallback) {
            fallback.style.display = "flex";
          }
        }}
      />
      <span
        className="hidden h-full w-full items-center justify-center bg-emerald-600 text-sm font-semibold text-white"
      >
        {initials}
      </span>
    </div>
  );
}

function extractKeywordsFromTopic(topic: string | null | undefined) {
  if (!topic) {
    return [];
  }

  return topic
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
}

function buildKeywordsFromBookmarks(bookmarks: BookmarkResponse[]) {
  const uniqueKeywords = new Set<string>();

  for (const bookmark of bookmarks) {
    const keywords = extractKeywordsFromTopic(bookmark.topic);

    for (const keyword of keywords) {
      if (!uniqueKeywords.has(keyword)) {
        uniqueKeywords.add(keyword);
      }
    }
  }

  return Array.from(uniqueKeywords);
}

function buildTopicTagValue(keywords: string[]) {
  if (keywords.length === 0) {
    return null;
  }

  return keywords.join(",");
}

function sortPosts(posts: SocialPostSummary[], sortMode: SortMode) {
  const nextPosts = [...posts];

  if (sortMode === "most-liked") {
    nextPosts.sort((left, right) => right.likeCount - left.likeCount);
    return nextPosts;
  }

  nextPosts.sort((left, right) => {
    const rightTime = new Date(
      getDisplayTime(right.createdAt, right.updatedAt),
    ).getTime();
    const leftTime = new Date(
      getDisplayTime(left.createdAt, left.updatedAt),
    ).getTime();

    return rightTime - leftTime;
  });

  return nextPosts;
}

function filterPosts(
  posts: SocialPostSummary[],
  tab: FeedTab,
  query: string,
  currentUserId?: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesTab =
      tab === "all" ||
      (tab === "my-posts" && currentUserId ? post.author.id === currentUserId : false);

    const tags = normalizeTags(post.topicTag);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.author.fullName.toLowerCase().includes(normalizedQuery) ||
      post.bodyPreview.toLowerCase().includes(normalizedQuery) ||
      tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesTab && matchesQuery;
  });
}

function BlogEditorModal(props: BlogModalProps) {
  const {
    bookmarks,
    errorMessage,
    form,
    isLoadingBookmarks,
    isSubmitting,
    mode,
    open,
    selectedKeywords,
    onChangeBody,
    onChangeTitle,
    onClose,
    onSubmit,
    onToggleBookmark,
  } = props;

  if (!open) {
    return null;
  }

  const modalTitle =
    mode === "edit" ? "Edit Research Blog" : "Create Research Blog";
  const submitLabel = mode === "edit" ? "Save changes" : "Publish";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[1.65rem] border border-black/12 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-5">
          <h2 className="font-search-title text-[2rem] leading-none text-black">
            {modalTitle}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-black"
            aria-label="Close social blog modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label className="font-text mb-2 block text-[1.05rem] font-semibold text-black">
                Blog title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={onChangeTitle}
                placeholder="e.g. What I learned re-reading the Transformer paper"
                className="h-12 w-full rounded-[1rem] border border-black/12 bg-[#FBFBFD] px-4 text-base text-black outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="font-text mb-2 block text-[1.05rem] font-semibold text-black">
                Write your insight...
              </label>
              <textarea
                rows={5}
                value={form.body}
                onChange={onChangeBody}
                placeholder="Share your notes, takeaways, or open questions for the community..."
                className="w-full resize-none rounded-[1rem] border border-black/12 bg-[#FBFBFD] px-4 py-4 text-base text-black outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="rounded-[1.2rem] border border-black/10 bg-[#FBFBFD] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-text text-[1.05rem] font-semibold text-black">
                    Add papers from Bookmarks
                  </p>
                  <p className="font-subtext mt-1 text-sm text-slate-500">
                    Select bookmarked papers. Their keywords will appear automatically.
                  </p>
                  <p className="font-subtext mt-1 text-xs text-slate-400">
                    You can add up to 3 bookmarked papers to one blog post.
                  </p>
                </div>

                <div className="rounded-full bg-[#E8FBF4] px-3 py-1 text-sm font-semibold text-[#0AAA6E]">
                  {form.selectedOpenAlexIds.length} selected
                </div>
              </div>

              <div className="mt-4 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                {isLoadingBookmarks ? (
                  <div className="rounded-[1rem] border border-dashed border-black/10 bg-white px-4 py-6 text-center text-slate-500">
                    Loading bookmarked papers...
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="rounded-[1rem] border border-dashed border-black/10 bg-white px-4 py-6 text-center text-slate-500">
                    No bookmarked papers yet.
                  </div>
                ) : (
                  bookmarks.map((bookmark) => {
                    const isSelected = form.selectedOpenAlexIds.includes(
                      bookmark.openAlexId,
                    );

                    return (
                      <button
                        key={bookmark.id}
                        type="button"
                        onClick={() => onToggleBookmark(bookmark.openAlexId)}
                        className={`flex w-full items-start gap-3 rounded-[1rem] border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-[#0AAA6E] bg-[#F2FFF9]"
                            : "border-black/10 bg-white"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "border-[#0AAA6E] bg-[#08C67B] text-black"
                              : "border-black/20 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-text text-sm font-semibold text-black">
                            {bookmark.title}
                          </p>
                          <p className="font-subtext mt-1 text-sm text-slate-500">
                            {bookmark.authors}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {extractKeywordsFromTopic(bookmark.topic).map((keyword) => (
                              <span
                                key={`${bookmark.id}-${keyword}`}
                                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-black"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label className="font-text mb-2 block text-[1.05rem] font-semibold text-black">
                Keywords from selected papers
              </label>
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-[1rem] border border-black/12 bg-[#FBFBFD] px-3 py-3">
                {selectedKeywords.length > 0 ? (
                  selectedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-full bg-[#DDF8EE] px-3 py-1 text-sm font-medium text-[#0A9D74]"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    Choose bookmarked papers to display their keywords here.
                  </span>
                )}
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3 border-t border-black/8 bg-white px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[1rem] border border-black/12 bg-white px-5 py-3.5 text-base font-semibold text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 rounded-[1rem] bg-[#08C67B] px-5 py-3.5 text-base font-semibold text-black shadow-[0_14px_28px_rgba(8,198,123,0.2)] ${
                isSubmitting ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PostCard({
  currentUserId,
  isLikeLoading,
  isOpeningEdit,
  onEdit,
  onToggleLike,
  post,
}: {
  currentUserId?: string;
  isLikeLoading: boolean;
  isOpeningEdit: boolean;
  onEdit: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  post: SocialPostSummary;
}) {
  const tags = normalizeTags(post.topicTag);
  const canEdit = currentUserId === post.author.id;
  const references = post.references ?? [];

  return (
    <article className="rounded-[1.85rem] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <SocialAvatar
            fullName={post.author.fullName}
            seed={post.author.id}
            sizeClassName="h-12 w-12"
          />

          <div>
            <p className="font-text text-[1.08rem] font-semibold text-black">
              {post.author.fullName}
            </p>
            <p className="font-subtext text-sm text-slate-500">
              Research community member
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 className="h-4 w-4" />
          <span>{formatPostedAt(post.createdAt, post.updatedAt)}</span>
        </div>
      </div>

      <h3 className="font-search-title mt-6 text-[2.45rem] leading-[1.08] text-black">
        {post.title}
      </h3>

      <p className="font-subtext mt-4 text-[1.1rem] leading-9 text-slate-500">
        {post.bodyPreview}
      </p>

      {tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={`${post.id}-${tag}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 font-subtext text-sm text-slate-600"
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      ) : null}

      {references.length > 0 ? (
        <div className="mt-5 rounded-[1.25rem] border border-black/8 bg-slate-50 px-4 py-4">
          <p className="font-text text-sm font-semibold uppercase tracking-[0.16em] text-black/70">
            Papers added
          </p>
          <div className="mt-3 space-y-3">
            {references.map((reference) => (
              <div key={reference.id} className="rounded-[1rem] bg-white px-4 py-3">
                <p className="font-text text-sm font-semibold text-black">
                  {reference.titleSnapshot}
                </p>
                <p className="font-subtext mt-1 text-sm text-slate-500">
                  {formatReferenceMetadata(
                    reference.authorsSnapshot,
                    reference.yearSnapshot,
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            disabled={isLikeLoading}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-base transition ${
              post.liked
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-black/10 bg-white text-slate-600"
            } ${isLikeLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
            {post.likeCount}
          </button>

          {canEdit ? (
            <button
              type="button"
              onClick={() => onEdit(post.id)}
              disabled={isOpeningEdit}
              className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-base font-semibold text-black ${
                isOpeningEdit ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[1rem] bg-black px-6 py-3 text-base font-semibold text-white"
        >
          Read post
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function SocialHubPage() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthSession();

  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogModalMode, setBlogModalMode] = useState<BlogModalMode>("create");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormState>(initialBlogForm);
  const [blogError, setBlogError] = useState<string | null>(null);

  const newestPostsQuery = useQuery({
    queryFn: () => socialApi.getNewest(0, 20),
    queryKey: ["social", "newest"],
    retry: false,
  });

  const topPostsQuery = useQuery({
    queryFn: () => socialApi.getTop(0, 5),
    queryKey: ["social", "top"],
    retry: false,
  });

  const bookmarksQuery = useQuery({
    enabled: isBlogModalOpen,
    queryFn: async () => {
      const response = await bookmarkApi.getList({
        page: 0,
        size: 100,
        sort: "RECENT",
      });

      return response.data.items;
    },
    queryKey: ["social", "bookmark-options"],
    retry: false,
  });

  const openEditPostMutation = useMutation({
    mutationFn: (postId: string) => socialApi.getPostDetail(postId),
    onError: (error) => {
      setBlogError(
        getApiErrorMessage(
          error,
          "Cannot open this post for editing right now. Please try again.",
        ),
      );
    },
    onSuccess: (postDetail: SocialPostDetail) => {
      setBlogModalMode("edit");
      setEditingPostId(postDetail.id);
      setBlogForm({
        title: postDetail.title,
        body: postDetail.body,
        selectedOpenAlexIds: postDetail.references.map(
          (reference) => reference.openalexId,
        ),
      });
      setBlogError(null);
      setIsBlogModalOpen(true);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (postId: string) => socialApi.toggleLike(postId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social"] });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: CreateSocialPostRequest) => socialApi.createPost(payload),
    onSuccess: () => {
      resetBlogModal();
      void queryClient.invalidateQueries({ queryKey: ["social"] });
    },
    onError: (error) => {
      setBlogError(
        getApiErrorMessage(
          error,
          "Cannot publish this research blog right now. Please try again.",
        ),
      );
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({
      payload,
      postId,
    }: {
      payload: UpdateSocialPostRequest;
      postId: string;
    }) => socialApi.updatePost(postId, payload),
    onSuccess: () => {
      resetBlogModal();
      void queryClient.invalidateQueries({ queryKey: ["social"] });
    },
    onError: (error) => {
      setBlogError(
        getApiErrorMessage(
          error,
          "Cannot save blog changes right now. Please try again.",
        ),
      );
    },
  });

  const newestPosts = newestPostsQuery.data?.content ?? [];
  const normalizedNewestPosts = newestPosts.map(normalizeSocialPost);
  const topPosts = (topPostsQuery.data?.content ?? []).map(normalizeSocialPost);
  const bookmarkOptions = bookmarksQuery.data ?? [];

  const visiblePostIds = useMemo(() => {
    const ids = new Set<string>();

    for (const post of normalizedNewestPosts) {
      ids.add(post.id);
    }

    for (const post of topPosts) {
      ids.add(post.id);
    }

    return Array.from(ids);
  }, [normalizedNewestPosts, topPosts]);

  const postDetailsQuery = useQuery({
    enabled: visiblePostIds.length > 0,
    queryFn: async () => {
      const detailEntries = await Promise.all(
        visiblePostIds.map(async (postId) => {
          const detail = await socialApi.getPostDetail(postId);
          return [postId, detail] as const;
        }),
      );

      return Object.fromEntries(detailEntries) as Record<string, SocialPostDetail>;
    },
    queryKey: ["social", "details", visiblePostIds],
    retry: false,
  });

  const postDetailsMap = postDetailsQuery.data ?? {};
  const enrichedNewestPosts = normalizedNewestPosts.map((post) =>
    mergeSummaryWithDetail(post, postDetailsMap[post.id]),
  );
  const enrichedTopPosts = topPosts.map((post) =>
    mergeSummaryWithDetail(post, postDetailsMap[post.id]),
  );
  const featuredPost = enrichedTopPosts[0] ?? enrichedNewestPosts[0] ?? null;

  const currentUserId =
    currentUser?.id !== undefined && currentUser?.id !== null
      ? String(currentUser.id)
      : undefined;

  const selectedBookmarks = useMemo(() => {
    return bookmarkOptions.filter((bookmark) =>
      blogForm.selectedOpenAlexIds.includes(bookmark.openAlexId),
    );
  }, [blogForm.selectedOpenAlexIds, bookmarkOptions]);

  const selectedKeywords = useMemo(() => {
    return buildKeywordsFromBookmarks(selectedBookmarks);
  }, [selectedBookmarks]);

  const feedPosts = useMemo(() => {
      const filteredPosts = filterPosts(
      enrichedNewestPosts,
      activeTab,
      searchQuery,
      currentUserId,
    );

    return sortPosts(filteredPosts, sortMode);
  }, [activeTab, currentUserId, enrichedNewestPosts, searchQuery, sortMode]);

  const topLikedPosts = useMemo(() => enrichedTopPosts.slice(0, 5), [enrichedTopPosts]);

  function resetBlogModal() {
    setIsBlogModalOpen(false);
    setBlogModalMode("create");
    setEditingPostId(null);
    setBlogForm(initialBlogForm);
    setBlogError(null);
  }

  function openCreateBlogModal() {
    setBlogModalMode("create");
    setEditingPostId(null);
    setBlogForm(initialBlogForm);
    setBlogError(null);
    setIsBlogModalOpen(true);
  }

  function openEditBlogModal(postId: string) {
    if (openEditPostMutation.isPending) {
      return;
    }

    setBlogError(null);
    openEditPostMutation.mutate(postId);
  }

  function closeBlogModal() {
    if (createPostMutation.isPending || updatePostMutation.isPending) {
      return;
    }

    resetBlogModal();
  }

  function updateBlogField(field: "title" | "body") {
    return (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const nextValue = event.target.value;

      setBlogForm((previous) => ({
        ...previous,
        [field]: nextValue,
      }));
    };
  }

  function toggleBookmarkSelection(openAlexId: string) {
    setBlogForm((previous) => {
      const isSelected = previous.selectedOpenAlexIds.includes(openAlexId);

      if (isSelected) {
        return {
          ...previous,
          selectedOpenAlexIds: previous.selectedOpenAlexIds.filter(
            (id) => id !== openAlexId,
          ),
        };
      }

      if (previous.selectedOpenAlexIds.length >= 3) {
        setBlogError("You can add up to 3 bookmarked papers to one blog post.");
        return previous;
      }

      return {
        ...previous,
        selectedOpenAlexIds: [...previous.selectedOpenAlexIds, openAlexId],
      };
    });
  }

  function handleBlogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = blogForm.title.trim();
    const normalizedBody = blogForm.body.trim();
    const topicTag = buildTopicTagValue(selectedKeywords);

    if (!normalizedTitle || !normalizedBody) {
      setBlogError("Please enter both title and content before saving.");
      return;
    }

    if (normalizedTitle.length < 10 || normalizedTitle.length > 300) {
      setBlogError("Title must be between 10 and 300 characters.");
      return;
    }

    if (normalizedBody.length < 20) {
      setBlogError("Body must be at least 20 characters.");
      return;
    }

    if (blogForm.selectedOpenAlexIds.length > 3) {
      setBlogError("You can add up to 3 bookmarked papers to one blog post.");
      return;
    }

    if (topicTag && topicTag.length > 500) {
      setBlogError(
        "Selected keywords are too long for one post. Please choose fewer papers.",
      );
      return;
    }

    const payload = {
      title: normalizedTitle,
      body: normalizedBody,
      topicTag,
      references: blogForm.selectedOpenAlexIds,
    };

    setBlogError(null);

    if (blogModalMode === "edit" && editingPostId) {
      updatePostMutation.mutate({
        payload,
        postId: editingPostId,
      });
      return;
    }

    createPostMutation.mutate(payload);
  }

  function handleToggleLike(postId: string) {
    if (toggleLikeMutation.isPending) {
      return;
    }

    toggleLikeMutation.mutate(postId);
  }

  function handleBlogModalKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  const isLoading = newestPostsQuery.isPending || topPostsQuery.isPending;
  const isSubmittingBlog =
    createPostMutation.isPending || updatePostMutation.isPending;

  const hasError = newestPostsQuery.isError || topPostsQuery.isError;
  const errorMessage = newestPostsQuery.error
    ? getApiErrorMessage(
        newestPostsQuery.error,
        "Cannot load community posts right now.",
      )
    : topPostsQuery.error
      ? getApiErrorMessage(
          topPostsQuery.error,
          "Cannot load top liked posts right now.",
        )
      : null;

  return (
    <div className="min-h-screen bg-[#F8FBFA] px-6 py-8">
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10">
          <section
            className={`rounded-[2rem] border border-black/10 px-8 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] ${HERO_GRADIENT}`}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[640px]">
                <h1 className="font-search-title text-[4.5rem] leading-[0.95] text-black">
                  Share Research. <span className="text-[#08B978]">Spark</span>
                  <br />
                  <span className="text-[#08B978]">Discussion.</span>
                </h1>

                <p className="font-subtext mt-6 max-w-[520px] text-[1.1rem] leading-9 text-slate-500">
                  Turn bookmarked papers into public research notes and discover
                  what others are reading.
                </p>

                <div className="mt-8 inline-flex items-center gap-4 rounded-[1.45rem] border border-black/10 bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8FBF4] text-[#0AAA6E]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-search-title text-3xl leading-none text-black">
                      {newestPostsQuery.data?.totalElements ?? 0}
                    </p>
                    <p className="font-subtext mt-1 text-sm text-slate-500">
                      Posts
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateBlogModal}
                className="inline-flex h-12 items-center gap-3 rounded-[1.05rem] border border-[#0AAA6E] bg-[#08C67B] px-6 text-base font-semibold text-black shadow-[0_16px_30px_rgba(8,198,123,0.24)]"
              >
                <Plus className="h-5 w-5" />
                Create Blog
              </button>
            </div>
          </section>

          {hasError ? (
            <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
              {errorMessage}
            </section>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E9FBF5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0AAA6E]">
                <Heart className="h-3.5 w-3.5" />
                Most liked this week
              </div>

              {featuredPost ? (
                <>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <SocialAvatar
                        fullName={featuredPost.author.fullName}
                        seed={featuredPost.author.id}
                        sizeClassName="h-12 w-12"
                      />

                      <div>
                        <p className="font-text text-[1.1rem] font-semibold text-black">
                          {featuredPost.author.fullName}
                        </p>
                        <p className="font-subtext text-sm text-slate-500">
                          Research community member
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      <span>
                        {formatPostedAt(
                          featuredPost.createdAt,
                          featuredPost.updatedAt,
                        )}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-search-title mt-7 max-w-4xl text-[3rem] leading-[1.02] text-black">
                    {featuredPost.title}
                  </h2>

                  <p className="font-subtext mt-5 max-w-4xl text-[1.1rem] leading-9 text-slate-500">
                    {featuredPost.bodyPreview}
                  </p>

                  {normalizeTags(featuredPost.topicTag).length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {normalizeTags(featuredPost.topicTag).map((tag) => (
                        <span
                          key={`featured-${tag}`}
                          className="rounded-full bg-slate-100 px-3 py-1.5 font-subtext text-sm text-slate-600"
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {featuredPost.references.length > 0 ? (
                    <div className="mt-6 rounded-[1.4rem] border border-black/8 bg-slate-50 px-5 py-5">
                      <p className="font-text text-sm font-semibold uppercase tracking-[0.16em] text-black/70">
                        Papers added
                      </p>
                      <div className="mt-4 space-y-3">
                        {featuredPost.references.map((reference) => (
                          <div
                            key={reference.id}
                            className="rounded-[1rem] bg-white px-4 py-3"
                          >
                            <p className="font-text text-base font-semibold text-black">
                              {reference.titleSnapshot}
                            </p>
                            <p className="font-subtext mt-1 text-sm text-slate-500">
                              {formatReferenceMetadata(
                                reference.authorsSnapshot,
                                reference.yearSnapshot,
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(featuredPost.id)}
                        disabled={toggleLikeMutation.isPending}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-base ${
                          featuredPost.liked
                            ? "border-rose-200 bg-rose-50 text-rose-600"
                            : "border-black/10 bg-white text-slate-600"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${featuredPost.liked ? "fill-current" : ""}`}
                        />
                        {featuredPost.likeCount}
                      </button>

                      {currentUserId === featuredPost.author.id ? (
                        <button
                          type="button"
                          onClick={() => openEditBlogModal(featuredPost.id)}
                          disabled={openEditPostMutation.isPending}
                          className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-base font-semibold text-black ${
                            openEditPostMutation.isPending
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-[1rem] bg-black px-6 py-3 text-base font-semibold text-white"
                    >
                      Read post
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-black/10 bg-slate-50 px-6 py-10 text-center text-slate-500">
                  {isLoading ? "Loading featured post..." : "No featured posts yet."}
                </div>
              )}
            </div>

            <aside className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1D9] text-[#F59E0B]">
                  <Trophy className="h-5 w-5" />
                </div>

                <h2 className="font-search-title text-[2rem] leading-none text-black">
                  Top liked this week
                </h2>
              </div>

              <div className="mt-8 space-y-5">
                {topLikedPosts.length > 0 ? (
                  topLikedPosts.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-4">
                      <div className="font-title w-6 text-right text-xl text-[#F59E0B]">
                        {index + 1}
                      </div>

                      <SocialAvatar
                        fullName={entry.author.fullName}
                        seed={entry.author.id}
                        sizeClassName="h-11 w-11 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-text truncate text-base font-semibold text-black">
                          {entry.title}
                        </p>
                        <p className="font-subtext text-sm text-slate-500">
                          {entry.author.fullName}
                        </p>
                      </div>

                      <div className="font-subtext flex items-center gap-1 text-sm text-rose-500">
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        {entry.likeCount}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-black/10 bg-slate-50 px-5 py-8 text-center text-slate-500">
                    {isLoading ? "Loading top liked posts..." : "No liked posts yet."}
                  </div>
                )}
              </div>
            </aside>
          </section>

          <section>
            <div>
              <h2 className="font-search-title text-[2.5rem] leading-none text-black">
                Community Sharing
              </h2>
              <p className="font-subtext mt-3 text-[1.05rem] text-slate-500">
                Insights from the Owlreka research community
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-[1.8rem] border border-black/10 bg-white px-4 py-3 shadow-[0_14px_45px_rgba(15,23,42,0.05)] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2 rounded-[1.15rem] bg-slate-50 p-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={[
                        "rounded-[0.95rem] px-4 py-2 text-sm font-semibold transition",
                        isActive
                          ? "bg-white text-black shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="flex min-w-[320px] items-center gap-3 rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-slate-400">
                  <Search className="h-4 w-4" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={handleBlogModalKeyDown}
                    placeholder="Search posts, tags, or authors..."
                    className="w-full border-0 bg-transparent text-sm text-black outline-none"
                  />
                </label>

                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="most-liked">Most liked</option>
                </select>
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-[640px] flex-col gap-6">
              {feedPosts.length > 0 ? (
                feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    currentUserId={currentUserId}
                    isLikeLoading={toggleLikeMutation.isPending}
                    isOpeningEdit={openEditPostMutation.isPending}
                    onEdit={openEditBlogModal}
                    onToggleLike={handleToggleLike}
                    post={post}
                  />
                ))
              ) : (
                <div className="rounded-[1.7rem] border border-dashed border-black/10 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
                  {isLoading
                    ? "Loading community posts..."
                    : "No posts match this filter yet."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <BlogEditorModal
        bookmarks={bookmarkOptions}
        errorMessage={blogError}
        form={blogForm}
        isLoadingBookmarks={bookmarksQuery.isPending}
        isSubmitting={isSubmittingBlog}
        mode={blogModalMode}
        open={isBlogModalOpen}
        selectedKeywords={selectedKeywords}
        onChangeBody={updateBlogField("body")}
        onChangeTitle={updateBlogField("title")}
        onClose={closeBlogModal}
        onSubmit={handleBlogSubmit}
        onToggleBookmark={toggleBookmarkSelection}
      />
    </div>
  );
}
