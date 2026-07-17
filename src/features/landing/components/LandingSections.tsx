import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { animate, motion, useInView } from "motion/react";
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  Cog,
  Cpu,
  Download,
  FileBarChart,
  FileText,
  LineChart,
  Search,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ROUTES } from "@/app/router";
import { usePublicationTrend } from "@/features/dashboard/topic/hooks/usePublicationTrend";
import { getSearchSummary } from "@/features/search/services";
import { searchScopeLabel } from "@/features/search/services";
import MainFooter from "@/layout/global/Footer";

import { getLandingTrendPreview } from "../services/landingApi";

const CS_TAGS = [
  {
    name: "Artificial Intelligence",
    description: "Learning, reasoning, and autonomous decision systems.",
  },
  {
    name: "Computational Theory and Mathematics",
    description: "Algorithms, complexity, models, and formal methods.",
  },
  {
    name: "Computer Graphics and Computer-Aided Design",
    description: "Visual computing, rendering, modeling, and CAD workflows.",
  },
  {
    name: "Computer Networks and Communications",
    description: "Network protocols, distributed systems, and connectivity.",
  },
  {
    name: "Computer Science Applications",
    description: "Applied computing methods across real-world domains.",
  },
  {
    name: "Computer Vision and Pattern Recognition",
    description: "Image understanding, detection, recognition, and perception.",
  },
  {
    name: "Hardware and Architecture",
    description: "Processors, systems architecture, and computing hardware.",
  },
  {
    name: "Human-Computer Interaction",
    description: "User experience, interaction design, and usability research.",
  },
  {
    name: "Information Systems",
    description: "Data systems, enterprise platforms, and information flow.",
  },
  {
    name: "Signal Processing",
    description: "Signal analysis, filtering, compression, and transformation.",
  },
  {
    name: "Software",
    description: "Software engineering, development methods, and quality.",
  },
] as const;
const ENG_TAGS = [
  {
    name: "General Engineering",
    description: "Cross-disciplinary engineering methods and systems.",
  },
  {
    name: "Aerospace Engineering",
    description: "Aircraft, spacecraft, propulsion, and flight systems.",
  },
  {
    name: "Automotive Engineering",
    description: "Vehicle design, mobility systems, and powertrains.",
  },
  {
    name: "Biomedical Engineering",
    description: "Engineering methods for healthcare and biological systems.",
  },
  {
    name: "Civil and Structural Engineering",
    description: "Infrastructure, structures, materials, and resilience.",
  },
  {
    name: "Computational Mechanics",
    description: "Simulation and numerical methods for physical systems.",
  },
  {
    name: "Control and Systems Engineering",
    description: "Control theory, automation, and dynamic systems.",
  },
  {
    name: "Electrical and Electronic Engineering",
    description: "Circuits, electronics, energy systems, and devices.",
  },
  {
    name: "Industrial and Manufacturing Engineering",
    description: "Production systems, operations, and manufacturing processes.",
  },
  {
    name: "Mechanical Engineering",
    description: "Machines, thermal systems, mechanics, and design.",
  },
  {
    name: "Mechanics of Materials",
    description: "Material behavior, stress, deformation, and failure.",
  },
  {
    name: "Ocean Engineering",
    description: "Marine structures, offshore systems, and ocean technology.",
  },
  {
    name: "Safety, Risk, Reliability and Quality",
    description: "Risk analysis, reliability modeling, and quality assurance.",
  },
  {
    name: "Media Technology",
    description: "Engineering for media systems, production, and delivery.",
  },
  {
    name: "Building and Construction",
    description:
      "Construction methods, building systems, and project delivery.",
  },
  {
    name: "Architecture",
    description: "Built environment design, planning, and spatial systems.",
  },
] as const;
const FEATURES = [
  {
    icon: Search,
    title: "Discovery workspace",
    desc: "Search works, authors, and topics inside the scoped research coverage, then refine by source, subfield, year, citation, and more.",
  },
  {
    icon: TrendingUp,
    title: "Trending dashboards",
    desc: "Read publication movement, topic momentum, and weekly trend snapshots for Computer Science and Engineering.",
  },
  {
    icon: Bookmark,
    title: "Bookmarks and collections",
    desc: "Save papers, group them into collections, and keep a cleaner reading trail before turning them into reports or social content.",
  },
  {
    icon: FileBarChart,
    title: "Reports and sharing",
    desc: "Export structured report inputs, monitor research threads through feed, and publish bookmark-based notes in Social Hub.",
  },
] as const;
const STEPS = [
  {
    icon: Search,
    title: "Discover",
    desc: "Search scoped works, topics, and authors from the main discovery workspace.",
  },
  {
    icon: LineChart,
    title: "Track",
    desc: "Open the trending dashboard to read signals, momentum, and publication movement.",
  },
  {
    icon: Bookmark,
    title: "Collect",
    desc: "Bookmark papers into collections so the same works stay organized across search, bookmarks, and detail views.",
  },
  {
    icon: Download,
    title: "Turn into output",
    desc: "Build reports, follow the feed, or publish bookmark-driven notes through Social Hub.",
  },
] as const;
const MIN_PREVIEW_YEAR = 2000;
const MAX_PREVIEW_YEAR = 2026;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setVal(value),
    });

    return () => controls.stop();
  }, [duration, inView, to]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

