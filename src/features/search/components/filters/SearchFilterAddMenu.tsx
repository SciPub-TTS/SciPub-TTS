import { Check, Plus } from "lucide-react";

import type { SearchFilterWidgetKey } from "@/features/search/types";
import { normalizeSearchFilterWidgetKeys } from "@/features/search/utils";

import { searchFilterWidgetDefinitions } from "./filterWidgetConfig";

type SearchFilterAddMenuProps = {
  onToggleWidget: (widgetKey: SearchFilterWidgetKey) => void;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};

export default function SearchFilterAddMenu({
  onToggleWidget,
  visibleFilterWidgets,
}: SearchFilterAddMenuProps) {
  const selectedWidgetKeys = new Set(
    normalizeSearchFilterWidgetKeys(visibleFilterWidgets),
  );

  return (
    <details className="group relative z-40">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 border border-slate-700 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-900 transition hover:bg-slate-100">
        <Plus className="h-4 w-4" />
        Add Widget
      </summary>

      <div className="absolute right-0 top-full z-[90] mt-2 w-[320px] overflow-hidden border border-slate-700 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <div className="border-b border-slate-700 bg-slate-100 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
            Widget Library
          </p>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {searchFilterWidgetDefinitions.map((definition, index) => {
            const Icon = definition.icon;
            const isSelected = selectedWidgetKeys.has(definition.key);

            return (
              <div key={definition.key}>
                <button
                  type="button"
                  onClick={() => onToggleWidget(definition.key)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-600" />
                  <span className="flex-1">{definition.label}</span>
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center border",
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-900 bg-white text-transparent",
                    ].join(" ")}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>

                {index < searchFilterWidgetDefinitions.length - 1 ? (
                  <div className="border-t border-slate-300" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}
