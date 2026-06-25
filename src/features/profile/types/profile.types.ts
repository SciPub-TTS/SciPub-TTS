// ─── Response types ───────────────────────────────────────────────────────────

/**
 * Khớp với DashboardResponse DTO từ Backend
 */
export interface DashboardSummaryResponse {
    followTopics: number;
    followAuthors: number;
    bookmarkMarked: number;
}

export interface UserProfileResponse {
    firstName: string;
    lastName: string;
    email: string;
    institution: string;
    department: string;
    country: string;
    avatarUrl: string | null;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface UpdateUserProfileRequest {
    firstName: string;
    lastName: string;
    institution: string;
    department: string;
    country: string;
}

// ─── UI-only types ─────────────────────────────────────────────────────────────

export type ProfileTabId = "profile" | "security";

export interface ProfileFormState {
    firstName: string;
    lastName: string;
    email: string; // read-only display
    institution: string;
    department: string;
    country: string;
}

export interface StatItem {
    label: string;
    value: string | number;
    accent: string;
    valueClass: string;
}