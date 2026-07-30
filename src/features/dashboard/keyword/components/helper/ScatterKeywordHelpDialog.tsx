import { useEffect } from "react";
import {
    BookOpen,
    CircleDot,
    MousePointerClick,
    TrendingUp,
    X,
} from "lucide-react";

type ScatterKeywordHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ScatterKeywordHelpDialog({
                                             isOpen,
                                             onClose,
                                         }: ScatterKeywordHelpDialogProps) {
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
                        Understanding keyword distribution
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
                        icon={<BookOpen size={18} />}
                        title="Publication Share"
                        description="The horizontal axis shows the percentage of publications containing the keyword. Keywords farther to the right appear in a larger share of the literature."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="CAGR"
                        description="The vertical axis shows the Compound Annual Growth Rate (CAGR). Higher values indicate keywords growing faster over time."
                    />

                    <HelpItem
                        icon={<CircleDot size={18} />}
                        title="Bubble size"
                        description="Bubble size represents the number of recent papers associated with the keyword. Larger bubbles indicate greater recent research activity."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="How to interpret"
                        description="Keywords in the upper-right combine broad adoption with rapid growth. Lower-left keywords are less common and growing more slowly."
                    />

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Hover for details"
                        description="Hover over a bubble to view the keyword and its publication share, CAGR, and recent paper count."
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
};

function HelpItem({
                      icon,
                      title,
                      description,
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
            </div>
        </div>
    );
}