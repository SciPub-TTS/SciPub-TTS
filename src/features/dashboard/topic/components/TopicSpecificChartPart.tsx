import {Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer} from "recharts";
import {useEffect, useMemo, useState} from "react";
import {ResponsiveHeatMap} from "@nivo/heatmap";
import {topicHeatmaps} from "@/features/dashboard/topic/constants/topic-heatmap.ts";
import type {TopicRadarData} from "@/features/dashboard/topic/types/radar.ts";
import {useTopicRadar} from "@/features/dashboard/topic/hooks/useTopicRadar.ts";

type TopicSpecificChartPartProps = {
    startDate: string;
    endDate: string;
    fieldId: string | number;
}

export default function TopicSpecificChartPart({
                                                   startDate,
                                                   endDate,
                                                   fieldId,
                                               }: TopicSpecificChartPartProps){
    const { radarData, error } = useTopicRadar({
        startDate,
        endDate,
        fieldId,
    });

    const [selectedTopic, setSelectedTopic] = useState("");
    useEffect(() => {
        if (radarData?.topics && radarData.topics.length > 0) {
            const hasDefaultTopic = radarData.topics.some(t => t.name === selectedTopic);
            if (!hasDefaultTopic) {
                setSelectedTopic(radarData.topics[0].name);
            }
        }
    }, [radarData, selectedTopic]);

    if (error) {
        return (
            <div className="p-4 text-center text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                {error}
            </div>
        );
    }

    return(
        <div className="grid grid-cols-2 gap-4">
            <RadarPart data={radarData} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic}/>

            <HeatMapPart selectedTopic={selectedTopic}/>
        </div>
    );
}

const METRIC_CONFIG = [
    { key: "velocity", label: "Velocity" },
    { key: "accelerate", label: "Acceleration" },
    { key: "citationDecay", label: "Citation Decay" },
    { key: "institution", label: "Institution Diversity" },
    { key: "newComerAuthor", label: "Newcomer Ratio" },
] as const;

interface RadarPartProps {
    data: TopicRadarData | null;
    selectedTopic: string;
    setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
}

function RadarPart({ data, selectedTopic, setSelectedTopic }: RadarPartProps
) {
    const chartData = useMemo(() => {
        if (!data) return [];

        const currentTopic = data.topics.find((t) => t.name === selectedTopic);
        const averageData = data.average;

        return METRIC_CONFIG.map((metric) => ({
            metric: metric.label,
            topicValue: currentTopic ? currentTopic[metric.key] : 0,
            averageValue: averageData ? averageData[metric.key] : 0,
        }));
    }, [data, selectedTopic]);

    if (!data) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-200 bg-white">
                <p className="text-sm text-slate-400">Loading radar charts data...</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Topic Performance Profile
                    </h2>
                    <p className="text-sm text-slate-500">
                        Compare a selected topic against the overall average
                        across key research momentum indicators.
                    </p>
                </div>

                <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="max-w-[260px] rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                    {data.topics.map((topic) => (
                        <option key={topic.name} value={topic.name}>
                            {topic.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} outerRadius="70%">
                        <PolarGrid />
                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{
                                fontSize: 12,
                                fill: "#475569",
                            }}
                        />

                        <PolarRadiusAxis
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />

                        <Radar
                            name={selectedTopic || "Selected Topic"}
                            dataKey="topicValue"
                            stroke="#2563EB"
                            fill="#2563EB"
                            fillOpacity={0.35}
                            strokeWidth={2}
                        />
                        <Radar
                            name="Overall Average"
                            dataKey="averageValue"
                            stroke="#16A34A"
                            fill="#16A34A"
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={40}
                            wrapperStyle={{
                                fontSize: "12px",
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function HeatMapPart({selectedTopic}:{selectedTopic:string}) {
    const data =
        topicHeatmaps[selectedTopic] ??
        topicHeatmaps["Large Language Models (LLMs)"];

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                    Research Metrics Heat Map
                </h2>

                <p className="text-sm text-slate-500">
                    Visualize how key research indicators have evolved from
                    2021 to 2026 across velocity, impact, diversity, and
                    newcomer participation metrics.
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full
                    bg-blue-50 px-3 py-1 text-sm text-blue-700 border border-blue-200">
                    <span className="font-medium">
                        Current topic:
                    </span>

                                <span>
                        {selectedTopic}
                    </span>
                </div>
            </div>

            <div className="h-[450px]">
                <ResponsiveHeatMap
                    data={data}

                    margin={{
                        top: 40,
                        right: 60,
                        bottom: 60,
                        left: 140,
                    }}
                    valueFormat=">-.0f"
                    colors={{
                        type: "sequential",
                        scheme: "greens",
                    }}
                    emptyColor="#f3f4f6"
                    borderWidth={1}
                    borderColor="#fff"
                />
            </div>
        </div>
    );
}