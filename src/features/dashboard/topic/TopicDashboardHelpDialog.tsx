import { useEffect } from "react";
import {
    CircleQuestionMark,
    Filter,
    Gauge,
    LineChart,
    ListOrdered,
    Radar as RadarIcon,
    Tags,
    X,
} from "lucide-react";

type TopicDashboardHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

const PAGE_MAP = [
    {
        title: "1. Filters",
        description:
            "Research field, date range, and two scoring formulas (Discovery Goal for topics, formula for keywords).",
    },
    {
        title: "2. Key Metrics",
        description:
            "Summary numbers for publications and citations in the selected field over the current period.",
    },
    {
        title: "3. Topic Landscape",
        description:
            "Scatter chart: all topics by Works, Citations, and topic score (bubble size).",
    },
    {
        title: "4. Trending Topics",
        description:
            "Bar chart comparing each topic's Previous Average vs Current Average score.",
    },
    {
        title: "5. Hot Keywords",
        description:
            "Ranked list of keywords by Hot Score, with a quick-add button to your search history.",
    },
    {
        title: "6. Topic Comparison",
        description:
            "Radar chart (multi-topic + average) and Heat Map (one topic over time), side by side.",
    },
    {
        title: "7. Keyword Landscape",
        description:
            "Scatter chart: keywords by Publication Share, CAGR, and recent paper count (bubble size).",
    },
];

export default function TopicDashboardHelpDialog({
                                                     isOpen,
                                                     onClose,
                                                 }: TopicDashboardHelpDialogProps) {
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () =>
            document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Understanding this dashboard
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5">
                    <HelpItem
                        icon={<Filter size={18} />}
                        title="Filters drive everything"
                        description="Every chart below reacts to the filter bar at the top of the page:"
                    >
                        <ul className="mt-2 space-y-1 text-xs text-slate-500">
                            <li>
                                <span className="font-medium text-slate-700">Field</span> — restricts every chart to one research field only.
                            </li>
                            <li>
                                <span className="font-medium text-slate-700">Date range</span> — the "current" window used for metrics, trending scores, and hot keywords. A "previous" window of equal length is derived automatically for trend comparisons.
                            </li>
                            <li>
                                <span className="font-medium text-slate-700">Discovery Goal formula</span> — changes how the topic score (bubble size in scatter charts, and the momentum score in Trending Topics) is calculated, e.g. balanced, growth-focused, or impact-focused.
                            </li>
                            <li>
                                <span className="font-medium text-slate-700">Keyword formula</span> — same idea, but controls the Hot Score used to rank keywords.
                            </li>
                        </ul>
                    </HelpItem>

                    <HelpItem
                        icon={<Gauge size={18} />}
                        title="Key metrics"
                        description="High-level totals (publications, citations, and similar counters) for the selected field, computed over the current date range only. Use this as a sanity check before reading the more detailed charts below."
                    />

                    <HelpItem
                        icon={<LineChart size={18} />}
                        title="Topic landscape (scatter)"
                        description="Plots every topic in the field with Works on the X-axis and Citations on the Y-axis. Bubble size is the topic score under the current Discovery Goal formula — so switching the formula reshuffles which bubbles look biggest without moving their X/Y position."
                    />

                    <HelpItem
                        icon={<ListOrdered size={18} />}
                        title="Trending topics & hot keywords"
                        description="Two panels shown side by side:"
                    >
                        <ul className="mt-2 space-y-1 text-xs text-slate-500">
                            <li>
                                <span className="font-medium text-slate-700">Trending Topics</span> — a bar chart with a blue bar (Previous Average score) and a green bar (Current Average score) per topic, so you can see who's rising or falling.
                            </li>
                            <li>
                                <span className="font-medium text-slate-700">Hot Keywords</span> — keywords ranked by Hot Score for the current date range, each with a button to save it to your search history.
                            </li>
                        </ul>
                    </HelpItem>

                    <HelpItem
                        icon={<RadarIcon size={18} />}
                        title="Deep dive: topic comparison"
                        description="Two independent charts for closer analysis, each with its own topic selection:"
                    >
                        <ul className="mt-2 space-y-1 text-xs text-slate-500">
                            <li>
                                <span className="font-medium text-slate-700">Radar chart</span> — check any number of topics, plus the overall field average, to compare them across momentum metrics (velocity, acceleration, citation decay, institution diversity, newcomer ratio) on one shape-based view.
                            </li>
                            <li>
                                <span className="font-medium text-slate-700">Heat map</span> — pick a single topic to see how its metrics evolved over the analysis period, one row per metric, one column per time.
                            </li>
                        </ul>
                        <p className="mt-2 text-xs text-slate-500">
                            These two selections are independent: choosing topics in the radar does not change the heat map's topic, and vice versa.
                        </p>
                    </HelpItem>

                    <HelpItem
                        icon={<Tags size={18} />}
                        title="Keyword landscape (scatter)"
                        description="Plots the same hot keywords from above with Publication Share on the X-axis and CAGR (growth rate) on the Y-axis, with bubble size showing recent paper count. Useful for spotting keywords that are both widely used and growing fast."
                    />

                    <HelpItem
                        icon={<CircleQuestionMark size={18} />}
                        title="Need more detail?"
                        description="Almost every chart on this page has its own help icon (the small question mark) with a focused explanation of exactly that visualization — axes, colors, and how to read it. This overview is just the map; use the per-chart help for specifics."
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <div className="mr-auto hidden flex-1 flex-wrap gap-2 sm:flex">
                        {PAGE_MAP.map((item) => (
                            <span
                                key={item.title}
                                title={item.description}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500"
                            >
                                {item.title}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

type HelpItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
};

function HelpItem({
                      icon,
                      title,
                      description,
                      children,
                  }: HelpItemProps) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="mt-0.5 text-sm text-slate-500">
                    {description}
                </p>

                {children}
            </div>
        </div>
    );
}