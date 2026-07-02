import { useEffect } from "react";

import type { LandingTopic } from "@/features/landing/types/landing.types";

interface LandingLiveTrendsSectionProps {
  topics?: LandingTopic[];
}

const fallbackLiveTrendTopics: LandingTopic[] = [
  {
    name: "Large Language Models",
    topicId: "fallback-topic-1",
    works: 96000,
    citations: 1200000,
    score: 0.96,
    change: null,
    state: "Breakout",
    isFollowed: false,
  },
  {
    name: "AI in Education",
    topicId: "fallback-topic-2",
    works: 87000,
    citations: 830000,
    score: 0.87,
    change: null,
    state: "Hot",
    isFollowed: false,
  },
  {
    name: "Open Science",
    topicId: "fallback-topic-3",
    works: 79000,
    citations: 640000,
    score: 0.79,
    change: null,
    state: "Rising",
    isFollowed: false,
  },
  {
    name: "Green Computing",
    topicId: "fallback-topic-4",
    works: 71000,
    citations: 520000,
    score: 0.71,
    change: null,
    state: "Rising",
    isFollowed: false,
  },
  {
    name: "Digital Health",
    topicId: "fallback-topic-5",
    works: 68000,
    citations: 480000,
    score: 0.68,
    change: null,
    state: "Rising",
    isFollowed: false,
  },
  {
    name: "Bibliometrics",
    topicId: "fallback-topic-6",
    works: 52000,
    citations: 310000,
    score: 0.52,
    change: null,
    state: "Stable",
    isFollowed: false,
  },
  {
    name: "Quantum ML",
    topicId: "fallback-topic-7",
    works: 64000,
    citations: 420000,
    score: 0.64,
    change: null,
    state: "Rising",
    isFollowed: false,
  },
];

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function LandingLiveTrendsSection({
  topics,
}: LandingLiveTrendsSectionProps) {
  const liveTrendTopics = topics?.length ? topics : fallbackLiveTrendTopics;

  useLiveTrendsAutoScroll();

  return (
    <section
      id="live-trends"
      className="mt-16 rounded-[28px] border border-slate-200/80 bg-[#f2f4f3] px-6 py-12 md:px-10 md:py-16"
    >
      <div className="mb-7 flex items-center gap-4">
        <span className="font-title-page text-[36px] italic text-emerald-600">
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
          <span className="font-title-page italic text-amber-500">right now</span>
        </h2>
      </div>

      <div
        id="live-trends-rail"
        className="no-scrollbar -mx-1 overflow-x-auto pb-2"
      >
        <div className="flex min-w-max gap-4 px-1">
          {liveTrendTopics.map((topic, index) => (
            <LiveTrendTopicCard key={topic.topicId} topic={topic} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveTrendTopicCard({
  topic,
  index,
}: {
  topic: LandingTopic;
  index: number;
}) {
  const score = Math.round(topic.score * 100);

  return (
    <article className="flex h-[300px] w-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-none transition hover:border-emerald-300 hover:shadow-[0_10px_28px_rgba(22,163,74,0.18)]">
      <div className="mb-8 flex items-center text-[13px] text-slate-400">
        <span>#{String(index + 1).padStart(2, "0")}</span>
      </div>
      
      <h3 className="mt-6 line-clamp-2 min-h-[56px] text-[19px] font-bold leading-[1.35] text-black">
        {topic.name}
      </h3>
      <div className="mt-auto grid grid-cols-2 items-end gap-4 pt-8">
        <div>
          <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
            Score
          </p>
          <p className="text-[40px] font-semibold text-amber-500">
            {score}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[12px] uppercase tracking-[0.12em] text-slate-400">
            Works
          </p>
          <p className="text-[40px] font-semibold text-emerald-600">
            {formatCompactNumber(topic.works)}
          </p>
        </div>
      </div>
    </article>
  );
}

function useLiveTrendsAutoScroll() {
  useEffect(() => {
    const rail = document.getElementById("live-trends-rail");
    if (!rail) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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
}

