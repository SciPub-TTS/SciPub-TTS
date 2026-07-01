import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router/routes";
import type { LandingTrendingPaper } from "@/features/landing/types/landing.types";

interface LandingPersonalizedPapersSectionProps {
  papers?: LandingTrendingPaper[];
}

const fallbackPapers: LandingTrendingPaper[] = [
  {
    openAlexId: "W1988888548",
    title: "OpenMP: an industry standard API for shared-memory programming",
    authors: "Leonardo Dagum, Ramesh Menon",
    topic: "Parallel Computing and Optimization Techniques",
    citations: 3323,
    saveCount: 2,
  },
  {
    openAlexId: "W2741809807",
    title: "Measuring the Open Access Citation Advantage Across Articles",
    authors: "Jason R. Priem, Heather Piwowar",
    topic: "Open Access and Bibliometric Impact",
    citations: 312,
    saveCount: 0,
  },
  {
    openAlexId: "W2140124133",
    title: "Open Access Repositories and Trend Visibility in Emerging Research",
    authors: "Jason R. Priem, S. Okafor",
    topic: "Scientometrics and Research Discovery",
    citations: 88,
    saveCount: 0,
  },
];

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function LandingPersonalizedPapersSection({
  papers,
}: LandingPersonalizedPapersSectionProps) {
  const displayPapers = (papers?.length ? papers : fallbackPapers).slice(0, 3);

  return (
    <section
      id="personalized-intelligence"
      className="mt-8 scroll-mt-24 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-8 md:px-10 md:py-10"
    >
      <div className="mb-5 flex items-center gap-4">
        <span className="font-title-page text-[42px] italic text-emerald-600">
          §06b
        </span>
        <span className="h-px w-[130px] bg-slate-300" />
        <span className="text-xs uppercase tracking-[0.34em] text-slate-500">
          Personalized Intelligence
        </span>
      </div>

      <h2 className="max-w-[920px] text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-[#0b0f0e] md:text-[64px]">
        Follow{" "}
        <span className="font-title-page italic text-emerald-600">topics</span>.
        Track <span className="font-title-page italic text-blue-600">authors</span>.
        <br />
        Understand trends.
      </h2>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {displayPapers.map((paper, index) => (
          <article
            key={paper.openAlexId}
            className="flex min-h-[360px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]"
          >
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-[14px] font-medium text-emerald-700">
              #{index + 1}
            </span>

            <h3 className="mt-5 line-clamp-3 min-h-[72px] text-[18px] font-bold leading-[1.35] text-slate-950">
              {paper.title}
            </h3>

            <p className="mt-5 line-clamp-2 min-h-[48px] text-[16px] leading-[1.5] text-blue-600">
              {paper.authors}
            </p>

            <span className="mt-5 line-clamp-2 text-[15px] font-medium leading-[1.4] text-slate-600">
              {paper.topic || "Research trend"}
            </span>

            <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-200 pt-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Cites
                </p>
                <p className="mt-1 text-[28px] font-semibold leading-none text-slate-950">
                  {formatCompactNumber(paper.citations)}
                </p>
              </div>
              <Link
                to={routePaths.paperDetail(paper.openAlexId)}
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

