import { useEffect } from "react";
import {
    CircleDot,
    FileText,
    GraduationCap,
    MousePointerClick,
    Compass,
    TrendingUp,
    X,
} from "lucide-react";

type ScatterHelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

const POSITION_GUIDE = [
    {
        title: "Upper-right",
        description:
            "Many publications and many citations. These are mature, influential research topics.",
    },
    {
        title: "Upper-left",
        description:
            "Fewer publications but strong citation impact. Smaller yet highly influential topics.",
    },
    {
        title: "Lower-right",
        description:
            "Large publication volume with relatively lower citation impact. Active but less influential.",
    },
    {
        title: "Lower-left",
        description:
            "Few publications and few citations. Usually niche, emerging, or early-stage topics.",
    },
];

export default function ScatterHelpDialog({
                                      isOpen,
                                      onClose,
                                  }: ScatterHelpDialogProps) {
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
                        Understanding the scatter chart
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
                        icon={<FileText size={18} />}
                        title="Works (X-axis)"
                        description="The total number of publications belonging to a research topic. Topics farther to the right have produced more papers."
                    />

                    <HelpItem
                        icon={<GraduationCap size={18} />}
                        title="Citations (Y-axis)"
                        description="The total number of citations received by papers in the topic. Higher positions indicate stronger scientific impact."
                    />

                    <HelpItem
                        icon={<CircleDot size={18} />}
                        title="Bubble size"
                        description="Bubble size represents the topic score calculated using the selected Discovery Goal formula. Larger bubbles rank higher under the current scoring strategy."
                    />

                    <HelpItem
                        icon={<TrendingUp size={18} />}
                        title="Reading the chart"
                        description="The position of a bubble tells you how much research exists and how influential it is."
                    >
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {POSITION_GUIDE.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                                >
                                    <p className="text-xs font-semibold text-slate-700">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </HelpItem>

                    <HelpItem
                        icon={<Compass size={18} />}
                        title="Changing Discovery Goal"
                        description="Changing the Discovery Goal only recalculates the topic score used for bubble size. Works and citations stay the same, but bubbles may become larger or smaller."
                    />

                    <HelpItem
                        icon={<MousePointerClick size={18} />}
                        title="Hover for details"
                        description="Move your mouse over any bubble to see detailed information about the research topic, including its score and statistics."
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