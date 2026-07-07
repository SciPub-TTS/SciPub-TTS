import { Search, LineChart, Bookmark, Download } from "lucide-react";

import { Reveal } from "./primitives";
import { SectionBg } from "./SectionBg";

const STEPS = [
  { icon: Search, title: "Search", desc: "Query millions of indexed academic works." },
  { icon: LineChart, title: "Analyze", desc: "Read trends, signals, and topic momentum." },
  { icon: Bookmark, title: "Save", desc: "Collect papers and findings into a workspace." },
  { icon: Download, title: "Export", desc: "Turn results into structured research reports." },
] as const;

export function Workflow() {
  return (
    <section className="relative">
      <SectionBg src="/image-2.png" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <span
            className="text-[0.72rem] tracking-[0.2em] text-[#166534]"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            HOW IT WORKS
          </span>
          <h2
            className="mt-3 text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            Research workflow designed for clarity.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="group relative h-full rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[2.2rem] leading-none text-slate-200 transition-colors group-hover:text-[#14532D]/25"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    0{index + 1}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#14532D]/8 text-[#14532D]">
                    <step.icon className="size-5" />
                  </div>
                </div>
                <h3
                  className="mt-5 text-[1.2rem] text-[#0F172A]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-1.5 text-[0.9rem] text-slate-600"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
