import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LoaderCircle,
  Search,
  Tags,
  X,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchJournalDailyArticles } from "@/features/journal/services/journalDaily.api";
import type { JournalArticle } from "@/features/journal/types/journal.types";

const ARTICLES_PER_PAGE = 12;
const AUTO_SLIDE_INTERVAL_MS = 2000;

function formatDisplayDate(value: string) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

type ArticleCardProps = {
  article: JournalArticle;
  onOpen: (article: JournalArticle) => void;
};

function LeadArticleCard({ article, onOpen }: ArticleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      className="group flex h-full w-full cursor-pointer flex-col text-left focus:outline-none focus:ring-4 focus:ring-[#14532D]/15"
    >
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />
      </div>

      <div className="pt-4">
        <span className="font-subtext text-xs font-extrabold uppercase tracking-[0.2em] text-[#14532D]">
          {article.category}
        </span>
        <h2 className="font-title-page mt-2 text-[2.25rem] font-semibold leading-[1] text-black md:text-[2.85rem]">
          {article.title}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 font-subtext text-sm font-semibold text-black/68">
          <span>{article.author}</span>
          <span aria-hidden="true">-</span>
          <span>{formatDisplayDate(article.publishedDate)}</span>
        </div>
      </div>
    </button>
  );
}

function FeaturedStackArticle({ article, onOpen }: ArticleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      className="group grid w-full cursor-pointer gap-3 border-b border-black/15 pb-5 text-left last:border-b-0 last:pb-0 focus:outline-none focus:ring-4 focus:ring-[#14532D]/15"
    >
      <div className="aspect-[16/8] overflow-hidden bg-slate-100">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />
      </div>

      <div>
        <span className="font-subtext text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#14532D]">
          {article.category}
        </span>
        <h3 className="font-title mt-1 text-[1.35rem] font-semibold leading-tight text-black">
          {article.title}
        </h3>
        <p className="font-subtext mt-2 text-sm font-semibold text-black/62">
          {article.author} - {formatDisplayDate(article.publishedDate)}
        </p>
      </div>
    </button>
  );
}

function RailArticleCard({ article, onOpen }: ArticleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      className="group w-full cursor-pointer border-b border-black/15 py-5 text-left first:pt-0 last:border-b-0 focus:outline-none focus:ring-4 focus:ring-[#14532D]/15"
    >
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="min-w-0 pt-4">
        <span className="font-subtext text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#14532D]">
          {article.category}
        </span>
        <h3 className="font-title mt-2 text-[1.28rem] font-semibold leading-tight text-black transition group-hover:text-[#14532D]">
          {article.title}
        </h3>
        <p className="font-subtext mt-3 text-xs font-semibold leading-5 text-black/62">
          {article.author} - {formatDisplayDate(article.publishedDate)}
        </p>
      </div>
    </button>
  );
}

function SearchResultArticleCard({ article, onOpen }: ArticleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      className="group flex h-full min-h-[420px] cursor-pointer flex-col overflow-hidden rounded-lg border border-black bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)] focus:outline-none focus:ring-4 focus:ring-[#14532D]/15"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <span className="font-subtext text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#14532D]">
          {article.category}
        </span>
        <h3 className="font-title mt-3 line-clamp-3 text-[1.45rem] font-semibold leading-tight text-black transition group-hover:text-[#14532D]">
          {article.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 font-subtext text-sm font-semibold text-black/62">
          <span>{article.author}</span>
          <span aria-hidden="true">-</span>
          <span>{formatDisplayDate(article.publishedDate)}</span>
        </div>
      </div>
    </button>
  );
}

type SearchResultGridProps = {
  articles: JournalArticle[];
  onOpenArticle: (article: JournalArticle) => void;
};

function SearchResultGrid({
  articles,
  onOpenArticle,
}: SearchResultGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <SearchResultArticleCard
          key={article.id}
          article={article}
          onOpen={onOpenArticle}
        />
      ))}
    </div>
  );
}

