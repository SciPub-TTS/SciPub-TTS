import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Legend, ResponsiveContainer, Scatter, ScatterChart,
    Tooltip, type TooltipContentProps,
    XAxis,
    YAxis, ZAxis
} from "recharts";
import {useEffect, useRef, useState} from "react";
import {usePublicationTrend} from "@/features/dashboard/topic/hooks/usePublicationTrend.ts";
import {ChevronDown} from "lucide-react";
import type {YearSelectProps} from "@/features/dashboard/topic/types/publication.ts";
import {useTopicMomentum} from "@/features/dashboard/topic/hooks/useTopicMomentum.ts";
import type {TopicBubble} from "@/features/dashboard/topic/types/scatter.ts";
import {useTopicScatter} from "@/features/dashboard/topic/hooks/useTopicScatter.ts";

const MIN_YEAR = 2000;
const MAX_YEAR = new Date().getFullYear();

type TopicGeneralChartPartProps = {
    startDate: string;
    endDate: string;
    fieldId: string;
    formula: string;
};

export default function TopicGeneralChartPart({
                                                  startDate,
                                                  endDate,
                                                  fieldId,
                                                  formula
                                              }: TopicGeneralChartPartProps){
    return(
        <div className="flex flex-col items-center gap-6">
            <GeneralPart/>

            <div className="grid grid-cols-2 gap-6 select-none">
                <ScatterHotTopics
                startDate={startDate}
                endDate={endDate}
                fieldId={fieldId}
                formula={formula}
                />

                <MomentumPart
                    startDate={startDate}
                    endDate={endDate}
                    fieldId={fieldId}
                    formula={formula}
                />
            </div>
        </div>
    )
}

