import type {TopicData} from "@/features/dashboard/topic/types/topic.ts";
import type {Momentum} from "@/features/dashboard/topic/types/momentum.ts";
import type {TopicRadarMetrics} from "@/features/dashboard/topic/types/radar.ts";

export const LIST_TOPICS: TopicData[] = [
    {
        name: "Large Language Models (LLMs)",
        works: 12450,
        citations: 89400,
        score: 98,
        change: 45.2,
        state: "hot",
        isFollowed: true
    },
    {
        name: "Quantum Machine Learning",
        works: 1840,
        citations: 12300,
        score: 85,
        change: 120.5,
        state: "breakout",
        isFollowed: false
    },
    {
        name: "Perovskite Solar Cells",
        works: 5620,
        citations: 34150,
        score: 79,
        change: 14.8,
        state: "rising",
        isFollowed: false
    },
    {
        name: "CRISPR Gene Editing",
        works: 8900,
        citations: 62400,
        score: 92,
        change: 22.1,
        state: "hot",
        isFollowed: true
    },
    {
        name: "Neuromorphic Computing",
        works: 2150,
        citations: 14800,
        score: 81,
        change: 88.4,
        state: "breakout",
        isFollowed: false
    },
    {
        name: "Solid-State Batteries",
        works: 4200,
        citations: 28900,
        score: 88,
        change: 35.6,
        state: "rising",
        isFollowed: true
    },
    {
        name: "Graph Neural Networks",
        works: 7310,
        citations: 45200,
        score: 86,
        change: 18.3,
        state: "hot",
        isFollowed: false
    },
    {
        name: "Generative AI in Drug Discovery",
        works: 1120,
        citations: 9600,
        score: 94,
        change: 210.7,
        state: "breakout",
        isFollowed: true
    },
    {
        name: "Edge Computing Architecture",
        works: 6150,
        citations: 31200,
        score: 75,
        change: 11.2,
        state: "rising",
        isFollowed: false
    },
    {
        name: "Autonomous Vehicle Safety",
        works: 5430,
        citations: 27600,
        score: 80,
        change: 25.4,
        state: "rising",
        isFollowed: false
    }
];

export const topicMetrics: TopicRadarMetrics[] = [
    {
        name: "Large Language Models (LLMs)",
        velocity: 92,
        accelerate: 84,
        citationDecay: 96,
        institution: 87,
        newComerAuthor: 42,
    },
    {
        name: "Quantum Machine Learning",
        velocity: 74,
        accelerate: 91,
        citationDecay: 78,
        institution: 69,
        newComerAuthor: 36,
    },
    {
        name: "CRISPR Gene Editing",
        velocity: 81,
        accelerate: 73,
        citationDecay: 88,
        institution: 78,
        newComerAuthor: 39,
    },
    {
        name: "Autonomous Vehicle Safety",
        velocity: 68,
        accelerate: 86,
        citationDecay: 72,
        institution: 73,
        newComerAuthor: 31,
    },
    {
        name: "Edge Computing Architecture",
        velocity: 59,
        accelerate: 64,
        citationDecay: 65,
        institution: 66,
        newComerAuthor: 47,
    },
    {
        name: "Solid-State Batteries",
        velocity: 77,
        accelerate: 95,
        citationDecay: 83,
        institution: 71,
        newComerAuthor: 52,
    },
    {
        name: "Neuromorphic Computing",
        velocity: 88,
        accelerate: 79,
        citationDecay: 94,
        institution: 82,
        newComerAuthor: 34,
    },
    {
        name: "Graph Neural Networks",
        velocity: 72,
        accelerate: 81,
        citationDecay: 76,
        institution: 75,
        newComerAuthor: 29,
    },
    {
        name: "Generative AI in Drug Discovery",
        velocity: 95,
        accelerate: 89,
        citationDecay: 98,
        institution: 91,
        newComerAuthor: 41,
    },
    {
        name: "Perovskite Solar Cells",
        velocity: 64,
        accelerate: 70,
        citationDecay: 69,
        institution: 62,
        newComerAuthor: 38,
    },
];

export const publicationTrend = [
    { year: "2005", publications: 1200 },
    { year: "2006", publications: 1450 },
    { year: "2007", publications: 1720 },
    { year: "2008", publications: 1980 },
    { year: "2009", publications: 2240 },
    { year: "2010", publications: 2670 },
    { year: "2011", publications: 3150 },
    { year: "2012", publications: 3890 },
    { year: "2013", publications: 4720 },
    { year: "2014", publications: 5610 },
    { year: "2015", publications: 6480 },
    { year: "2016", publications: 7420 },
    { year: "2017", publications: 8610 },
    { year: "2018", publications: 10120 },
    { year: "2019", publications: 11850 },
    { year: "2020", publications: 13640 },
    { year: "2021", publications: 15890 },
    { year: "2022", publications: 17620 },
    { year: "2023", publications: 19340 },
    { year: "2024", publications: 21480 }
];

export const topicGrowthMetrics: Momentum[] = [
    {
        name: "Large Language Models (LLMs)",
        currentAverage: 80.2,
        pastAverage: 70.41,
        growthPercentage: 13.9
    },
    {
        name: "Quantum Machine Learning",
        currentAverage: 69.6,
        pastAverage: 52.55,
        growthPercentage: 32.45
    },
    {
        name: "CRISPR Gene Editing",
        currentAverage: 71.8,
        pastAverage: 57.8,
        growthPercentage: 24.22
    },
    {
        name: "Autonomous Vehicle Safety",
        currentAverage: 66.0,
        pastAverage: 52.45,
        growthPercentage: 25.83
    },
    {
        name: "Edge Computing Architecture",
        currentAverage: 60.2,
        pastAverage: 54.02,
        growthPercentage: 11.44
    },
    {
        name: "Solid-State Batteries",
        currentAverage: 75.6,
        pastAverage: 66.93,
        growthPercentage: 12.95
    },
    {
        name: "Neuromorphic Computing",
        currentAverage: 75.4,
        pastAverage: 70.0,
        growthPercentage: 7.71
    },
    {
        name: "Graph Neural Networks",
        currentAverage: 66.6,
        pastAverage: 51.11,
        growthPercentage: 30.31
    },
    {
        name: "Generative AI in Drug Discovery",
        currentAverage: 82.8,
        pastAverage: 69.09,
        growthPercentage: 19.84
    },
    {
        name: "Perovskite Solar Cells",
        currentAverage: 60.6,
        pastAverage: 45.81,
        growthPercentage: 32.29
    }
];