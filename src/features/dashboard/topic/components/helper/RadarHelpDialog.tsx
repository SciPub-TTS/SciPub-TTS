import { useEffect } from "react";
import {
    CircleGauge,
    ChartNoAxesCombined,
    MousePointerClick,
    Target,
    TrendingUp,
    X,
} from "lucide-react";

type RadarHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function RadarHelpDialog({
                                    isOpen,
                                    onClose,
                                }: RadarHelpDialogProps) {
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
                        Understanding the radar chart
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
                        icon={<Target size={18} />}
                        title="What is being compared?"
                        description="The selected research topic is compared against the overall average across all research momentum metrics."
                    />

                    <HelpItem
                        icon={<ChartNoAxesCombined size={18} />}
                        title="Reading the radar"
                        description="Each axis represents a different evaluation metric. Values farther from the center indicate stronger performance on that metric."
                    />

                    <HelpItem
                        icon={<CircleGauge size={18} />}
                        title="Comparing shapes"
                        description="When the blue area extends beyond the green area, the selected topic performs above the overall average for that metric. When it stays inside, it performs below average."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="Overall performance"
                        description="A larger radar area generally indicates a stronger overall research profile. Balanced shapes suggest consistent performance across multiple indicators."
                    />

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Choose a topic"
                        description="Use the topic selector to instantly compare different research topics with the field average using the same set of metrics."
                    />
                </div>

                <div className="flex justify-end border-t border-slate-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
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