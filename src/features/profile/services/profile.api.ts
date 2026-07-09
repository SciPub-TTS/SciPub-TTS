import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
    DashboardSummaryResponse,
    UpdateUserProfileRequest,
    UserProfileResponse,
} from "@/features/profile/types/profile.types";

/**
 * Lưu ý: `http` đã có baseURL = VITE_API_BASE_URL (ví dụ http://localhost:8080),
 * KHÔNG bao gồm "/api". Vì vậy mọi path ở đây phải tự thêm "/api" ở đầu,
 * khớp với context-path Spring Boot.
 */
const PROFILE_BASE = "/api/account/profile";
const SUMMARY_BASE = "/api/account/summary";

export const profileApi = {
    /**
     * Lấy thống kê dashboard (followed topics/authors, bookmarked papers)
     */
    getDashboardSummary() {
        return http
            .get<ApiResponse<DashboardSummaryResponse>>(SUMMARY_BASE)
            .then((res) => res.data);
    },

    /**
     * Lấy thông tin profile đầy đủ của user hiện tại
     */
    getProfile() {
        return http
            .get<ApiResponse<UserProfileResponse>>(PROFILE_BASE)
            .then((res) => res.data);
    },

    /**
     * Cập nhật thông tin profile
     */
    updateProfile(payload: UpdateUserProfileRequest) {
        return http
            .put<ApiResponse<UserProfileResponse>>(PROFILE_BASE, payload)
            .then((res) => res.data);
    },
};