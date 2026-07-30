import type {TopicData} from "@/features/dashboard/topic/types/topic.ts";
import type {Momentum} from "@/features/dashboard/topic/types/momentum.ts";
import type {TopicRadarMetrics} from "@/features/dashboard/topic/types/radar.ts";

export const LIST_TOPICS: TopicData[] = [
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Large Language Models (LLMs)",
        works: 12450,
        citations: 89400,
        score: 98,
        change: 45.2,
        state: "hot",
        isFollowed: true
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Quantum Machine Learning",
        works: 1840,
        citations: 12300,
        score: 85,
        change: 120.5,
        state: "breakout",
        isFollowed: false
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Perovskite Solar Cells",
        works: 5620,
        citations: 34150,
        score: 79,
        change: 14.8,
        state: "rising",
        isFollowed: false
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "CRISPR Gene Editing",
        works: 8900,
        citations: 62400,
        score: 92,
        change: 22.1,
        state: "hot",
        isFollowed: true
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Neuromorphic Computing",
        works: 2150,
        citations: 14800,
        score: 81,
        change: 88.4,
        state: "breakout",
        isFollowed: false
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Solid-State Batteries",
        works: 4200,
        citations: 28900,
        score: 88,
        change: 35.6,
        state: "rising",
        isFollowed: true
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Graph Neural Networks",
        works: 7310,
        citations: 45200,
        score: 86,
        change: 18.3,
        state: "hot",
        isFollowed: false
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Generative AI in Drug Discovery",
        works: 1120,
        citations: 9600,
        score: 94,
        change: 210.7,
        state: "breakout",
        isFollowed: true
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
        name: "Edge Computing Architecture",
        works: 6150,
        citations: 31200,
        score: 75,
        change: 11.2,
        state: "rising",
        isFollowed: false
    },
    {
        topicId: "https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg",
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
        history: [
            { name: "2026-06-22", average: 63.5 },
            { name: "2026-06-29", average: 68.9 },
            { name: "2026-07-06", average: 72.4 },
            { name: "2026-07-13", average: 76.8 },
            { name: "2026-07-20", average: 80.2 },
        ],
    },
    {
        name: "Quantum Machine Learning",
        history: [
            { name: "2026-06-22", average: 45.2 },
            { name: "2026-06-29", average: 52.5 },
            { name: "2026-07-06", average: 58.4 },
            { name: "2026-07-13", average: 63.9 },
            { name: "2026-07-20", average: 69.6 },
        ],
    },
    {
        name: "CRISPR Gene Editing",
        history: [
            { name: "2026-06-22", average: 50.4 },
            { name: "2026-06-29", average: 56.8 },
            { name: "2026-07-06", average: 61.7 },
            { name: "2026-07-13", average: 67.5 },
            { name: "2026-07-20", average: 71.8 },
        ],
    },
    {
        name: "Autonomous Vehicle Safety",
        history: [
            { name: "2026-06-22", average: 46.8 },
            { name: "2026-06-29", average: 52.4 },
            { name: "2026-07-06", average: 58.1 },
            { name: "2026-07-13", average: 62.7 },
            { name: "2026-07-20", average: 66.0 },
        ],
    },
    {
        name: "Edge Computing Architecture",
        history: [
            { name: "2026-06-22", average: 49.6 },
            { name: "2026-06-29", average: 52.3 },
            { name: "2026-07-06", average: 55.8 },
            { name: "2026-07-13", average: 57.9 },
            { name: "2026-07-20", average: 60.2 },
        ],
    },
    {
        name: "Solid-State Batteries",
        history: [
            { name: "2026-06-22", average: 60.7 },
            { name: "2026-06-29", average: 65.3 },
            { name: "2026-07-06", average: 68.8 },
            { name: "2026-07-13", average: 72.4 },
            { name: "2026-07-20", average: 75.6 },
        ],
    },
    {
        name: "Neuromorphic Computing",
        history: [
            { name: "2026-06-22", average: 62.5 },
            { name: "2026-06-29", average: 66.1 },
            { name: "2026-07-06", average: 69.4 },
            { name: "2026-07-13", average: 72.2 },
            { name: "2026-07-20", average: 75.4 },
        ],
    },
    {
        name: "Graph Neural Networks",
        history: [
            { name: "2026-06-22", average: 40.8 },
            { name: "2026-06-29", average: 47.6 },
            { name: "2026-07-06", average: 54.1 },
            { name: "2026-07-13", average: 60.3 },
            { name: "2026-07-20", average: 66.6 },
        ],
    },
    {
        name: "Generative AI in Drug Discovery",
        history: [
            { name: "2026-06-22", average: 61.9 },
            { name: "2026-06-29", average: 67.4 },
            { name: "2026-07-06", average: 72.3 },
            { name: "2026-07-13", average: 77.5 },
            { name: "2026-07-20", average: 82.8 },
        ],
    },
    {
        name: "Perovskite Solar Cells",
        history: [
            { name: "2026-06-22", average: 39.6 },
            { name: "2026-06-29", average: 45.8 },
            { name: "2026-07-06", average: 51.7 },
            { name: "2026-07-13", average: 56.2 },
            { name: "2026-07-20", average: 60.6 },
        ],
    },
];