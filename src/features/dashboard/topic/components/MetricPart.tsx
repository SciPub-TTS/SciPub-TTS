import type {MetricData} from "@/features/dashboard/topic/types/metric.ts";
import {useGeneralMetrics} from "@/features/dashboard/topic/hooks/useMetric.ts";

export default function MetricPart() {
    const {metricList} = useGeneralMetrics();

    return (
        <div className="grid grid-cols-4 gap-6">
            {metricList.map((metric) => (
                <MetricField
                    key={metric.title}
                    metrics={metric}
                />
            ))}
        </div>
    )
}

function MetricField({metrics}:{metrics: MetricData}) {
    const Icon = metrics.icon;

    return(
        <div className={`
            h-36 relative rounded-2xl
            outline outline-[0.80px] outline-offset-[-0.80px]
            ${metrics.className}
            p-2
        `}>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="text-slate-600 text-xs uppercase tracking-wide">
                    {metrics.title}
                </div>
                <Icon/>
            </div>

            <div className="absolute left-4 top-14 text-neutral-950 text-2xl font-bold">
                {metrics.value}
            </div>

            <div className="absolute left-4 bottom-4 text-xs text-blue-700">
                {metrics.changes}
            </div>
        </div>
    )
}