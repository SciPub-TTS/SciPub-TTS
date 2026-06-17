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
  Flame,
  Layers3,
  Library,
  LifeBuoy,
  Radar,
  Rss,
  Search,
  Send,
  Sparkles,
  Tag,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";

const quickStartCards = [
  {
    title: "Search papers",
    description: "Start with keywords, then narrow results with the same filters used across the app.",
    href: ROUTES.SEARCH,
    icon: Search,
    accentClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "See what is rising",
    description: "Open the trending topic dashboard when you want discovery before precision search.",
    href: ROUTES.TRENDING_TOPIC,
    icon: Flame,
    accentClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    title: "Save your trail",
    description: "Bookmark papers and follow entities so your feed becomes more useful over time.",
    href: ROUTES.BOOKMARKS,
    icon: Bookmark,
    accentClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
];

const workflowSteps = [
  {
    id: "01",
    eyebrow: "Start Wide",
    title: "Discover a topic or question worth exploring",
    description:
      "If you already know what to look for, go straight to Search. If not, use the trending topic dashboard to spot hot themes, fast-growing areas, and research signals worth chasing.",
    checkpoints: [
      "Use Search when you have a concrete keyword, author, or topic.",
      "Use Trending Topic when you want discovery and market scanning first.",
      "Pick one promising thread before going deeper.",
    ],
    icon: Radar,
    surfaceClassName: "from-emerald-100 via-white to-emerald-50",
  },
  {
    id: "02",
    eyebrow: "Refine",
    title: "Filter results until the list feels decision-ready",
    description:
      "The search page is the main workbench. Use filters for year, type, subfield, institution, country, and entity-specific options so the result list reflects the exact slice you care about.",
    checkpoints: [
      "Works tab: use detailed filters for publication and metadata control.",
      "Authors tab: refine by institution, country, and primary topic.",
      "Topics tab: refine by subfield and field, then sort by relevance or most works.",
    ],
    icon: Filter,
    surfaceClassName: "from-sky-100 via-white to-sky-50",
  },
  {
    id: "03",
    eyebrow: "Inspect",
    title: "Open detail pages to validate quality and context",
    description:
      "Once a result looks promising, inspect the detail page. This is where you confirm relevance, read context, inspect metadata, and decide whether to keep following the trail.",
    checkpoints: [
      "Paper detail: check abstract, authors, keywords, and source.",
      "Author detail: inspect works, institution context, and follow if useful.",
      "Topic detail: understand scope and save the area for later tracking.",
    ],
    icon: Eye,
    surfaceClassName: "from-violet-100 via-white to-fuchsia-50",
  },
  {
    id: "04",
    eyebrow: "Personalize",
    title: "Bookmark and follow so the system starts working for you",
    description:
      "The product gets better when you leave signals behind. Bookmark works you may cite later and follow authors or topics you want the system to keep watching for you.",
    checkpoints: [
      "Bookmark works directly from result cards or detail pages.",
      "Follow authors and topics from result cards and entity detail pages.",
      "Build a durable reading trail instead of re-searching from scratch.",
    ],
    icon: Sparkles,
    surfaceClassName: "from-amber-100 via-white to-orange-50",
  },
  {
    id: "05",
    eyebrow: "Monitor",
    title: "Use Feed and reports to stay current after the first search",
    description:
      "After you have a set of interests, let the platform surface updates for you. Feed helps with ongoing monitoring, while reports help package findings into something you can reuse or share.",
    checkpoints: [
      "Feed: check what is new around followed topics and saved interests.",
      "Bookmarks: return to your saved works library quickly.",
      "Report: summarize a topic or time range when you need a polished output.",
    ],
    icon: Rss,
    surfaceClassName: "from-slate-200 via-white to-slate-100",
  },
];

const routeMapCards = [
  {
    title: "Search",
    subtitle: "Main research workbench",
    description: "Best when you already know the keyword, topic, author, or field you want to investigate.",
    href: ROUTES.SEARCH,
    icon: FileSearch,
  },
  {
    title: "Trending Topic",
    subtitle: "Discovery dashboard",
    description: "Best for spotting emerging themes, publication momentum, and research directions worth entering.",
    href: ROUTES.TRENDING_TOPIC,
    icon: TrendingUp,
  },
  {
    title: "Paper Detail",
    subtitle: "Validation layer",
    description: "Use it to inspect metadata, context, and decide whether the work deserves a bookmark.",
    href: ROUTES.SEARCH,
    icon: BookOpen,
  },
  {
    title: "Author Detail",
    subtitle: "People tracking",
    description: "Follow an author when they consistently publish in an area you care about.",
    href: ROUTES.SEARCH,
    icon: UserRound,
  },
  {
    title: "Topic Detail",
    subtitle: "Area tracking",
    description: "Follow a topic when you want the system to keep watching that research space for you.",
    href: ROUTES.SEARCH,
    icon: Layers3,
  },
  {
    title: "Bookmarks",
    subtitle: "Personal library",
    description: "Return to saved works without rebuilding the same search trail every time.",
    href: ROUTES.BOOKMARKS,
    icon: Library,
  },
  {
    title: "Feed",
    subtitle: "Continuous monitoring",
    description: "A better starting point after you already followed entities and saved relevant items.",
    href: ROUTES.FEED,
    icon: Rss,
  },
  {
    title: "Report",
    subtitle: "Output and sharing",
    description: "Turn exploration into a reusable summary when you need to present findings.",
    href: ROUTES.REPORT,
    icon: FileBarChart2,
  },
];

const habitCards = [
  {
    title: "Search -> inspect -> bookmark",
    description: "Use this when building a reading list for a paper, thesis, or literature review.",
    icon: Bookmark,
  },
  {
    title: "Trending -> search -> follow",
    description: "Use this when you want to move from discovery into long-term monitoring.",
    icon: Tag,
  },
  {
    title: "Follow -> feed -> report",
    description: "Use this when your goal is to stay current and package updates for others.",
    icon: BellRing,
  },
];

export default function GuideHelpPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f4ed_0%,#eef4f1_44%,#f8fafc_100%)] text-slate-950">
      <main className="px-4 pb-14 pt-6 md:px-8 md:pt-10">
        <section className="mx-auto max-w-7xl space-y-8">
          <section className="overflow-hidden rounded-[34px] border border-[#d9d2bf] bg-[radial-gradient(circle_at_top_left,rgba(253,224,71,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_32%),linear-gradient(135deg,#fffdf6_0%,#f3f8f5_52%,#eef6ff_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-emerald-700">
                  Product Guide
                </p>
                <h1 className="mt-4 max-w-4xl text-[40px] font-semibold leading-[0.95] tracking-[-0.03em] md:text-[64px] lg:text-[82px]">
                  Learn the flow of
                  {" "}
                  <span className="font-serif italic text-emerald-700">Owlreka</span>
                  {" "}
                  like a real research workflow.
                </h1>
                <p className="mt-5 max-w-3xl text-[16px] leading-8 text-slate-700 md:text-[18px]">
                  This guide is not just a feature list. It mirrors how the site
                  actually works best: discover a signal, refine with search,
                  inspect detail pages, save what matters, then let feed and
                  reports carry the work forward.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={ROUTES.SEARCH}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                  >
                    Open Search
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={ROUTES.TRENDING_TOPIC}
                    className="inline-flex items-center gap-2 rounded-2xl border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                  >
                    View Trending Topic
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {quickStartCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.title}
                      to={card.href}
                      className="group rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                    >
                      <span
                        className={[
                          "inline-flex h-11 w-11 items-center justify-center rounded-2xl border",
                          card.accentClassName,
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="mt-4 text-lg font-semibold text-slate-950">
                        {card.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {card.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
                        Go there
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
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

              <p className="max-w-xl text-sm leading-7 text-slate-600">
                If you follow these steps in order, the platform feels much more
                coherent and useful than jumping randomly between pages.
              </p>
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

              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Think of each screen as a role in the research process, not just
                a menu item.
              </p>
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
                  "Search first with a broad keyword, then tighten with filters after you see the shape of results.",
                  "Open detail pages before bookmarking so your library stays meaningful instead of noisy.",
                  "Follow topics for area monitoring and follow authors for person-based tracking.",
                  "Use feed after you already created signals; it becomes more valuable once you follow and save things.",
                  "Generate reports only after you have narrowed the topic enough that the output tells a coherent story.",
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
                    <Search className="h-4 w-4 text-emerald-200" />
                    I need to find papers now
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.TRENDING_TOPIC}
                  className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-200" />
                    I need discovery first
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.BOOKMARKS}
                  className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-sky-200" />
                    I want my saved works
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm leading-7 text-emerald-50/90">
                The strongest product loop is:
                {" "}
                <span className="font-semibold text-white">
                  Search {"->"} Detail {"->"} Bookmark/Follow {"->"} Feed {"->"} Report
                </span>
                .
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a
                  href="mailto:support@owlreka.local"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 font-semibold transition hover:bg-white/15"
                >
                  <LifeBuoy className="h-4 w-4" />
                  Contact support
                </a>
                <a
                  href="mailto:feedback@owlreka.local"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 font-semibold transition hover:bg-white/15"
                >
                  <Send className="h-4 w-4" />
                  Send feedback
                </a>
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}
