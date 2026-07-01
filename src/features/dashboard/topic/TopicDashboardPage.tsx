import MetricPart from "@/features/dashboard/topic/components/MetricPart.tsx";
import TopicGeneralChartPart from "@/features/dashboard/topic/components/TopicGeneralChartPart.tsx";
import TrendingPart from "@/features/dashboard/topic/components/TrendingPart.tsx";
import TopicSpecificChartPart from "@/features/dashboard/topic/components/TopicSpecificChartPart.tsx";
import {useMemo, useState} from "react";
import FilterPart from "@/features/dashboard/topic/components/FilterPart.tsx";
import {KeywordGeneralChartPart} from "@/features/dashboard/keyword/components/KeywordGeneralChartPart.tsx";
import {KeywordHotListPart} from "@/features/dashboard/keyword/components/KeywordHotListPart.tsx";
import {useHotKeyword} from "@/features/dashboard/keyword/hooks/useHotKeyword.ts";
import type {KeywordFormulaType} from "@/features/dashboard/keyword/types/keyword.ts";
import {saveSearchHistory} from "@/features/search/services";

export default function TopicDashboardPage() {

    const currentMonday = getMonday(new Date());

    const oneWeekBefore = new Date(currentMonday);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    const fiveYearsBefore = new Date(currentMonday);
    fiveYearsBefore.setFullYear(fiveYearsBefore.getFullYear() - 5);

    const [endDate, setEndDate] = useState<string>(formatDate(currentMonday));
    const shortStartDate = useMemo(() => {
        const date = new Date(endDate);
        date.setDate(date.getDate() - 7);
        return formatDate(date);
    }, [endDate]);

    const longStartDate = useMemo(() => {
        const date = new Date(endDate);
        date.setFullYear(date.getFullYear() - 5);
        return formatDate(date);
    }, [endDate]);
    const [fieldId, setFieldId] = useState("17");
    const [topicFormula, setTopicFormula] = useState("balanced");
    const [keywordFormula, setKeywordFormula] = useState<KeywordFormulaType>("balanced");

    const {keywordList, isLoading} = useHotKeyword(
        {
            recentStart: longStartDate,
            recentEnd: endDate,
            fieldId,
            formula: keywordFormula
        }
    )

  return (
    <div className="flex flex-col gap-[3vh]">
        <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                Analyze - Topic + Keyword Trends
            </p>
            <h1 className="font-search-title mt-3 text-4xl font-normal leading-[1.05] text-[#14532D] md:text-5xl xl:whitespace-nowrap">
                Read the Research Pulse.
            </h1>
            <p className="font-subtext mt-3 max-w-4xl text-base leading-7 text-slate-500">
                Track publication growth, citation impact, trending topics, and rising keywords.
            </p>
        </div>

        <FilterPart endDate={endDate}
        fieldId={fieldId}
        topicFormula={topicFormula}
        keywordFormula={keywordFormula}
        setEndDate={setEndDate}
        setFieldId={setFieldId}
        setTopicFormula={setTopicFormula}
        setKeywordFormula={setKeywordFormula}/>

        <MetricPart startDate={shortStartDate} endDate={endDate}/>

        <TopicGeneralChartPart startDate={longStartDate}
                               endDate={endDate}
                               fieldId={fieldId}
                               formula={topicFormula}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
            <TrendingPart startDate={longStartDate}
                          endDate={endDate}
                          fieldId={fieldId}
                          formula={topicFormula}
            />

            <KeywordHotListPart keywordList={keywordList}
                                isLoading={isLoading}
                                onAdd={async (keyword) => {
                                    return saveSearchHistory(keyword.name);
                                }}
            />
        </div>

        <TopicSpecificChartPart startDate={longStartDate}
                                endDate={endDate}
                                fieldId={fieldId}
        />

        <KeywordGeneralChartPart keywordList={keywordList}
                                 isLoading={isLoading}
        />
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
