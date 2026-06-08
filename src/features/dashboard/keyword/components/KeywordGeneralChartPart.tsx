import {
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

import type {
    KeywordBubble,
} from "@/features/dashboard/keyword/types/bubble.ts";

export function KeywordGeneralChartPart() {
    return (
        <div className="flex flex-col items-center gap-6">
            <ScatterHotKeywords />
        </div>
    );
}

function CustomTooltip({
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
    const { metricList } =
        useGeneralsMetric();

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
                />

                <YAxis
                    dataKey="cagr"
                    name="CAGR"
                />

                <ZAxis
                    dataKey="recentPapers"
                    range={[80, 400]}
                />

                <Tooltip
                    content={CustomTooltip}
                />

                <Scatter
                    data={metricList}
                    shape={Bubble}
                />

            </ScatterChart>
        </ResponsiveContainer>
    );
}