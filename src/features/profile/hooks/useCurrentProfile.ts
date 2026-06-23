// Đặt file này tại: src/features/profile/hooks/useCurrentProfile.ts
import { useEffect, useState } from "react";
import { authApi } from "@/features/auth/services/auth.api";
import { setCurrentUser, getCurrentUser } from "@/features/auth/utils/authStorage";
import type { ProfileFormState } from "@/features/profile/types/profile.types";

function toFormState(user: ReturnType<typeof getCurrentUser>): ProfileFormState {
    return {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        institution: user?.institution ?? "",
        department: user?.department ?? "",
        country: user?.country ?? "",
    };
}

/**
 * Gọi GET /api/auth/me khi mount để lấy dữ liệu mới nhất từ backend,
 * thay vì chỉ đọc cache localStorage (có thể thiếu institution/department/country
 * nếu được lưu trước khi các field này tồn tại trên BE).
 */
export function useCurrentProfile() {
    const [profile, setProfile] = useState<ProfileFormState>(() =>
        toFormState(getCurrentUser()),
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                const response = await authApi.me();
                setCurrentUser(response.data); // đồng bộ lại cache với dữ liệu mới

                if (isMounted) {
                    setProfile(toFormState(response.data));
                }
            } catch {
                // Giữ nguyên giá trị cache cũ nếu gọi /me thất bại
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { profile, setProfile, isLoading };
}