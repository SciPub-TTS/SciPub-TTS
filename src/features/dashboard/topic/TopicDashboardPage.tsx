import MetricPart from "@/features/dashboard/topic/components/MetricPart.tsx";
import TopicGeneralChartPart from "@/features/dashboard/topic/components/TopicGeneralChartPart.tsx";
import TrendingPart from "@/features/dashboard/topic/components/TrendingPart.tsx";
import TopicSpecificChartPart from "@/features/dashboard/topic/components/TopicSpecificChartPart.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTE_SEGMENTS} from "@/app/router";
import {useState} from "react";

export default function TopicDashboardPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTE_SEGMENTS.TRENDING_KEYWORD);
    }

    const currentMonday = getMonday(new Date());

    const oneWeekBefore = new Date(currentMonday);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    const fiveYearsBefore = new Date(currentMonday);
    fiveYearsBefore.setFullYear(fiveYearsBefore.getFullYear() - 5);

    const [shortStartDate] = useState<string>(formatDate(oneWeekBefore));
    const [longStartDate] = useState<string>(formatDate(fiveYearsBefore));
    const [endDate] = useState<string>(formatDate(currentMonday));
    const [fieldId] = useState<string>("17");
    const [formula] = useState<string>("balanced");

    console.log(shortStartDate, longStartDate, endDate, fieldId, formula);

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

        <MetricPart startDate={shortStartDate} endDate={endDate}/>

        <TopicGeneralChartPart startDate={longStartDate}
                               endDate={endDate}
                               fieldId={fieldId}
                               formula={formula}
        />

        <TrendingPart startDate={longStartDate}
                      endDate={endDate}
                      fieldId={fieldId}
                      formula={formula}/>

        <TopicSpecificChartPart/>
    </div>
  );
}

function getMonday(date: Date): Date {
    const result = new Date(date);

    const day = result.getDay(); // 0 = Sunday, 1 = Monday
    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);

    return result;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}