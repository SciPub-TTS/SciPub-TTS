import {
  ArrowRight,
  BellRing,
  Bookmark,
  BookOpen,
  ChevronRight,
  Eye,
  FileBarChart2,
  FileSearch,
  Filter,
  Layers3,
  Library,
  Radar,
  Rss,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { ENABLE_SOCIAL_HUB } from "@/features/social/socialFeature";

const workflowSteps = [
  {
    id: "01",
    eyebrow: "Start Wide",
    title: "Discover a topic or question worth exploring",
    description: "Begin with Search or Trending Topic.",
    checkpoints: [
      "Search for a known keyword, author, or topic.",
      "Use Trending Topic for discovery first.",
      "Choose one thread to explore.",
    ],
    icon: Radar,
    surfaceClassName: "from-emerald-100 via-white to-emerald-50",
  },
  {
    id: "02",
    eyebrow: "Refine",
    title: "Filter results until the list feels decision-ready",
    description: "Use filters to narrow the list.",
    checkpoints: [
      "Works: refine by year, type, field, or source.",
      "Authors: refine by institution or country.",
      "Topics: refine by subfield or field.",
    ],
    icon: Filter,
    surfaceClassName: "from-sky-100 via-white to-sky-50",
  },
  {
    id: "03",
    eyebrow: "Inspect",
    title: "Open detail pages to validate quality and context",
    description: "Validate before you save.",
    checkpoints: [
      "Paper detail: check abstract and metadata.",
      "Author detail: inspect works and context.",
      "Topic detail: understand the area quickly.",
    ],
    icon: Eye,
    surfaceClassName: "from-violet-100 via-white to-fuchsia-50",
  },
  {
    id: "04",
    eyebrow: "Personalize",
    title: "Bookmark and follow so the system starts working for you",
    description: "Save useful works and follow useful entities.",
    checkpoints: [
      "Bookmark from cards or detail pages.",
      "Follow authors and topics you care about.",
      "Build a reusable reading trail.",
    ],
    icon: Sparkles,
    surfaceClassName: "from-amber-100 via-white to-orange-50",
  },
  ...(ENABLE_SOCIAL_HUB
    ? [
        {
          id: "05",
          eyebrow: "Share",
          title: "Create a blog from your saved papers in Social Hub",
          description: "Turn bookmarks into public notes.",
          checkpoints: [
            "Create a blog post in Social Hub.",
            "Attach papers from your Bookmark Library.",
            "Publish so others can read and like it.",
          ],
          icon: Library,
          surfaceClassName: "from-rose-100 via-white to-orange-50",
        },
      ]
    : []),
  {
    id: "06",
    eyebrow: "Monitor",
    title: "Use Feed and reports to stay current after the first search",
    description: "Let the system help after the first pass.",
    checkpoints: [
      "Feed for ongoing updates.",
      "Bookmarks to revisit saved works.",
      "Reports for summary output.",
    ],
    icon: Rss,
    surfaceClassName: "from-slate-200 via-white to-slate-100",
  },
] as const;

const routeMapCards = [
  {
    title: "Search",
    subtitle: "Main research workbench",
    description: "Best for direct queries.",
    href: ROUTES.SEARCH,
    icon: FileSearch,
  },
  {
    title: "Trending Topic",
    subtitle: "Discovery dashboard",
    description: "Best for discovery first.",
    href: ROUTES.TRENDING,
    icon: TrendingUp,
  },
  {
    title: "Paper Detail",
    subtitle: "Validation layer",
    description: "Inspect before saving.",
    href: ROUTES.SEARCH,
    icon: BookOpen,
  },
  {
    title: "Author Detail",
    subtitle: "People tracking",
    description: "Track useful researchers.",
    href: ROUTES.SEARCH,
    icon: UserRound,
  },
  {
    title: "Topic Detail",
    subtitle: "Area tracking",
    description: "Track a research area.",
    href: ROUTES.SEARCH,
    icon: Layers3,
  },
  {
    title: "Bookmarks",
    subtitle: "Personal library",
    description: "Revisit saved works.",
    href: ROUTES.BOOKMARKS,
    icon: Library,
  },
  {
    title: "Feed",
    subtitle: "Continuous monitoring",
    description: "Check updates quickly.",
    href: ROUTES.FEED,
    icon: Rss,
  },
  {
    title: "Report",
    subtitle: "Output and sharing",
    description: "Turn findings into output.",
    href: ROUTES.REPORT,
    icon: FileBarChart2,
  },
  ...(ENABLE_SOCIAL_HUB
    ? [
        {
          title: "Social Hub",
          subtitle: "Public sharing",
          description: "Write blogs and attach bookmarked papers.",
          href: ROUTES.SOCIAL_HUB,
          icon: BellRing,
        },
      ]
    : []),
] as const;

const habitCards = [
  {
    title: "Search -> inspect -> bookmark",
    description: "Best for building a reading list.",
    icon: Bookmark,
  },
  {
    title: "Trending -> search -> follow",
    description: "Best for discovery into monitoring.",
    icon: Tag,
  },
  ...(ENABLE_SOCIAL_HUB
    ? [
        {
          title: "Bookmark -> Social Hub -> like",
          description: "Best for sharing notes with others.",
          icon: BellRing,
        },
      ]
    : []),
] as const;

export default function GuideHelpPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ed_0%,#eef4f1_44%,#f8fafc_100%)] text-slate-950">
      <main className="px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <section className="mx-auto max-w-7xl space-y-8">
          <section className="overflow-hidden rounded-[34px] border border-[#d9d2bf] bg-[radial-gradient(circle_at_top_left,rgba(253,224,71,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%),linear-gradient(135deg,#fffdf6_0%,#f3f8f5_52%,#eef6ff_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Learn - Product Guide
                </p>
                <h1 className="font-title-page mt-3 max-w-4xl text-4xl font-normal leading-[1.05] text-[#14532D] md:text-5xl xl:whitespace-nowrap">
                  Learn Owlreka. Research Smarter.
                </h1>
                <p className="font-subtext mt-3 max-w-3xl text-base leading-7 text-slate-500">
                  Follow the product flow from discovery to bookmarking,
                  monitoring, and sharing.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to={ROUTES.SEARCH}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                  >
                    Open Search
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={ROUTES.TRENDING}
                    className="inline-flex items-center gap-2 rounded-2xl border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    View Trending Topic
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {habitCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[26px] border border-slate-200 bg-white/85 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold text-slate-950">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:px-8 md:py-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-700">
                  Core Workflow
                </p>
                <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[44px]">
                  The recommended path through the product
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {workflowSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.id}
                    className={[
                      "overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br p-5 md:p-6",
                      step.surfaceClassName,
                    ].join(" ")}
                  >
                    <div className="grid gap-5 lg:grid-cols-[auto_1fr_0.9fr] lg:items-start">
                      <div className="flex items-center gap-4 lg:block">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-950 text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="lg:mt-4">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-500">
                            Step {step.id}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-700">
                            {step.eyebrow}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[22px] font-semibold leading-tight text-slate-950 md:text-[28px]">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 md:text-[15px]">
                          {step.description}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white/70 bg-white/80 p-4">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
                          What to do here
                        </p>
                        <ul className="mt-3 space-y-2.5 text-sm leading-7 text-slate-700">
                          {step.checkpoints.map((checkpoint) => (
                            <li key={checkpoint} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                              <span>{checkpoint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[34px] border border-slate-200 bg-[#fffdf7] px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:px-8 md:py-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-700">
                  Page Map
                </p>
                <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[44px]">
                  Which page should you open next?
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {routeMapCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.title}
                    to={card.href}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">
                      {card.subtitle}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
                      Open page
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:px-8">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-sky-700">
                Practical Tips
              </p>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[42px]">
                Small habits that make the web flow better
              </h2>

              <div className="mt-6 grid gap-3">
                {[
                  "Search broad first, then narrow with filters.",
                  "Open detail pages before bookmarking.",
                  ENABLE_SOCIAL_HUB
                    ? "Use Social Hub to turn saved papers into public notes."
                    : "Use bookmarks and reports to keep your research trail organized.",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#14532D] text-[11px] font-bold text-white">
                      ✓
                    </span>
                    <p className="text-sm leading-7 text-slate-700">{tip}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] border border-emerald-900/20 bg-[linear-gradient(160deg,#052e1b_0%,#082f49_100%)] px-6 py-7 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:px-8">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-200">
                Need Help Fast
              </p>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[42px]">
                Start with the action that matches your current intent.
              </h2>

              <div className="mt-6 space-y-3">
                <Link
                  to={ROUTES.SEARCH}
                  className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-200" />I need to
                    find papers now
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.TRENDING}
                  className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-200" />I need
                    discovery first
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.BOOKMARKS}
                  className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-sky-200" />I want my saved
                    works
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm leading-7 text-emerald-50/90">
                The strongest product loop is:{" "}
                <span className="font-semibold text-white">
                  {ENABLE_SOCIAL_HUB
                    ? "Search -> Detail -> Bookmark -> Social Hub -> Feed/Report"
                    : "Search -> Detail -> Bookmark -> Feed/Report"}
                </span>
                .
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}
