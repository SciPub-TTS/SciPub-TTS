import { useEffect } from "react";
import {
    ArrowLeftRight,
    BarChart3,
    MousePointerClick,
    TrendingUp,
    TrendingDown,
    X,
} from "lucide-react";

type MomentumHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MomentumHelpDialog({
                                       isOpen,
                                       onClose,
                                   }: MomentumHelpDialogProps) {
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
                        Understanding topic momentum
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
                        icon={<ArrowLeftRight size={18} />}
                        title="What is being compared?"
                        description="Each topic is compared across two time periods. The chart shows how its average score has changed from the previous period to the current period."
                    />

                    <HelpItem
                        icon={<BarChart3 size={18} />}
                        title="Reading the bars"
                        description="Blue bars represent the Previous Average score, while green bars represent the Current Average score for the same topic."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="Growing topics"
                        description="If the green bar is taller than the blue bar, the topic has gained momentum and is performing better than before."
                    />

                    <HelpItem
                        icon={<TrendingDown size={18} />}
                        title="Declining topics"
                        description="If the green bar is shorter than the blue bar, the topic has lost momentum compared with the previous period."
                    />

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Hover for details"
                        description="Hover over any bar to view the exact previous score, current score, and percentage change for that topic."
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