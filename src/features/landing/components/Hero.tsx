import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      >
        <img
          src="/landingpagebg2.png"
          alt="Academic research library with books and study workspace"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/55 via-[#0F172A]/40 to-[#0F172A]/65" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_85%_10%,rgba(254,243,199,0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl text-[2.6rem] leading-[1.05] text-white sm:text-[3.6rem] lg:text-[4.4rem]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            textShadow: "0 2px 24px rgba(15,23,42,0.5)",
          }}
        >
          Explore scientific knowledge through structured research signals.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-slate-100"
          style={{
            fontFamily: "'Manrope', sans-serif",
            textShadow: "0 1px 12px rgba(15,23,42,0.5)",
          }}
        >
          Owlreka helps researchers discover papers, analyze trends, and turn
          academic data into clear research insight across Computer Science and
          Engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-9 flex flex-wrap gap-3"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          <Link
            to={ROUTES.SEARCH}
            className="group inline-flex items-center gap-2 rounded-full bg-[#14532D] px-6 py-3 text-white shadow-lg transition-all hover:bg-[#166534] hover:shadow-emerald-900/30"
          >
            Explore Research
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to={ROUTES.GUIDE}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            View Scope
          </Link>
        </motion.div>
      </div>

      <div className="relative h-[3px] w-full overflow-hidden bg-slate-200">
        <motion.div
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#166534] to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </section>
  );
}
