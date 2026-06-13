import {Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer} from "recharts";
import {topicMetrics} from "@/features/dashboard/topic/constants/topic-data.ts";
import {useMemo, useState} from "react";
import {buildRadarData} from "@/features/dashboard/topic/hooks/buildRadarData.ts";
import {ResponsiveHeatMap} from "@nivo/heatmap";
import {topicHeatmaps} from "@/features/dashboard/topic/constants/topic-heatmap.ts";

export default function TopicSpecificChartPart(){
    const [selectedTopic, setSelectedTopic] = useState(
        "Large Language Models (LLMs)"
    );

    return(
        <div className="grid grid-cols-2 gap-4">
            <RadarPart selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic}/>

            <HeatMapPart selectedTopic={selectedTopic}/>
        </div>
    );
}

function RadarPart({selectedTopic, setSelectedTopic,
                   }: {
                        selectedTopic: string;
                        setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
                    }
) {
    const radarData = useMemo(
        () => buildRadarData(selectedTopic),
        [selectedTopic]
    );

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
                    {topicMetrics.map((topic) => (
                        <option
                            key={topic.topic}
                            value={topic.topic}
                        >
                            {topic.topic}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        data={radarData}
                        outerRadius="70%"
                    >
                        <PolarGrid />

                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{
                                fontSize: 12,
                                fill: "#475569",
                            }}
                        />

                        <Radar
                            name={selectedTopic}
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