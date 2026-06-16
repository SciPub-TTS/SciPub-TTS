import { PieChart as PieChartIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatCompactNumber,
  formatFullNumber,
} from "@/features/search/utils";

import type {
  PaperDetailImpactChartItem,
  PaperDetailImpactPieChartItem,
} from "../../types";
import type { PaperImpactChartsSectionData } from "../../view-models/impactSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperImpactChartsSectionProps = {
  section: PaperImpactChartsSectionData;
};

type CitationChartProps = {
  items: PaperDetailImpactChartItem[];
};

type LocationAccessChartProps = {
  items: PaperDetailImpactPieChartItem[];
};

type CitationChartTooltipProps = {
  active?: boolean;
  label?: number | string;
  payload?: Array<{ value?: number }>;
};

type LocationAccessChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
};

export default function PaperImpactChartsSection(
  props: PaperImpactChartsSectionProps,
) {
  const { section } = props;
  const hasBarChart = section.barChartItems.length > 0;
  const hasPieChart = section.pieChartItems.length > 0;

  if (!hasBarChart && !hasPieChart) {
    return null;
  }

  return (
    <DetailSectionCard
      icon={<PieChartIcon className="h-5 w-5" />}
      title="Impact Charts"
    >
      <div className="grid gap-4 xl:grid-cols-1">
        {hasBarChart ? <CitationChart items={section.barChartItems} /> : null}
        {hasPieChart ? (
          <LocationAccessChart items={section.pieChartItems} />
        ) : null}
      </div>
    </DetailSectionCard>
  );
}

function CitationChart(props: CitationChartProps) {
  const { items } = props;

  return (
    <div className="rounded-2xl border border-black bg-[#f1f3f4] p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-black">
          Citations by Year
        </h3>
        <p className="text-sm text-black">
          Annual citation counts returned directly by OpenAlex `counts_by_year`.
        </p>
      </div>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            margin={{ top: 12, right: 12, bottom: 6, left: 0 }}
          >
            <defs>
              <linearGradient id="impactBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3c8534" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#8fdc86" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#b8c2cc"
              strokeDasharray="4 6"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#9a6700", fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#9a6700" }}
            />
            <YAxis
              tickFormatter={formatCompactNumber}
              tick={{ fill: "#9a6700", fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip content={<CitationChartTooltip />} />
            <Bar
              dataKey="citations"
              radius={[10, 10, 0, 0]}
              fill="url(#impactBarGradient)"
            >
              {items.map((item) => (
                <Cell
                  key={`citation-bar-${item.year}`}
                  stroke="#2f6e29"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LocationAccessChart(props: LocationAccessChartProps) {
  const { items } = props;

  return (
    <div className="rounded-2xl border border-black bg-[#f1f3f4] p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-black">
          Location Access Split
        </h3>
        <p className="text-sm text-black">
          Share of OpenAlex locations marked open access versus restricted.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="label"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
              >
                {items.map((item) => (
                  <Cell key={item.label} fill={item.color} stroke="#111111" />
                ))}
              </Pie>
              <Tooltip content={<LocationAccessChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-black bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-3.5 w-3.5 rounded-full border border-black"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-sm font-semibold text-black">{item.label}</p>
              </div>
              <p className="mt-2 text-lg font-semibold text-[#9a6700]">
                {formatFullNumber(item.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CitationChartTooltip(props: CitationChartTooltipProps) {
  const { active, label, payload } = props;

  if (!active || !payload?.length) {
    return null;
  }

  const citationCount = payload[0]?.value;

  if (typeof citationCount !== "number") {
    return null;
  }

  return (
    <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6700]">
        Year {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatFullNumber(citationCount)} citations
      </p>
    </div>
  );
}

function LocationAccessChartTooltip(props: LocationAccessChartTooltipProps) {
  const { active, payload } = props;

  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const value = item?.value;
  const label = item?.name;

  if (typeof value !== "number" || !label) {
    return null;
  }

  return (
    <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6700]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatFullNumber(value)} locations
      </p>
    </div>
  );
}
