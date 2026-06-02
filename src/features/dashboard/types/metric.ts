export type MetricData = {
    title: string;
    className?: string;
    value: string;
    changes: string
    icon: React.ComponentType<{ className?: string }>;
}

export type MetricResponse = {
    title: string;
    value: string;
    changes: string
}