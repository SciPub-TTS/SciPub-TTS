import {CircleQuestionMark, Cloud, Filter} from "lucide-react";
import {MENU_FILTER} from "@/features/dashboard/topic/constants/filter-data.ts";
import type {FilterData} from "@/features/dashboard/topic/types/filter.ts";
import {useState} from "react";

type FilterPartProps = {
    endDate: string;
    fieldId: string;
    formula: string;
    setEndDate: (value: string) => void;
    setFieldId: (value: string) => void;
    setFormula: (value: string) => void;
};

export default function FilterPart({
                                       endDate,
                                       fieldId,
                                       formula,
                                       setEndDate,
                                       setFieldId,
                                       setFormula,
                                   }: FilterPartProps) {
    const [draftEndDate, setDraftEndDate] = useState(endDate);
    const [draftFieldId, setDraftFieldId] = useState(fieldId);
    const [draftFormula, setDraftFormula] = useState(formula);

    const handleApply = () => {
        setEndDate(draftEndDate);
        setFieldId(draftFieldId);
        setFormula(draftFormula);
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-8 py-3 flex flex-col gap-3 justify-start items-end relative">
            <CircleQuestionMark className="absolute mr-[77vw] mt-[12vh] cursor-pointer" />

            <div className="flex flex-row justify-between items-end w-full">
                <div className="rounded-lg border border-slate-200 bg-gray-50 flex flex-row gap-2 w-fit px-2 py-1 h-fit cursor-pointer">
                    <Filter width={16} />
                    Filters
                </div>

                {MENU_FILTER.map((filter) => {
                    let value = "";
                    switch (filter.key) {
                        case "endDate": value = draftEndDate; break;
                        case "fieldId": value = draftFieldId; break;
                        case "formula": value = draftFormula; break;
                    }

                    return (
                        <FilterField
                            key={filter.key}
                            filter={filter}
                            value={value}
                            onChange={(val) => {
                                switch (filter.key) {
                                    case "endDate": setDraftEndDate(val); break;
                                    case "fieldId": setDraftFieldId(val); break;
                                    case "formula": setDraftFormula(val); break;
                                }
                            }}
                        />
                    );
                })}

                <button
                    onClick={handleApply}
                    className="rounded-lg bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors"
                >
                    Apply
                </button>
            </div>

            <div className="flex flex-row gap-2 w-fit px-2 py-1 h-fit rounded-lg bg-green-100 text-green-800 scale-80">
                <Cloud />
                Data Source: Open Alex
            </div>
        </div>
    );
}

type FilterFieldProps = {
    filter: FilterData;
    value: string;
    onChange: (value: string) => void;
};

export function FilterField({ filter, value, onChange }: FilterFieldProps) {
    return (
        <div className={filter.className}>
            <div className="flex flex-col gap-1 text-base opacity-75">
                {filter.title}

                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="rounded-lg border border-slate-200 h-[4.5vh] w-full px-2"
                >
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}