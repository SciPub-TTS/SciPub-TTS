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
import {useState} from "react";
import {
    topicGrowthMetrics,
    topicTrend
} from "@/features/dashboard/constants/topic-data.ts";
import {usePublicationTrend} from "@/features/dashboard/hooks/usePublicationTrend.ts";

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

function GeneralPart(){
    const {publicationTrend} = usePublicationTrend();

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
                    <YAxis width={50} />
                    <Tooltip />
                    <Legend align="right" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

function EmergingPart(){
    const [line, setLine] = useState<string | null>(null);
    const [showLegend, setShowLegend] = useState(true);

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

                <button
                    onClick={() => setShowLegend(prev => !prev)}
                    className="px-3 text-sm border rounded-md border-blue-500
                    bg-blue-100 font-semibold cursor-pointer"
                >
                    {showLegend ? "Hide Legend" : "Show Legend"}
                </button>
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
                {showLegend && (
                    <Legend
                        align="right"
                        onMouseEnter={(e) => setLine(e.dataKey as string)}
                        onMouseLeave={() => setLine(null)}
                    />
                )}
            </LineChart>
        </div>
    )
}

function MomentumPart(){
    const formatAxisTick = (value: any): string => {
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