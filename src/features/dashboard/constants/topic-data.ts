import type {TopicData} from "@/features/dashboard/types/topic.ts";

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

export const topicMetrics = [
    {
        topic: "Large Language Models (LLMs)",
        Velocity: 92,
        Acceleration: 84,
        Citation: 96,
        InstitutionDivers: 87,
        AuthorNewcomerRatio: 42,
    },
    {
        topic: "Quantum Machine Learning",
        Velocity: 74,
        Acceleration: 91,
        Citation: 78,
        InstitutionDivers: 69,
        AuthorNewcomerRatio: 36,
    },
    {
        topic: "CRISPR Gene Editing",
        Velocity: 81,
        Acceleration: 73,
        Citation: 88,
        InstitutionDivers: 78,
        AuthorNewcomerRatio: 39,
    },
    {
        topic: "Autonomous Vehicle Safety",
        Velocity: 68,
        Acceleration: 86,
        Citation: 72,
        InstitutionDivers: 73,
        AuthorNewcomerRatio: 31,
    },
    {
        topic: "Edge Computing Architecture",
        Velocity: 59,
        Acceleration: 64,
        Citation: 65,
        InstitutionDivers: 66,
        AuthorNewcomerRatio: 47,
    },
    {
        topic: "Solid-State Batteries",
        Velocity: 77,
        Acceleration: 95,
        Citation: 83,
        InstitutionDivers: 71,
        AuthorNewcomerRatio: 52,
    },
    {
        topic: "Neuromorphic Computing",
        Velocity: 88,
        Acceleration: 79,
        Citation: 94,
        InstitutionDivers: 82,
        AuthorNewcomerRatio: 34,
    },
    {
        topic: "Graph Neural Networks",
        Velocity: 72,
        Acceleration: 81,
        Citation: 76,
        InstitutionDivers: 75,
        AuthorNewcomerRatio: 29,
    },
    {
        topic: "Generative AI in Drug Discovery",
        Velocity: 95,
        Acceleration: 89,
        Citation: 98,
        InstitutionDivers: 91,
        AuthorNewcomerRatio: 41,
    },
    {
        topic: "Perovskite Solar Cells",
        Velocity: 64,
        Acceleration: 70,
        Citation: 69,
        InstitutionDivers: 62,
        AuthorNewcomerRatio: 38,
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

export const topicGrowthMetrics = [
    {
        topic: "Large Language Models (LLMs)",
        currentAverage: 80.2,
        pastAverage: 70.41,
        growthPercentage: 13.9
    },
    {
        topic: "Quantum Machine Learning",
        currentAverage: 69.6,
        pastAverage: 52.55,
        growthPercentage: 32.45
    },
    {
        topic: "CRISPR Gene Editing",
        currentAverage: 71.8,
        pastAverage: 57.8,
        growthPercentage: 24.22
    },
    {
        topic: "Autonomous Vehicle Safety",
        currentAverage: 66.0,
        pastAverage: 52.45,
        growthPercentage: 25.83
    },
    {
        topic: "Edge Computing Architecture",
        currentAverage: 60.2,
        pastAverage: 54.02,
        growthPercentage: 11.44
    },
    {
        topic: "Solid-State Batteries",
        currentAverage: 75.6,
        pastAverage: 66.93,
        growthPercentage: 12.95
    },
    {
        topic: "Neuromorphic Computing",
        currentAverage: 75.4,
        pastAverage: 70.0,
        growthPercentage: 7.71
    },
    {
        topic: "Graph Neural Networks",
        currentAverage: 66.6,
        pastAverage: 51.11,
        growthPercentage: 30.31
    },
    {
        topic: "Generative AI in Drug Discovery",
        currentAverage: 82.8,
        pastAverage: 69.09,
        growthPercentage: 19.84
    },
    {
        topic: "Perovskite Solar Cells",
        currentAverage: 60.6,
        pastAverage: 45.81,
        growthPercentage: 32.29
    }
];