import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthHeader from "@/features/auth/components/common/AuthHeader";
import { authApi } from "@/features/auth/services/auth.api";
import { submitRegister } from "@/features/auth/services/authFlows";
import type { RegisterLocalRequest } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { registerSchema } from "@/features/auth/validators/auth.schema";
import RegisterFormPanel from "@/features/auth/components/panel/RegisterFormPanel.tsx";
import RegisterPreviewPanel from "@/features/auth/components/panel/RegisterReviewPanel.tsx";
import { useReloadOnHistoryRestore } from "@/features/auth/hooks/useReloadOnHistoryRestore";

type RegisterFormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialForm: RegisterFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterPage() {
    const navigate = useNavigate();
    useReloadOnHistoryRestore();

    const [form, setForm] = useState<RegisterFormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(field: keyof RegisterFormState, value: string) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");

        const validation = registerSchema.safeParse({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
        });

        if (!validation.success) {
            setError(
                validation.error.issues[0]?.message ?? "Invalid registration data.",
            );
            return;
        }

        try {
            setSubmitting(true);

            const payload: RegisterLocalRequest = {
                firstName: validation.data.firstName,
                lastName: validation.data.lastName,
                email: validation.data.email,
                password: validation.data.password,
                confirmPassword: validation.data.confirmPassword,
            };

            const response = await submitRegister(payload);

            navigate(ROUTES.LOGIN, {
                replace: true,
                state: {
                    successMessage:
                        response.message ??
                        "Registration successful! Please check your email to verify your account.",
                    registeredEmail: validation.data.email,
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Registration failed. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    function handleGoogleLogin() {
        try {
            authApi.startGoogleLogin();
        } catch (err) {
            setError(getApiErrorMessage(err, "Google login is not configured yet."));
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader backTo={ROUTES.HOME} backLabel="Back to home" />

            <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                <RegisterFormPanel
                    form={form}
                    error={error}
                    submitting={submitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onGoogleLogin={handleGoogleLogin}
                />

                <RegisterPreviewPanel />
            </main>
        </div>
    );
}
