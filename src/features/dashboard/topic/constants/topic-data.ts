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

export const topicTrend = [
    {
        name: "Week 01",
        "Large Language Models (LLMs)": 52.07,
        "Quantum Machine Learning": 0.0,
        "CRISPR Gene Editing": 39.57,
        "Autonomous Vehicle Safety": 17.06,
        "Edge Computing Architecture": 42.44,
        "Solid-State Batteries": 71.85,
        "Neuromorphic Computing": 80.73,
        "Graph Neural Networks": 6.9,
        "Generative AI in Drug Discovery": 49.73,
        "Perovskite Solar Cells": 29.48,
    },
    {
        name: "Week 02",
        "Large Language Models (LLMs)": 0.0,
        "Quantum Machine Learning": 44.61,
        "CRISPR Gene Editing": 0.0,
        "Autonomous Vehicle Safety": 54.41,
        "Edge Computing Architecture": 19.24,
        "Solid-State Batteries": 49.74,
        "Neuromorphic Computing": 59.17,
        "Graph Neural Networks": 39.84,
        "Generative AI in Drug Discovery": 77.95,
        "Perovskite Solar Cells": 13.63,
    },
    {
        name: "Week 03",
        "Large Language Models (LLMs)": 77.73,
        "Quantum Machine Learning": 10.02,
        "CRISPR Gene Editing": 24.09,
        "Autonomous Vehicle Safety": 0.0,
        "Edge Computing Architecture": 100.0,
        "Solid-State Batteries": 21.85,
        "Neuromorphic Computing": 42.22,
        "Graph Neural Networks": 68.42,
        "Generative AI in Drug Discovery": 25.12,
        "Perovskite Solar Cells": 54.75,
    },
    {
        name: "Week 04",
        "Large Language Models (LLMs)": 29.47,
        "Quantum Machine Learning": 74.06,
        "CRISPR Gene Editing": 4.92,
        "Autonomous Vehicle Safety": 84.03,
        "Edge Computing Architecture": 45.48,
        "Solid-State Batteries": 0.0,
        "Neuromorphic Computing": 63.54,
        "Graph Neural Networks": 18.58,
        "Generative AI in Drug Discovery": 100.0,
        "Perovskite Solar Cells": 35.01,
    },
    {
        name: "Week 05",
        "Large Language Models (LLMs)": 100.0,
        "Quantum Machine Learning": 29.68,
        "CRISPR Gene Editing": 80.88,
        "Autonomous Vehicle Safety": 11.33,
        "Edge Computing Architecture": 53.55,
        "Solid-State Batteries": 68.94,
        "Neuromorphic Computing": 13.02,
        "Graph Neural Networks": 80.63,
        "Generative AI in Drug Discovery": 0.0,
        "Perovskite Solar Cells": 62.12,
    },
    {
        name: "Week 06",
        "Large Language Models (LLMs)": 3.81,
        "Quantum Machine Learning": 68.01,
        "CRISPR Gene Editing": 65.61,
        "Autonomous Vehicle Safety": 42.25,
        "Edge Computing Architecture": 9.8,
        "Solid-State Batteries": 100.0,
        "Neuromorphic Computing": 33.39,
        "Graph Neural Networks": 36.3,
        "Generative AI in Drug Discovery": 62.34,
        "Perovskite Solar Cells": 0.0,
    },
    {
        name: "Week 07",
        "Large Language Models (LLMs)": 71.29,
        "Quantum Machine Learning": 7.14,
        "CRISPR Gene Editing": 16.47,
        "Autonomous Vehicle Safety": 66.77,
        "Edge Computing Architecture": 74.38,
        "Solid-State Batteries": 36.92,
        "Neuromorphic Computing": 100.0,
        "Graph Neural Networks": 0.0,
        "Generative AI in Drug Discovery": 33.46,
        "Perovskite Solar Cells": 100.0,
    },
    {
        name: "Week 08",
        "Large Language Models (LLMs)": 22.89,
        "Quantum Machine Learning": 100.0,
        "CRISPR Gene Editing": 3.39,
        "Autonomous Vehicle Safety": 24.21,
        "Edge Computing Architecture": 97.57,
        "Solid-State Batteries": 57.3,
        "Neuromorphic Computing": 0.0,
        "Graph Neural Networks": 100.0,
        "Generative AI in Drug Discovery": 55.01,
        "Perovskite Solar Cells": 26.32,
    },
    {
        name: "Week 09",
        "Large Language Models (LLMs)": 90.73,
        "Quantum Machine Learning": 38.84,
        "CRISPR Gene Editing": 100.0,
        "Autonomous Vehicle Safety": 38.44,
        "Edge Computing Architecture": 0.0,
        "Solid-State Batteries": 92.12,
        "Neuromorphic Computing": 20.83,
        "Graph Neural Networks": 60.45,
        "Generative AI in Drug Discovery": 75.91,
        "Perovskite Solar Cells": 8.89,
    },
    {
        name: "Week 10",
        "Large Language Models (LLMs)": 12.63,
        "Quantum Machine Learning": 84.66,
        "CRISPR Gene Editing": 32.43,
        "Autonomous Vehicle Safety": 100.0,
        "Edge Computing Architecture": 29.24,
        "Solid-State Batteries": 14.25,
        "Neuromorphic Computing": 78.62,
        "Graph Neural Networks": 29.19,
        "Generative AI in Drug Discovery": 44.76,
        "Perovskite Solar Cells": 88.12,
    },
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