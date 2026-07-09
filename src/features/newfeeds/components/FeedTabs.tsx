import clsx from "clsx";

import type { FeedTab, FeedTabKey } from "../types";

type FeedTabsProps = {
  activeTab: FeedTabKey;
  onTabChange: (tab: FeedTabKey) => void;
  tabs: FeedTab[];
};

export function FeedTabs({ activeTab, onTabChange, tabs }: FeedTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max gap-7">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              className={clsx(
                "relative h-12 whitespace-nowrap text-sm font-semibold transition",
                isActive ? "text-emerald-600" : "text-black hover:text-black",
              )}
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              type="button"
            >
              {tab.label}
              {isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-600" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
