import FilterPart from "@/pages/dashboard/components/FilterPart.tsx";
import MetricPart from "@/pages/dashboard/components/MetricPart.tsx";
import ChartPart from "@/pages/dashboard/components/ChartPart.tsx";
import TrendingPart from "@/pages/dashboard/components/TrendingPart.tsx";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[3vh]">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">
                Research Trend Dashboard
            </h1>
            <h2 className="text-base opacity-75">
                Track publication growth, citation impact, trending topics, and rising keywords.
            </h2>
        </div>

        <FilterPart/>

        <MetricPart/>

        <ChartPart/>

        <TrendingPart/>
    </div>
  );
}