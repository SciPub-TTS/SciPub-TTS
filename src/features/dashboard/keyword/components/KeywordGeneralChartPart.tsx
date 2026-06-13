import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
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
import { useTrend } from "@/features/dashboard/keyword/hooks/useTrend.ts";

import type {
    KeywordBubble,
} from "@/features/dashboard/keyword/types/bubble.ts";

export function KeywordGeneralChartPart() {
    return (
        <div className="flex flex-col gap-8">

            <ScatterHotKeywords />

            <KeywordTrendChart />

            <KeywordHotScoreChart />

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

    const item =
        payload[0]
            .payload as KeywordBubble;

    return (
        <div className="rounded-md border bg-white p-4 shadow">

            <div className="mb-2 font-semibold">
                {item.keyword}
            </div>

            <div>
                CAGR: {item.cagr}%
            </div>

            <div>
                Publication Share:
                {" "}
                {item.publicationShare}%
            </div>

            <div>
                Recent Papers:
                {" "}
                {item.recentPapers}
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

    const item =
        payload as KeywordBubble;

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

function ScatterHotKeywords() {
    const { metricList } = useGeneralsMetric();

    return (
        <ResponsiveContainer
            width="100%"
            height={420}
        >
            <ScatterChart>

                <CartesianGrid />

                <XAxis
                    dataKey="publicationShare"
                    name="Publication Share"
                    label={{ value: "Publication Share (%)", position: "insideBottom", offset: -5 }}
                />

                <YAxis
                    dataKey="cagr"
                    name="CAGR"
                    label={{ value: "CAGR (%)", angle: -90, position: "insideLeft", offset: 10 }}
                />

                <ZAxis
                    dataKey="recentPapers"
                    range={[80, 400]}
                />

                <Tooltip
                    content={ScatterTooltip}
                />

                <Scatter
                    data={metricList}
                    shape={Bubble}
                />

            </ScatterChart>

        </ResponsiveContainer>
    );
}

function TrendTooltip({
                          active,
                          payload,
                          label,
                      }: TooltipContentProps) {

    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-md border bg-white p-4 shadow">

            <div className="mb-2 font-semibold">
                Year {label}
            </div>

            {
                payload.map((item) => (
                    <div key={String(item.name)}>

                        {item.name}
                        :
                        {" "}
                        {item.value}

                    </div>
                ))
            }

        </div>
    );
}

function KeywordTrendChart() {
    const { trendList } = useTrend();

    const data = trendList[0]?.yearly.map((_, index) => {
        const row: Record<string, number | string> = {
            year: trendList[0].yearly[index].year,
        };

        trendList.forEach((item) => {
            row[item.keyword] =
                item.yearly[index]?.count ?? 0;
        });

        return row;

    }) ?? [];

    return (
        <ResponsiveContainer
            width="100%"
            height={520}
        >
            <LineChart data={data}>

                <CartesianGrid />

                <XAxis dataKey="year" />

                <YAxis />

                <Tooltip content={TrendTooltip} />

                <Legend />

                {
                    trendList.map((item) => (
                        <Line
                            key={item.keyword}
                            dataKey={item.keyword}
                            stroke={item.color}
                            strokeWidth={3}
                            dot={false}
                        />
                    ))
                }

            </LineChart>

        </ResponsiveContainer>
    );
}

function KeywordHotScoreChart() {
    const { metricList } = useGeneralsMetric();

    const data = [...metricList].sort(
        (a, b) => b.hotScore - a.hotScore
    );

    return (
        <ResponsiveContainer width="100%" height={420}>
            <BarChart
                data={data}
                layout="vertical"
                barSize={18}
            >

                <CartesianGrid />

                <XAxis
                    type="number"
                    domain={[0, 100]}
                />

                <YAxis
                    type="category"
                    dataKey="keyword"
                    width={150}
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