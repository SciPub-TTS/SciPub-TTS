import {
  ArrowRight,
  ChartColumnIncreasing,
  ChevronDown,
  FileBarChart2,
  LibraryBig,
  Search,
  Sparkles,
  TrendingUp,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { LandingHeroPreview } from "@/features/landing/components/LandingHeroPreview";
import { LandingLiveTrendsSection } from "@/features/landing/components/LandingLiveTrendsSection";
import { LandingPersonalizedPapersSection } from "@/features/landing/components/LandingPersonalizedPapersSection";
import { useLandingSummary } from "@/features/landing/hooks/useLandingSummary";
import { ENABLE_SOCIAL_HUB } from "@/features/social/socialFeature";
import MainFooter from "@/layout/global/Footer";

const publicNavLinks = [
  { label: "Trending Topics", to: ROUTES.TRENDING_TOPIC },
  { label: "Trending Keywords", to: ROUTES.TRENDING_KEYWORD },
  { label: "Guide", to: ROUTES.GUIDE },
] as const;

const workspaceLinks = [
  { label: "Feed", to: ROUTES.FEED },
  { label: "Bookmarks", to: ROUTES.BOOKMARKS },
  { label: "Report", to: ROUTES.REPORT },
  ...(ENABLE_SOCIAL_HUB ? [{ label: "Social Hub", to: ROUTES.SOCIAL_HUB }] : []),
] as const;

const landingSections = [
  { id: "overview", number: "01", title: "Overview" },
  { id: "live-trends", number: "02", title: "Live Trends" },
  { id: "personalized-intelligence", number: "03", title: "Personalized Intelligence" },
] as const;

const productHighlights = [
  {
    description:
      "Search across papers, authors, topics, and metadata with filters built for research workflows.",
    icon: Search,
    title: "Search with structure",
  },
  {
    description:
      "See publication growth, citation movement, hot keywords, and momentum in one dashboard.",
    icon: TrendingUp,
    title: "Track what is rising",
  },
  {
    description:
      "Save key works into collections, revisit them later, and organize a cleaner review flow.",
    icon: LibraryBig,
    title: "Build a personal library",
  },
  {
    description:
      "Turn saved papers and trend signals into concise reports for class, review, or planning.",
    icon: FileBarChart2,
    title: "Export useful reports",
  },
] as const;

function formatCompactNumber(value: number | undefined, fallback: string) {
  if (typeof value !== "number") {
    return fallback;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}

export default function LandingPage() {
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuthSession();
  const { data: landingSummary } = useLandingSummary();

  const dashboardPath =
    currentUser?.role === AUTH_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.TRENDING_TOPIC;
  const profilePath =
    currentUser?.role === AUTH_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.PROFILE;
  const displayName = currentUser?.fullName ?? "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function handleSectionSelect(sectionId: string) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.history.replaceState(null, "", `#${sectionId}`);
    setIsSectionMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black">
      <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Owlreka logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="font-brand text-3xl font-normal">Owlreka</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex xl:gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSectionMenuOpen((isOpen) => !isOpen);
                  setIsExploreMenuOpen(false);
                  setIsWorkspaceMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-black hover:text-emerald-700"
              >
                Sections
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isSectionMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSectionMenuOpen ? (
                <div className="absolute left-0 top-8 z-30 w-80 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                  {landingSections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleSectionSelect(section.id)}
                      className="mb-1.5 flex w-full items-center gap-3 border-b border-black px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                    >
                      <span className="min-w-7 text-black">
                        {section.number}
                      </span>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              to={ROUTES.SEARCH}
              className="rounded-full bg-slate-50 px-4 py-2 whitespace-nowrap text-black transition hover:text-emerald-700"
            >
              Discovery
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsExploreMenuOpen((isOpen) => !isOpen);
                  setIsWorkspaceMenuOpen(false);
                  setIsSectionMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
              >
                Explore
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isExploreMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExploreMenuOpen ? (
                <div className="absolute left-0 top-12 z-30 w-64 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsExploreMenuOpen(false)}
                      className="mb-1.5 flex items-center border-b border-black px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsWorkspaceMenuOpen((isOpen) => !isOpen);
                  setIsExploreMenuOpen(false);
                  setIsSectionMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
              >
                Workspace
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isWorkspaceMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isWorkspaceMenuOpen ? (
                <div className="absolute left-0 top-12 z-30 w-60 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                  {workspaceLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={isAuthenticated ? link.to : ROUTES.LOGIN}
                      onClick={() => setIsWorkspaceMenuOpen(false)}
                      className="mb-1.5 flex items-center border-b border-black px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          {isAuthenticated ? (
            <Link
              to={profilePath}
              aria-label="Open user profile"
              className="flex items-center gap-3 transition hover:opacity-90"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-base font-bold text-white ring-2 ring-emerald-100">
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "U"
                )}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold text-slate-900">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {currentUser?.email ?? "Signed in account"}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="rounded-lg border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-lg bg-[#14532D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#166534]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[2rem] border border-black bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                Research Discovery Platform
              </p>
              <h1 className="font-title-page mt-4 max-w-4xl text-4xl font-normal leading-[1.05] text-[#14532D] md:text-5xl xl:text-6xl">
                Discover research. Track trends. Save what matters.
              </h1>
              <p className="font-subtext mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Owlreka brings together paper search, trending topics, hot
                keywords, bookmarks, and reports in one workflow that already
                matches the rest of your workspace.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.SEARCH}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                >
                  Start Searching
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-xl border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  <ChartColumnIncreasing className="h-4 w-4" />
                  View Trending Topic
                </Link>
                {!isAuthenticated ? (
                  <Link
                    to={ROUTES.REGISTER}
                    className="inline-flex items-center gap-2 rounded-xl border border-black bg-[#FEF3C7] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#FDE68A]"
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    Create Account
                  </Link>
                ) : null}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryMetricCard
                  label="Papers"
                  value={formatCompactNumber(landingSummary?.totalPapers, "317M")}
                />
                <SummaryMetricCard
                  label="Authors"
                  value={formatCompactNumber(landingSummary?.totalAuthors, "118M")}
                />
                <SummaryMetricCard
                  label="Topics"
                  value={formatCompactNumber(landingSummary?.totalTopics, "4.5K")}
                />
                <SummaryMetricCard
                  label="Fields"
                  value={formatCompactNumber(landingSummary?.totalFields, "26")}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <QuickPanel
                description="Find papers by keyword, author, topic, field, year, and trend markers."
                icon={Search}
                title="Search Workspace"
                to={ROUTES.SEARCH}
              />
              <QuickPanel
                description="See which topics are breaking out and which keywords are gaining momentum."
                icon={TrendingUp}
                title="Trending Topic Dashboard"
                to={ROUTES.TRENDING_TOPIC}
              />
              <QuickPanel
                description="Keep useful works inside collections and turn them into cleaner review reports."
                icon={Sparkles}
                title="Bookmarks and Reports"
                to={isAuthenticated ? ROUTES.BOOKMARKS : ROUTES.LOGIN}
              />
            </div>
          </section>

          <LandingHeroPreview summary={landingSummary ?? null} />

          <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[2rem] border border-black bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                Why It Fits
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-black md:text-4xl">
                Landing now follows the same language as the rest of Owlreka.
              </h2>
              <p className="font-subtext mt-4 text-base leading-7 text-slate-600">
                Instead of feeling like a separate microsite, the landing page
                now mirrors the platform itself: clear cards, strong borders,
                practical summaries, and direct paths into the product.
              </p>

              <div className="mt-6 space-y-3">
                <FeatureLine
                  text="Consistent visual rhythm with Search, Trending, Bookmarks, and Reports"
                />
                <FeatureLine text="More readable sections with less decorative noise" />
                <FeatureLine text="Dynamic data blocks kept intact and surfaced earlier" />
                <FeatureLine text="Faster onboarding into the actual workspace" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {productHighlights.map((item) => (
                <ProductHighlightCard
                  key={item.title}
                  description={item.description}
                  icon={item.icon}
                  title={item.title}
                />
              ))}
            </div>
          </section>

          <LandingLiveTrendsSection topics={landingSummary?.top10Topics} />

          <section className="rounded-[2rem] border border-black bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Core Workflow
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-black md:text-4xl">
                  A cleaner path from discovery to decision.
                </h2>
                <p className="font-subtext mt-4 text-base leading-7 text-slate-600">
                  The main workflow stays simple: search, evaluate trends, save
                  strong papers, and generate useful outputs for study or
                  research planning.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <WorkflowCard
                  description="Query papers and narrow by topic, author, field, year, or trend relevance."
                  icon={Search}
                  number="01"
                  title="Search"
                />
                <WorkflowCard
                  description="Read topic growth, publication movement, hot keywords, and signal strength."
                  icon={TrendingUp}
                  number="02"
                  title="Analyze"
                />
                <WorkflowCard
                  description="Store useful works in collections so your review trail stays organized."
                  icon={LibraryBig}
                  number="03"
                  title="Save"
                />
                <WorkflowCard
                  description="Turn saved evidence and trend snapshots into a concise report."
                  icon={FileBarChart2}
                  number="04"
                  title="Report"
                />
              </div>
            </div>
          </section>

          <LandingPersonalizedPapersSection
            papers={landingSummary?.top6TrendingPapers?.slice(0, 3)}
          />

          <section className="rounded-[2rem] border border-black bg-[#14532D] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-emerald-100">
                  Ready To Explore
                </p>
                <h2 className="font-title-page mt-4 text-4xl font-normal leading-[1.05] text-white md:text-5xl">
                  Step into your research workspace.
                </h2>
                <p className="font-subtext mt-4 max-w-2xl text-base leading-7 text-emerald-50/90">
                  Start with Search if you already know the paper you need, or
                  open Trending Topic if you want to understand where attention
                  is moving first.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  to={ROUTES.SEARCH}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#14532D] transition hover:bg-slate-100"
                >
                  Open Search
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.TRENDING_TOPIC}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-100/50 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open Trending Topic
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

function SummaryMetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-black">{value}</p>
    </article>
  );
}

function QuickPanel({
  description,
  icon: Icon,
  title,
  to,
}: {
  description: string;
  icon: typeof Search;
  title: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-[1.75rem] border border-black bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-slate-50"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black bg-[#FEF3C7] text-black">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-black">{title}</h3>
      <p className="font-subtext mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </Link>
  );
}

function FeatureLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#14532D] text-white">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
      <p className="text-sm font-semibold leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function ProductHighlightCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof Search;
  title: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-black bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black bg-[#EEF6FF] text-[#005CB9]">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-black">{title}</h3>
      <p className="font-subtext mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}

function WorkflowCard({
  description,
  icon: Icon,
  number,
  title,
}: {
  description: string;
  icon: typeof Search;
  number: string;
  title: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-black bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-title-page text-3xl font-normal text-[#14532D]">
          {number}
        </span>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black bg-white text-black">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-black">{title}</h3>
      <p className="font-subtext mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}
