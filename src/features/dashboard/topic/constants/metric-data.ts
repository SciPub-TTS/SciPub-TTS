import {BarChart3, CalendarPlus, FileText, Layers, Quote, RefreshCw, Sparkles, TrendingUp} from "lucide-react";
import type {MetricData} from "@/features/dashboard/topic/types/metric.ts";


export const MENU_METRICS: MetricData[] = [
    {
        title: "TOTAL PAPERS",
        value: "",
        change: "",
        changeSuffix: "% YoY",
        icon: FileText,
        className: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
        title: "ACTIVE TRENDING TOPICS",
        value: "",
        change: "",
        changeSuffix: "% vs previous period",
        icon: TrendingUp,
        className: "bg-green-50 text-green-600 border-green-200"
    },
    {
        title: "RISING KEYWORDS",
        value: "",
        change: "",
        changeSuffix: "% vs previous period",
        icon: Sparkles,
        className: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
        title: "AVERAGE GROWTH RATE",
        value: "",
        change: "",
        changeSuffix: "% vs previous period",
        icon: BarChart3,
        className: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
        title: "CITATION IMPACT",
        value: "",
        change: "",
        changeSuffix: "% vs previous period",
        icon: Quote,
        className: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
        title: "TOP FIELD",
        value: "",
        change: "",
        changeSuffix: "",
        icon: Layers,
        className: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
        title: "NEW PAPERS THIS WEEK",
        value: "",
        change: "",
        changeSuffix: "% vs last week",
        icon: CalendarPlus,
        className: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
        title: "LAST SYNC",
        value: "",
        change: "",
        changeSuffix: "",
        icon: RefreshCw,
        className: "bg-cyan-50 text-cyan-600 border-cyan-200"
    }
];
