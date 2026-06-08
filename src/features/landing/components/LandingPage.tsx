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
import { getCurrentUser } from "@/features/auth/utils/authStorage";
import { isAuthenticated } from "@/features/auth/utils/authGuard";
import MainFooter from "@/layout/main/Footer";

const floatCards = [
  {
    title: "Routing Stability in MoE Models",
    label: "PAPER NODE",
    className:
      "left-[-14px] top-[54px] w-[180px] md:left-[-20px] md:top-[60px] md:w-[210px]",
    delay: "0s",
  },
  {
    title: "Author Node",
    label: "AUTHOR NODE",
    className:
      "left-[-8px] bottom-[50px] w-[150px] md:left-[-14px] md:bottom-[62px] md:w-[180px]",
    delay: "0.8s",
  },
  {
    title: "Topic Score",
    label: "TOPIC SCORE",
    className:
      "right-[8px] top-[26px] w-[130px] md:right-[12px] md:top-[34px] md:w-[150px]",
    delay: "1.2s",
  },
  {
    title: "Topic Node",
    label: "TOPIC NODE",
    className:
      "right-[8px] bottom-[92px] w-[130px] md:right-[12px] md:bottom-[108px] md:w-[150px]",
    delay: "0.4s",
  },
];

export default function LandingPage() {
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const currentUser = getCurrentUser();
  const loggedIn = isAuthenticated();
  const dashboardPath =
    currentUser?.role === AUTH_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.DASHBOARD;
  const profilePath =
    currentUser?.role === AUTH_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.PROFILE;
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
      { threshold: 0.15 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rail = document.getElementById("live-trends-rail");
    if (!rail) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let timerId: number | null = null;
    let isPaused = false;
    let pos = rail.scrollLeft;

    const onEnter = () => {
      isPaused = true;
    };
    const onLeave = () => {
      isPaused = false;
    };

    rail.addEventListener("mouseenter", onEnter);
    rail.addEventListener("mouseleave", onLeave);

    timerId = window.setInterval(() => {
      if (isPaused) return;

      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;

      pos += 0.8;
      rail.scrollLeft = pos;

      if (pos >= max - 1) {
        pos = 0;
        rail.scrollLeft = 0;
      }
    }, 16);

    return () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
      }
      rail.removeEventListener("mouseenter", onEnter);
      rail.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f4f2] text-[#0b0f0e]">
      <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Research Trend"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="font-brand text-3xl font-normal">Owlreka</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSectionMenuOpen((isOpen) => !isOpen)}
                className="inline-flex items-center gap-1.5 hover:text-emerald-700 text-black"
              >
                Sections
                <ChevronDown
                  className={`h-4 w-4 transition ${isSectionMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isSectionMenuOpen && (
                <div className="absolute left-0 top-8 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleSectionSelect("overview")}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSectionSelect("trending-topic-preview")}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Trending Topic Preview
                  </button>
                </div>
              )}
            </div>

            <Link
              to={ROUTES.SEARCH}
              className="hover:text-emerald-700 text-black"
            >
              Search
            </Link>
            <Link
              to={ROUTES.TRENDING_TOPIC}
              className="hover:text-emerald-700 text-black"
            >
              Trending Topic
            </Link>
            <Link
              to={ROUTES.GUIDE}
              className="hover:text-emerald-700 text-black"
            >
              Guide
            </Link>
          </nav>

          {loggedIn ? (
            <Link
              to={profilePath}
              aria-label="Open user profile"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || "U"
              )}
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
                    See the{" "}
                    <span className="font-serif italic text-emerald-600">signal</span>
                    <br />
                    behind every
                    <br />
                    <span className="relative inline-block font-serif italic">
                      paper
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
                A research trend observatory that watches <em>millions of papers</em>{" "}
                so you can track topic growth, citation momentum, and rising
                keywords before they become mainstream.
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

          <div
            id="trending-topic-preview"
            className="relative mt-12 scroll-mt-24 overflow-visible rounded-[28px] border border-slate-300/70 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.09)] md:p-4"
          >
          

            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
              <div className="relative">
                <img
                  src="/LandingPage-Img/DashboardPreview.png"
                  alt="Trending topic preview"
                  className="h-[420px] w-full rounded-3xl object-cover object-left-top md:h-[460px]"
                />

                {floatCards.map((card) => (
                  <article
                    key={card.title}
                    className={`floating-node absolute rounded-2xl border border-white/45 bg-white/72 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm ${card.className}`}
                    style={{ animationDelay: card.delay }}
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {card.label}
                    </p>
                    <h3 className="text-[20px] font-semibold leading-tight text-slate-900">
                      {card.title}
                    </h3>
                  </article>
                ))}
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      Papers Synced
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-emerald-600">
                      248K
                    </p>
                  </article>
                  <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      Active Trends
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-amber-500">42</p>
                  </article>
                  <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      Topics
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-blue-600">186</p>
                  </article>
                  <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      Fields
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-emerald-600">12</p>
                  </article>
                </div>

                <article className="h-[120px] rounded-2xl border border-slate-200 bg-white px-4 pt-3 pb-1">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    <span>Trust Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800">
                      OpenAlex Metadata
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800">
                      Topic Trend Analysis
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800">
                      Personalized Feed
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800">
                      Report Export
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800">
                      Citation Graph
                    </span>
                  </div>
                </article>
              </div>
            </div>

          </div>

          <section className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-12 md:px-10 md:py-16">
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
                  Follow research topics and academic authors to receive relevant
                  publication updates.
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
                  Create analytical reports with publication totals, topic trends,
                  top papers, and relevant journals.
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

          <section className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-12 md:px-10 md:py-16">
            <div className="mb-7 flex items-center gap-4">
              <span className="font-serif text-[36px] italic text-emerald-600">
                §03
              </span>
              <span className="h-px w-[130px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                The Pulse · Live Trends
              </span>
            </div>

            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-[44px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
                Topics moving{" "}
                <span className="font-serif italic text-amber-500">right now</span>
              </h2>

            </div>

          <div id="live-trends-rail" className="no-scrollbar -mx-1 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-4 px-1">
                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#01</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-600">
                      Breakout
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Computer Science</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Large Language Models
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-amber-500">96</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+48%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#02</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-600">
                      Hot
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Education</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    AI in Education
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-emerald-600">87</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+32%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#03</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-600">
                      Rising
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Information</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Open Science
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-emerald-600">79</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+24%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#04</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-600">
                      Rising
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Sustainability</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Green Computing
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-blue-600">71</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+19%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#05</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-600">
                      Rising
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Health Informatics</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Digital Health
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-blue-600">68</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+15%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#06</span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-600">
                      Stable
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Scientometrics</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Bibliometrics
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-slate-500">52</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+4%</p>
                    </div>
                  </div>
                </article>

                <article className="w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                  <div className="mb-8 flex items-center justify-between text-[13px] text-slate-400">
                    <span>#07</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-600">
                      Rising
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500">Physics</p>
                  <h3 className="mt-6 text-[16px] font-semibold text-slate-900">
                    Quantum ML
                  </h3>
                  <div className="mt-16 flex items-end justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Score
                      </p>
                      <p className="text-[40px] font-semibold text-blue-600">64</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
                        Growth
                      </p>
                      <p className="text-[32px] font-semibold text-emerald-600">+22%</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3]">
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
                See the{" "}
                <span className="font-serif italic text-emerald-600">signal</span>{" "}
                behind scientific publications.
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
                  <h3 className="text-[16px] font-semibold">Research Trend Tracker</h3>
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

          <section className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12">
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
                  The Trending Topic page helps users see which topics are growing, which
                  keywords are rising, and which research areas have strong
                  citation impact at a glance.
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

          <section className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr] lg:items-start">
              <div>
                <div className="mb-7 flex items-center gap-4">
                  <span className="font-serif text-[36px] italic text-emerald-600">
                    §06
                  </span>
                  <span className="h-px w-[130px] bg-slate-300" />
                  <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                    Knowledge Graph
                  </span>
                </div>

                <h2 className="max-w-[560px] text-[44px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
                  A{" "}
                  <span className="font-serif italic text-emerald-600">topic constellation</span>{" "}
                  of connected research.
                </h2>

                <p className="mt-5 max-w-[500px] text-[16px] leading-[1.75] text-slate-600">
                  Every paper is a node. Every author, topic, and field is a
                  link. Explore how ideas connect across disciplines and watch new
                  clusters emerge in real time.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[16px] text-amber-600">
                    • Breakout
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[16px] text-emerald-600">
                    • Hot
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[16px] text-blue-600">
                    • Rising
                  </span>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-[16px] text-slate-600">
                    • Stable
                  </span>
                </div>
              </div>

              <div className="relative rounded-[24px] border border-slate-200 bg-white p-4 md:p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[24px] opacity-35"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
                    backgroundSize: "32px 32px, 32px 32px",
                  }}
                />
                <p className="relative z-10 text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  Graph.Topics · 7 Nodes · 10 Edges
                </p>

                <div className="relative z-10 mt-6 h-[520px]">
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 800 520"
                    aria-hidden="true"
                  >
                    <g stroke="#9ed8af" strokeWidth="1.5" strokeDasharray="4 6" fill="none">
                      <line x1="390" y1="250" x2="300" y2="120" />
                      <line x1="390" y1="250" x2="390" y2="70" />
                      <line x1="390" y1="250" x2="660" y2="110" />
                      <line x1="390" y1="250" x2="710" y2="290" />
                      <line x1="390" y1="250" x2="630" y2="430" />
                      <line x1="390" y1="250" x2="330" y2="440" />
                      <line x1="130" y1="140" x2="330" y2="440" />
                      <line x1="130" y1="140" x2="390" y2="70" />
                      <line x1="660" y1="110" x2="710" y2="290" />
                      <line x1="710" y1="290" x2="630" y2="430" />
                    </g>
                  </svg>

                  <div className="absolute left-[355px] top-[214px] h-[86px] w-[86px] rounded-full border-2 border-amber-500 bg-white text-center text-[16px] font-semibold leading-tight text-amber-500 shadow-[0_0_28px_rgba(245,158,11,0.28)]">
                    <div className="pt-4">LLMs</div>
                    <div className="text-[12px]">96</div>
                  </div>
                  <div className="absolute left-[86px] top-[100px] h-[66px] w-[66px] rounded-full border-2 border-emerald-500 bg-white text-center text-[14px] leading-tight text-emerald-600 shadow-[0_0_22px_rgba(16,185,129,0.25)]">
                    <div className="pt-3">Open<br />Science</div>
                  </div>
                  <div className="absolute left-[350px] top-[40px] h-[60px] w-[60px] rounded-full border-2 border-emerald-500 bg-white text-center text-[13px] leading-tight text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.22)]">
                    <div className="pt-2.5">AI in<br />Edu</div>
                  </div>
                  <div className="absolute right-[72px] top-[92px] h-[64px] w-[64px] rounded-full border-2 border-blue-500 bg-white text-center text-[13px] leading-tight text-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.24)]">
                    <div className="pt-2">Green<br />Comp</div>
                  </div>
                  <div className="absolute right-[44px] top-[256px] h-[52px] w-[52px] rounded-full border-2 border-blue-500 bg-white text-center text-[12px] leading-tight text-blue-600 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
                    <div className="pt-2">XAI</div>
                  </div>
                  <div className="absolute right-[106px] bottom-[60px] h-[62px] w-[62px] rounded-full border-2 border-emerald-500 bg-white text-center text-[12px] leading-tight text-emerald-600 shadow-[0_0_18px_rgba(16,185,129,0.2)]">
                    <div className="pt-2">Digital<br />Health</div>
                  </div>
                  <div className="absolute left-[125px] bottom-[52px] h-[54px] w-[54px] rounded-full border-2 border-slate-500 bg-white text-center text-[12px] leading-tight text-slate-600 shadow-[0_0_14px_rgba(100,116,139,0.2)]">
                    <div className="pt-2">Biblio</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-8 md:px-10 md:py-10">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-serif text-[42px] italic text-emerald-600">
                §06b
              </span>
              <span className="h-px w-[130px] bg-slate-300" />
              <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Personalized Intelligence
              </span>
            </div>

            <h2 className="max-w-[920px] text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
              Follow{" "}
              <span className="font-serif italic text-emerald-600">topics</span>.
              {" "}Track{" "}
              <span className="font-serif italic text-blue-600">authors</span>.
              <br />
              Understand trends.
            </h2>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <p className="text-[16px] leading-[1.7] text-slate-600">
                Every recommendation comes with an explanation - see exactly why a
                paper showed up.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-[16px] font-medium text-slate-900"
                >
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Follow New Topic
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-[16px] font-medium text-slate-900"
                >
                  <UserRoundPlus className="h-4 w-4 text-blue-600" />
                  Follow New Author
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-6 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[14px] font-medium text-emerald-700">
                  ✧ Matched followed topic
                </span>
                <h3 className="mt-5 text-[16px] font-semibold leading-[1.5] text-slate-900">
                  Sparse Mixture-of-Experts at Scale: Routing Stability in Large
                  Language Models
                </h3>
                <p className="mt-6 text-[16px] text-blue-600">
                  Y. Chen, L. Patel, A. Nakamura
                </p>
                <span className="mt-5 inline-flex rounded-xl border border-slate-300 bg-slate-100 px-3 py-1 text-[16px] text-slate-900">
                  Computer Science
                </span>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #LLMs
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #MoE
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Scaling
                  </span>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-slate-500">❞ 124 citations</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-[16px] font-semibold text-emerald-600"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-6 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[14px] font-medium text-blue-700">
                  ✧ Matched followed author
                </span>
                <h3 className="mt-5 text-[16px] font-semibold leading-[1.5] text-slate-900">
                  Measuring the Open Access Citation Advantage Across 12M Articles
                </h3>
                <p className="mt-6 text-[16px] text-blue-600">
                  Jason R Priem, H. Piwowar
                </p>
                <span className="mt-5 inline-flex rounded-xl border border-slate-300 bg-slate-100 px-3 py-1 text-[16px] text-slate-900">
                  Information Science
                </span>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Open Access
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Bibliometrics
                  </span>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-slate-500">❞ 312 citations</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-[16px] font-semibold text-emerald-600"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="reveal-on-scroll rounded-2xl border border-slate-200 bg-white p-6 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[14px] font-medium text-amber-700">
                  ✧ Matched topic & author
                </span>
                <h3 className="mt-5 text-[16px] font-semibold leading-[1.5] text-slate-900">
                  Open Access Repositories and Trend Visibility in Emerging
                  Research Areas
                </h3>
                <p className="mt-6 text-[16px] text-blue-600">
                  Jason R Priem, S. Okafor
                </p>
                <span className="mt-5 inline-flex rounded-xl border border-slate-300 bg-slate-100 px-3 py-1 text-[16px] text-slate-900">
                  Scientometrics
                </span>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Open Access
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Trends
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[14px] text-emerald-700">
                    #Repositories
                  </span>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-slate-500">❞ 88 citations</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-[16px] font-semibold text-emerald-600"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12">
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
              <span className="font-serif italic text-emerald-600">insight</span>{" "}
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
                      Select fields, topics, authors, or keywords you care about.
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

          <section className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-10 md:px-10 md:py-12">
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
                <span className="font-serif italic text-emerald-600">researchers</span>.
              </h2>


            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid lg:grid-cols-3">
                <article className="reveal-on-scroll border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <GraduationCap className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">Student</h3>
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
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">Lecturer</h3>
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
                  <h3 className="mt-5 text-[16px] font-semibold text-slate-900">Researcher</h3>
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

          <section className="relative mt-16 overflow-hidden rounded-[28px] border border-emerald-900/30 bg-[#04170f] px-6 py-14 text-white md:px-10 md:py-16">
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
              <span className="font-serif text-[44px] italic leading-none">§09</span>
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
                emerging research directions all from one intelligent trending topic page.
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



