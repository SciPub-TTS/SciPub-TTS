import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts";

import type {
    TooltipContentProps,
} from "recharts";

import type {
    ScatterCustomizedShape,
} from "recharts/types/cartesian/Scatter";

import { useGeneralsMetric } from "@/features/dashboard/keyword/hooks/useMetric.ts";
import type {KeywordsMetric} from "@/features/dashboard/keyword/types/keyword.ts";
import type {KeywordMetric} from "@/features/dashboard/keyword/types/metric.ts";

type KeywordGeneralChartPartProps = {
    keywordList: KeywordsMetric[];
    isLoading: boolean;
};

type HotKeywordProps = {
    metricList: KeywordMetric[];
    isLoading: boolean;
};

export function KeywordGeneralChartPart({
                                            keywordList,
                                            isLoading,
                                        }: KeywordGeneralChartPartProps) {
    const { metricList } = useGeneralsMetric(keywordList);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 select-none">
            <ChartCard
                title="Hot Keywords — CAGR vs Publication Share"
                description="Bubble size reflects recent paper volume; position shows growth rate against research share."
            >
                <ScatterHotKeywords
                    metricList={metricList}
                    isLoading={isLoading}
                />
            </ChartCard>

            <ChartCard
                title="Keyword Hot Score Ranking"
                description="Topics ranked by overall hot score, combining momentum and attention signals."
            >
                <KeywordHotScoreChart
                    metricList={metricList}
                    isLoading={isLoading}
                />
            </ChartCard>
        </div>
    );
}

function ChartCard({
                       title,
                       description,
                       children,
                   }: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
                {title}
            </h2>

            {description && (
                <p className="mb-3 text-sm text-slate-500">
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}

function ScatterTooltip({
                            active,
                            payload,
                        }: TooltipContentProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0].payload as KeywordMetric;

    return (
        <div className="rounded-md border bg-white p-4 shadow">
            <div className="mb-2 font-semibold">
                {item.keyword}
            </div>

            <div>
                CAGR: {item.cagr}%
            </div>

            <div>
                Publication Share: {item.publicationShare}%
            </div>

            <div>
                Recent Papers: {item.recentPapers.toLocaleString()}
            </div>
        </div>
    );
}

const Bubble: ScatterCustomizedShape = ({
                                            cx = 0,
                                            cy = 0,
                                            size = 0,
                                            payload,
                                        }) => {
    const item = payload as KeywordMetric;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={Math.sqrt(size)}
            fill={item.color}
            fillOpacity={0.9}
        />
    );
};

function ScatterHotKeywords({
                                metricList,
                                isLoading,
                            }: HotKeywordProps) {
    if (isLoading) {
        return (
            <div className="h-[380px] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <ResponsiveContainer
            width="100%"
            height={380}
        >
            <ScatterChart
                margin={{
                    top: 10,
                    right: 20,
                    bottom: 30,
                    left: 30,
                }}
            >
                <CartesianGrid />

                <XAxis
                    dataKey="publicationShare"
                    name="Publication Share"
                    label={{
                        value: "Publication Share (%)",
                        position: "insideBottom",
                        offset: -15,
                    }}
                />

                <YAxis
                    dataKey="cagr"
                    name="CAGR"
                    label={{
                        value: "CAGR (%)",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                    }}
                />

                <ZAxis
                    dataKey="recentPapers"
                    range={[80, 400]}
                />

                <Tooltip content={ScatterTooltip} />

                <Scatter
                    data={metricList}
                    shape={Bubble}
                />
            </ScatterChart>
        </ResponsiveContainer>
    );
}

function KeywordHotScoreChart({
                                  metricList,
                                  isLoading,
                              }: HotKeywordProps) {
    if (isLoading) {
        return (
            <div className="h-[380px] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const data = [...metricList].sort(
        (a, b) => b.hotScore - a.hotScore,
    );

    return (
        <ResponsiveContainer
            width="100%"
            height={380}
            className="ml-[-2vw]"
        >
            <BarChart
                data={data}
                layout="vertical"
                barSize={18}
                barCategoryGap="30%"
                margin={{
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                }}
            >
                <CartesianGrid />

                <XAxis
                    type="number"
                    domain={[
                        0,
                        (dataMax: number) =>
                            Math.ceil((dataMax + 5) / 5) * 5,
                    ]}
                />

                <YAxis
                    type="category"
                    dataKey="keyword"
                    width={160}
                    tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                    dataKey="hotScore"
                    radius={[0, 0, 0, 0]}
                    shape={(props) => (
                        <rect
                            x={props.x}
                            y={props.y}
                            width={props.width}
                            height={props.height}
                            rx={8}
                            fill={props.payload.color}
                        />
                    )}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}