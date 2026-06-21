import {
  Bookmark,
  ExternalLink,
  GitBranch,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { FeedArticle, FeedBadge } from "../types";

type FeedArticleCardProps = {
  article: FeedArticle;
};

export function FeedArticleCard({ article }: FeedArticleCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            {article.relevance}% relevance
          </span>
          {article.badges.map((badge) => (
            <Badge badge={badge} key={`${article.id}-${badge.label}`} />
          ))}
        </div>
        <span className="shrink-0 text-sm font-semibold text-slate-400">
          {article.year}
        </span>
      </div>

      <h2 className="mt-4 text-lg font-bold leading-snug text-slate-950">
        {article.title}
      </h2>

      <p className="mt-2 text-base font-semibold text-blue-600">
        {article.authors.map((author, index) => (
          <span key={author.name}>
            {index > 0 ? <span className="text-slate-400">, </span> : null}
            <span>{author.name}</span>
            {author.following ? (
              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                Following
              </span>
            ) : null}
          </span>
        ))}
        {article.extraAuthors ? (
          <span className="text-sm font-semibold text-blue-500">
            {" "}
            +{article.extraAuthors} more
          </span>
        ) : null}
      </p>

      <p className="mt-1 text-base font-semibold text-blue-600">
        {article.venue}
        <span className="font-medium text-slate-400"> · {article.year}</span>
        <span className="font-medium text-emerald-700">
          {" "}
          · {article.citations} citations
        </span>
      </p>

      <p className="mt-5 text-sm leading-6 text-slate-700">
        {article.abstract}
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
        {article.reason}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-sm font-semibold text-slate-900"
            key={tag}
          >
            #{tag}
            <span className="ml-1 text-emerald-600">+</span>
          </span>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <a
          className="inline-flex max-w-full items-center gap-1 truncate text-sm font-medium text-blue-600 hover:text-blue-700"
          href={article.doiUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="truncate">{article.doiLabel}</span>
        </a>

        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton icon={<Bookmark className="h-4 w-4" />} label="Bookmark" />
          <ActionButton label="View Details" />
          <ActionButton
            icon={<TrendingUp className="h-4 w-4" />}
            label="View Trend"
          />
          <button
            aria-label="Share paper"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            type="button"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Badge({ badge }: { badge: FeedBadge }) {
  const styles = {
    author: "bg-emerald-100 text-emerald-700",
    match: "bg-emerald-600 text-white",
    rising: "bg-amber-100 text-amber-700",
    stable: "bg-slate-100 text-slate-500",
    topic: "bg-blue-100 text-blue-600",
  } satisfies Record<FeedBadge["tone"], string>;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[badge.tone]}`}
    >
      {badge.tone === "rising" ? <GitBranch className="h-3.5 w-3.5" /> : null}
      {badge.label}
    </span>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 sm:text-sm"
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
