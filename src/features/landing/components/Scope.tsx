import { Cpu, Cog } from "lucide-react";

import { searchScopeLabel } from "@/features/search/services";

import { Reveal } from "./primitives";
import { SectionBg } from "./SectionBg";

const CS_TAGS = [
  "AI",
  "Data Mining",
  "Software Engineering",
  "Networks",
  "Information Systems",
  "Algorithms",
] as const;
const ENG_TAGS = [
  "Systems",
  "Materials",
  "Industrial Engineering",
  "Electronics",
  "Mechanical Design",
  "Applied Science",
] as const;

function ScopeCard({
  icon: Icon,
  title,
  count,
  desc,
  tags,
}: {
  icon: typeof Cpu;
  title: string;
  count: string;
  desc: string;
  tags: readonly string[];
}) {
  return (
    <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-slate-300 bg-white p-8 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#14532D] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#14532D]/8 text-[#14532D]">
          <Icon className="size-7" />
        </div>
        <div className="text-right">
          <div
            className="text-[2.6rem] leading-none text-[#0F172A]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            {count}
          </div>
          <span
            className="text-[0.72rem] tracking-[0.14em] text-slate-400"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            CATEGORIES
          </span>
        </div>
      </div>

      <h3
        className="mt-6 text-[1.5rem] text-[#0F172A]"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-slate-600"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        {desc}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.82rem] text-slate-700 transition-colors group-hover:border-[#166534]/30 group-hover:bg-[#14532D]/5"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Scope() {
  return (
    <section className="relative">
      <SectionBg src="/image-1.png" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <span
            className="text-[0.72rem] tracking-[0.2em] text-[#166534]"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            RESEARCH SCOPE
          </span>
          <h2
            className="mt-3 max-w-2xl text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            Focused research scope, built for discovery.
          </h2>
          <p
            className="mt-4 max-w-2xl text-slate-600"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {searchScopeLabel} Structured into a focused research scope for
            clearer discovery, filtering, and exploration.
          </p>
        </Reveal>

        <div className="relative mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
            <span className="size-2 rounded-full bg-[#166534]" />
            <span className="h-px w-10 bg-slate-300" />
            <span className="size-3 rounded-full border-2 border-[#166534] bg-white" />
            <span className="h-px w-10 bg-slate-300" />
            <span className="size-2 rounded-full bg-[#166534]" />
          </div>

          <Reveal delay={0.05}>
            <ScopeCard
              icon={Cpu}
              title="Computer Science"
              count="17"
              desc="From intelligent systems to the foundations of computation and data."
              tags={CS_TAGS}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <ScopeCard
              icon={Cog}
              title="Engineering"
              count="22"
              desc="Applied science spanning systems, materials, and physical design."
              tags={ENG_TAGS}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
