import type {FilterData} from "@/features/dashboard/topic/types/filter.ts";
import {getAvailableMondays} from "@/features/dashboard/topic/hooks/getAvailableMondays.ts";

export const MENU_FILTER: FilterData[] = [
    {
        key: "endDate",
        title: "End Date",
        className: "w-[12vw]",
        options: getAvailableMondays().map(date => ({
            label: date,
            value: date,
        })),
    },

    {
        key: "fieldId",
        title: "Field",
        className: "w-[12vw]",
        options: [
            {
                label: "Computer Science",
                value: "17",
            },
            {
                label: "Engineering",
                value: "22",
            },
        ],
    },

    {
        key: "formula",
        title: "Formula",
        className: "w-[12vw]",
        options: [
            {
                label: "Balanced",
                value: "balanced",
            },
            {
                label: "Trending",
                value: "trending",
            },
            {
                label: "Emerging",
                value: "emerging",
            },
            {
                label: "Impact",
                value: "impact",
            },
        ],
    },
];