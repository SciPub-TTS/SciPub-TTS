// src/features/auth/constants/registerRoles.tsx
import type { ReactNode } from "react";
import { AUTH_ROLES, type AuthRole } from "@/features/auth/constants/roles";

export type PublicRole = Exclude<AuthRole, "ADMIN">;

export const REGISTER_ROLE_OPTIONS: {
    value: PublicRole;
    label: string;
    sub: string;
    icon: ReactNode;
}[] = [
    {
        value: AUTH_ROLES.USER,
        label: "Researcher",
        sub: "PHD, POSTDOC, PI",
        icon: null,
    },
];