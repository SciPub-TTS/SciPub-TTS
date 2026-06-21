import { useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthMessage from "@/features/auth/components/common/AuthMessage";
import GoogleLoginButton from "@/features/auth/components/common/GoogleLoginButton";

type LoginFormPanelProps = {
  form: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  error: string;
  successMessage?: string;
  submitting: boolean;
  onChange: (field: string, value: string | boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoogleLogin: () => void;
};

export default function LoginFormPanel({
  form,
  error,
  successMessage,
  submitting,
  onChange,
  onSubmit,
  onGoogleLogin,
}: LoginFormPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-[640px] rounded-[2rem] border border-black bg-white/94 p-7 shadow-[12px_14px_0_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-8">
      <div className="mb-7">
        <p className="mb-2 font-subtext text-xs font-semibold uppercase tracking-[0.28em] text-[#8B5E34]">
          Sign in
        </p>
        <h2 className="font-search-title text-[2.9rem] leading-[0.92] text-black sm:text-[3.3rem]">
          Return to your
          <br />
          <span className="text-[#14532D]">reading room.</span>
        </h2>
      </div>

      {successMessage && <AuthMessage type="success" message={successMessage} />}
      <AuthMessage type="error" message={error} />

      <GoogleLoginButton onClick={onGoogleLogin} label="Google" />

      <div className="relative mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/12" />
        <span className="text-[11px] uppercase tracking-widest text-black/40">
          or
        </span>
        <div className="h-px flex-1 bg-black/12" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-subtext text-sm font-semibold text-black">
            Email
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/45"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
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
            </svg>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="yourname@gmail.com"
              required
              className="h-12 w-full rounded-xl border border-black bg-white pl-9 pr-4 text-sm text-black placeholder:text-black/45 transition-all focus:border-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#14532D]/15"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-subtext text-sm font-semibold text-black">Password</label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-subtext text-xs text-black/60 transition-colors hover:text-[#14532D]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/45"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 11V7a5 5 0 0110 0v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Enter your password"
              required
              className="h-12 w-full rounded-xl border border-black bg-white pl-9 pr-10 text-sm text-black placeholder:text-black/45 transition-all focus:border-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#14532D]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/45 transition-colors hover:text-black"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="23"
                    y2="23"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5">
          <div
            onClick={() => onChange("rememberMe", !form.rememberMe)}
            className={`flex rounded border transition-all ${
              form.rememberMe
                ? "border-[#14532D] bg-[#14532D]"
                : "border-black/20 bg-white"
            }`}
            style={{ width: 18, height: 18 }}
          >
            {form.rememberMe && (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-black/70">
            Keep me signed in on this device
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-black bg-[#14532D] text-sm font-semibold text-white transition-all hover:bg-[#0f4223] disabled:cursor-not-allowed disabled:opacity-60"
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
            <>
              Continue to my feed
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center font-subtext text-sm text-black/65">
        <span className="block">New to Owlreka?</span>
        <Link
          to={ROUTES.REGISTER}
          className="mt-1 inline-block font-medium text-[#14532D] hover:underline"
        >
          Create a free account -&gt;
        </Link>
      </p>
    </section>
  );
}
