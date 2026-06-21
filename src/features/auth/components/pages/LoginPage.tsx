import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthHeader from "@/features/auth/components/common/AuthHeader";
import AuthSplitStage from "@/features/auth/components/common/AuthSplitStage";
import { useReloadOnHistoryRestore } from "@/features/auth/hooks/useReloadOnHistoryRestore";
import LoginFormPanel from "@/features/auth/components/panel/LoginFormPanel";
import LoginPreviewPanel from "@/features/auth/components/panel/LoginPreviewPanel";
import { authApi } from "@/features/auth/services/auth.api";
import { submitLogin } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  useReloadOnHistoryRestore();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const successMessage = (
    location.state as { successMessage?: string } | null
  )?.successMessage;

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      navigate(result.redirectTo, { replace: true });
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
    <div className="flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(rgba(255,254,251,0.52),rgba(247,251,255,0.5)),url('/background.png')] bg-cover bg-center bg-no-repeat">
      <AuthHeader backTo={ROUTES.HOME} backLabel="Back to home" />

      <main className="mx-auto flex w-full max-w-[1292px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <AuthSplitStage
          panel={
            <LoginFormPanel
              form={form}
              error={error}
              successMessage={successMessage}
              submitting={submitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onGoogleLogin={handleGoogleLogin}
            />
          }
          showcase={<LoginPreviewPanel />}
        />
      </main>
    </div>
  );
}
