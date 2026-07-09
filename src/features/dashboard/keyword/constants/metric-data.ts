import type { KeywordMetric } from "../types/metric";

export const KEYWORD_COLORS = [
    "#2563eb",
    "#10b981",
    "#9333ea",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#8b5cf6",
    "#ec4899",
    "#22c55e",
    "#64748b",
];

export type KeywordQuadrant =
    | "dominant"
    | "emerging"
    | "mature"
    | "declining";

export interface KeywordMetricDisplay extends KeywordMetric {
    label: string;
    order: number;
    quadrant: KeywordQuadrant;
}