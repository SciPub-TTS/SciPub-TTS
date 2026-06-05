// export default function LoginPage() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
//       <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8">
//         <h1 className="text-2xl font-semibold text-slate-950">Login</h1>
//         <p className="mt-2 text-sm text-slate-500">Login form is being built.</p>
//       </section>
//     </main>
//   );
// }

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitLogin } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { authApi } from "@/features/auth/services/auth.api";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Đọc success message từ register hoặc change-password redirect
    const successMessage = (location.state as { successMessage?: string } | null)
        ?.successMessage;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        try {
            setSubmitting(true);
            setError("");

            const requestedPath = (
                location.state as { from?: { pathname?: string } } | null
            )?.from?.pathname;

            const result = await submitLogin({ email, password, rememberMe }, requestedPath);
            navigate(result.redirectTo, { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Đăng nhập thất bại. Vui lòng thử lại."));
        } finally {
            setSubmitting(false);
        }
    }

    function handleGoogleLogin() {
        try {
            authApi.startGoogleLogin();
        } catch (err) {
            setError(getApiErrorMessage(err, "Chưa cấu hình Google login."));
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
                <Link to={ROUTES.HOME} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </Link>
            </header>

            {/* Main */}
            <div className="flex flex-1 min-h-0">
                {/* Left — Form */}
                <div className="flex-1 flex items-center justify-center px-8 py-12 lg:max-w-[520px]">
                    <div className="w-full max-w-[360px]">
                        <div className="mb-8">
                            <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                                Welcome back
                            </p>
                            <h1 className="font-serif text-[2.6rem] leading-[1.12] text-slate-950 mb-0">
                                Log in to your
                            </h1>
                            <h1 className="font-serif text-[2.6rem] leading-[1.12] italic text-emerald-700">
                                research feed.
                            </h1>
                        </div>

                        {successMessage && (
                            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-5"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>

                        <div className="relative flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[11px] tracking-widest text-slate-400 uppercase">or</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    onClick={() => setRememberMe((v) => !v)}
                                    className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all ${
                                        rememberMe
                                            ? "bg-emerald-700 border-emerald-700"
                                            : "border-slate-300 bg-white"
                                    }`}
                                    style={{ width: 18, height: 18 }}
                                >
                                    {rememberMe && (
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
                            New to Research Trend Tracker?{" "}
                            <Link to={ROUTES.REGISTER} className="text-emerald-700 font-medium hover:underline">
                                Create a free academic account →
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right — Dark preview panel */}
                <div className="hidden lg:flex flex-1 bg-[#0d2018] flex-col justify-between p-10 relative overflow-hidden">
                    {/* Decorative grid dots */}
                    <div className="absolute inset-0 opacity-[0.06]"
                         style={{
                             backgroundImage: "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
                             backgroundSize: "32px 32px",
                         }}
                    />
                    {/* Decorative line SVG */}
                    <svg className="absolute right-0 top-0 opacity-20" width="340" height="500" viewBox="0 0 340 500" fill="none">
                        <path d="M340 0 Q180 120 200 250 Q220 380 340 500" stroke="#6ee7b7" strokeWidth="0.8" />
                        <path d="M340 50 Q200 170 220 300 Q240 430 340 500" stroke="#34d399" strokeWidth="0.5" />
                        <circle cx="200" cy="250" r="3" fill="#6ee7b7" opacity="0.6" />
                        <circle cx="220" cy="170" r="2" fill="#6ee7b7" opacity="0.4" />
                        <circle cx="240" cy="350" r="2" fill="#34d399" opacity="0.4" />
                    </svg>

                    <div className="relative z-10">
                        <p className="text-[11px] tracking-[0.18em] text-emerald-400/70 uppercase mb-4 flex items-center gap-1.5">
                            <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                            Your feed · Since last login
                            <span className="ml-auto text-emerald-400/50">● LIVE</span>
                        </p>

                        <h2 className="font-serif text-[2.2rem] leading-[1.15] text-white mb-2">
                            Continue tracking<br />
                            your{" "}
                            <span className="italic text-emerald-400">research trends.</span>
                        </h2>
                        <p className="text-sm text-slate-400 max-w-[380px] mt-3">
                            While you were away, 12 watchlist topics moved. Three crossed your acceleration threshold and one venue cooled.
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 mt-8">
                            {[
                                { label: "NEW PAPERS", value: "+1,284", sub: "LAST 72H" },
                                { label: "WATCHLIST Δ", value: "+38.4%", sub: "MOMENTUM QOQ" },
                                { label: "HOT VENUES", value: "14", sub: "OF 92 TRACKED" },
                            ].map((s) => (
                                <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-4">
                                    <p className="text-[10px] tracking-widest text-slate-500 uppercase mb-1">{s.label}</p>
                                    <p className="text-xl font-semibold text-emerald-400">{s.value}</p>
                                    <p className="text-[10px] text-slate-600 mt-0.5">{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Trend chart area */}
                        <div className="mt-5 rounded-xl bg-white/5 border border-white/8 p-5">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] tracking-widest text-slate-500 uppercase">Aggregate Trend Index</p>
                                <div className="flex gap-2 text-[10px] text-slate-600">
                                    {["1W", "10W", "1Y"].map((t, i) => (
                                        <span key={t} className={i === 1 ? "text-emerald-400 font-semibold" : ""}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-emerald-400 mt-1">
                                +52.7% <span className="text-sm font-normal text-emerald-600">▲ vs last week</span>
                            </p>
                            {/* Fake sparkline */}
                            <svg className="w-full mt-3" height="56" viewBox="0 0 400 56" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0 48 Q40 45 80 42 Q120 38 160 34 Q200 28 240 22 Q280 14 320 10 Q360 6 400 2" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" />
                                <path d="M0 48 Q40 45 80 42 Q120 38 160 34 Q200 28 240 22 Q280 14 320 10 Q360 6 400 2 V56 H0Z" fill="url(#lg)" />
                                <circle cx="400" cy="2" r="3" fill="#34d399" />
                            </svg>
                        </div>

                        {/* Trending list */}
                        <div className="mt-5 rounded-xl bg-white/5 border border-white/8 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-[10px] tracking-widest text-slate-500 uppercase">Trending in your watchlist</p>
                                    <p className="text-sm font-medium text-white mt-0.5">This week</p>
                                </div>
                                <span className="text-[10px] text-amber-400 border border-amber-400/30 rounded px-2 py-0.5">🔔 4 ALERTS</span>
                            </div>
                            {[
                                { n: "01", name: "Mechanistic Interpretability", papers: "3,481 PAPERS", pct: "+247%" },
                                { n: "02", name: "Mixture-of-Experts Routing", papers: "2,210 PAPERS", pct: "+184%" },
                                { n: "03", name: "Protein Language Models", papers: "1,876 PAPERS", pct: "+132%" },
                                { n: "04", name: "Carbon-Capture Catalysts", papers: "1,402 PAPERS", pct: "+96%" },
                            ].map((item) => (
                                <div key={item.n} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                    <span className="text-[11px] text-slate-600 w-5">{item.n}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 truncate">{item.name}</p>
                                        <p className="text-[10px] text-slate-600">{item.papers}</p>
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">{item.pct}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Signal alert bar */}
                    <div className="relative z-10 mt-5 rounded-xl bg-emerald-900/40 border border-emerald-800/50 p-4 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] tracking-widest text-slate-500 uppercase">Signal · Acceleration breached</p>
                            <p className="text-xs text-slate-300 mt-0.5">
                                <span className="text-emerald-400 font-medium">Mechanistic Interpretability</span> just crossed your 200% threshold — first time since you started tracking it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
