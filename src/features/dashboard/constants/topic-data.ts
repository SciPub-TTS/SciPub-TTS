export type TopicData = {
    name: string;
    works: number;
    citations: number;
    score: number;
    change: number;
    state: string;
    isFollowed: boolean;
}

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
        "name": "Week 01",
        "AI": 52.07, "Quantum": 0.0, "Biotech": 39.57, "Robotics": 17.06, "IoT": 42.44,
        "Blockchain": 71.85, "Cloud": 80.73, "Security": 6.9, "Data": 49.73, "FiveG": 29.48
    },
    {
        "name": "Week 02",
        "AI": 0.0, "Quantum": 44.61, "Biotech": 0.0, "Robotics": 54.41, "IoT": 19.24,
        "Blockchain": 49.74, "Cloud": 59.17, "Security": 39.84, "Data": 77.95, "FiveG": 13.63
    },
    {
        "name": "Week 03",
        "AI": 77.73, "Quantum": 10.02, "Biotech": 24.09, "Robotics": 0.0, "IoT": 100.0,
        "Blockchain": 21.85, "Cloud": 42.22, "Security": 68.42, "Data": 25.12, "FiveG": 54.75
    },
    {
        "name": "Week 04",
        "AI": 29.47, "Quantum": 74.06, "Biotech": 4.92, "Robotics": 84.03, "IoT": 45.48,
        "Blockchain": 0.0, "Cloud": 63.54, "Security": 18.58, "Data": 100.0, "FiveG": 35.01
    },
    {
        "name": "Week 05",
        "AI": 100.0, "Quantum": 29.68, "Biotech": 80.88, "Robotics": 11.33, "IoT": 53.55,
        "Blockchain": 68.94, "Cloud": 13.02, "Security": 80.63, "Data": 0.0, "FiveG": 62.12
    },
    {
        "name": "Week 06",
        "AI": 3.81, "Quantum": 68.01, "Biotech": 65.61, "Robotics": 42.25, "IoT": 9.8,
        "Blockchain": 100.0, "Cloud": 33.39, "Security": 36.3, "Data": 62.34, "FiveG": 0.0
    },
    {
        "name": "Week 07",
        "AI": 71.29, "Quantum": 7.14, "Biotech": 16.47, "Robotics": 66.77, "IoT": 74.38,
        "Blockchain": 36.92, "Cloud": 100.0, "Security": 0.0, "Data": 33.46, "FiveG": 100.0
    },
    {
        "name": "Week 08",
        "AI": 22.89, "Quantum": 100.0, "Biotech": 3.39, "Robotics": 24.21, "IoT": 97.57,
        "Blockchain": 57.3, "Cloud": 0.0, "Security": 100.0, "Data": 55.01, "FiveG": 26.32
    },
    {
        "name": "Week 09",
        "AI": 90.73, "Quantum": 38.84, "Biotech": 100.0, "Robotics": 38.44, "IoT": 0.0,
        "Blockchain": 92.12, "Cloud": 20.83, "Security": 60.45, "Data": 75.91, "FiveG": 8.89
    },
    {
        "name": "Week 10",
        "AI": 12.63, "Quantum": 84.66, "Biotech": 32.43, "Robotics": 100.0, "IoT": 29.24,
        "Blockchain": 14.25, "Cloud": 78.62, "Security": 29.19, "Data": 44.76, "FiveG": 88.12
    }
];

export const topicMetrics = [
    {
        topic: "AI",
        Velocity: 92,
        Acceleration: 84,
        Citation: 96,
        InstitutionDivers: 87,
        AuthorNewcomerRatio: 42
    },
    {
        topic: "Quantum",
        Velocity: 74,
        Acceleration: 91,
        Citation: 78,
        InstitutionDivers: 69,
        AuthorNewcomerRatio: 36
    },
    {
        topic: "Biotech",
        Velocity: 81,
        Acceleration: 73,
        Citation: 88,
        InstitutionDivers: 78,
        AuthorNewcomerRatio: 39
    },
    {
        topic: "Robotics",
        Velocity: 68,
        Acceleration: 86,
        Citation: 72,
        InstitutionDivers: 73,
        AuthorNewcomerRatio: 31
    },
    {
        topic: "IoT",
        Velocity: 59,
        Acceleration: 64,
        Citation: 65,
        InstitutionDivers: 66,
        AuthorNewcomerRatio: 47
    },
    {
        topic: "Blockchain",
        Velocity: 77,
        Acceleration: 95,
        Citation: 83,
        InstitutionDivers: 71,
        AuthorNewcomerRatio: 52
    },
    {
        topic: "Cloud",
        Velocity: 88,
        Acceleration: 79,
        Citation: 94,
        InstitutionDivers: 82,
        AuthorNewcomerRatio: 34
    },
    {
        topic: "Security",
        Velocity: 72,
        Acceleration: 81,
        Citation: 76,
        InstitutionDivers: 75,
        AuthorNewcomerRatio: 29
    },
    {
        topic: "Data",
        Velocity: 95,
        Acceleration: 89,
        Citation: 98,
        InstitutionDivers: 91,
        AuthorNewcomerRatio: 41
    },
    {
        topic: "FiveG",
        Velocity: 64,
        Acceleration: 70,
        Citation: 69,
        InstitutionDivers: 62,
        AuthorNewcomerRatio: 38
    }
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