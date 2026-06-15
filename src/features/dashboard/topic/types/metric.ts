export type MetricData = {
    title: string;
    className?: string;
    value: string | number;
    change: string
    changeSuffix: string;
    icon: React.ComponentType<{ className?: string }>;
}

export type MetricApiResponse = {
    status: number;
    message: string;
    data: {
        metricList: MetricItem[];
    };
};

export type MetricItem = {
    title: string;
    value: number | string;
    change: number
}