function YearSelect({ value, onChange, options, label }: YearSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="relative" ref={ref}>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1 ml-0.5">
                {label}
            </span>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`
                    flex items-center gap-2 min-w-[90px] px-3 py-2 rounded-lg
                    bg-slate-50 border text-sm font-semibold text-slate-700
                    transition-all duration-150 outline-none
                    ${open
                    ? "border-indigo-400 ring-2 ring-indigo-100 bg-white shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                }
                `}
            >
                <span className="flex-1 text-left">{value}</span>
                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="
                    absolute z-50 top-full mt-1.5 right-0 min-w-[90px]
                    bg-white border border-slate-200 rounded-xl shadow-lg
                    py-1 max-h-52 overflow-y-auto
                ">
                    {options.map((y) => (
                        <button
                            key={y}
                            type="button"
                            onClick={() => { onChange(y); setOpen(false); }}
                            className={`
                                w-full text-left px-3 py-1.5 text-sm transition-colors
                                ${y === value
                                ? "bg-indigo-50 text-indigo-600 font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                            }
                            `}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function GeneralPart(){
    const [startYear, setStartYear] = useState(2016);
    const [endYear, setEndYear] = useState(2026);

    const years = Array.from(
        { length: MAX_YEAR - MIN_YEAR + 1 },
        (_, i) => MIN_YEAR + i
    );

    const {publicationTrend} = usePublicationTrend(
        startYear,endYear
    );

    return(
        <div className="rounded-lg border border-slate-200 bg-white p-4
        flex flex-col gap-2 w-full">

            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900">
                        Publication Trend Over Time
                    </h1>
                    <h2 className="text-sm opacity-75">
                        Number of papers published per year
                    </h2>
                </div>

                <div className="flex gap-2">
                    <YearSelect
                        label="From"
                        value={startYear}
                        options={years.filter((y) => y <= endYear)}
                        onChange={(newStart) => {
                            setStartYear(newStart);
                            if (newStart > endYear) setEndYear(newStart);
                        }}
                    />

                    <span className="mb-2.5 text-slate-300 font-light text-lg">  </span>

                    <YearSelect
                        label="To"
                        value={endYear}
                        options={years.filter((y) => y >= startYear)}
                        onChange={(newEnd) => {
                            setEndYear(newEnd);
                            if (newEnd < startYear) setStartYear(newEnd);
                        }}
                    />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={publicationTrend}
                    margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                    <defs>
                        <linearGradient id="publicationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#aaa" strokeDasharray="10 10" vertical={false} opacity={0.6} />
                    <Area
                        type="monotone"
                        dataKey="publications"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fill="url(#publicationGradient)"
                    />
                    <XAxis dataKey="year" />
                    <YAxis
                        width={80}
                        tickFormatter={(value) =>
                            new Intl.NumberFormat("en-US", {
                                notation: "compact",
                                maximumFractionDigits: 1
                            }).format(value)
                        }
                    />
                    <Tooltip />
                    <Legend align="right" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

type ScatterPartProps = {
    startDate: string;
    endDate: string;
    fieldId: string;
    formula: string;
};

function fmtNum(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return String(n);
}

function ScatterTooltip({
                            active,
                            payload,
                        }: TooltipContentProps) {

    if (!active || !payload?.length) {
        return null;
    }

    const item =
        payload[0]
            .payload as TopicBubble;

    return (
        <div className="rounded-md border bg-white p-4 shadow">
            <div className="mb-2 font-semibold text-sm">
                {item.name}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
                <div>
                    Works:
                    {" "}
                    <span className="font-medium text-gray-900">
                        {fmtNum(item.works)}
                    </span>
                </div>

                <div>
                    Citations:
                    {" "}
                    <span className="font-medium text-gray-900">
                        {fmtNum(item.citations)}
                    </span>
                </div>

                <div>
                    Score:
                    {" "}
                    <span className="font-medium text-gray-900">
                        {item.score}
                    </span>
                </div>
            </div>
        </div>
    );
}

interface BubbleProps {
    cx?: number;
    cy?: number;
    payload?: TopicBubble;
}

function Bubble({ cx = 0, cy = 0, payload }: BubbleProps) {
    if (!payload) return null;
    const r = Math.sqrt(payload.score) * 3.5;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={payload.color}
            fillOpacity={0.75}
            stroke={payload.color}
            strokeWidth={1.5}
        />
    );
}

function ScatterHotTopics({
                                     startDate,
                                     endDate,
                                     fieldId,
                                     formula
                                 }:ScatterPartProps) {
    const { topicList, isLoading, error } = useTopicScatter({startDate, endDate, fieldId, formula});

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-2">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-slate-900">
                    Research topics — works vs citations
                </h2>
                <p className="text-sm opacity-75">
                    Bubble size reflects topic score. Hover for details.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={440}>
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <XAxis
                        dataKey="works"
                        type="number"
                        name="Works"
                        tickFormatter={fmtNum}
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        label={{ value: "Works", position: "insideBottom", offset: -10, fontSize: 13, fill: "#9ca3af" }}
                    />

                    <YAxis
                        dataKey="citations"
                        type="number"
                        name="Citations"
                        tickFormatter={fmtNum}
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        label={{ value: "Citations", angle: -90, position: "insideLeft", offset: 10, fontSize: 13, fill: "#9ca3af" }}
                    />

                    <ZAxis range={[1, 1]} />
                    <Tooltip content={ScatterTooltip} />

                    <Scatter data={topicList} shape={(props: BubbleProps) => <Bubble {...props} />} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

type MomentumPartProps = {
    startDate: string;
    endDate: string;
    fieldId: string;
    formula: string;
};

function MomentumPart({
                          startDate,
                          endDate,
                          fieldId,
                          formula
                      }: MomentumPartProps){
    const formatAxisTick = (value: any): string => {
        return `${value}`;
    };

    const {momentumData} = useTopicMomentum({startDate, endDate, fieldId, formula});

    return(
        <div className="rounded-lg border border-slate-200 bg-white p-4
        flex flex-col gap-2">

            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900">
                        Topic Momentum Analysis
                    </h1>
                    <h2 className="text-sm opacity-75">
                        Comparison of current and historical topic scores with percentage growth trends.
                    </h2>
                </div>

            </div>

            <BarChart
                width={600}
                height={350}
                data={momentumData}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 5,
                    left: 0,
                }}
            >
                <XAxis
                    dataKey="name"
                    tickFormatter={formatAxisTick}
                    label={{ position: 'insideBottomRight', offset: -10 }}
                />

                <CartesianGrid
                    stroke="#aaa"
                    strokeDasharray="10 10"
                    vertical={false}
                    opacity={0.6}
                />

                <YAxis
                    label={{ position: 'insideTopLeft', angle: -90, dy: 60 }}
                />

                <Tooltip />

                <Bar dataKey="pastAverage" fill="#2563EB" barSize={18} radius={[5, 5, 0, 0]}
                />
                <Bar dataKey="currentAverage" fill="#16A34A" barSize={18} radius={[5, 5, 0, 0]} >
                    <LabelList
                        className="text-xs"
                        dataKey="growthPercentage"
                        position="top"
                        formatter={(value) => Number(value) > 0 ? `+${value}%` : `${value}%`}
                    />
                </Bar>

                <Legend align="right" />
            </BarChart>
        </div>
    )
}
