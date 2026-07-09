export type PublicationTrend = {
    year: number;
    publications: number;
}

export type PublicationTrendApiResponse = {
    status: number;
    message: string;
    data: {
        publicationTrends: PublicationTrend[];
    };
};

export type YearSelectProps = {
    value: number;
    onChange: (year: number) => void;
    options: number[];
    label: string;
}