import type { AuthRole } from "../constants/roles";
import type { UserType } from "../constants/userTypes";

export type AuthUser = {
  id: string | number;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  // Role dùng để phân quyền route: user | admin
  role: AuthRole;
  // Loại user phụ: student | lecturer | researcher
  userType?: UserType;
};
