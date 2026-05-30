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
  const trendTopicClassName = paper.isTrendTopic
    ? "bg-emerald-950 text-white shadow-sm ring-1 ring-emerald-300"
    : "bg-white text-emerald-900 ring-1 ring-emerald-200";

  const followButtonClassName = paper.isTrendTopic
    ? "border-amber-200 bg-white/10 text-amber-100 hover:bg-white/20"
    : "border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100";

  const bookmarkClassName = paper.saved
    ? "bg-emerald-950 text-white"
    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  const visibleAuthors = showAllAuthors ? paper.authors : paper.authors.slice(0, 3);
  const hasMoreAuthors = paper.authors.length > 3;
  const authorText =
    visibleAuthors.length > 0 ? visibleAuthors.join(", ") : "Unknown authors";
  const hasDoi = paper.doi.trim().length > 0;
  const hasPdfUrl = Boolean(paper.pdfUrl && paper.pdfUrl.trim().length > 0);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.subField}
          </span>

          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase",
              trendTopicClassName,
            ].join(" ")}
          >
            {paper.isTrendTopic && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-emerald-950">
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

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.field}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.growthPercent}% growth
          </span>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold tracking-[0.24em] text-slate-400">
          <CalendarDays className="h-3.5 w-3.5 tracking-normal" />
          {paper.year}
        </span>
      </div>

      <h3 className="text-xl font-semibold leading-snug text-slate-950">
        {paper.title}
      </h3>

      <p className="mt-2 text-sm font-semibold text-slate-700">
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4 text-slate-500" />
          {authorText}
        </span>
        {hasMoreAuthors && (
          <button
            type="button"
            onClick={() => setShowAllAuthors((currentState) => !currentState)}
            className="ml-2 text-xs font-bold text-emerald-900 underline-offset-2 hover:underline"
          >
            {showAllAuthors ? "Show less" : "Show more"}
          </button>
        )}
        <span className="mx-2 text-slate-400">-</span>
        <span className="inline-flex items-center gap-1 text-blue-700">
          <Building2 className="h-4 w-4" />
          {paper.venue}
        </span>
        <span className="mx-2 text-slate-400">-</span>
        <span className="inline-flex items-center gap-1">
          <Quote className="h-4 w-4 text-slate-500" />
          {formatFullNumber(paper.citations)} citations
        </span>
      </p>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
          <FileText className="h-4 w-4" />
          Abstract:
        </span>{" "}
        {paper.abstract}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          <Tags className="h-3.5 w-3.5" />
          Keyword:
        </span>
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
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
          <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-slate-400">
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
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>

          {hasPdfUrl ? (
            <a
              href={paper.pdfUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100"
            >
              <FileText className="h-4 w-4" />
              PDF
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400"
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

/*
SEARCH_FILE_NOTE
Syntax su dung:
- Typed props, JSX render card.
File nay lam gi:
- Hien thi chi tiet 1 paper result (title, authors, citations, doi, pdf, tags).
Flow chay:
- SearchResults map tung paper va truyen vao card nay.
*/

