import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/services/auth.api.ts";
import { setAuthSession, setCurrentUser } from "@/features/auth/utils/authStorage.ts";
import { AUTH_ROLES } from "@/features/auth/constants/roles.ts";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage.ts";
import {ROUTES} from "@/app/router";

type Status = "loading" | "error";
const ERROR_MESSAGES: Record<string, string> = {
  account_banned: "Your account has been banned. Please contact support.",
  invalid_user_info: "Unable to retrieve information from Google. Please try again.",
  oauth2_user_not_found: "Account not found. Please register first.",
  google_email_not_verified: "Your Google email has not been verified.",
};

export default function OAuth2SuccessPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // Read error from URL if the backend redirects back with ?error=
  const searchParams = new URLSearchParams(window.location.search);
  const urlError = searchParams.get("error");

  // useRef prevents the effect from running twice because of React StrictMode
  const hasCalled = useRef(false);

  const googleSignupToken = searchParams.get("googleSignupToken");

  useEffect(() => {
    if (googleSignupToken) {
      navigate(
          `${ROUTES.GOOGLE_REGISTER_COMPLETE}?token=${encodeURIComponent(
              googleSignupToken,
          )}`,
          { replace: true },
      );
      return;
    }
    // If the backend redirects back with ?error=, show the error immediately
    // and do not call the API
    if (urlError) {
      setErrorMessage(
          ERROR_MESSAGES[urlError] ?? "Google login failed. Please try again."
      );
      setStatus("error");
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    async function handleOAuth2Callback() {
      try {
        // Step 1: Call /refresh — the browser automatically attaches the HttpOnly cookie.
        // The backend reads the refresh token from the cookie and returns an access token.
        const refreshResponse = await authApi.refresh();
        setAuthSession(refreshResponse.data);

        // Step 2: Call /me to get the full user information.
        const meResponse = await authApi.me();
        setCurrentUser(meResponse.data);

        // Step 3: Navigate based on role.
        const role = meResponse.data.role;
        const redirectTo =
            role === AUTH_ROLES.ADMIN ? "/admin/dashboard" : "/";

        navigate(redirectTo, { replace: true });
      } catch (err) {
        const msg = getApiErrorMessage(err, "Google login failed. Please try again.");
        setErrorMessage(msg);
        setStatus("error");
      }
    }

    handleOAuth2Callback();
  }, [navigate, urlError, googleSignupToken]);
  // ── Error state ──────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="flex items-center px-8 h-14 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-800 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 10 Q7 2 12 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <circle cx="7" cy="5.5" r="1.2" fill="#6ee7b7" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 leading-none">Research Trend Tracker</div>
              <div className="text-[10px] tracking-widest text-slate-400 leading-none mt-0.5">RTT · V2.4</div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-[380px] text-center">
            {/* Error icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1.3" fill="#ef4444" />
              </svg>
            </div>

            <h1 className="font-serif text-[1.8rem] leading-tight text-slate-950 mb-1">
              Login
            </h1>
            <h1 className="font-serif text-[1.8rem] leading-tight italic text-red-600 mb-4">
              Failed.
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs mx-auto">
              {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Go back to Login
              </a>

              <button
                onClick={() => window.location.href = "/login"}
                className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
              >
                Thử lại với Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path d="M2 10 Q7 2 12 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <circle cx="7" cy="5.5" r="1.2" fill="#6ee7b7" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 leading-none">Research Trend Tracker</div>
          <div className="text-[10px] tracking-widest text-slate-400 leading-none mt-0.5">RTT · V2.4</div>
        </div>
      </div>

      {/* Spinner */}
      <div className="relative w-12 h-12">
        <svg className="animate-spin w-12 h-12 text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      {/* Steps indicator */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-sm font-medium text-slate-700">Processing Google login…</p>
        <p className="text-xs text-slate-400">Please do not close this page</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3 mt-4">
        {[
          "Google login",
          "Create session",
          "Download information",
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <span className="text-xs text-slate-400">{step}</span>
            </div>
            {i < 2 && (
              <div className="w-4 h-px bg-slate-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
