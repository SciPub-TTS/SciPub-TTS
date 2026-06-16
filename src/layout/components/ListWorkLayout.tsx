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
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import type { PaperResultEntityRef } from "@/features/search/types";
import MetadataBadge from "@/layout/components/MetadataBadge";

type ListWorkLayoutProps = {
  abstractText: string;
  authors: string[];
  authorRefs?: PaperResultEntityRef[];
  citations: number;
  detailHref: string;
  doi: string;
  field: string;
  followedAuthors?: string[];
  isSaved?: boolean;
  isTrendTopic?: boolean;
  keywords: string[];
  pdfUrl: string | null;
  preserveSearchStateOnDetailClick?: boolean;
  subField: string;
  title: string;
  topic: string;
  topicRef?: PaperResultEntityRef | null;
  venue: string;
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

function copyTextWithFallback(value: string) {
  if (
    typeof navigator !== "undefined"
    && navigator.clipboard
    && typeof navigator.clipboard.writeText === "function"
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
  } catch (error) {
    document.body.removeChild(textArea);
    return Promise.reject(error);
  }
}

export default function ListWorkLayout({
  abstractText,
  authors,
  authorRefs = [],
  citations,
  detailHref,
  doi,
  field,
  followedAuthors = [],
  isSaved = false,
  isTrendTopic = false,
  keywords,
  pdfUrl,
  preserveSearchStateOnDetailClick = true,
  subField,
  title,
  topic,
  topicRef = null,
  venue,
  year,
  onBookmarkClick,
}: ListWorkLayoutProps) {
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const shareResetTimeoutRef = useRef<number | null>(null);
  const authorItems =
    authorRefs.length > 0
      ? authorRefs
      : authors.map((authorName) => ({ id: null, name: authorName }));

  const bookmarkClassName = isSaved
    ? "bg-[#14532D] text-white"
    : "border border-slate-400 bg-white text-black hover:bg-slate-50";

  const visibleAuthors = showAllAuthors ? authorItems : authorItems.slice(0, 3);
  const hasMoreAuthors = authorItems.length > 3;
  const normalizedDoi = doi.trim();
  const hasDoi = normalizedDoi.length > 0;
  const hasPdfUrl = Boolean(pdfUrl && pdfUrl.trim().length > 0);
  const canExpandAbstract = abstractText.length > 520;
  const visibleAbstract = showFullAbstract
    ? abstractText
    : getPreviewText(abstractText, 520);
  const normalizedFollowedAuthors = followedAuthors.map((author) =>
    author.trim().toLocaleLowerCase(),
  );
  const entityNavigationOnClick = preserveSearchStateOnDetailClick
    ? markSearchPageRestorePending
    : undefined;

  function isFollowedAuthor(author: string) {
    return normalizedFollowedAuthors.includes(
      author.trim().toLocaleLowerCase(),
    );
  }

  useEffect(() => () => {
    if (
      typeof window !== "undefined"
      && shareResetTimeoutRef.current !== null
    ) {
      window.clearTimeout(shareResetTimeoutRef.current);
    }
  }, []);

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
    } catch (error) {
      setShareLabel("Copy failed");
      scheduleShareLabelReset();
    }
  }

  return (
    <article className="rounded-2xl border border-black bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <MetadataBadge tone="accent" label={subField} />

          {topicRef?.id ? (
            <Link
              to={routePaths.topicDetail(topicRef.id)}
              onClick={entityNavigationOnClick}
              className="transition hover:-translate-y-0.5"
            >
              <MetadataBadge
                label={topicRef.name}
                tone={isTrendTopic ? "topicTrend" : "topic"}
              />
            </Link>
          ) : (
            <MetadataBadge
              label={topic}
              tone={isTrendTopic ? "topicTrend" : "topic"}
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
                  <Link
                    to={routePaths.authorDetail(author.id)}
                    onClick={entityNavigationOnClick}
                    className={[
                      "text-blue-700 transition hover:text-blue-900 hover:underline",
                      isFollowedAuthor(author.name) ? "font-bold underline" : "font-semibold",
                    ].join(" ")}
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span
                    className={
                      isFollowedAuthor(author.name) ? "font-bold underline" : undefined
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
        <span className="inline-flex items-center gap-1 text-blue-700">
          <Building2 className="h-4 w-4" />
          {venue}
        </span>
        <span className="text-black">-</span>
        <span className="inline-flex items-center gap-1">
          <Quote className="h-4 w-4 text-black" />
          {formatDisplayNumber(citations)} citations
        </span>
      </div>

      <div className="mt-4 text-sm font-medium leading-7 text-black">
        <div className="mb-1 flex items-center gap-1 font-bold text-black">
          <FileText className="h-4 w-4" />
          Abstract:
        </div>
        <p>{visibleAbstract}</p>
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
          <span
            key={keyword}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-black ring-1 ring-slate-300"
          >
            #{keyword}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-400 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {hasDoi ? (
          <a
            href={`https://${normalizedDoi}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">{normalizedDoi}</span>
          </a>
        ) : (
          <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-black">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">No DOI</span>
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBookmarkClick}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition",
              bookmarkClassName,
            ].join(" ")}
          >
            <Bookmark className="h-4 w-4" />
            {isSaved ? "Saved" : "Bookmark"}
          </button>

          <button
            type="button"
            onClick={() => {
              void handleShareClick();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#14532D] bg-white px-3 py-2 text-xs font-bold text-[#14532D] transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          >
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </button>

          <Link
            to={detailHref}
            onClick={entityNavigationOnClick}
            className="inline-flex items-center gap-2 rounded-lg border border-[#14532D] bg-white px-3 py-2 text-xs font-bold text-[#14532D] transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>

          {hasPdfUrl ? (
            <a
              href={pdfUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#16A34A] bg-[#A3E635]/20 px-3 py-2 text-xs font-bold text-[#14532D] transition hover:bg-[#A3E635]/35"
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
  );
}
