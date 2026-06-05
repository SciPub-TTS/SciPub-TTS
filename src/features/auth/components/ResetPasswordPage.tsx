import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitResetPassword } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const long = password.length >= 10;
    const score = [long, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    const levels = [
        { label: "Too weak", color: "bg-red-400", width: "w-1/4" },
        { label: "Weak", color: "bg-orange-400", width: "w-2/4" },
        { label: "Medium", color: "bg-amber-400", width: "w-3/4" },
        { label: "Strong", color: "bg-emerald-500", width: "w-full" },
    ];
    const level = levels[Math.max(0, score - 1)];

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${level.color} ${level.width}`} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
                {[
                    { label: "10+ chars", ok: long },
                    { label: "Uppercase", ok: hasUpper },
                    { label: "Number", ok: hasNumber },
                    { label: "Special char", ok: hasSpecial },
                ].map((r) => (
                    <span key={r.label} className={`text-[10px] flex items-center gap-1 ${r.ok ? "text-emerald-600" : "text-slate-400"}`}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              {r.ok
                  ? <><circle cx="6" cy="6" r="5.5" fill="#059669" /><path d="M3.5 6l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></>
                  : <circle cx="6" cy="6" r="5.5" stroke="#cbd5e1" strokeWidth="1" />
              }
            </svg>
                        {r.label}
          </span>
                ))}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as { resetGrantToken?: string } | null;

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword.length < 10) {
            setError("Password must be at least 10 characters long.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("Password confirmation does not match.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await submitResetPassword({
                resetGrantToken: locationState?.resetGrantToken,
                newPassword,
                confirmNewPassword,
            });

            navigate(ROUTES.LOGIN, {
                replace: true,
                state: {
                    successMessage:
                        response.message ?? "Your password has been reset. Please log in.",
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to reset password. The link may have expired."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 h-14 border-b border-slate-100">
                <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
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
                </Link>
                <Link to={ROUTES.LOGIN} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to login
                </Link>
            </header>

            {/* Main */}
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[400px]">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#059669" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="12" cy="16" r="1.5" fill="#059669" />
                        </svg>
                    </div>

                    <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                        Password recovery · Step 3 of 3
                    </p>

                    <h1 className="font-serif text-[2.2rem] leading-[1.15] text-slate-950 mb-1">
                        Set a new
                    </h1>
                    <h1 className="font-serif text-[2.2rem] leading-[1.15] italic text-emerald-700 mb-3">
                        password.
                    </h1>
                    <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                        Choose a strong password for your account. You'll use it to sign in next time.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 10 characters"
                                    required
                                    autoFocus
                                    className="w-full h-11 pl-9 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                                <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </button>
                            </div>
                            <PasswordStrength password={newPassword} />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    required
                                    className={`w-full h-11 pl-9 pr-10 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                        confirmNewPassword && confirmNewPassword !== newPassword
                                            ? "border-red-300 bg-red-50"
                                            : "border-slate-200"
                                    }`}
                                />
                                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </button>
                            </div>
                            {confirmNewPassword && confirmNewPassword !== newPassword && (
                                <p className="mt-1 text-xs text-red-500">Passwords don't match.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Reset password
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="h-1 w-6 rounded-full bg-emerald-600" />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">Step 3 of 3</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
