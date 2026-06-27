import {
  ArrowRight,
  BookOpen,
  ChartColumnIncreasing,
  Check,
  ChevronDown,
  ChartNoAxesColumnIncreasing,
  CircleX,
  FileBarChart2,
  Flame,
  GraduationCap,
  Layers,
  LineChart,
  Microscope,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import logoImage from "@/assets/images/logo.png";
import { AUTH_ROLES } from "@/features/auth/constants/roles";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { LandingHeroPreview } from "@/features/landing/components/LandingHeroPreview";
import { LandingLiveTrendsSection } from "@/features/landing/components/LandingLiveTrendsSection";
import { LandingPersonalizedPapersSection } from "@/features/landing/components/LandingPersonalizedPapersSection";
import { useLandingSummary } from "@/features/landing/hooks/useLandingSummary";
import MainFooter from "@/layout/global/Footer";
const landingSections = [
  { id: "overview", number: "01", title: "Overview" },
  {
    id: "research-tool-modules",
    number: "02",
    title: "Research Tool Modules",
  },
  { id: "live-trends", number: "03", title: "Live Trends" },
  { id: "the-argument", number: "04", title: "The Argument" },
  { id: "command-center", number: "05", title: "Command Center" },
  {
    id: "knowledge-graph",
    number: "06",
    title: "Research Growth Landscape",
  },
  {
    id: "personalized-intelligence",
    number: "06b",
    title: "Personalized Intelligence",
  },
  { id: "method", number: "07", title: "Method" },
  { id: "audience", number: "08", title: "Audience" },
  { id: "invitation", number: "09", title: "The Invitation" },
] as const;

const publicNavLinks = [
  { label: "Trending Topics", to: ROUTES.TRENDING_TOPIC },
  { label: "Trending Keywords", to: ROUTES.TRENDING_KEYWORD },
  { label: "Guide", to: ROUTES.GUIDE },
] as const;

const authenticatedNavLinks = [
  { label: "Feed", to: ROUTES.FEED },
  { label: "Bookmarks", to: ROUTES.BOOKMARKS },
  { label: "Report", to: ROUTES.REPORT },
  { label: "Social Hub", to: ROUTES.SOCIAL_HUB },
] as const;

export default function LandingPage() {
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const { currentUser, isAuthenticated: loggedIn } = useAuthSession();
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
  const displayEmail = currentUser?.email ?? "Signed in account";
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

  function handleExploreMenuToggle() {
    setIsExploreMenuOpen((isOpen) => !isOpen);
    setIsWorkspaceMenuOpen(false);
    setIsSectionMenuOpen(false);
  }

  function handleWorkspaceMenuToggle() {
    setIsWorkspaceMenuOpen((isOpen) => !isOpen);
    setIsExploreMenuOpen(false);
    setIsSectionMenuOpen(false);
  }

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f4f2] text-[#0b0f0e]">
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
                className="inline-flex items-center gap-1.5 hover:text-emerald-700 text-black"
              >
                Sections
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isSectionMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSectionMenuOpen && (
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
              )}
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
                onClick={handleExploreMenuToggle}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
              >
                Explore
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isExploreMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExploreMenuOpen && (
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
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handleWorkspaceMenuToggle}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition hover:text-emerald-700"
              >
                Workspace
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isWorkspaceMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isWorkspaceMenuOpen && (
                <div className="absolute left-0 top-12 z-30 w-60 rounded-[28px] border border-black bg-[#fcfdfb] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
                  {authenticatedNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={loggedIn ? link.to : ROUTES.LOGIN}
                      onClick={() => setIsWorkspaceMenuOpen(false)}
                      className="mb-1.5 flex items-center border-b border-black px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 last:mb-0 last:border-b-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {loggedIn ? (
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
                  {displayEmail}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="rounded-lg border border-black px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <section id="overview" className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:items-start">
            <div className="lg:pl-4">
              <div className="flex items-start gap-4 md:gap-6">
                <span className="pt-6 font-serif text-[56px] italic leading-none text-emerald-600 md:text-[78px]">
                  §01
                </span>
                <div>
                  <p className="mb-3 pt-1 text-xs font-medium uppercase tracking-[0.42em] text-emerald-600">
                    The Manifesto
                  </p>
                  <h1 className="max-w-[860px] text-[46px] font-semibold leading-[0.94] tracking-[-0.02em] md:text-[72px] lg:text-[86px]">
                    Read the{" "}
                    <span className="font-serif italic text-emerald-600">
                      literature
                    </span>
                    <br />
                    as a living
                    <br />
                    <span className="relative inline-block font-serif italic">
                      conversation
                      <svg
                        viewBox="0 0 420 24"
                        aria-hidden="true"
                        className="paper-underline pointer-events-none absolute -bottom-3 left-[-12px] h-[14px] w-[136%] text-emerald-600"
                      >
                        <path
                          d="M2 16 C 60 8, 120 18, 178 14 C 238 10, 300 18, 418 13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          className="paper-underline-path"
                        />
                      </svg>
                    </span>
                    .
                  </h1>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-emerald-600 pl-8 pt-8 lg:pl-8">
              <p className="max-w-[500px] text-[17px] leading-[1.75] text-slate-800 md:text-[18px]">
                A research trend observatory that watches{" "}
                <em>millions of papers</em> so you can track topic growth,
                citation momentum, and rising keywords before they become
                mainstream.
              </p>
              <div className="mt-10 flex flex-nowrap items-center gap-3">
                <Link
                  to={ROUTES.SEARCH}
                  className="inline-flex whitespace-nowrap items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700"
                >
                  Enter Observatory
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={dashboardPath}
                  className="inline-flex whitespace-nowrap items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <ChartColumnIncreasing className="h-4 w-4" />
                  View Trending Topic
                </Link>
              </div>
            </div>
          </div>

          <LandingHeroPreview summary={landingSummary ?? null} />

          <section
            id="research-tool-modules"
            className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-12 md:px-10 md:py-16"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="font-serif text-[36px] italic text-emerald-600">
                §02
              </span>
              <span className="h-px w-[150px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Research Tool Modules
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr] lg:items-end">
              <h2 className="text-[44px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
                From paper search to{" "}
                <span className="font-serif italic text-emerald-600">
                  research intelligence
                </span>
                .
              </h2>

              <p className="border-l-2 border-emerald-500/70 pl-5 text-[17px] leading-[1.75] text-slate-600 md:text-[18px] md:leading-[1.75]">
                Six modules that turn academic metadata into a clear picture of
                what's rising, stable, and ready to break out.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <Search className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Search Academic Papers
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  Search papers by keyword, author, topic, field, journal,
                  publication year, or citation count.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[12px] text-blue-600">
                      author
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[12px] text-blue-600">
                      topic
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[12px] text-blue-600">
                      year
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[12px] text-blue-600">
                      field
                    </span>
                  </div>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Track Publication Trends
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  View how topics and keywords grow over time using publication
                  volume and citation impact.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <svg
                    viewBox="0 0 320 44"
                    aria-hidden="true"
                    className="h-10 w-full text-emerald-600"
                  >
                    <path
                      d="M2 33 C 42 24, 66 38, 98 28 C 130 18, 168 36, 198 24 C 230 14, 260 30, 318 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="module-trend-path"
                    />
                  </svg>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <Flame className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Discover Trending Topics
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  Identify rising, hot, stable, and declining topics using
                  calibrated trend scores.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-600">
                      Breakout
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[12px] font-medium text-emerald-600">
                      Rising
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[12px] font-medium text-blue-600">
                      Stable
                    </span>
                  </div>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Personalized Research Feed
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  Get papers based on followed topics, followed authors, saved
                  keywords, or both topic and author matches.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <p className="flex items-center gap-1.5 text-[16px] text-emerald-600">
                    <Check className="h-4 w-4" />
                    Matched followed topic
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[16px] text-blue-600">
                    <Check className="h-4 w-4" />
                    Matched followed author
                  </p>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <UserRoundPlus className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Follow Topics and Authors
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  Follow research topics and academic authors to receive
                  relevant publication updates.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <div className="flex items-center">
                    <span className="inline-block h-8 w-8 rounded-full border-2 border-white bg-emerald-600" />
                    <span className="-ml-1.5 inline-block h-8 w-8 rounded-full border-2 border-white bg-blue-600" />
                    <span className="-ml-1.5 inline-block h-8 w-8 rounded-full border-2 border-white bg-amber-500" />
                    <span className="-ml-1.5 inline-block h-8 w-8 rounded-full border-2 border-white bg-black" />
                    <span className="-ml-1.5 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-2 text-[12px] text-slate-500">
                      +12
                    </span>
                  </div>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <FileBarChart2 className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Generate Simple Reports
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-slate-500">
                  Create analytical reports with publication totals, topic
                  trends, top papers, and relevant journals.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-200 pt-3">
                  <div className="flex items-end gap-1.5">
                    <span className="h-3 w-2 rounded-full bg-emerald-600" />
                    <span className="h-6 w-2 rounded-full bg-blue-600" />
                    <span className="h-5 w-2 rounded-full bg-emerald-600" />
                    <span className="h-8 w-2 rounded-full bg-blue-600" />
                    <span className="h-6 w-2 rounded-full bg-emerald-600" />
                    <span className="h-7 w-2 rounded-full bg-blue-600" />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <LandingLiveTrendsSection topics={landingSummary?.top10Topics} />

          <section
            id="the-argument"
            className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3]"
          >
            <div className="relative px-6 pb-8 pt-8 md:px-10 md:pt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-100"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(100,116,139,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.26) 1px, transparent 1px)",
                  backgroundSize: "36px 36px, 36px 36px",
                }}
              />

              <div className="relative z-10 mb-12 flex items-center gap-4">
                <span className="font-serif text-[36px] italic text-emerald-600">
                  §04
                </span>
                <span className="h-px w-[130px] bg-slate-300" />
                <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                  The Argument
                </span>
              </div>

              <h2 className="relative z-10 max-w-[980px] text-[58px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0b0f0e] md:text-[72px]">
                Trace the{" "}
                <span className="font-serif italic text-emerald-600">
                  argument
                </span>{" "}
                across scientific literature.
              </h2>

              <div className="relative z-10 mt-10 grid gap-4 lg:grid-cols-3">
                <article className="rounded-3xl border border-slate-200 bg-white p-7">
                  <div className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-slate-900">
                    Traditional Search Platforms
                  </h3>
                  <ul className="mt-6 space-y-3 text-[16px] text-slate-800">
                    <li className="flex items-center gap-3">
                      <CircleX className="h-5 w-5 text-slate-400" />
                      Search by keyword
                    </li>
                    <li className="flex items-center gap-3">
                      <CircleX className="h-5 w-5 text-slate-400" />
                      Show paper list
                    </li>
                    <li className="flex items-center gap-3">
                      <CircleX className="h-5 w-5 text-slate-400" />
                      Filter by year or citation
                    </li>
                    <li className="flex items-center gap-3">
                      <CircleX className="h-5 w-5 text-slate-400" />
                      User analyzes manually
                    </li>
                  </ul>
                </article>

                <article className="relative rounded-3xl border border-emerald-500/45 bg-[#0c241a] p-7 text-white shadow-[0_14px_30px_rgba(2,23,15,0.26)]">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]">
                    Recommended
                  </span>
                  <div className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/70 text-emerald-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-[16px] font-semibold">Owlreka</h3>
                  <ul className="mt-6 space-y-3 text-[16px] text-emerald-50">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-400" />
                      Shows publication growth
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-400" />
                      Calculates topic & keyword trend score
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-400" />
                      Explains why a paper appears in your feed
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-400" />
                      Connects papers, authors, topics, fields & trends
                    </li>
                  </ul>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-7">
                  <div className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-slate-900">
                    Result for Users
                  </h3>
                  <ul className="mt-6 space-y-3 text-[16px] text-slate-800">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Save time on literature review
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Find rising topics faster
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Follow authors and topics easily
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Generate reports for study or research
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section
            id="command-center"
            className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="font-serif text-[36px] italic text-emerald-600">
                §05
              </span>
              <span className="h-px w-[130px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Command Center
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.45fr] lg:items-start">
              <div>
                <h2 className="max-w-[580px] text-[44px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
                  A{" "}
                  <span className="font-serif italic text-emerald-600">
                    Trending Topic
                  </span>{" "}
                  designed for research decisions.
                </h2>
                <p className="mt-4 max-w-[520px] text-[16px] leading-[1.75] text-slate-600">
                  The Trending Topic page helps users see which topics are
                  growing, which keywords are rising, and which research areas
                  have strong citation impact at a glance.
                </p>

                <ul className="mt-8 space-y-3 text-[16px] text-slate-800">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <ChartColumnIncreasing className="h-4 w-4" />
                    </span>
                    KPI cards & growth metrics
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <LineChart className="h-4 w-4" />
                    </span>
                    Publication trend over time
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Flame className="h-4 w-4" />
                    </span>
                    Top trending topics & keywords
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Layers className="h-4 w-4" />
                    </span>
                    Topic activity heatmap by year
                  </li>
                </ul>
              </div>

              <div className="overflow-hidden rounded-[24px] ">
                <img
                  src="/LandingPage-Img/05-trenddashboard.png"
                  alt="Trending topic preview"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </section>

          <section
            id="knowledge-graph"
            className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12"
          >
            <div className="grid gap-8 lg:grid-cols-[4fr_3fr] lg:items-start">
              <div>
                <div className="mb-7 flex items-center gap-4">
                  <span className="font-serif text-[36px] italic text-emerald-600">
                    §06
                  </span>
                  <span className="h-px w-[130px] bg-slate-300" />
                  <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                    Research Growth Landscape
                  </span>
                </div>

                <h2 className="max-w-[620px] text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] text-[#0b0f0e] md:text-[56px]">
                  Compare research
                  <br />
                  fields by{" "}
                  <span className="font-serif italic text-emerald-600">
                    publication
                  </span>
                  <br />
                  <span className="font-serif italic text-emerald-600">
                    share
                  </span>{" "}
                  and growth rate.
                </h2>

                <p className="mt-5 max-w-[500px] text-[16px] leading-[1.75] text-slate-600">
                  Each bubble represents a research area, positioned by its
                  current publication share and CAGR. Larger bubbles indicate
                  stronger overall presence or impact.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-[16px] font-medium leading-none text-amber-500">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Breakout
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-[16px] font-medium leading-none text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Hot
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-[16px] font-medium leading-none text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    Rising
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[16px] font-medium leading-none text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Stable
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-4">
                <img
                  src="/LandingPage-Img/KnowledgeGraph.jpg"
                  alt="Research growth landscape bubble chart"
                  className="h-[420px] w-full rounded-[20px] object-contain"
                />
              </div>
            </div>
          </section>

          <LandingPersonalizedPapersSection
            papers={landingSummary?.top6TrendingPapers?.slice(0, 3)}
          />

          <section
            id="method"
            className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12"
          >
            <div className="reveal-on-scroll mb-6 flex items-center gap-4">
              <span className="font-serif text-[42px] italic text-emerald-600">
                §07
              </span>
              <span className="h-px w-[130px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Method
              </span>
            </div>

            <h2 className="reveal-on-scroll max-w-[980px] text-[44px] font-semibold leading-[0.98] tracking-[-0.02em] text-[#0b0f0e] md:text-[76px]">
              From research interest to{" "}
              <span className="font-serif italic text-emerald-600">
                insight
              </span>{" "}
              in four steps.
            </h2>

            <div className="relative mt-12 pb-6">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-200" />

              <div className="relative space-y-12">
                <div className="reveal-on-scroll grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                  <div className="text-right">
                    <p className="font-serif text-[64px] italic leading-none text-emerald-600">
                      01
                    </p>
                    <h3 className="mt-3 text-[16px] font-semibold text-slate-900">
                      Choose research interests
                    </h3>
                    <p className="mt-2 text-[16px] text-slate-600">
                      Select fields, topics, authors, or keywords you care
                      about.
                    </p>
                  </div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div />
                </div>

                <div className="reveal-on-scroll grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                  <div />
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-serif text-[64px] italic leading-none text-emerald-600">
                      02
                    </p>
                    <h3 className="mt-3 text-[16px] font-semibold text-slate-900">
                      Explore papers
                    </h3>
                    <p className="mt-2 text-[16px] text-slate-600">
                      Search and filter academic metadata from external APIs.
                    </p>
                  </div>
                </div>

                <div className="reveal-on-scroll grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                  <div className="text-right">
                    <p className="font-serif text-[64px] italic leading-none text-emerald-600">
                      03
                    </p>
                    <h3 className="mt-3 text-[16px] font-semibold text-slate-900">
                      Track trends
                    </h3>
                    <p className="mt-2 text-[16px] text-slate-600">
                      View publication growth, citation impact, topic score, and
                      momentum.
                    </p>
                  </div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div />
                </div>

                <div className="reveal-on-scroll grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
                  <div />
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]">
                    <FileBarChart2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-serif text-[64px] italic leading-none text-emerald-600">
                      04
                    </p>
                    <h3 className="mt-3 text-[16px] font-semibold text-slate-900">
                      Save and report
                    </h3>
                    <p className="mt-2 text-[16px] text-slate-600">
                      Bookmark key papers and generate concise reports for your
                      study flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="audience"
            className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="font-serif text-[42px] italic text-emerald-600">
                §08
              </span>
              <span className="h-px w-[130px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Audience
              </span>
            </div>

            <div className="relative">
              <h2 className="max-w-[980px] text-[44px] font-semibold leading-[0.98] tracking-[-0.02em] text-[#0b0f0e] md:text-[76px]">
                For students, lecturers, and{" "}
                <span className="font-serif italic text-emerald-600">
                  researchers
                </span>
                .
              </h2>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid lg:grid-cols-3">
                <article className="reveal-on-scroll border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <GraduationCap className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">
                    Student
                  </h3>
                  <ul className="mt-4 space-y-2 text-[16px] text-slate-900">
                    <li>✓ Find reference papers</li>
                    <li>✓ Follow topics for assignments</li>
                    <li>✓ Save bookmarks</li>
                    <li>✓ Export simple reports</li>
                  </ul>
                </article>

                <article className="reveal-on-scroll border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <BookOpen className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">
                    Lecturer
                  </h3>
                  <ul className="mt-4 space-y-2 text-[16px] text-slate-900">
                    <li>✓ Track research topics</li>
                    <li>✓ Recommend reading materials</li>
                    <li>✓ Follow authors and journals</li>
                    <li>✓ View trending topics</li>
                  </ul>
                </article>

                <article className="reveal-on-scroll p-6">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Microscope className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">
                    Researcher
                  </h3>
                  <ul className="mt-4 space-y-2 text-[16px] text-slate-900">
                    <li>✓ Discover emerging topics</li>
                    <li>✓ Compare topic growth</li>
                    <li>✓ Monitor publication activity</li>
                    <li>✓ Track citation impact</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section
            id="invitation"
            className="relative mt-16 overflow-hidden rounded-[28px] border border-emerald-900/30 bg-[#04170f] px-6 py-14 text-white md:px-10 md:py-16"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(16,185,129,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.14) 1px, transparent 1px)",
                backgroundSize: "32px 32px, 32px 32px",
              }}
            />
            <div className="relative z-10 mx-auto max-w-[980px] text-center">
              <div className="flex items-end justify-center gap-3 text-emerald-300">
                <span className="font-serif text-[44px] italic leading-none">
                  §09
                </span>
                <span className="pb-1.5 text-[18px] uppercase tracking-[0.2em]">
                  The Invitation
                </span>
              </div>
              <h2 className="mt-4 text-[44px] font-semibold leading-[0.98] md:text-[76px]">
                Step Into Your{" "}
                <span className="font-serif italic text-emerald-400">
                  Research Observatory
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-[16px] leading-[1.75] text-emerald-100/90">
                Search papers, follow topics, monitor authors, and discover
                emerging research directions all from one intelligent trending
                topic page.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={ROUTES.SEARCH}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-[16px] font-semibold text-white hover:bg-emerald-600"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.TRENDING_TOPIC}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-700/70 bg-transparent px-6 py-3 text-[16px] font-semibold text-white hover:bg-emerald-900/30"
                >
                  View Trending Topic
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[16px] text-emerald-200">
                <span>✓ No credit card required</span>
                <span>✓ Academic project</span>
                <span>✓ Open metadata</span>
              </div>
            </div>
          </section>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
