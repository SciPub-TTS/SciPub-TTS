import {
  Building2,
  Bookmark,
  CalendarDays,
  ExternalLink,
  FileText,
  Eye,
  Plus,
  Quote,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";
import { memo, useState } from "react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";
import type { PaperResultCardProps } from "@/features/search/types";
import { formatFullNumber } from "@/features/search/utils";

function PaperResultCardComponent({ paper }: PaperResultCardProps) {
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const trendTopicClassName = paper.isTrendTopic
    ? "bg-[#14532D] text-white shadow-sm ring-1 ring-[#16A34A]"
    : "bg-white text-[#14532D] ring-1 ring-[#059669]";

  const followButtonClassName = paper.isTrendTopic
    ? "border-amber-300 bg-white/10 text-amber-100 hover:bg-white/20"
    : "border-[#16A34A] bg-[#A3E635]/20 text-[#14532D] hover:bg-[#A3E635]/35";

  const bookmarkClassName = paper.saved
    ? "bg-[#14532D] text-white"
    : "border border-slate-400 bg-white text-black hover:bg-slate-50";
  const visibleAuthors = showAllAuthors
    ? paper.authors
    : paper.authors.slice(0, 3);
  const hasMoreAuthors = paper.authors.length > 3;
  const authorText =
    visibleAuthors.length > 0 ? visibleAuthors.join(", ") : "Unknown authors";
  const hasDoi = paper.doi.trim().length > 0;
  const hasPdfUrl = Boolean(paper.pdfUrl && paper.pdfUrl.trim().length > 0);
  const canExpandAbstract = paper.abstract.length > 520;
  const collapsedAbstractStyle = showFullAbstract
    ? undefined
    : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical" as const,
        WebkitLineClamp: 5,
        overflow: "hidden",
      };

  return (
    <article className="rounded-2xl border border-slate-400 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex min-h-9 items-center rounded-full bg-[#A3E635]/20 px-3 text-[11px] font-bold uppercase leading-none text-[#14532D] ring-1 ring-[#A3E635]/60">
            {paper.subField}
          </span>

          <span
            className={[
              "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-[11px] font-bold uppercase leading-none",
              trendTopicClassName,
            ].join(" ")}
          >
            {paper.isTrendTopic && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[#14532D]">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
            )}

            {paper.topic}

            <button
              type="button"
              aria-label={`Follow ${paper.topic}`}
              className={[
                "inline-flex h-5 w-5 items-center justify-center rounded-full border transition",
                followButtonClassName,
              ].join(" ")}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </span>

          <span className="inline-flex min-h-9 items-center rounded-full bg-[#A3E635]/20 px-3 text-[11px] font-bold uppercase leading-none text-[#14532D] ring-1 ring-[#A3E635]/60">
            {paper.field}
          </span>
          <span className="inline-flex min-h-9 items-center rounded-full bg-[#A3E635]/20 px-3 text-[11px] font-bold uppercase leading-none text-[#14532D] ring-1 ring-[#A3E635]/60">
            {paper.growthPercent}% growth
          </span>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-[0.24em] text-black">
          <CalendarDays className="h-3.5 w-3.5 tracking-normal" />
          {paper.year}
        </span>
      </div>

      <h3 className="text-[22px] font-semibold leading-snug text-black">
        {paper.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-black">
        <span className="inline-flex min-w-0 items-center gap-1">
          <Users className="h-4 w-4 text-black" />
          <span className="break-words">{authorText}</span>
        </span>
        {hasMoreAuthors && (
          <button
            type="button"
            onClick={() => setShowAllAuthors((currentState) => !currentState)}
            className="inline-flex h-5 items-center text-xs font-bold text-[#14532D] underline-offset-2 hover:underline"
          >
            {showAllAuthors ? "Show less" : "Show more"}
          </button>
        )}
        <span className="text-black">-</span>
        <span className="inline-flex items-center gap-1 text-blue-700">
          <Building2 className="h-4 w-4" />
          {paper.venue}
        </span>
        <span className="text-black">-</span>
        <span className="inline-flex items-center gap-1">
          <Quote className="h-4 w-4 text-black" />
          {formatFullNumber(paper.citations)} citations
        </span>
      </div>

      <div className="mt-4 text-sm font-medium leading-7 text-black">
        <div className="mb-1 flex items-center gap-1 font-bold text-black">
          <FileText className="h-4 w-4" />
          Abstract:
        </div>
        <p style={collapsedAbstractStyle}>{paper.abstract}</p>
      </div>
      {canExpandAbstract && (
        <button
          type="button"
          onClick={() => setShowFullAbstract((currentState) => !currentState)}
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
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-black ring-1 ring-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-400 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {hasDoi ? (
          <a
            href={`https://${paper.doi}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">{paper.doi}</span>
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
            className={[
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition",
              bookmarkClassName,
            ].join(" ")}
          >
            <Bookmark className="h-4 w-4" />
            {paper.saved ? "Saved" : "Bookmark"}
          </button>

          <Link
            to={routePaths.paperDetail(paper.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>

          {hasPdfUrl ? (
            <a
              href={paper.pdfUrl || undefined}
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

export const PaperResultCard = memo(PaperResultCardComponent);
