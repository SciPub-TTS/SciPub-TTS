import { profileApi } from "@/features/profile/services/profile.api.ts";
import type {
    ProfileFormState,
    UpdateUserProfileRequest,
} from "@/features/profile/types/profile.types";

/**
 * Gọi API update profile, trả về boolean cho UI quyết định
 * hiển thị trạng thái thành công/thất bại.
 */
export async function submitProfileUpdate(
    form: ProfileFormState,
): Promise<{ success: boolean; message?: string }> {
    const payload: UpdateUserProfileRequest = {
        firstName: form.firstName,
        lastName: form.lastName,
        institution: form.institution,
        department: form.department,
        country: form.country,
    };

    try {
        const response = await profileApi.updateProfile(payload);
        return { success: true, message: response.message };
    } catch {
        return { success: false };
    }
}

/**
 * Lấy dashboard summary, trả null nếu lỗi (UI tự fallback giá trị mặc định)
 */
export async function fetchDashboardSummary() {
    try {
        const response = await profileApi.getDashboardSummary();
        return response.data;
    } catch {
        return null;
    }
}