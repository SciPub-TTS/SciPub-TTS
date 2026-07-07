import { useQuery } from "@tanstack/react-query";

import { getSearchSummary } from "@/features/search/services";

import { CountUp, Reveal } from "./primitives";

function formatCompactCount(value: number | null) {
  if (value === null) {
    return "2.4M+";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: "compact",
  }).format(value);
}

export function Metrics() {
  const worksSummaryQuery = useQuery({
    queryKey: ["searchSummary", "works"],
    queryFn: () => getSearchSummary("works"),
  });

  const totalWorks = worksSummaryQuery.data?.totalIndexedCount ?? null;

  const cards = [
    {
      label: "TOTAL PAPERS",
      node:
        totalWorks === null
          ? "2.4M+"
          : formatCompactCount(totalWorks) + (worksSummaryQuery.data?.totalCountExact ? "" : "+"),
      cap: "indexed research works",
    },
    {
      label: "ACTIVE SCOPE",
      node: "1 Domain",
      cap: "Focused research scope",
    },
    {
      label: "COMPUTER SCIENCE",
      node: <CountUp to={17} />,
      cap: "research categories",
    },
    {
      label: "ENGINEERING",
      node: <CountUp to={22} />,
      cap: "research categories",
    },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
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
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
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
