import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitLogin } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { authApi } from "@/features/auth/services/auth.api";

import LoginFormPanel from "@/features/auth/components/panel/LoginFormPanel";
import LoginPreviewPanel from "@/features/auth/components/panel/LoginPreviewPanel";
import AuthHeader from "@/features/auth/components/common/AuthHeader.tsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;

    function handleChange(field: string, value: string | boolean) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) return;

        try {
            setSubmitting(true);
            setError("");

            const requestedPath = (
                location.state as { from?: { pathname?: string } } | null
            )?.from?.pathname;

            const result = await submitLogin(form, requestedPath);
            navigate(result.redirectTo, {replace: true});
        } catch (err) {
            setError(getApiErrorMessage(err, "Login failed. Please try again"));
        } finally {
            setSubmitting(false);
        }
    }

    function handleGoogleLogin() {
        try {
            authApi.startGoogleLogin();
        } catch (err) {
            setError(getApiErrorMessage(err, "Google login is not configured."));
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <AuthHeader backTo={ROUTES.HOME} backLabel="Back to home"/>

            <main className="flex flex-1 min-h-0">
                <LoginFormPanel
                    form={form}
                    error={error}
                    successMessage={successMessage}
                    submitting={submitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onGoogleLogin={handleGoogleLogin}
                />

                <LoginPreviewPanel/>
            </main>
        </div>
    );
}