import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Legend,
    Line,
    LineChart, ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useEffect, useRef, useState} from "react";
import {
    topicGrowthMetrics,
    topicTrend
} from "@/features/dashboard/topic/constants/topic-data.ts";
import {usePublicationTrend} from "@/features/dashboard/topic/hooks/usePublicationTrend.ts";
import {ChevronDown} from "lucide-react";
import type {YearSelectProps} from "@/features/dashboard/topic/types/publication.ts";

const MIN_YEAR = 2000;
const MAX_YEAR = new Date().getFullYear();

export default function TopicGeneralChartPart(){
    return(
        <div className="flex flex-col items-center gap-6">
            <GeneralPart/>

            <div className="grid grid-cols-2 gap-6 select-none">
                <EmergingPart/>

                <MomentumPart/>
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

function EmergingPart(){
    const [line] = useState<string | null>(null);
    // const [showLegend, setShowLegend] = useState(true);

    const topicKeys = Object.keys(topicTrend[0]).filter(
        key => key !== "name"
    );
    const colors = [
        "#22C55E",
        "#3B82F6",
        "#EF4444",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
        "#6366F1",
        "#F97316",
    ];

    return(
        <div className="rounded-lg border border-slate-200 bg-white p-4
        flex flex-col gap-2">

            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900">
                        Emerging Topic Trends
                    </h1>
                    <h2 className="text-sm opacity-75">
                        Temporal changes in activity across emerging topics
                    </h2>
                </div>

                {/*<button*/}
                {/*    onClick={() => setShowLegend(prev => !prev)}*/}
                {/*    className="px-3 text-sm border rounded-md border-blue-500*/}
                {/*    bg-blue-100 font-semibold cursor-pointer"*/}
                {/*>*/}
                {/*    {showLegend ? "Hide Legend" : "Show Legend"}*/}
                {/*</button>*/}
            </div>

            <LineChart
                style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
                responsive
                data={topicTrend}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 5,
                    left: 0,
                }}
            >
                <CartesianGrid stroke="#aaa" strokeDasharray="10 10" vertical={false} opacity={0.6} />
                {
                    topicKeys.map((topic, index) => (
                        <Line
                            key={topic}
                            type="monotone"
                            dataKey={topic}
                            stroke={colors[index]}
                            strokeWidth={
                                line === null || line === topic
                                    ? 2
                                    : 0
                            }
                            dot={false}
                        />
                    ))
                }
                <XAxis dataKey="name" />
                <Tooltip />
                <YAxis width="auto" label={{ position: 'insideLeft', angle: -90 }} />
                {/*{showLegend && (*/}
                {/*    <Legend*/}
                {/*        align="right"*/}
                {/*        onMouseEnter={(e) => setLine(e.dataKey as string)}*/}
                {/*        onMouseLeave={() => setLine(null)}*/}
                {/*    />*/}
                {/*)}*/}
            </LineChart>
        </div>
    )
}

function MomentumPart(){
    const formatAxisTick = (value: string | number): string => {
        return `${value}`;
    };

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
                data={topicGrowthMetrics}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 5,
                    left: 0,
                }}
            >
                <XAxis
                    dataKey="topic"
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
                        formatter={(value) => `+${value}%`}
                    />
                </Bar>

                <Legend align="right" />
            </BarChart>
        </div>
    )
}
