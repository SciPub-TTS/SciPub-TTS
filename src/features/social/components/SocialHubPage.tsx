import {
  useRef,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Check,
  Clock3,
  FileText,
  Heart,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import { buildDetailTrailUrl } from "@/features/detail/detailTrail";
import { socialApi } from "@/features/social/services/social.api";
import {
  decodeJwtSubject,
  findSocialPostInPage,
  normalizeIdentityValue,
  updateSocialPostPageLikeState,
} from "@/features/social/utils/socialQueryUtils";
import type {
  CreateSocialPostRequest,
  LikeToggleResponse,
  SocialPostDetail,
  SocialPostPageResponse,
  SocialPostReferenceInfo,
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

type ToggleLikeMutationVariables = {
  fallbackLikeCount: number;
  fallbackLiked: boolean;
  postId: string;
};

type ToggleLikeMutationContext = {
  previousNewestPosts?: SocialPostPageResponse;
  previousTopPosts?: SocialPostPageResponse;
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
  "bg-[radial-gradient(circle_at_top_right,_rgba(163,230,53,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(0,92,185,0.12),_transparent_30%),linear-gradient(180deg,#FFFFFF_0%,#F8FCFA_100%)]";

const SURFACE_CARD_CLASS =
  "rounded-[2rem] border border-black bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]";

const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400";

const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-black bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

const TAG_PILL_CLASS =
  "rounded-full bg-[#A3E635]/20 px-3 py-1.5 font-subtext text-sm text-[#14532D] ring-1 ring-[#059669]/40";

const INPUT_CLASS =
  "w-full rounded-xl border border-black bg-slate-50/60 px-4 text-base text-black outline-none placeholder:text-slate-400 focus:border-[#14532D] focus:bg-white";

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

const SOCIAL_NEWEST_QUERY_KEY = ["social", "newest"] as const;
const SOCIAL_TOP_QUERY_KEY = ["social", "top"] as const;

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

function normalizeReferenceEntityId(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  const segments = normalizedValue.split("/");
  return segments[segments.length - 1].toUpperCase();
}

function buildReferenceAuthorEntries(reference: SocialPostReferenceInfo) {
  const authorNames = reference.authorsSnapshot
    .split(",")
    .map((author) => author.trim())
    .filter((author) => author.length > 0);

  return authorNames.map((name, index) => ({
    id: normalizeReferenceEntityId(reference.authorOpenAlexIdsSnapshot[index]),
    name,
  }));
}

function buildSocialDetailHref(
  entityType: "authors" | "topics" | "works",
  entityId: string,
) {
  return buildDetailTrailUrl(entityType, entityId, [], "social-hub");
}

function SocialReferenceCard({
  reference,
  titleClassName,
}: {
  reference: SocialPostReferenceInfo;
  titleClassName: string;
}) {
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const authorEntries = buildReferenceAuthorEntries(reference);
  const hasAuthors = authorEntries.length > 0;
  const visibleAuthors = showAllAuthors
    ? authorEntries
    : authorEntries.slice(0, 3);
  const hasMoreAuthors = authorEntries.length > 3;
  const topicLabel = reference.topicSnapshot?.trim() || null;
  const topicId = normalizeReferenceEntityId(reference.topicOpenAlexIdSnapshot);
  const workTitle = reference.titleSnapshot?.trim() || reference.openalexId;
  const topicBadgeClassName =
    "inline-flex items-center rounded-full border border-[#D6B37A] bg-[#FFF7ED] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A16207] transition hover:border-[#B45309] hover:text-[#92400E]";

  return (
    <div className="rounded-[1rem] bg-white px-4 py-3">
      {topicLabel ? (
        topicId ? (
          <Link
            to={buildSocialDetailHref("topics", topicId)}
            className={topicBadgeClassName}
          >
            {topicLabel}
          </Link>
        ) : (
          <span className={topicBadgeClassName}>{topicLabel}</span>
        )
      ) : null}

      <p className={`${topicLabel ? "mt-2" : ""} ${titleClassName}`}>
        <Link
          to={buildSocialDetailHref("works", reference.openalexId)}
          className="transition hover:text-[#0EA5E9] hover:underline"
        >
          {workTitle}
        </Link>
      </p>

      <div className="font-subtext mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-[#A16207]">
        {hasAuthors
          ? visibleAuthors.map((author, index) => (
              <span key={`${reference.id}-author-${author.name}-${index}`}>
                {author.id ? (
                  <Link
                    to={buildSocialDetailHref("authors", author.id)}
                    className="transition hover:text-[#92400E] hover:underline"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="text-inherit">
                    {author.name}
                  </span>
                )}
                {index < visibleAuthors.length - 1 ? ", " : ""}
              </span>
            ))
          : null}

        {hasMoreAuthors ? (
          <button
            type="button"
            onClick={() => setShowAllAuthors((previous) => !previous)}
            className="ml-1 inline-flex items-center text-xs font-bold text-[#14532D] underline-offset-2 hover:text-[#15803D] hover:underline"
          >
            {showAllAuthors ? "Show less" : "Show more"}
          </button>
        ) : null}

        {hasAuthors && reference.yearSnapshot ? <span>•</span> : null}
        {hasAuthors && reference.yearSnapshot ? (
          <span>{reference.yearSnapshot}</span>
        ) : null}
        {!hasAuthors ? (
          <span>
            {formatReferenceMetadata(
              reference.authorsSnapshot,
              reference.yearSnapshot,
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SocialReferenceList({
  references,
  titleClassName,
  wrapperClassName,
}: {
  references: SocialPostReferenceInfo[];
  titleClassName: string;
  wrapperClassName: string;
}) {
  if (references.length === 0) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#005CB9]">
        Papers added
      </p>
      <div className="mt-3">
        {references.map((reference, index) => (
          <div key={reference.id}>
            <SocialReferenceCard
              reference={reference}
              titleClassName={titleClassName}
            />

            {index < references.length - 1 ? (
              <div className="mx-3 my-3 h-px bg-gradient-to-r from-transparent via-[#D6B37A] to-transparent" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
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
    references: Array.isArray(post.references)
      ? post.references.map((reference) => ({
          ...reference,
          authorOpenAlexIdsSnapshot: Array.isArray(
            reference.authorOpenAlexIdsSnapshot,
          )
            ? reference.authorOpenAlexIdsSnapshot
            : [],
          topicOpenAlexIdSnapshot: reference.topicOpenAlexIdSnapshot ?? null,
          topicSnapshot: reference.topicSnapshot ?? null,
        }))
      : [],
    topicTag: Array.isArray(post.topicTag) ? post.topicTag : [],
    updatedAt: post.updatedAt ?? null,
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
        className={`flex items-center justify-center rounded-full bg-[#14532D] text-sm font-semibold text-white ${sizeClassName}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-full bg-[#EEF6FF] ${sizeClassName}`}>
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
        className="hidden h-full w-full items-center justify-center bg-[#14532D] text-sm font-semibold text-white"
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
    nextPosts.sort((left, right) => {
      if (right.likeCount !== left.likeCount) {
        return right.likeCount - left.likeCount;
      }

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
  const normalizedCurrentUserId = normalizeIdentityValue(currentUserId);

  return posts.filter((post) => {
    const matchesTab =
      tab === "all" ||
      (
        tab === "my-posts"
        && normalizedCurrentUserId
          ? normalizeIdentityValue(post.author.id) === normalizedCurrentUserId
          : false
      );

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
      <div className="flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[1.65rem] border border-black bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-black px-6 py-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#14532D]">
              Research community
            </p>
            <h2 className="font-search-title mt-2 text-[2rem] leading-none text-[#059669]">
              {modalTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#EEF6FF] hover:text-[#005CB9]"
            aria-label="Close social blog modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Blog title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={onChangeTitle}
                placeholder="e.g. What I learned re-reading the Transformer paper"
                className={`h-12 ${INPUT_CLASS}`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Write your insight
              </label>
              <textarea
                rows={5}
                value={form.body}
                onChange={onChangeBody}
                placeholder="Share your notes, takeaways, or open questions for the community..."
                className={`${INPUT_CLASS} resize-none py-4`}
              />
            </div>

            <div className="rounded-[1.2rem] border border-black bg-slate-50/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#005CB9]">
                    Bookmarks
                  </p>
                  <p className="mt-2 text-[1.05rem] font-semibold text-black">
                    Add papers from Bookmarks
                  </p>
                  <p className="font-subtext mt-1 text-sm text-slate-500">
                    Select bookmarked papers. Their keywords will appear automatically.
                  </p>
                  <p className="font-subtext mt-1 text-xs text-slate-400">
                    You can add up to 3 bookmarked papers to one blog post.
                  </p>
                </div>

                <div className="rounded-full bg-[#EEF6FF] px-3 py-1 text-sm font-semibold text-[#005CB9] ring-1 ring-[#005CB9]/20">
                  {form.selectedOpenAlexIds.length} selected
                </div>
              </div>

              <div className="mt-4 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                {isLoadingBookmarks ? (
                  <div className="rounded-[1rem] border border-dashed border-black bg-white px-4 py-6 text-center text-slate-500">
                    Loading bookmarked papers...
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="rounded-[1rem] border border-dashed border-black bg-white px-4 py-6 text-center text-slate-500">
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
                            ? "border-[#14532D] bg-[#A3E635]/15"
                            : "border-black bg-white hover:border-[#14532D] hover:bg-[#EEF6FF]/60"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "border-[#14532D] bg-[#14532D] text-white"
                              : "border-black/20 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black">
                            {bookmark.title}
                          </p>
                          <p className="font-subtext mt-1 text-sm text-slate-500">
                            {bookmark.authors}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {extractKeywordsFromTopic(bookmark.topic).map((keyword) => (
                              <span
                                key={`${bookmark.id}-${keyword}`}
                                className={TAG_PILL_CLASS}
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
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Keywords from selected papers
              </label>
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-[1rem] border border-black bg-slate-50/60 px-3 py-3">
                {selectedKeywords.length > 0 ? (
                  selectedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className={TAG_PILL_CLASS}
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

          <div className="flex shrink-0 items-center gap-3 border-t border-black bg-white px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${SECONDARY_BUTTON_CLASS}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${PRIMARY_BUTTON_CLASS}`}
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
  isDeleteLoading,
  isLikeLoading,
  isOpeningEdit,
  onDelete,
  onEdit,
  onToggleLike,
  post,
}: {
  currentUserId?: string;
  isDeleteLoading: boolean;
  isLikeLoading: boolean;
  isOpeningEdit: boolean;
  onDelete: (postId: string) => void;
  onEdit: (postId: string) => void;
  onToggleLike: (post: SocialPostSummary) => void;
  post: SocialPostSummary;
}) {
  const tags = normalizeTags(post.topicTag);
  const canManagePost =
    normalizeIdentityValue(currentUserId) === normalizeIdentityValue(post.author.id);
  const references = post.references ?? [];

  return (
    <article className="rounded-[1.85rem] border border-black bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <SocialAvatar
            fullName={post.author.fullName}
            seed={post.author.id}
            sizeClassName="h-12 w-12"
          />

          <div>
            <p className="text-[1.08rem] font-semibold text-black">
              {post.author.fullName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 className="h-4 w-4" />
          <span>{formatPostedAt(post.createdAt, post.updatedAt)}</span>
        </div>
      </div>

      <h3 className="font-search-title mt-6 text-[2.35rem] leading-[1.08] text-[#14532D]">
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
              className={TAG_PILL_CLASS}
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      ) : null}

      <SocialReferenceList
        references={references}
        titleClassName="text-sm font-semibold text-black"
        wrapperClassName="mt-5 rounded-[1.25rem] border border-black bg-slate-50/60 px-4 py-4"
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleLike(post)}
            disabled={isLikeLoading}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              post.liked
                ? "border-[#F33E58] bg-[#FDECEF] text-[#F33E58]"
                : "border-black bg-white text-black hover:border-[#F33E58] hover:bg-[#F33E58] hover:text-white"
            } ${isLikeLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
            {post.likeCount}
          </button>
        </div>

        {canManagePost ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(post.id)}
              disabled={isOpeningEdit || isDeleteLoading}
              className={`${SECONDARY_BUTTON_CLASS} ${
                isOpeningEdit || isDeleteLoading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(post.id)}
              disabled={isDeleteLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#DC2626] bg-white px-4 py-3 text-sm font-semibold text-[#DC2626] transition hover:bg-[#DC2626] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                isDeleteLoading ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function SocialHubPage() {
  const queryClient = useQueryClient();
  const { accessToken, currentUser } = useAuthSession();

  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogModalMode, setBlogModalMode] = useState<BlogModalMode>("create");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormState>(initialBlogForm);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [pendingLikePostIds, setPendingLikePostIds] = useState<string[]>([]);
  const [pendingDeletePostId, setPendingDeletePostId] = useState<string | null>(null);
  const pendingLikePostIdsRef = useRef<Set<string>>(new Set());

  const newestPostsQuery = useQuery({
    queryFn: () => socialApi.getNewest(0, 20),
    queryKey: SOCIAL_NEWEST_QUERY_KEY,
    retry: false,
  });

  const topPostsQuery = useQuery({
    queryFn: () => socialApi.getTop(0, 5),
    queryKey: SOCIAL_TOP_QUERY_KEY,
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

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => socialApi.deletePost(postId),
    onMutate: (postId: string) => {
      setPendingDeletePostId(postId);
    },
    onSuccess: (_response, postId) => {
      if (editingPostId === postId) {
        resetBlogModal();
      }

      void queryClient.invalidateQueries({ queryKey: ["social"] });
    },
    onError: (error) => {
      setBlogError(
        getApiErrorMessage(
          error,
          "Cannot delete this post right now. Please try again.",
        ),
      );
    },
    onSettled: () => {
      setPendingDeletePostId(null);
    },
  });

  const newestPosts = newestPostsQuery.data?.content ?? [];
  const normalizedNewestPosts = newestPosts.map(normalizeSocialPost);
  const topPosts = (topPostsQuery.data?.content ?? []).map(normalizeSocialPost);
  const bookmarkOptions = bookmarksQuery.data ?? [];

  const toggleLikeMutation = useMutation<
    LikeToggleResponse,
    Error,
    ToggleLikeMutationVariables,
    ToggleLikeMutationContext
  >({
    mutationFn: ({ postId }) => socialApi.toggleLike(postId),
    onMutate: async ({ fallbackLikeCount, fallbackLiked, postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: SOCIAL_NEWEST_QUERY_KEY }),
        queryClient.cancelQueries({ queryKey: SOCIAL_TOP_QUERY_KEY }),
      ]);

      const previousNewestPosts = queryClient.getQueryData<SocialPostPageResponse>(
        SOCIAL_NEWEST_QUERY_KEY,
      );
      const previousTopPosts = queryClient.getQueryData<SocialPostPageResponse>(
        SOCIAL_TOP_QUERY_KEY,
      );

      const currentPost =
        findSocialPostInPage(previousNewestPosts, postId)
        ?? findSocialPostInPage(previousTopPosts, postId);
      const currentLikeCount = currentPost?.likeCount ?? fallbackLikeCount;
      const currentLiked = currentPost?.liked ?? fallbackLiked;
      const optimisticState: LikeToggleResponse = {
        liked: !currentLiked,
        likeCount: Math.max(0, currentLikeCount + (currentLiked ? -1 : 1)),
      };

      queryClient.setQueryData<SocialPostPageResponse | undefined>(
        SOCIAL_NEWEST_QUERY_KEY,
        (current) => updateSocialPostPageLikeState(current, postId, optimisticState),
      );
      queryClient.setQueryData<SocialPostPageResponse | undefined>(
        SOCIAL_TOP_QUERY_KEY,
        (current) => updateSocialPostPageLikeState(current, postId, optimisticState),
      );
      return {
        previousNewestPosts,
        previousTopPosts,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNewestPosts) {
        queryClient.setQueryData(SOCIAL_NEWEST_QUERY_KEY, context.previousNewestPosts);
      }

      if (context?.previousTopPosts) {
        queryClient.setQueryData(SOCIAL_TOP_QUERY_KEY, context.previousTopPosts);
      }

    },
    onSuccess: (response, { postId }) => {
      queryClient.setQueryData<SocialPostPageResponse | undefined>(
        SOCIAL_NEWEST_QUERY_KEY,
        (current) => updateSocialPostPageLikeState(current, postId, response),
      );
      queryClient.setQueryData<SocialPostPageResponse | undefined>(
        SOCIAL_TOP_QUERY_KEY,
        (current) => updateSocialPostPageLikeState(current, postId, response),
      );
    },
    onSettled: (_response, _error, variables) => {
      if (!variables) {
        return;
      }

      pendingLikePostIdsRef.current.delete(variables.postId);
      setPendingLikePostIds((previous) =>
        previous.filter((currentPostId) => currentPostId !== variables.postId),
      );
      void queryClient.invalidateQueries({ queryKey: SOCIAL_NEWEST_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SOCIAL_TOP_QUERY_KEY });
    },
  });

  const enrichedNewestPosts = normalizedNewestPosts;
  const enrichedTopPosts = topPosts;
  const featuredPost = enrichedTopPosts[0] ?? enrichedNewestPosts[0] ?? null;

  const currentUserId = (
    normalizeIdentityValue(currentUser?.id)
    ?? decodeJwtSubject(accessToken)
    ?? undefined
  );

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

  function handleToggleLike(post: SocialPostSummary) {
    if (pendingLikePostIdsRef.current.has(post.id)) {
      return;
    }

    pendingLikePostIdsRef.current.add(post.id);
    setPendingLikePostIds((previous) =>
      previous.includes(post.id) ? previous : [...previous, post.id],
    );

    toggleLikeMutation.mutate({
      fallbackLikeCount: post.likeCount,
      fallbackLiked: post.liked,
      postId: post.id,
    });
  }

  function handleDeletePost(postId: string) {
    if (deletePostMutation.isPending) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this post? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    setBlogError(null);
    deletePostMutation.mutate(postId);
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
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10">
          <section
            className={`rounded-[2rem] border border-black px-8 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] ${HERO_GRADIENT}`}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[640px]">
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Explore - Community Research Notes
                </p>
                <h1 className="font-search-title mt-3 text-[4.5rem] leading-[0.95] text-[#059669]">
                  Share Research. <span className="text-[#14532D]">Spark</span>
                  <br />
                  <span className="text-[#14532D]">Discussion.</span>
                </h1>

                <p className="font-subtext mt-6 max-w-[520px] text-[1.1rem] leading-9 text-slate-500">
                  Turn bookmarked papers into public research notes and discover
                  what others are reading.
                </p>

              </div>

              <button
                type="button"
                onClick={openCreateBlogModal}
                className="inline-flex h-12 items-center gap-3 rounded-lg bg-[#14532D] px-6 text-base font-semibold text-white transition hover:bg-[#15803D]"
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
            <div className={`${SURFACE_CARD_CLASS} p-7`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A3E635]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#14532D] ring-1 ring-[#059669]/40">
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
                        <p className="text-[1.1rem] font-semibold text-black">
                          {featuredPost.author.fullName}
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

                  <h2 className="font-search-title mt-7 max-w-4xl text-[3rem] leading-[1.02] text-[#14532D]">
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
                          className={TAG_PILL_CLASS}
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <SocialReferenceList
                    references={featuredPost.references}
                    titleClassName="text-base font-semibold text-black"
                    wrapperClassName="mt-6 rounded-[1.4rem] border border-black bg-slate-50/60 px-5 py-5"
                  />

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(featuredPost)}
                        disabled={pendingLikePostIds.includes(featuredPost.id)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                          featuredPost.liked
                            ? "border-[#F33E58] bg-[#FDECEF] text-[#F33E58]"
                            : "border-black bg-white text-black hover:border-[#F33E58] hover:bg-[#F33E58] hover:text-white"
                        } ${
                          pendingLikePostIds.includes(featuredPost.id)
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${featuredPost.liked ? "fill-current" : ""}`}
                        />
                        {featuredPost.likeCount}
                      </button>
                    </div>

                    {normalizeIdentityValue(currentUserId) === normalizeIdentityValue(featuredPost.author.id) ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditBlogModal(featuredPost.id)}
                          disabled={
                            openEditPostMutation.isPending
                            || pendingDeletePostId === featuredPost.id
                          }
                          className={`${SECONDARY_BUTTON_CLASS} ${
                            openEditPostMutation.isPending
                            || pendingDeletePostId === featuredPost.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePost(featuredPost.id)}
                          disabled={pendingDeletePostId === featuredPost.id}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#DC2626] bg-white px-4 py-3 text-sm font-semibold text-[#DC2626] transition hover:bg-[#DC2626] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                            pendingDeletePostId === featuredPost.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-black/10 bg-slate-50 px-6 py-10 text-center text-slate-500">
                  {isLoading ? "Loading featured post..." : "No featured posts yet."}
                </div>
              )}
            </div>

            <aside className={`${SURFACE_CARD_CLASS} p-7`}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7E8] text-[#D4A017]">
                  <Trophy className="h-5 w-5" />
                </div>

                <h2 className="font-search-title text-[2rem] leading-none text-[#059669]">
                  Top liked this week
                </h2>
              </div>

              <div className="mt-8 space-y-5">
                {topLikedPosts.length > 0 ? (
                  topLikedPosts.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-4">
                      <div className="font-title w-6 text-right text-xl text-[#14532D]">
                        {index + 1}
                      </div>

                      <SocialAvatar
                        fullName={entry.author.fullName}
                        seed={entry.author.id}
                        sizeClassName="h-11 w-11 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-black">
                          {entry.title}
                        </p>
                        <p className="font-subtext text-sm text-slate-500">
                          {entry.author.fullName}
                        </p>
                      </div>

                      <div className="font-subtext flex items-center gap-1 text-sm text-[#F33E58]">
                        <Heart className="h-3.5 w-3.5 fill-current text-[#F33E58]" />
                        {entry.likeCount}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-black bg-slate-50/60 px-5 py-8 text-center text-slate-500">
                    {isLoading ? "Loading top liked posts..." : "No liked posts yet."}
                  </div>
                )}
              </div>
            </aside>
          </section>

          <section>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Community feed
                </p>
                <h2 className="font-search-title mt-3 text-[2.5rem] leading-none text-[#059669]">
                  Community Sharing
                </h2>
              </div>

              <div className="inline-flex items-center gap-4 self-start rounded-[1.45rem] border border-black bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:self-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7E8] text-[#D4A017]">
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

            <div className="mt-6 flex flex-col gap-4 rounded-[1.8rem] border border-black bg-white px-4 py-3 shadow-[0_14px_45px_rgba(15,23,42,0.05)] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={[
                        "rounded-[0.95rem] border border-black px-4 py-2 text-sm font-semibold transition",
                        isActive
                          ? "bg-[#14532D] text-white"
                          : "bg-slate-200 text-black hover:bg-slate-300",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="flex min-w-[320px] items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-400 shadow-sm ring-1 ring-[#2f8551]">
                  <Search className="h-4 w-4" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={handleBlogModalKeyDown}
                    placeholder="Search posts, tags, or authors..."
                    className="w-full border-0 bg-transparent text-sm font-medium text-black outline-none placeholder:text-black"
                  />
                </label>

                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="h-10 rounded-sm border border-black bg-white px-4 text-sm font-semibold text-black outline-none"
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
                    isDeleteLoading={pendingDeletePostId === post.id}
                    isLikeLoading={pendingLikePostIds.includes(post.id)}
                    isOpeningEdit={openEditPostMutation.isPending}
                    onDelete={handleDeletePost}
                    onEdit={openEditBlogModal}
                    onToggleLike={handleToggleLike}
                    post={post}
                  />
                ))
              ) : (
                <div className="rounded-[1.7rem] border border-dashed border-black bg-slate-50/60 px-6 py-12 text-center text-slate-500 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
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
