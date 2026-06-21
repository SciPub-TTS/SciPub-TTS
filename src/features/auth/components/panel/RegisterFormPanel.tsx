import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthMessage from "@/features/auth/components/common/AuthMessage";
import GoogleLoginButton from "@/features/auth/components/common/GoogleLoginButton";
import PasswordInput from "@/features/auth/components/form/PasswordInput";

type RegisterFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormPanelProps = {
  form: RegisterFormState;
  error: string;
  submitting: boolean;
  onChange: (field: keyof RegisterFormState, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoogleLogin: () => void;
};

export default function RegisterFormPanel({
  form,
  error,
  submitting,
  onChange,
  onSubmit,
  onGoogleLogin,
}: RegisterFormPanelProps) {
  return (
    <section className="w-full rounded-[2rem] border border-black bg-white/94 p-6 shadow-[12px_14px_0_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-8">
      <div className="mb-7">
        <p className="mb-2 font-subtext text-xs font-semibold uppercase tracking-[0.28em] text-[#8B5E34]">
          Join Owlreka
        </p>
        <h2 className="font-search-title text-[2.9rem] leading-[0.92] text-black sm:text-[3.3rem]">
          Open a new
          <br />
          <span className="text-[#14532D]">research account.</span>
        </h2>
      </div>

      <AuthMessage type="error" message={error} />

      <GoogleLoginButton onClick={onGoogleLogin} />

      <div className="relative mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/12" />
        <span className="text-[11px] uppercase tracking-widest text-black/40">
          or with email
        </span>
        <div className="h-px flex-1 bg-black/12" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="First name"
            value={form.firstName}
            onChange={(value) => onChange("firstName", value)}
            placeholder="John"
          />

          <TextInput
            label="Last name"
            value={form.lastName}
            onChange={(value) => onChange("lastName", value)}
            placeholder="Doe"
          />
        </div>

        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => onChange("email", value)}
          placeholder="yourname@gmail.com"
        />

        <div className="grid grid-cols-2 gap-3">
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(value) => onChange("password", value)}
            placeholder="Create a password"
          />

          <PasswordInput
            label="Confirm password"
            value={form.confirmPassword}
            onChange={(value) => onChange("confirmPassword", value)}
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-black bg-[#14532D] text-sm font-semibold text-white transition-all hover:bg-[#0f4223] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <>Create account and begin exploring -&gt;</>
          )}
        </button>
      </form>

      <p className="mt-5 text-center font-subtext text-sm text-black/65">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-[#14532D] hover:underline"
        >
          Login
        </Link>
      </p>
    </section>
  );
}

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: TextInputProps) {
  return (
    <div>
      <label className="mb-1.5 block font-subtext text-sm font-semibold text-black">
        {label}
      </label>

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/45"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          {type === "email" ? (
            <>
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M22 6l-10 7L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </>
          ) : (
            <>
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-xl border border-black bg-white pl-9 pr-3 text-sm text-black placeholder:text-black/45 transition-all focus:border-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#14532D]/15"
        />
      </div>
    </div>
  );
}
