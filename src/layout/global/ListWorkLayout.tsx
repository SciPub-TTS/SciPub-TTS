import {
  Bookmark,
  Building2,
  CalendarDays,
  Eye,
  ExternalLink,
  FileText,
  Quote,
  Share2,
  Tags,
  Users,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import { useWorkBookmark } from "@/features/bookmarks/hooks/useWorkBookmark";
import {
  buildDetailTrailUrl,
  buildNextDetailUrl,
  getDetailContextFromRouteParams,
  persistNextDetailNavigation,
  persistRootDetailNavigation,
  type DetailOrigin,
} from "@/features/detail/detailTrail";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import type { PaperResultEntityRef } from "@/features/search/types";
import MetadataBadge from "./MetadataBadge";
import { SafeActionDialog } from "./SafeActionDialog";
import WorkBookmarkCollectionDialog from "./WorkBookmarkCollectionDialog";

type ListWorkLayoutProps = {
  abstractText: string;
  abstractLabel?: string;
  authors: string[];
  authorRefs?: PaperResultEntityRef[];
  citations: number;
  detailHref: string;
  detailOrigin?: DetailOrigin;
  doi: string;
  field: string;
  feedReasonText?: string;
  followedAuthors?: string[];
  isSaved?: boolean;
  keywords: string[];
  workId: string;
  pdfUrl: string | null;
  preserveSearchStateOnDetailClick?: boolean;
  source: string;
  subField: string;
  title: string;
  topic: string;
  topicRef?: PaperResultEntityRef | null;
  year: number;
  onBookmarkClick?: () => void;
};

function formatDisplayNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getPreviewText(text: string, limit: number) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim()}...`;
}

function getDisplayDoi(doi: string, limit: number) {
  if (doi.length <= limit) {
    return doi;
  }

  if (limit <= 3) {
    return doi.slice(0, limit);
  }

  return `${doi.slice(0, limit - 3).trim()}...`;
}

function copyTextWithFallback(value: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    return navigator.clipboard.writeText(value);
  }

  if (typeof document === "undefined") {
    return Promise.reject(new Error("Clipboard is not available."));
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!copied) {
      return Promise.reject(new Error("Copy command was not successful."));
    }

    return Promise.resolve();
  } catch {
    document.body.removeChild(textArea);
    return Promise.reject(new Error("Copy command was not successful."));
  }
}

export default function ListWorkLayout({
  abstractText,
  abstractLabel = "Abstract",
  authors,
  authorRefs = [],
  citations,
  detailHref,
  detailOrigin = "search",
  doi,
  field,
  feedReasonText,
  followedAuthors = [],
  isSaved = false,
  keywords,
  workId,
  pdfUrl,
  preserveSearchStateOnDetailClick = true,
  source,
  subField,
  title,
  topic,
  topicRef = null,
  year,
  onBookmarkClick,
}: ListWorkLayoutProps) {
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());
  const { accessToken } = useAuthSession();
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showRemoveBookmarkDialog, setShowRemoveBookmarkDialog] = useState(false);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [shareLabel, setShareLabel] = useState("Share");
  const shareResetTimeoutRef = useRef<number | null>(null);
  const collectionsQuery = useQuery({
    enabled: Boolean(accessToken) && showBookmarkDialog,
    queryFn: async () => {
      const response = await bookmarkApi.getCollections();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.collections(),
    staleTime: 60_000,
  });
  const authorItems =
    authorRefs.length > 0
      ? authorRefs
      : authors.map((authorName) => ({ id: null, name: authorName }));

  const {
    bookmarkButtonLabel,
    collections,
    handleBookmarkClick: handleWorkBookmarkClick,
    isBookmarkActionPending,
    isSaved: savedState,
  } = useWorkBookmark({
    authors,
    authorOpenAlexIds: authorItems.map((author) => author.id),
    citations,
    initialSaved: isSaved,
    knownCollections: collectionsQuery.data ?? [],
    onSuccess: onBookmarkClick,
    openAlexId: workId,
    source,
    title,
    topic: topicRef?.name || topic,
    topicOpenAlexId: topicRef?.id ?? null,
    workType: field,
    year,
  });

  const bookmarkClassName = savedState
    ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
    : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

  const visibleAuthors = showAllAuthors ? authorItems : authorItems.slice(0, 3);
  const hasMoreAuthors = authorItems.length > 3;
  const normalizedDoi = doi.trim();
  const displayDoi = getDisplayDoi(normalizedDoi, 30);
  const hasDoi = normalizedDoi.length > 0;
  const hasPdfUrl = Boolean(pdfUrl && pdfUrl.trim().length > 0);
  const canExpandAbstract = abstractText.length > 520;
  const visibleAbstract = showFullAbstract
    ? abstractText
    : getPreviewText(abstractText, 520);
  const abstractPreviewStyle: CSSProperties | undefined = showFullAbstract
    ? undefined
    : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 5,
        overflow: "hidden",
      };
  const normalizedFollowedAuthors = followedAuthors.map((author) =>
    author.trim().toLocaleLowerCase(),
  );
  const entityNavigationOnClick = preserveSearchStateOnDetailClick
    ? markSearchPageRestorePending
    : undefined;
  const resolvedDetailHref = currentDetailContext
    ? buildNextDetailUrl(
        location.search,
        currentDetailContext.entityType,
        currentDetailContext.entityId,
        "works",
        workId,
      )
    : detailHref;

  function buildEntityHref(
    entityType: "authors" | "topics",
    entityId: string,
  ) {
    if (!currentDetailContext) {
      return buildDetailTrailUrl(entityType, entityId, detailOrigin);
    }

    return buildNextDetailUrl(
      location.search,
      currentDetailContext.entityType,
      currentDetailContext.entityId,
      entityType,
      entityId,
    );
  }

  function isFollowedAuthor(author: string) {
    return normalizedFollowedAuthors.includes(
      author.trim().toLocaleLowerCase(),
    );
  }

  function handleDetailNavigation(
    entityType: "authors" | "topics" | "works",
    entityId: string,
  ) {
    if (!currentDetailContext) {
      persistRootDetailNavigation(entityType, entityId, detailOrigin);
      return;
    }

    persistNextDetailNavigation(
      location.search,
      currentDetailContext.entityType,
      currentDetailContext.entityId,
      entityType,
      entityId,
    );
  }

  async function handleBookmarkButtonClick() {
    if (savedState) {
      setShowRemoveBookmarkDialog(true);
      return;
    }

    if (!accessToken) {
      void handleWorkBookmarkClick();
      return;
    }

    setSelectedCollectionIds([]);
    setShowBookmarkDialog(true);
  }

  async function handleBookmarkConfirm() {
    const didSave = await handleWorkBookmarkClick(selectedCollectionIds);

    if (didSave) {
      setShowBookmarkDialog(false);
      setSelectedCollectionIds([]);
    }
  }

  async function handleRemoveBookmarkConfirm() {
    const didRemove = await handleWorkBookmarkClick();

    if (didRemove) {
      setShowRemoveBookmarkDialog(false);
    }
  }

  function toggleCollectionSelection(collectionId: string) {
    setSelectedCollectionIds((currentCollectionIds) =>
      currentCollectionIds.includes(collectionId)
        ? currentCollectionIds.filter((id) => id !== collectionId)
        : [...currentCollectionIds, collectionId],
    );
  }

  useEffect(
    () => () => {
      if (
        typeof window !== "undefined" &&
        shareResetTimeoutRef.current !== null
      ) {
        window.clearTimeout(shareResetTimeoutRef.current);
      }
    },
    [],
  );

  function scheduleShareLabelReset() {
    if (typeof window === "undefined") {
      return;
    }

    if (shareResetTimeoutRef.current !== null) {
      window.clearTimeout(shareResetTimeoutRef.current);
    }

    shareResetTimeoutRef.current = window.setTimeout(() => {
      setShareLabel("Share");
      shareResetTimeoutRef.current = null;
    }, 6000);
  }

  async function handleShareClick() {
    const shareUrl =
      typeof window !== "undefined"
        ? new URL(detailHref, window.location.origin).toString()
        : detailHref;

    try {
      await copyTextWithFallback(shareUrl);
      setShareLabel("Copied link!");
      scheduleShareLabelReset();
    } catch {
      setShareLabel("Copy failed");
      scheduleShareLabelReset();
    }
  }

  return (
    <>
    <article className="rounded-2xl border border-black bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <MetadataBadge tone="accent" label={subField} />

          {topicRef?.id ? (
            (() => {
              const topicId = topicRef.id;

              return (
            <Link
              to={buildEntityHref("topics", topicId)}
              onClick={() => {
                handleDetailNavigation("topics", topicId);
                entityNavigationOnClick?.();
              }}
              className="transition hover:-translate-y-0.5"
            >
              <MetadataBadge
                label={topicRef.name}
                tone="topic"
              />
            </Link>
              );
            })()
          ) : (
            <MetadataBadge
              label={topic}
              tone="topic"
            />
          )}

          <MetadataBadge tone="default" label={field} />
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-[0.24em] text-black">
          <CalendarDays className="h-3.5 w-3.5 tracking-normal" />
          {year}
        </span>
      </div>

      <h3 className="text-[22px] font-semibold leading-snug text-black">
        {title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-black">
        <span className="inline-flex min-w-0 items-center gap-1">
          <Users className="h-4 w-4 text-black" />
          <span className="break-words">
            {visibleAuthors.map((author, index) => (
              <span key={`${author.name}-${author.id || index}`}>
                {author.id ? (
                  (() => {
                    const authorId = author.id;

                    return (
                  <Link
                    to={buildEntityHref("authors", authorId)}
                    onClick={() => {
                      handleDetailNavigation("authors", authorId);
                      entityNavigationOnClick?.();
                    }}
                    className={[
                      "text-blue-700 transition hover:text-blue-900 hover:underline",
                      isFollowedAuthor(author.name)
                        ? "font-bold underline"
                        : "font-semibold",
                    ].join(" ")}
                  >
                    {author.name}
                  </Link>
                    );
                  })()
                ) : (
                  <span
                    className={
                      isFollowedAuthor(author.name)
                        ? "font-bold underline"
                        : undefined
                    }
                  >
                    {author.name}
                  </span>
                )}
                {index < visibleAuthors.length - 1 ? ", " : ""}
              </span>
            ))}
            {visibleAuthors.length === 0 ? "Unknown authors" : null}
          </span>
        </span>
        {hasMoreAuthors && (
          <button
            type="button"
            onClick={() => setShowAllAuthors(!showAllAuthors)}
            className="inline-flex h-5 items-center text-xs font-bold text-[#14532D] underline-offset-2 hover:underline"
          >
            {showAllAuthors ? "Show less" : "Show more"}
          </button>
        )}
        <span className="text-black">-</span>
        <span className="inline-flex items-center gap-1 text-black">
          <Building2 className="h-4 w-4 text-black" />
          {source}
        </span>
        <span className="text-black">-</span>
        <span className="inline-flex items-center gap-1">
          <Quote className="h-4 w-4 text-black" />
          {formatDisplayNumber(citations)} citations
        </span>
      </div>

      {collections.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-start gap-2">
          {collections.map((collection) => (
            <span
              key={collection.id}
              className="inline-flex max-w-full items-center break-words rounded-md border border-black bg-black px-3 py-1.5 text-[11px] font-semibold text-white"
              title={collection.name}
            >
              {collection.name}
            </span>
          ))}
        </div>
      ) : null}

      {feedReasonText ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-6 text-black">
          <div className="mb-1 flex items-center gap-1 font-bold text-black">
            <FileText className="h-4 w-4" />
            Why this paper:
          </div>
          <p>{feedReasonText}</p>
        </div>
      ) : null}

      <div className="mt-4 text-sm font-medium leading-7 text-black">
        <div className="mb-1 flex items-center gap-1 font-bold text-black">
          <FileText className="h-4 w-4" />
          {abstractLabel}:
        </div>
        <p style={abstractPreviewStyle}>{visibleAbstract}</p>
      </div>

      {canExpandAbstract && (
        <button
          type="button"
          onClick={() => setShowFullAbstract(!showFullAbstract)}
          className="mt-2 text-xs font-bold text-[#14532D] underline-offset-2 hover:text-[#15803D] hover:underline"
        >
          {showFullAbstract ? "Show less" : "Show more"}
        </button>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
          <Tags className="h-3.5 w-3.5" />
          Keyword:
        </span>
        {keywords.map((keyword) => (
          <MetadataBadge
            key={keyword}
            label={`#${keyword}`}
            tone="keyword"
          />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-400 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {hasDoi ? (
          <a
            href={`https://${normalizedDoi}`}
            target="_blank"
            rel="noreferrer"
            title={normalizedDoi}
            className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>{displayDoi}</span>
          </a>
        ) : (
          <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-black">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">No DOI</span>
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            {showBookmarkDialog ? (
              <WorkBookmarkCollectionDialog
                collections={collectionsQuery.data}
                isError={collectionsQuery.isError}
                isLoading={collectionsQuery.isPending}
                isPending={isBookmarkActionPending}
                onCancel={() => {
                  setShowBookmarkDialog(false);
                  setSelectedCollectionIds([]);
                }}
                onConfirm={() => {
                  void handleBookmarkConfirm();
                }}
                onToggleCollection={toggleCollectionSelection}
                selectedCollectionIds={selectedCollectionIds}
              />
            ) : null}

            <button
              type="button"
              disabled={isBookmarkActionPending}
              onClick={() => {
                void handleBookmarkButtonClick();
              }}
              title={savedState ? "Remove bookmark" : "Save bookmark"}
              className={[
                "relative z-20 inline-flex items-center gap-2 rounded-lg border-black px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-70",
                bookmarkClassName,
              ].join(" ")}
            >
              <Bookmark className="h-4 w-4" />
              {bookmarkButtonLabel}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleShareClick();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          >
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </button>

          <Link
            to={resolvedDetailHref}
            onClick={() => {
              handleDetailNavigation("works", workId);
              entityNavigationOnClick?.();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>

          {hasPdfUrl ? (
            <a
              href={pdfUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
            >
              <FileText className="h-4 w-4" />
              PDF
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-slate-400 bg-slate-100 px-3 py-2 text-xs font-bold text-black"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
          )}
        </div>
      </div>
    </article>

    <SafeActionDialog
      confirmLabel="Delete bookmark"
      description={
        <>
          <p>Remove "{title}" from your bookmark library?</p>
          <p>This action cannot be undone.</p>
        </>
      }
      eyebrow="Safe delete"
      isPending={isBookmarkActionPending}
      onClose={() => {
        if (!isBookmarkActionPending) {
          setShowRemoveBookmarkDialog(false);
        }
      }}
      onConfirm={handleRemoveBookmarkConfirm}
      open={showRemoveBookmarkDialog}
      pendingLabel="Deleting bookmark..."
      title="Delete this bookmark?"
      variant="danger"
    />
    </>
  );
}
