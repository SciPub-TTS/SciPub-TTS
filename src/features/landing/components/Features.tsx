import { Search, TrendingUp, FileBarChart } from "lucide-react";

import { Reveal } from "./primitives";
import { SectionBg } from "./SectionBg";

const FEATURES = [
  {
    icon: Search,
    title: "Discover papers",
    desc: "Search academic works and filter by topic, publication year, source, and relevance.",
  },
  {
    icon: TrendingUp,
    title: "Track research trends",
    desc: "Understand emerging topics, signals, and research momentum across fields.",
  },
  {
    icon: FileBarChart,
    title: "Build reports",
    desc: "Collect findings from search and trends, then export structured research summaries.",
  },
] as const;

export function Features() {
  return (
    <section className="relative bg-[#E1EFE6]">
      <SectionBg src="/image-3.png" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <span
            className="text-[0.72rem] tracking-[0.2em] text-[#166534]"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            CAPABILITIES
          </span>
          <h2
            className="mt-3 text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            From search to insight.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <div className="group h-full rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#14532D] text-white transition-transform group-hover:scale-105">
                  <feature.icon className="size-6" />
                </div>
                <h3
                  className="mt-5 text-[1.3rem] text-[#0F172A]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-slate-600"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
