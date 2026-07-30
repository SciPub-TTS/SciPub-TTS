import { useEffect } from "react";
import {
    CalendarRange,
    MousePointerClick,
    Palette,
    Rows3,
    TrendingUp,
    X,
} from "lucide-react";

type HeatMapHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function HeatMapHelpDialog({
                                      isOpen,
                                      onClose,
                                  }: HeatMapHelpDialogProps) {
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () =>
            document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Understanding the heat map
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5">
                    <HelpItem
                        icon={<Rows3 size={18} />}
                        title="Rows and columns"
                        description="Each row represents a research metric, while each column represents a time. Every cell shows the value of one metric in one specific time."
                    />

                    <HelpItem
                        icon={<Palette size={18} />}
                        title="Reading the colors"
                        description="Darker green cells indicate higher values, while lighter cells indicate lower values. This makes it easy to spot strong and weak periods at a glance."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="Finding trends"
                        description="Read across a row to see how a metric changes over time. Read down a column to compare different metrics within the same time."
                    />

                    <HelpItem
                        icon={<CalendarRange size={18} />}
                        title="Time range"
                        description="The heat map summarizes timely research metrics for the currently selected topic over the available analysis period."
                    />

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Current topic"
                        description="Changing the selected topic updates the entire heat map, allowing you to compare how different research topics evolved over time."
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

type HelpItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
};

function HelpItem({
                      icon,
                      title,
                      description,
                      children,
                  }: HelpItemProps) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="mt-0.5 text-sm text-slate-500">
                    {description}
                </p>

                {children}
            </div>
        </div>
    );
}