import {Cloud, Filter} from "lucide-react";
import {type FilterData, MENU_FILTER} from "@/features/dashboard/constants/filter-data.ts";

export default function FilterPart(){
    return(
        <div className="rounded-lg border border-slate-200 bg-white px-8 py-3
        flex flex-col overflow-y-auto gap-3 justify-start items-end">
            <div className="flex flex-row overflow-y-auto justify-between items-end w-full">
                <div className="rounded-lg border border-slate-200 bg-gray-50
            flex flex-row gap-2 w-fit px-2 py-1 h-fit">
                    <Filter width={16}/> Filters
                </div>

                {MENU_FILTER.map((filter) => (
                    <FilterField
                        key={filter.title}
                        filter={filter}
                    />
                ))}
            </div>

            <div className="flex flex-row gap-2 w-fit px-2 py-1 h-fit
            rounded-lg bg-green-100 text-green-800 scale-80">
                <Cloud/>
                Data Source: Open Alex
            </div>
        </div>
    );
}

function FilterField({filter}:{filter:FilterData}) {
    return(
        <div className={filter.className}>
            <div className="flex flex-col gap-1 text-base opacity-75">
                {filter.title}
                <input type={"number"}
                       min={0}
                       max={1}
                       step={0.05}
                       className="rounded-lg border border-slate-200 h-[4.5vh] w-full"/>
            </div>
        </div>
    );
}