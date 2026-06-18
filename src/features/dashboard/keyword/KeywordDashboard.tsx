import {useNavigate} from "react-router-dom";
import {ROUTE_SEGMENTS} from "@/app/router";
import MetricPart from "@/features/dashboard/topic/components/MetricPart.tsx";

export function KeywordDashboardPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTE_SEGMENTS.TRENDING_TOPIC);
    }

    return(
        <div className="flex flex-col gap-[3vh]">
            <div>
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Research Keyword Trend Dashboard
                    </h1>
                    <button onClick={handleClick}>
                        <p className="text-ml font-bold text-blue-700 cursor-pointer">
                            Topic Dashboard &rarr;
                        </p>
                    </button>
                </div>
                <h2 className="text-base opacity-75">
                    Track publication growth, citation impact, trending topics, and rising keywords.
                </h2>
            </div>

            <MetricPart/>

            {/*<KeywordGeneralChartPart/>*/}
        </div>
    );
}