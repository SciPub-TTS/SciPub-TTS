export type MetricData = {
    title: string;
    className?: string;
    value: string;
    changes: string
    icon: React.ComponentType<{ className?: string }>;
}