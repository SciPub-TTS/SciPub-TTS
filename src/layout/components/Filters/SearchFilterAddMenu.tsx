import { Check, Plus } from "lucide-react";

import type { SearchFilterWidgetKey } from "@/features/search/types";

import { searchFilterWidgetDefinitions } from "./filterWidgetConfig";

type SearchFilterAddMenuProps = {
  onToggleWidget: (widgetKey: SearchFilterWidgetKey) => void;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};

export default function SearchFilterAddMenu({
  onToggleWidget,
  visibleFilterWidgets,
}: SearchFilterAddMenuProps) {
  return (
    <details className="group relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-400 bg-white px-4 py-2 text-xs font-bold text-[#14532D] transition hover:border-[#15803D] hover:bg-[#A3E635]/20">
        <Plus className="h-4 w-4" />
        Add filter
      </summary>

      <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-2xl">
        <div className="max-h-[420px] overflow-y-auto py-2">
          {searchFilterWidgetDefinitions.map((definition, index) => {
            const Icon = definition.icon;
            const isSelected = visibleFilterWidgets.includes(definition.key);

            return (
              <div key={definition.key}>
                <button
                  type="button"
                  onClick={() => onToggleWidget(definition.key)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{definition.label}</span>
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-md border bg-white",
                      isSelected
                        ? "border-black bg-[#059669]"
                        : "border-black",
                    ].join(" ")}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-white" />
                    ) : null}
                  </span>
                </button>

                {index < searchFilterWidgetDefinitions.length - 1 ? (
                  <div className="mx-4 border-t border-slate-200" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}
