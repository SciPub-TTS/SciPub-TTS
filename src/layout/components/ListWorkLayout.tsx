import {
  Bookmark,
  Building2,
  CalendarDays,
  Eye,
  ExternalLink,
  FileText,
  Quote,
  Tags,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import MetadataBadge from "@/layout/components/MetadataBadge";

type ListWorkLayoutProps = {
  abstractText: string;
  authors: string[];
  citations: number;
  detailHref: string;
  doi: string;
  field: string;
  followedAuthors?: string[];
  isSaved?: boolean;
  isTrendTopic?: boolean;
  keywords: string[];
  pdfUrl: string | null;
  subField: string;
  title: string;
  topic: string;
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

export default function ListWorkLayout({
  abstractText,
  authors,
  citations,
  detailHref,
  doi,
  field,
  followedAuthors = [],
  isSaved = false,
  isTrendTopic = false,
  keywords,
  pdfUrl,
  subField,
  title,
  topic,
  venue,
  year,
  onBookmarkClick,
}: ListWorkLayoutProps) {
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const bookmarkClassName = isSaved
    ? "bg-[#14532D] text-white"
    : "border border-slate-400 bg-white text-black hover:bg-slate-50";

  const visibleAuthors = showAllAuthors ? authors : authors.slice(0, 3);
  const hasMoreAuthors = authors.length > 3;
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

  function isFollowedAuthor(author: string) {
    return normalizedFollowedAuthors.includes(
      author.trim().toLocaleLowerCase(),
    );
  }

  return (
    <article className="rounded-2xl border border-black bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <MetadataBadge tone="accent" label={subField} />

          <MetadataBadge
            label={topic}
            tone={isTrendTopic ? "topicTrend" : "topic"}
          />

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
              <span key={`${author}-${index}`}>
                <span
                  className={
                    isFollowedAuthor(author) ? "font-bold underline" : undefined
                  }
                >
                  {author}
                </span>
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

          <Link
            to={detailHref}
            onClick={markSearchPageRestorePending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-slate-50"
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
