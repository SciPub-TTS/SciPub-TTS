import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useState} from "react";
import {publicationTrend, topicMetrics, topicTrend} from "@/features/dashboard/constants/topic-data.ts";

export default function ChartPart(){
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

            <LineChart
                style={{ width: '100%', aspectRatio: 1.618, maxWidth: '100%', height: '50vh' }}
                responsive
                data={publicationTrend}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 5,
                    left: 0,
                }}
            >
                <CartesianGrid stroke="#aaa" strokeDasharray="10 10" vertical={false} opacity={0.6} />
                <Line type="monotone" dataKey="publications" stroke="#2563EB" strokeWidth={2} />
                <XAxis dataKey="year" />
                <Tooltip />
                <YAxis width="auto" label={{ position: 'insideLeft', angle: -90 }} />
                <Legend align="right"/>
            </LineChart>
        </div>
    )
}

function EmergingPart(){
    const [line, setLine] = useState<string | null>(null);

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
                <Line type="monotone" dataKey="AI" stroke="green" strokeWidth={line === null || line === "AI" ? 2 : 0} />
                <Line type="monotone" dataKey="Quantum" stroke="#3B82F6" strokeWidth={line === null || line === "Quantum" ? 2 : 0} />
                <Line type="monotone" dataKey="Biotech" stroke="#EF4444" strokeWidth={line === null || line === "Biotech" ? 2 : 0} />
                <Line type="monotone" dataKey="Robotics" stroke="#F59E0B" strokeWidth={line === null || line === "Robotics" ? 2 : 0} />
                <Line type="monotone" dataKey="IoT" stroke="#8B5CF6" strokeWidth={line === null || line === "IoT" ? 2 : 0} />
                <Line type="monotone" dataKey="Blockchain" stroke="#EC4899" strokeWidth={line === null || line === "Blockchain" ? 2 : 0} />
                <Line type="monotone" dataKey="Cloud" stroke="#06B6D4" strokeWidth={line === null || line === "Cloud" ? 2 : 0} />
                <Line type="monotone" dataKey="Security" stroke="#84CC16" strokeWidth={line === null || line === "Security" ? 2 : 0} />
                <Line type="monotone" dataKey="Data" stroke="#6366F1" strokeWidth={line === null || line === "Data" ? 2 : 0} />
                <Line type="monotone" dataKey="FiveG" stroke="#F97316" strokeWidth={line === null || line === "FiveG" ? 2 : 0} />
                <XAxis dataKey="name" />
                <Tooltip />
                <YAxis width="auto" label={{ position: 'insideLeft', angle: -90 }} />
                <Legend align="right"
                        onMouseEnter={(e) => setLine(e.dataKey as string)}
                        onMouseLeave={() => setLine(null)}
                />
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
                        Comparative scores for velocity, impact, diversity, and newcomer activity
                    </h2>
                </div>

            </div>

            <BarChart
                width={600}
                height={350}
                data={topicMetrics}
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

                <Bar dataKey="Velocity" fill="#2563EB" barSize={18} radius={[5, 5, 0, 0]} />
                <Bar dataKey="Acceleration" fill="#16A34A" barSize={18} radius={[5, 5, 0, 0]} />
                <Bar dataKey="Citation" fill="#8B5CF6" barSize={18} radius={[5, 5, 0, 0]} />
                <Bar dataKey="InstitutionDivers" fill="#F59E0B" barSize={18} radius={[5, 5, 0, 0]} />
                <Bar dataKey="AuthorNewcomerRatio" fill="#EF4444" barSize={18} radius={[5, 5, 0, 0]} />

                <Legend align="right" />
            </BarChart>
        </div>
    )
}