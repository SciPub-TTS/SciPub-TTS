import {
    CalendarClock,
    CircleQuestionMark,
    Cloud,
    Compass,
    Filter,
    Hash,
    Layers,
    MousePointerClick,
    X
} from "lucide-react";
import {MENU_FILTER} from "@/features/dashboard/topic/constants/filter-data.ts";
import type {FilterData} from "@/features/dashboard/topic/types/filter.ts";
import type {KeywordFormulaType} from "@/features/dashboard/keyword/types/keyword.ts";
import {useEffect, useState} from "react";

type FilterPartProps = {
    endDate: string;
    fieldId: string;
    topicFormula: string;
    keywordFormula: KeywordFormulaType;
    setEndDate: (value: string) => void;
    setFieldId: (value: string) => void;
    setTopicFormula: (value: string) => void;
    setKeywordFormula: (value: KeywordFormulaType) => void;
};

export default function FilterPart({
                                       endDate,
                                       fieldId,
                                       topicFormula,
                                       keywordFormula,
                                       setEndDate,
                                       setFieldId,
                                       setTopicFormula,
                                       setKeywordFormula,
                                   }: FilterPartProps) {
    const [draftEndDate, setDraftEndDate] = useState(endDate);
    const [draftFieldId, setDraftFieldId] = useState(fieldId);
    const [draftTopicFormula, setDraftTopicFormula] = useState(topicFormula);
    const [draftKeywordFormula, setDraftKeywordFormula] = useState(keywordFormula);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const handleApply = () => {
        setEndDate(draftEndDate);
        setFieldId(draftFieldId);
        setTopicFormula(draftTopicFormula);
        setKeywordFormula(draftKeywordFormula);
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-8 py-3 flex flex-col gap-3 justify-start items-end relative">
            <CircleQuestionMark className="absolute mr-[77vw] mt-[12vh] cursor-pointer"
                                onClick={() => setIsHelpOpen(true)}
            />

            <div className="flex flex-row justify-between items-end w-full">
                <div className="relative group">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center animate-bounce pointer-events-none">
                        <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap font-medium">
                            This is button
                        </span>
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800"></div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-gray-50 flex flex-row gap-2 w-fit px-2 py-1 h-fit cursor-pointer hover:bg-gray-100 transition-colors"
                         onClick={() => handleApply()}
                    >
                        <Filter width={16} />
                        Filters
                    </div>
                </div>

                {MENU_FILTER.map((filter) => {
                    let value = "";
                    switch (filter.key) {
                        case "endDate": value = draftEndDate; break;
                        case "fieldId": value = draftFieldId; break;
                        case "topicFormula": value = draftTopicFormula; break;
                        case "keywordFormula": value = draftKeywordFormula; break;
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
                                    case "topicFormula": setDraftTopicFormula(val); break;
                                    case "keywordFormula": setDraftKeywordFormula(val as KeywordFormulaType); break;
                                }
                            }}
                        />
                    );
                })}
            </div>

            <div className="flex flex-row gap-2 w-fit px-2 py-1 h-fit rounded-lg bg-green-100 text-green-800 scale-80">
                <Cloud />
                Data Source: Open Alex
            </div>

            <FilterHelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
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

type FilterHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

const DISCOVERY_GOAL_OPTIONS = [
    {
        name: "Balanced",
        description: "Weighs every signal evenly — a good general-purpose view.",
    },
    {
        name: "Trending",
        description: "Surfaces topics growing fast right now, based on recent volume and pace.",
    },
    {
        name: "Emerging",
        description: "Surfaces newer topics pulling in new institutions and first-time authors.",
    },
    {
        name: "Impact",
        description: "Surfaces topics whose papers keep getting cited over time.",
    },
];

const KEYWORD_GOAL_OPTIONS = [
    {
        name: "Balanced",
        description: "An even mix of growth speed and how widely a keyword is already used.",
    },
    {
        name: "Trending",
        description: "Favors keywords gaining ground quickly.",
    },
    {
        name: "Emerging",
        description: "Favors brand-new keywords that are just starting to rise — catches things earliest.",
    },
    {
        name: "Dominant",
        description: "Favors keywords that are already widely and heavily used.",
    },
];

function FilterHelpDialog({ isOpen, onClose }: FilterHelpDialogProps) {
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        How filtering works
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5">
                    <HelpItem
                        icon={<CalendarClock size={18} />}
                        title="End Date"
                        description="The most recent date included in the analysis. Papers published after this date are excluded — useful for looking back at how things stood at a specific point in time."
                    />

                    <HelpItem
                        icon={<Layers size={18} />}
                        title="Field"
                        description="The academic field the dashboard analyzes. Only papers and topics within this field are shown."
                    />

                    <HelpItem
                        icon={<Compass size={18} />}
                        title="Discovery Goal"
                        description="What you want to find when looking at hot topics."
                    >
                        <OptionGrid options={DISCOVERY_GOAL_OPTIONS} />
                    </HelpItem>

                    <HelpItem
                        icon={<Hash size={18} />}
                        title="Keyword Goal"
                        description="Same idea as Discovery Goal, applied to individual keywords instead of whole topics."
                    >
                        <OptionGrid options={KEYWORD_GOAL_OPTIONS} />
                    </HelpItem>

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Applying changes"
                        description='Adjusting any filter above only updates the dashboard once you click "Filters". This keeps the dashboard from reloading on every single change.'
                    />
                </div>

                <div className="flex justify-end border-t border-slate-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

function HelpItem({
                      icon,
                      title,
                      description,
                      children,
                  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                {children}
            </div>
        </div>
    );
}

function OptionGrid({ options }: { options: { name: string; description: string }[] }) {
    return (
        <div className="mt-3 grid grid-cols-2 gap-2">
            {options.map((option) => (
                <div
                    key={option.name}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                    <p className="text-xs font-semibold text-slate-700">{option.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{option.description}</p>
                </div>
            ))}
        </div>
    );
}