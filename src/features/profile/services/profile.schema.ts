import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    institution: z.string().max(255, "Institution name is too long").optional(),
    department: z.string().max(255, "Department name is too long").optional(),
    country: z.string().max(100, "Country name is too long").optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;