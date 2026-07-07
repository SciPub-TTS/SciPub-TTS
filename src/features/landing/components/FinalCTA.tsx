import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import MainFooter from "@/layout/global/Footer";

import { Reveal } from "./primitives";
import { SectionBg } from "./SectionBg";

export function FinalCTA() {
  return (
    <section className="relative">
      <SectionBg src="/image-1.png" opacity={0.68} />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#0F172A] bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(20,83,45,0.06),transparent_55%)]" />
            <div className="relative">
              <h2
                className="mx-auto max-w-2xl text-[2.2rem] leading-tight text-[#0F172A] sm:text-[3rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                Turn academic data into research direction.
              </h2>
              <p
                className="mx-auto mt-4 max-w-xl text-slate-600"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Explore papers, signals, topics, and reports in one structured
                workspace.
              </p>
              <Link
                to={ROUTES.GUIDE}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#14532D] px-7 py-3.5 text-white shadow-lg transition-all hover:bg-[#166534] hover:shadow-xl"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                Start with Research Scope
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return <MainFooter />;
}
