import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmPassword: z.string(),
    // acceptTerms: z.boolean().refine(Boolean, {
    //     message: "You must accept the Terms and Conditions",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyResetCodeSchema = z.object({
  code: z.string().min(6, "Verification code must be at least 6 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });
