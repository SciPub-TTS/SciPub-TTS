import MetricPart from "@/features/dashboard/topic/components/MetricPart.tsx";
import TopicGeneralChartPart from "@/features/dashboard/topic/components/TopicGeneralChartPart.tsx";
import TrendingPart from "@/features/dashboard/topic/components/TrendingPart.tsx";
import TopicSpecificChartPart from "@/features/dashboard/topic/components/TopicSpecificChartPart.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTE_SEGMENTS} from "@/app/router";

export default function TopicDashboardPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTE_SEGMENTS.TRENDING_KEYWORD);
    }

  return (
    <div className="flex flex-col gap-[3vh]">
        <div>
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold text-slate-900">
                    Research Topic Trend Dashboard
                </h1>
                <button onClick={handleClick}>
                    <p className="text-ml font-bold text-blue-700 cursor-pointer">
                        Keyword Dashboard &rarr;
                    </p>
                </button>
            </div>
            <h2 className="text-base opacity-75">
                Track publication growth, citation impact, trending topics, and rising keywords.
            </h2>
        </div>

        {/*<FilterPart/>*/}

        <MetricPart/>

        <TopicGeneralChartPart/>

        <TrendingPart/>

        <TopicSpecificChartPart/>
    </div>
  );
}