import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthHeader from "@/features/auth/components/common/AuthHeader";
import AuthSplitStage from "@/features/auth/components/common/AuthSplitStage";
import { useReloadOnHistoryRestore } from "@/features/auth/hooks/useReloadOnHistoryRestore";
import RegisterFormPanel from "@/features/auth/components/panel/RegisterFormPanel";
import RegisterPreviewPanel from "@/features/auth/components/panel/RegisterReviewPanel";
import { authApi } from "@/features/auth/services/auth.api";
import { submitRegister } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { registerSchema } from "@/features/auth/validators/auth.schema";

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

      const payload = {
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
    <div className="flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(rgba(230,255,244,0.28),rgba(226,244,255,0.22)),url('/background.png')] bg-cover bg-center bg-no-repeat">
      <AuthHeader backTo={ROUTES.HOME} backLabel="Back to home" />

      <main className="mx-auto flex w-full max-w-[1360px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <AuthSplitStage
          panel={
            <RegisterFormPanel
              form={form}
              error={error}
              submitting={submitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onGoogleLogin={handleGoogleLogin}
            />
          }
          showcase={<RegisterPreviewPanel />}
        />
      </main>
    </div>
  );
}
