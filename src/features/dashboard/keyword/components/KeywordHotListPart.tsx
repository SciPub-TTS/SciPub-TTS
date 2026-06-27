import { useState } from "react";
import type {
    KeywordsMetric,
} from "@/features/dashboard/keyword/types/keyword.ts";

type KeywordHotListPartProps = {
    keywordList: KeywordsMetric[];
    isLoading: boolean;
    onAdd?: (keyword: KeywordsMetric) => Promise<void> | void;
}

export function KeywordHotListPart({ keywordList, isLoading, onAdd }: KeywordHotListPartProps) {
    const [addedIds, setAddedIds] = useState<number[]>([]);

    const handleAdd = async (keyword: KeywordsMetric) => {
        try {
            if (onAdd) {
                await onAdd(keyword);
            }

            // Only mark as added (hide the button) when onAdd succeeds
            setAddedIds((prev) => [...prev, keyword.id]);
        } catch (error) {
            // On failure, button stays visible because addedIds is not updated
            console.error("Failed to add keyword:", error);
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Hot Topics</h2>
            <p className="mb-3 text-sm text-slate-500">Ranked by works and field relevance</p>

            {isLoading ? (
                <p className="text-sm text-slate-400">Loading...</p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {keywordList.map((keyword) => (
                        <SourceRow
                            key={keyword.id}
                            keyword={keyword}
                            maxWorks={keyword.worksCount}
                            isAdded={addedIds.includes(keyword.id)}
                            onAdd={handleAdd}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

function SourceRow({
                       keyword,
                       maxWorks,
                       isAdded,
                       onAdd
                   }: {
    keyword: KeywordsMetric;
    maxWorks: number;
    isAdded: boolean;
    onAdd?: (keyword: KeywordsMetric) => void;
}) {
    const widthPercent = Math.max((keyword.worksCount / maxWorks) * 100, 4);

    return (
        <li className="py-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-base font-semibold text-blue-600">
                    {keyword.name}
                </p>

                {!isAdded && (
                    <button
                        type="button"
                        onClick={() => onAdd?.(keyword)}
                        className="shrink-0 rounded-full border border-blue-200 px-2.5 py-0.5 text-xs
                        font-semibold text-blue-600 cursor-pointer hover:bg-blue-50"
                    >
                        Add
                    </button>
                )}
            </div>

            <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${widthPercent}%` }}
                    />
                </div>
                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                    {keyword.worksCount.toLocaleString()} works
                </span>
            </div>
        </li>
    );
}