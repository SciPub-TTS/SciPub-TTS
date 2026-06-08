// src/features/auth/components/panel/LoginFormPanel.tsx
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
        <div className="flex-1 flex items-center justify-center px-8 py-12 lg:max-w-[680px]">
            <div className="w-full max-w-[430px]">
                <div className="mb-8">
                  
                    <h1 className="font-serif text-[2.6rem] leading-[1.12] text-slate-950 mb-0">
                        Log in to your
                    </h1>
                    <h1 className="font-serif text-[2.6rem] leading-[1.12] italic text-emerald-700">
                        research feed.
                    </h1>
                </div>

                {successMessage && <AuthMessage type="success" message={successMessage} />}
                <AuthMessage type="error" message={error} />

                <GoogleLoginButton onClick={onGoogleLogin} label="Google" />

                <div className="relative flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[11px] tracking-widest text-slate-400 uppercase">or</span>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => onChange("email", e.target.value)}
                                placeholder="a.okonkwo@ethz.ch"
                                required
                                className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <Link
                                to={ROUTES.FORGOT_PASSWORD}
                                className="text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => onChange("password", e.target.value)}
                                placeholder="••••••••••"
                                required
                                className="w-full h-11 pl-9 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Keep signed in */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div
                            onClick={() => onChange("rememberMe", !form.rememberMe)}
                            className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all ${
                                form.rememberMe
                                    ? "bg-emerald-700 border-emerald-700"
                                    : "border-slate-300 bg-white"
                            }`}
                            style={{ width: 18, height: 18 }}
                        >
                            {form.rememberMe && (
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm text-slate-600">Keep me signed in on this device</span>
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                    >
                        {submitting ? (
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <>
                                Continue to my feed
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-500 text-center">
                    <span className="block">New to Research Trend Tracker?</span>
                    <Link to={ROUTES.REGISTER} className="mt-1 inline-block text-emerald-700 font-medium hover:underline">
                        Create a free academic account →
                    </Link>
                </p>
            </div>
        </div>
    );
}
