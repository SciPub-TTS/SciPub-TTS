import {BarChart3, CalendarPlus, FileText, Layers, Quote, RefreshCw, Sparkles, TrendingUp} from "lucide-react";

export type MetricData = {
    title: string;
    className?: string;
    value: string;
    changes: string
    icon: React.ComponentType<{ className?: string }>;
}

export const MENU_METRICS: MetricData[] = [
    {
        title: "TOTAL PAPERS",
        value: "248,900",
        changes: "+24.6% YoY",
        icon: FileText,
        className: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
        title: "ACTIVE TRENDING TOPICS",
        value: "42",
        changes: "+5 this week",
        icon: TrendingUp,
        className: "bg-green-50 text-green-600 border-green-200"
    },
    {
        title: "RISING KEYWORDS",
        value: "128",
        changes: "+18 this week",
        icon: Sparkles,
        className: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
        title: "AVERAGE GROWTH RATE",
        value: "+24.6%",
        changes: "vs last quarter",
        icon: BarChart3,
        className: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
        title: "CITATION IMPACT",
        value: "4.82",
        changes: "2-yr mean citedness",
        icon: Quote,
        className: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
        title: "TOP FIELD",
        value: "Computer Science",
        changes: "38,420 papers",
        icon: Layers,
        className: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
        title: "NEW PAPERS THIS WEEK",
        value: "3,210",
        changes: "+8% vs last week",
        icon: CalendarPlus,
        className: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
        title: "LAST SYNC",
        value: "Today, 09:30",
        changes: "OpenAlex Active",
        icon: RefreshCw,
        className: "bg-cyan-50 text-cyan-600 border-cyan-200"
    }
];