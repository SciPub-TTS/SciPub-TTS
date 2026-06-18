export interface FilterData {
    key: FilterKey;
    title: string;
    className?: string;
    options: FilterOption[];
}

export type FilterKey =
    | "endDate"
    | "fieldId"
    | "topicFormula"
    | "keywordFormula";

export interface FilterOption {
    label: string;
    value: string;
}

