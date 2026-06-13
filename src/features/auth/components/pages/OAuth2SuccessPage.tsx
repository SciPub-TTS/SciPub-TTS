import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AUTH_ROLES } from "@/features/auth/constants/roles.ts";
import { useReloadOnHistoryRestore } from "@/features/auth/hooks/useReloadOnHistoryRestore";
import { authApi } from "@/features/auth/services/auth.api.ts";
import { setAuthSession, setCurrentUser } from "@/features/auth/utils/authStorage.ts";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage.ts";

type Status = "loading" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Google sign-in was cancelled.",
  cancelled: "Google sign-in was cancelled.",
  account_banned: "Your account has been banned. Please contact support.",
  invalid_user_info: "Unable to retrieve information from Google. Please try again.",
  oauth2_user_not_found: "Account not found. Please register first.",
  google_email_not_verified: "Your Google email has not been verified.",
  oauth2_failed: "Google authentication failed. Please try again.",
};

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 shadow-[0_8px_20px_rgba(5,150,105,0.22)]">
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 10 Q7 2 12 10"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="7" cy="5.5" r="1.2" fill="#6ee7b7" />
        </svg>
      </div>
      <div>
        <div className="font-title text-sm font-semibold leading-none text-slate-900">
          Research Trend Tracker
        </div>
        <div className="font-subtext mt-0.5 text-[10px] leading-none tracking-widest text-slate-400">
          RTT · V2.4
        </div>
      </div>
    </div>
  );
}

export default function OAuth2SuccessPage() {
  const navigate = useNavigate();
  useReloadOnHistoryRestore();
  const hasCalled = useRef(false);

  const searchParams = new URLSearchParams(window.location.search);
  const urlError = searchParams.get("error");
  const initialErrorMessage = urlError
    ? ERROR_MESSAGES[urlError] ?? "Google authentication failed. Please try again."
    : "";
  const [status, setStatus] = useState<Status>(
    initialErrorMessage ? "error" : "loading",
  );
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);

  useEffect(() => {
    if (urlError) {
      return;
    }

    if (hasCalled.current) {
      return;
    }
    hasCalled.current = true;

    async function handleOAuth2Callback() {
      try {
        const refreshResponse = await authApi.refresh();
        setAuthSession(refreshResponse.data);

        const meResponse = await authApi.me();
        setCurrentUser(meResponse.data);

        const redirectTo =
          meResponse.data.role === AUTH_ROLES.ADMIN ? "/admin/dashboard" : "/";

        navigate(redirectTo, { replace: true });
      } catch (err) {
        setErrorMessage(
          getApiErrorMessage(err, "Google authentication failed. Please try again."),
        );
        setStatus("error");
      }
    }

    handleOAuth2Callback();
  }, [navigate, urlError]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="flex h-14 items-center border-b border-slate-200/70 bg-white px-8">
          <BrandLockup />
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-[420px] rounded-[28px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_22px_56px_rgba(15,23,42,0.08)]">
            <p className="font-subtext mb-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-red-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
              OAuth Callback
            </p>

            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1.3" fill="#ef4444" />
              </svg>
            </div>

            <h1 className="font-title mb-1 text-[1.95rem] leading-tight text-slate-950">
              Authentication
            </h1>
            <h1 className="font-title mb-4 text-[1.95rem] leading-tight italic text-red-600">
              Failed.
            </h1>

            <p className="font-subtext mx-auto mb-8 max-w-xs text-sm leading-relaxed text-slate-500">
              {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.16)] transition-all hover:bg-emerald-900"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Go to Login
              </a>

              <a
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-6 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
              >
                Go to Register
              </a>

              <button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-6 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
              >
                Retry with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-50 px-6">
      <BrandLockup />

      <div className="rounded-[28px] border border-slate-200/80 bg-white px-10 py-10 text-center shadow-[0_22px_56px_rgba(15,23,42,0.08)]">
        <div className="relative mx-auto h-12 w-12">
          <svg className="h-12 w-12 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="font-title text-sm font-semibold text-slate-800">
            Processing Google authentication...
          </p>
          <p className="font-subtext text-xs text-slate-400">
            Please do not close this page
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {["Google authentication", "Create session", "Load profile"].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                  style={{ animationDelay: `${index * 0.3}s` }}
                />
                <span className="font-subtext text-xs text-slate-400">{step}</span>
              </div>
              {index < 2 ? <div className="h-px w-4 bg-slate-200" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