function SectionBg({
  src,
  from = "#E1EFE6",
  opacity = 0.72,
}: {
  src: string;
  from?: string;
  opacity?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        whileInView={{ scale: [1.05, 1.16, 1.05], opacity }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 30, ease: "easeInOut", repeat: Infinity },
        }}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.78) saturate(0.95)" }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${from} 0%, ${from}ee 8%, ${from}66 30%, ${from}55 50%, ${from}66 70%, ${from}ee 92%, ${from} 100%)`,
        }}
      />
    </div>
  );
}

function formatCompactCount(value: number | null) {
  if (value === null) {
    return "2.4M+";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: "compact",
  }).format(value);
}

function formatCompactNumber(value: number | null) {
  if (value === null) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1_000 ? 1 : 0,
  }).format(value);
}

function formatSnapshotDate(value?: string) {
  if (!value) {
    return "latest snapshot";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatMillions(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

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
  tags: readonly {
    name: string;
    description: string;
  }[];
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
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            {count}
          </div>
          <span
            className="text-[0.72rem] tracking-[0.14em] text-slate-400"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            ID
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

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {tags.map((tag) => (
          <div
            key={tag.name}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors group-hover:border-[#166534]/30 group-hover:bg-[#14532D]/5"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            <p className="text-[0.82rem] font-semibold leading-snug text-slate-800">
              {tag.name}
            </p>
            <p className="mt-1 text-[0.72rem] leading-snug text-slate-500">
              {tag.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function YearSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <span
        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9AAFD0]"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((currentValue) => !currentValue)}
        className={[
          "flex min-w-[140px] items-center justify-between rounded-[1.15rem] border px-5 py-3.5 text-[1.05rem] font-semibold text-[#264C7E] transition",
          open
            ? "border-[#A7BFDE] bg-white shadow-[0_10px_24px_rgba(15,117,188,0.12)]"
            : "border-[#D7E3F4] bg-[#F9FBFF] hover:border-[#BDD0E8] hover:bg-white",
        ].join(" ")}
      >
        <span>{value}</span>
        <ChevronDown
          className={[
            "size-4 text-[#8BA7CC] transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 max-h-56 min-w-full overflow-y-auto rounded-[1rem] border border-[#D7E3F4] bg-white py-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {options.map((option) => (
            <button
              key={`${label}-${option}`}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={[
                "block w-full px-4 py-2 text-left text-[0.98rem] transition",
                option === value
                  ? "bg-[#EEF6FF] font-semibold text-[#0F75BC]"
                  : "text-[#264C7E] hover:bg-[#F5F9FF]",
              ].join(" ")}
              style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HeroSection() {
  return (
    <section id="landing-hero" className="relative overflow-hidden">
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
          className="w-full max-w-none text-[2.6rem] leading-[1.05] text-white sm:text-[3.6rem] lg:text-[4.4rem]"
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
          academic activity into scoped insight across Computer Science (field
          17) and Engineering (field 22), with bookmarks, reports, feeds, and
          social note sharing in one workspace.
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
            to={ROUTES.TRENDING}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            View Trending Dashboard
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

function MetricsSection() {
  const worksSummaryQuery = useQuery({
    queryKey: ["searchSummary", "works"],
    queryFn: () => getSearchSummary("works"),
  });

  const totalWorks = worksSummaryQuery.data?.totalIndexedCount ?? null;

  const cards = [
    {
      label: "TOTAL WORKS",
      node:
        totalWorks === null
          ? "2.4M+"
          : formatCompactCount(totalWorks) +
          (worksSummaryQuery.data?.totalCountExact ? "" : "+"),
      cap: "indexed research works",
    },
    {
      label: "PHYSICAL SCIENCES",
      node: <CountUp to={3} />,
      cap: "Scoped domain",
    },
    {
      label: "COMPUTER SCIENCE",
      node: <CountUp to={17} />,
      cap: "Field ID 17",
    },
    {
      label: "ENGINEERING",
      node: <CountUp to={22} />,
      cap: "Field ID 22",
    },
  ] as const;

  return (
    <section
      id="landing-metrics"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.08}>
            <div className="group h-full rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
              <span
                className="text-[0.68rem] tracking-[0.16em] text-slate-500"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                {card.label}
              </span>
              <div
                className="mt-3 text-[2.4rem] leading-none text-[#14532D]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                {card.node}
              </div>
              <p
                className="mt-2 text-[0.9rem] text-slate-500"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {card.cap}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ScopeSection() {
  return (
    <section id="landing-scope" className="relative">
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
            className="mt-3 w-full max-w-none text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            Focused research scope, built for discovery.
          </h2>
          <p
            className="mt-4 w-full max-w-none"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {searchScopeLabel} The workspace narrows discovery to the field IDs
            your product actually supports, then surfaces their subfields
            through search, trend analysis, bookmarks, reports, and sharing.
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
              desc="Field ID 17 covers the computing-oriented subfields used throughout discovery, trending, and paper detail exploration."
              tags={CS_TAGS}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <ScopeCard
              icon={Cog}
              title="Engineering"
              count="22"
              desc="Field ID 22 anchors the engineering-side scope so reports, trends, and collections stay inside the same research boundary."
              tags={ENG_TAGS}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="landing-features" className="relative bg-[#E1EFE6]">
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
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            Built around the workflow already in the product.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <div className="group h-full rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#14532D] text-white transition-transform group-hover:scale-105">
                  <feature.icon className="size-6" />
                </div>
                <h3
                  className="mt-5 text-[1.3rem] text-[#0F172A]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                  }}
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

function WorkflowSection() {
  return (
    <section id="landing-workflow" className="relative">
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
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            Search, trend, collect, report, and share.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="group relative h-full rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[2.2rem] leading-none text-black transition-colors group-hover:text-[#14532D]"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    0{index + 1}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#14532D]/8 text-[#14532D]">
                    <step.icon className="size-5" />
                  </div>
                </div>
                <h3
                  className="mt-5 text-[1.2rem] text-[#0F172A]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                  }}
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

function PreviewSection() {
  const [startYear, setStartYear] = useState(String(MIN_PREVIEW_YEAR));
  const [endYear, setEndYear] = useState(String(MAX_PREVIEW_YEAR));
  const landingTrendPreviewQuery = useQuery({
    queryKey: ["landingTrendPreview"],
    queryFn: () => getLandingTrendPreview(),
  });
  const { publicationTrend, loading: isPublicationTrendLoading } =
    usePublicationTrend(Number(startYear), Number(endYear));

  const landingTrendPreview = landingTrendPreviewQuery.data;
  const hasLoadedTrendSnapshot = landingTrendPreviewQuery.status !== "pending";
  const topicResults = landingTrendPreview?.topTopics ?? [];
  const keywordResults = landingTrendPreview?.topKeywords ?? [];
  const hasTrendingTopics = topicResults.length > 0;
  const hasTrendingKeywords = keywordResults.length > 0;
  const hasTrendingThisWeek = hasTrendingTopics || hasTrendingKeywords;
  const yearOptions = Array.from(
    { length: MAX_PREVIEW_YEAR - MIN_PREVIEW_YEAR + 1 },
    (_, index) => String(MIN_PREVIEW_YEAR + index),
  );
  const fromYearOptions = yearOptions.filter(
    (year) => Number(year) <= Number(endYear),
  );
  const toYearOptions = yearOptions.filter(
    (year) => Number(year) >= Number(startYear),
  );

  return (
    <section id="landing-preview" className="relative bg-[#E1EFE6]">
      <SectionBg src="/image-4.jpg" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <span
            className="text-[0.72rem] tracking-[0.2em] text-[#166534]"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            PRODUCT PREVIEW
          </span>
          <h2
            className="mt-3 text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            One workspace connecting search to action.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
              <span className="size-3 rounded-full bg-[#F37021]" />
              <span className="size-3 rounded-full bg-[#0F75BC]" />
              <span className="size-3 rounded-full bg-[#7AC143]" />
              <div
                className="ml-3 rounded-md border border-slate-200 bg-white px-3 py-1 text-[0.78rem] text-slate-400"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                owlreka.app / workspace
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[0.95fr_1.35fr]">
              <div className="space-y-3">
                {!hasLoadedTrendSnapshot
                  ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`loading-topic-${index + 1}`}
                      className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0F75BC]/10 text-[#0F75BC]">
                        <FileText className="size-4" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))
                  : null}

                {hasLoadedTrendSnapshot && !hasTrendingThisWeek ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-500">
                    <p
                      className="text-[0.92rem]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      No trending this week.
                    </p>
                  </div>
                ) : null}

                {topicResults.map((topic) => (
                  <div
                    key={topic.topicId ?? topic.name}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0F75BC]/10 text-[#0F75BC]">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="break-words text-[0.98rem] text-[#0F172A]"
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {topic.name}
                      </p>
                      <p
                        className="mt-0.5 text-[0.82rem] text-slate-500"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Topic trend - {formatCompactNumber(topic.works)} works -{" "}
                        <span className="text-[#0F75BC]">
                          {formatCompactNumber(topic.citations)} citations
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {!hasLoadedTrendSnapshot ? (
                  <div className="rounded-[1.2rem] border border-slate-200 bg-[#F8FBFF] p-4">
                    <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`loading-keyword-${index + 1}`}
                          className="h-8 animate-pulse rounded-lg bg-white"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasLoadedTrendSnapshot && hasTrendingKeywords ? (
                  <div className="rounded-[1.2rem] border border-slate-200 bg-[#F8FBFF] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className="text-[0.72rem] uppercase tracking-[0.2em] text-[#0F75BC]"
                        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      >
                        Trending Keywords
                      </p>
                      <span
                        className="rounded-full border border-[#0F75BC]/20 bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-[#0F75BC]"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Top {keywordResults.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {keywordResults.map((keyword) => (
                        <div
                          key={keyword.keywordId ?? keyword.name}
                          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                        >
                          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-[#F37021]/10 text-[#F37021]">
                            <TrendingUp className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="break-words text-[0.9rem] text-[#0F172A]"
                              style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              #{keyword.name}
                            </p>
                            <p
                              className="mt-0.5 text-[0.78rem] text-slate-500"
                              style={{ fontFamily: "'Manrope', sans-serif" }}
                            >
                              {formatCompactNumber(keyword.works)} works -{" "}
                              <span className="text-[#F37021]">
                                {formatCompactNumber(keyword.citations)}{" "}
                                citations
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3
                        className="text-[1.6rem] leading-tight text-[#0F172A] sm:text-[1.8rem]"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Publication Trend Over Time
                      </h3>
                      <p
                        className="mt-1 text-[1rem] text-slate-500"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Number of papers published per year
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <YearSelect
                        label="From"
                        value={startYear}
                        options={fromYearOptions}
                        onChange={(nextStartYear) => {
                          setStartYear(nextStartYear);
                          if (Number(nextStartYear) > Number(endYear)) {
                            setEndYear(nextStartYear);
                          }
                        }}
                      />
                      <YearSelect
                        label="To"
                        value={endYear}
                        options={toYearOptions}
                        onChange={(nextEndYear) => {
                          setEndYear(nextEndYear);
                          if (Number(nextEndYear) < Number(startYear)) {
                            setStartYear(nextEndYear);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 h-[320px]">
                    {isPublicationTrendLoading ? (
                      <div className="flex h-full items-center justify-center rounded-[1rem] border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                        Loading publication trend...
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={publicationTrend}
                          margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="landing-publication-gradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#2563EB"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#2563EB"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            stroke="#CBD5E1"
                            strokeDasharray="10 10"
                            vertical={false}
                            opacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="publications"
                            name="Publications"
                            stroke="#2563EB"
                            strokeWidth={2}
                            fill="url(#landing-publication-gradient)"
                          />
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748B" }}
                          />
                          <YAxis
                            width={80}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            tickFormatter={(value) =>
                              formatMillions(Number(value))
                            }
                          />
                          <Tooltip
                            formatter={(value) => [
                              Number(value ?? 0).toLocaleString("en-US"),
                              "Publications",
                            ]}
                            contentStyle={{
                              borderRadius: 14,
                              border: "1px solid #D7E3F4",
                              boxShadow: "0 12px 30px rgba(37,99,235,0.08)",
                            }}
                          />
                          <Legend
                            align="right"
                            wrapperStyle={{
                              paddingTop: 8,
                              color: "#2563EB",
                              fontSize: "12px",
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span
                    className="text-[0.8rem] text-slate-600"
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    Report summary
                  </span>
                  <p
                    className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-500"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {!hasLoadedTrendSnapshot
                      ? "Loading this week's trend snapshot."
                      : hasTrendingThisWeek
                        ? `${formatCompactNumber(landingTrendPreview?.totalTrendingTopics ?? null)} trending topics - ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`
                        : `No trending snapshot data for ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`}
                        ? `${formatCompactNumber(landingTrendPreview?.totalTrendingTopics ?? null)} trending topics - ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`
                        : `No trending snapshot data for ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="flex-1 rounded-lg border border-[#F37021] bg-[#F37021] py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#D85C12]"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      CSV
                    </button>
                    <button
                      className="flex-1 rounded-lg border border-[#0F75BC] bg-[#0F75BC] py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#0B5D97]"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="landing-cta" className="relative">
      <SectionBg src="/image-1.png" opacity={0.68} />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#0F172A] bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(20,83,45,0.06),transparent_55%)]" />
            <div className="relative">
              <h2
                className="mx-auto w-full max-w-none text-[2.2rem] leading-tight text-[#0F172A] sm:text-[3rem]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                }}
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

export function LandingMainSections() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <ScopeSection />
      <FeaturesSection />
      <WorkflowSection />
      <PreviewSection />
      <CtaSection />
    </>
  );
}

export function LandingFooter() {
  return <MainFooter />;
}