type JournalNewsLayoutProps = {
  articles: JournalArticle[];
  onOpenArticle: (article: JournalArticle) => void;
};

function JournalNewsLayout({ articles, onOpenArticle }: JournalNewsLayoutProps) {
  const leadArticle = articles[0];
  const stackArticles = articles.slice(1, 3);
  const railArticles = articles.slice(3);

  if (!leadArticle) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-black bg-white px-5 py-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,6fr)_minmax(280px,3fr)_minmax(280px,3fr)]">
        <section className="border-black/20 xl:border-r xl:pr-6">
          <LeadArticleCard article={leadArticle} onOpen={onOpenArticle} />
        </section>

        <section className="grid auto-rows-fr gap-5 border-black/20 xl:border-r xl:pr-6">
          {stackArticles.map((article) => (
            <FeaturedStackArticle
              key={article.id}
              article={article}
              onOpen={onOpenArticle}
            />
          ))}
        </section>

        <VerticalArticleCarousel
          articles={railArticles.length > 0 ? railArticles : stackArticles}
          onOpenArticle={onOpenArticle}
        />
      </div>
    </div>
  );
}

type VerticalArticleCarouselProps = {
  articles: JournalArticle[];
  onOpenArticle: (article: JournalArticle) => void;
};

function VerticalArticleCarousel({
  articles,
  onOpenArticle,
}: VerticalArticleCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function getNearestSlideIndex() {
    const track = trackRef.current;

    if (!track || articles.length <= 1) {
      return 0;
    }

    const maxScroll = Math.max(track.scrollHeight - track.clientHeight, 0);

    if (maxScroll === 0) {
      return 0;
    }

    return Math.min(
      Math.round((track.scrollTop / maxScroll) * (articles.length - 1)),
      articles.length - 1,
    );
  }

  function scrollToSlide(index: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = Math.max(track.scrollHeight - track.clientHeight, 0);
    const targetTop =
      articles.length <= 1 ? 0 : (index / (articles.length - 1)) * maxScroll;

    setActiveSlide(index);
    track.scrollTo({
      behavior: "smooth",
      top: targetTop,
    });
  }

  function scrollCarousel(direction: -1 | 1) {
    const nextSlide = Math.min(
      Math.max(getNearestSlideIndex() + direction, 0),
      articles.length - 1,
    );

    scrollToSlide(nextSlide);
  }

  function advanceCarousel() {
    const currentSlide = getNearestSlideIndex();
    const nextSlide =
      currentSlide >= articles.length - 1 ? 0 : currentSlide + 1;

    scrollToSlide(nextSlide);
  }

  function handleCarouselScroll() {
    window.requestAnimationFrame(() => {
      setActiveSlide(getNearestSlideIndex());
    });
  }

  useEffect(() => {
    if (isPaused || articles.length <= 1) {
      return;
    }

    const timerId = window.setInterval(() => {
      advanceCarousel();
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [articles.length, isPaused]);

  useEffect(() => {
    setActiveSlide(0);
    scrollToSlide(0);
  }, [articles]);

  if (articles.length === 0) {
    return null;
  }

  return (
    <aside
      className="relative min-w-0 pr-8"
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-subtext text-xs font-bold uppercase tracking-[0.18em] text-black/55">
          More science news
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous articles"
            title="Previous articles"
            onClick={() => scrollCarousel(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black bg-white text-black transition hover:bg-[#14532D] hover:text-white"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next articles"
            title="Next articles"
            onClick={() => scrollCarousel(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black bg-white text-black transition hover:bg-[#14532D] hover:text-white"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleCarouselScroll}
        className="no-scrollbar max-h-[680px] overflow-y-auto scroll-smooth pr-1"
      >
        {articles.map((article) => (
          <div key={article.id} data-journal-slide>
            <RailArticleCard article={article} onOpen={onOpenArticle} />
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center gap-2">
        {articles.map((article, index) => {
          const isActive = index === activeSlide;

          return (
            <button
              key={article.id}
              type="button"
              aria-label={`Show article ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSlide(index)}
              className={[
                "rounded-full border border-black transition-all duration-300 ease-out",
                isActive
                  ? "h-7 w-3 scale-110 bg-[#14532D]"
                  : "h-2.5 w-2.5 bg-white hover:scale-110 hover:bg-[#14532D]",
              ].join(" ")}
            />
          );
        })}
      </div>
    </aside>
  );
}

function sortArticlesByPublishedDate(articles: JournalArticle[]) {
  return [...articles].sort((firstArticle, secondArticle) => {
    const firstTime = new Date(firstArticle.publishedDate).getTime();
    const secondTime = new Date(secondArticle.publishedDate).getTime();

    return (Number.isNaN(secondTime) ? 0 : secondTime)
      - (Number.isNaN(firstTime) ? 0 : firstTime);
  });
}

function getArticleDedupeKeys(article: JournalArticle) {
  return [
    article.id,
    article.externalId,
    article.sourceUrl,
    article.webUrl,
    article.title,
  ]
    .map((value) => value?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));
}

function dedupeJournalArticles(articles: JournalArticle[]) {
  const seenKeys = new Set<string>();

  return articles.filter((article) => {
    const keys = getArticleDedupeKeys(article);
    const hasDuplicateKey = keys.some((key) => seenKeys.has(key));

    if (hasDuplicateKey) {
      return false;
    }

    keys.forEach((key) => seenKeys.add(key));
    return true;
  });
}

/*
 * The modal starts here; the main page keeps cards scan-friendly and moves
 * article metadata into this focused dialog.
 */

type ArticleMetadataDialogProps = {
  article: JournalArticle | null;
  onClose: () => void;
};

function ArticleMetadataDialog({ article, onClose }: ArticleMetadataDialogProps) {
  if (!article) {
    return null;
  }

  const articleUrl = article.webUrl || article.sourceUrl;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-article-dialog-title"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-black bg-white shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black px-5 py-4">
          <div>
            <p className="font-subtext text-[11px] font-bold uppercase tracking-[0.22em] text-[#14532D]">
              News / Science / Article
            </p>
            <h2
              id="journal-article-dialog-title"
              className="font-title mt-2 text-2xl font-semibold leading-tight text-black"
            >
              {article.title}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close article details"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black bg-white text-black transition hover:bg-black hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(88vh-96px)] overflow-y-auto px-6 py-6 pb-8">
          <div className="aspect-[16/8] overflow-hidden rounded-lg border border-black bg-slate-100">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 font-subtext text-sm font-semibold text-black/62">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#14532D]" />
              {formatDisplayDate(article.publishedDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4 text-[#005CB9]" />
              {article.author}
            </span>
            <span className="rounded-full border border-black bg-white px-3 py-1 font-subtext text-xs font-bold uppercase tracking-[0.12em] text-[#14532D]">
              {article.category}
            </span>
          </div>

          <p className="font-subtext mt-5 text-sm leading-7 text-black/68">
            {article.summary}
          </p>

          {article.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d2bf] bg-[#fbfaf5] px-3 py-1.5 font-subtext text-xs font-semibold text-black/68"
                >
                  <Tags className="h-3.5 w-3.5 text-[#F37021]" />
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 pb-2">
            <a
              href={articleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#14532D] bg-[#14532D] px-4 font-subtext text-sm font-bold text-white transition hover:bg-[#166534]"
            >
              Open article
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyJournalPage() {
  const [searchTitle, setSearchTitle] = useState("");
  const [debouncedSearchTitle, setDebouncedSearchTitle] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(
    null,
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearchTitle(searchTitle.trim());
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [searchTitle]);

  const journalArticlesQuery = useQuery({
    queryFn: () =>
      fetchJournalDailyArticles({
        page: 1,
        pageSize: ARTICLES_PER_PAGE,
        title: debouncedSearchTitle,
      }),
    queryKey: ["journalDailyArticles", debouncedSearchTitle],
  });
  const articlePage = journalArticlesQuery.data;
  const visibleArticles = dedupeJournalArticles(
    sortArticlesByPublishedDate(articlePage?.articles ?? []),
  );
  const totalArticles = articlePage?.totalItems ?? 0;
  const isShowingSearchResults = debouncedSearchTitle.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-8">
      <ArticleMetadataDialog
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <section className="overflow-hidden rounded-[2rem] border border-black bg-[linear-gradient(135deg,#fbfaf5_0%,#ffffff_52%,#edf7f2_100%)] shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <div className="grid gap-6 px-5 py-7 md:px-8 md:py-9 xl:grid-cols-[minmax(0,1fr)_150px] xl:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
              Science News - Editorial Briefing
            </p>
            <h1 className="font-title-page mt-3 text-4xl font-normal leading-[1.05] text-[#14532D] md:text-5xl xl:whitespace-nowrap">
              Daily Journal
            </h1>
            <p className="font-subtext mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Science articles are sourced from{" "}
              <a
                href="https://open-platform.theguardian.com/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#14532D] underline decoration-[#14532D]/35 underline-offset-4 transition hover:text-[#166534] hover:decoration-[#166534]"
              >
                The Guardian Open Platform
              </a>
              , filtered by news pillar, article type, science or technology
              sections, and research-focused keywords for the Daily Journal
              feed.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.25rem] border border-black bg-white px-4 py-4">
              <p className="text-xs font-bold text-black/52">Articles</p>
              <p className="font-title mt-1 text-3xl font-bold text-black">
                {totalArticles}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.25rem] border border-black bg-white px-4 py-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <label className="flex min-h-14 items-center gap-3 rounded-lg border border-black bg-white px-4">
          <Search className="h-5 w-5 shrink-0 text-[#14532D]" />
          <input
            type="search"
            value={searchTitle}
            onChange={(event) => setSearchTitle(event.target.value)}
            placeholder="Search article title..."
            className="font-subtext min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-black/40"
          />
        </label>
      </section>

      <section className="mt-6">
        {journalArticlesQuery.isLoading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] border border-black bg-white px-6 py-12 text-center">
            <LoaderCircle className="h-10 w-10 animate-spin text-[#14532D]" />
            <h2 className="font-title mt-4 text-2xl font-semibold text-black">
              Loading science articles
            </h2>
            <p className="font-subtext mt-2 max-w-md text-sm leading-7 text-black/58">
              Fetching the latest Guardian science news from the backend.
            </p>
          </div>
        ) : journalArticlesQuery.isError ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/30 bg-white px-6 py-12 text-center">
            <ExternalLink className="h-10 w-10 text-[#14532D]" />
            <h2 className="font-title mt-4 text-2xl font-semibold text-black">
              Cannot load journal articles
            </h2>
            <p className="font-subtext mt-2 max-w-md text-sm leading-7 text-black/58">
              The backend article feed is not reachable right now.
            </p>
          </div>
        ) : visibleArticles.length > 0 ? (
          isShowingSearchResults ? (
            <SearchResultGrid
              articles={visibleArticles}
              onOpenArticle={setSelectedArticle}
            />
          ) : (
            <JournalNewsLayout
              articles={visibleArticles}
              onOpenArticle={setSelectedArticle}
            />
          )
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/30 bg-white px-6 py-12 text-center">
            <ExternalLink className="h-10 w-10 text-[#14532D]" />
            <h2 className="font-title mt-4 text-2xl font-semibold text-black">
              No journal items found
            </h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-black/58">
              Try a broader keyword or switch back to all categories.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
