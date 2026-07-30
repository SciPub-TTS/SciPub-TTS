import {
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import {useEffect, useMemo, useRef, useState} from "react";
import {ResponsiveHeatMap} from "@nivo/heatmap";
import type {TopicRadarData} from "@/features/dashboard/topic/types/radar.ts";
import {useTopicRadar} from "@/features/dashboard/topic/hooks/useTopicRadar.ts";
import {useTopicHeatmap} from "@/features/dashboard/topic/hooks/useTopicHeatmap.ts";
import {ChevronDown, CircleQuestionMark} from "lucide-react";
import {RadarHelpDialog} from "@/features/dashboard/topic/components/helper/RadarHelpDialog.tsx";
import {HeatMapHelpDialog} from "@/features/dashboard/topic/components/helper/HeatMapHelpDialog.tsx";

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

    const [heatmapTopic, setHeatmapTopic] = useState("");
    useEffect(() => {
        if (radarData?.topics && radarData.topics.length > 0) {
            const hasDefaultTopic = radarData.topics.some(t => t.name === heatmapTopic);
            if (!hasDefaultTopic) {
                setHeatmapTopic(radarData.topics[0].name);
            }
        }
    }, [radarData, heatmapTopic]);

    if (error) {
        return (
            <div className="p-4 text-center text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                {error}
            </div>
        );
    }

    return(
        <div className="grid grid-cols-2 gap-4">
            <RadarPart data={radarData} />

            <HeatMapPart
                selectedTopic={heatmapTopic}
                setSelectedTopic={setHeatmapTopic}
                topics={radarData?.topics ?? []}
                startDate={startDate}
                endDate={endDate}
                fieldId={fieldId}
            />
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

const AVERAGE_KEY = "__average__";

const SERIES_COLOR_PALETTE = [
    "#2563EB", "#DC2626", "#9333EA", "#EA580C",
    "#0891B2", "#DB2777", "#65A30D", "#7C3AED",
];

interface RadarPartProps {
    data: TopicRadarData | null;
}

function RadarPart({ data }: RadarPartProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data?.topics && data.topics.length > 0 && selectedKeys.length === 0) {
            setSelectedKeys([AVERAGE_KEY, data.topics[0].name]);
        }
    }, [data]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggleKey(key: string) {
        setSelectedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        );
    }

    const seriesList = useMemo(() => {
        if (!data) return [];

        const list: { key: string; name: string; color: string }[] = [];
        let colorIndex = 0;

        selectedKeys.forEach((key) => {
            if (key === AVERAGE_KEY) {
                list.push({ key, name: "Overall Average", color: "#16A34A" });
                return;
            }

            const topic = data.topics.find((t) => t.name === key);
            if (topic) {
                list.push({
                    key,
                    name: topic.name,
                    color: SERIES_COLOR_PALETTE[colorIndex % SERIES_COLOR_PALETTE.length],
                });
                colorIndex += 1;
            }
        });

        return list;
    }, [data, selectedKeys]);

    const chartData = useMemo(() => {
        if (!data) return [];

        return METRIC_CONFIG.map((metric) => {
            const point: Record<string, string | number> = { metric: metric.label };

            selectedKeys.forEach((key) => {
                if (key === AVERAGE_KEY) {
                    point[key] = data.average ? data.average[metric.key] : 0;
                } else {
                    const topic = data.topics.find((t) => t.name === key);
                    point[key] = topic ? topic[metric.key] : 0;
                }
            });

            return point;
        });
    }, [data, selectedKeys]);

    if (!data) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-200 bg-white">
                <p className="text-sm text-slate-400">Loading radar charts data...</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 overflow-y-auto">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Topic Performance Profile
                        </h2>

                        <p className="text-sm text-slate-500">
                            Compare selected topics (and the overall average) across
                            key research momentum indicators.
                        </p>
                    </div>

                    <CircleQuestionMark
                        className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        onClick={() => setIsHelpOpen(true)}
                    />
                </div>

                <div ref={pickerRef} className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsPickerOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Compare topics ({selectedKeys.length})
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {isPickerOpen && (
                        <div className="absolute right-0 z-10 mt-1 max-h-72 w-64 overflow-auto rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={selectedKeys.includes(AVERAGE_KEY)}
                                    onChange={() => toggleKey(AVERAGE_KEY)}
                                />
                                <span className="font-medium text-green-700">
                                    Overall Average
                                </span>
                            </label>

                            <div className="my-1 border-t border-slate-100" />

                            {data.topics.map((topic) => (
                                <label
                                    key={topic.name}
                                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedKeys.includes(topic.name)}
                                        onChange={() => toggleKey(topic.name)}
                                    />
                                    <span className="truncate">{topic.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <RadarHelpDialog
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            <div className="h-[500px] w-full">
                {seriesList.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Select at least one topic or Average to compare.
                    </div>
                ) : (
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

                            <Tooltip />

                            {seriesList.map((series) => (
                                <Radar
                                    key={series.key}
                                    name={series.name}
                                    dataKey={series.key}
                                    stroke={series.color}
                                    fill={series.color}
                                    fillOpacity={0.25}
                                    strokeWidth={2}
                                />
                            ))}

                            <Legend
                                verticalAlign="bottom"
                                height={40}
                                wrapperStyle={{
                                    fontSize: "12px",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

function TopicComboBox({
                           topics,
                           selectedTopic,
                           setSelectedTopic,
                       }: {
    topics: { name: string }[];
    selectedTopic: string;
    setSelectedTopic: (name: string) => void;
}) {
    const [query, setQuery] = useState(selectedTopic);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(selectedTopic);
    }, [selectedTopic]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setQuery(selectedTopic);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedTopic]);

    const filteredTopics = useMemo(() => {
        if (!query.trim()) return topics;
        const lowerQuery = query.toLowerCase();
        return topics.filter((t) => t.name.toLowerCase().includes(lowerQuery));
    }, [topics, query]);

    useEffect(() => {
        setHighlightIndex(0);
    }, [query]);

    function handleSelect(name: string) {
        setSelectedTopic(name);
        setQuery(name);
        setIsOpen(false);
    }

    function handleConfirmClick() {
        const target = filteredTopics[highlightIndex] ?? filteredTopics[0];
        if (target) {
            handleSelect(target.name);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.min(prev + 1, filteredTopics.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleConfirmClick();
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setQuery(selectedTopic);
        }
    }

    return (
        <div ref={containerRef} className="relative flex w-full max-w-[320px] gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={(e) => {
                        setIsOpen(true);
                        e.target.select();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm topic..."
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
                        {filteredTopics.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-slate-400">
                                Không tìm thấy topic
                            </div>
                        ) : (
                            filteredTopics.map((topic, index) => (
                                <div
                                    key={topic.name}
                                    onMouseDown={() => handleSelect(topic.name)}
                                    onMouseEnter={() => setHighlightIndex(index)}
                                    className={`cursor-pointer px-3 py-2 text-sm ${
                                        index === highlightIndex
                                            ? "bg-blue-50"
                                            : ""
                                    } ${
                                        topic.name === selectedTopic
                                            ? "font-medium text-blue-700"
                                            : "text-slate-700"
                                    }`}
                                >
                                    {topic.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function HeatMapPart({ selectedTopic, setSelectedTopic, topics, startDate, endDate, fieldId }: {
    selectedTopic: string;
    setSelectedTopic: (name: string) => void;
    topics: { name: string }[];
    startDate: string;
    endDate: string;
    fieldId: string | number;
}) {
    const { loading, nivoData, error } = useTopicHeatmap(
        { startDate, endDate, fieldId },
        selectedTopic
    );

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Research Metrics Heat Map
                        </h2>

                        <p className="text-sm text-slate-500">
                            Visualize how key research indicators have evolved from
                            2021 to 2026 across velocity, impact, diversity, and
                            newcomer participation metrics.
                        </p>
                    </div>

                    <CircleQuestionMark
                        className="mt-1 h-5 w-5 shrink-0 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        onClick={() => setIsHelpOpen(true)}
                    />
                </div>

                <TopicComboBox
                    topics={topics}
                    selectedTopic={selectedTopic}
                    setSelectedTopic={setSelectedTopic}
                />
            </div>

            <HeatMapHelpDialog
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            <div className="h-[450px]">
                {loading && (
                    <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                        Loading heatmap...
                    </div>
                )}
                {error && (
                    <div className="flex h-full items-center justify-center text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {!loading && !error && nivoData.length > 0 && (
                    <ResponsiveHeatMap
                        data={nivoData}
                        margin={{ top: 40, right: 60, bottom: 60, left: 140 }}
                        valueFormat=">-.0f"
                        colors={{ type: "sequential", scheme: "greens" }}
                        emptyColor="#f3f4f6"
                        borderWidth={1}
                        borderColor="#fff"
                    />
                )}
            </div>
        </div>
    );
}