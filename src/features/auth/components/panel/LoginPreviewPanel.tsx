// src/features/auth/components/panel/LoginPreviewPanel.tsx
export default function LoginPreviewPanel() {
    return (
        <div className="hidden lg:flex flex-[0.62] bg-[#0d2018] flex-col justify-between p-7 relative overflow-hidden">
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
                

                <h2 className="font-serif text-[2.2rem] leading-[1.15] text-white mb-2">
                    Continue tracking your{" "}
                    <span className="italic text-emerald-400">research trends.</span>
                </h2>
                

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
                <div className="mt-4 rounded-xl bg-white/5 border border-white/8 p-4">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] tracking-widest text-slate-500 uppercase">Aggregate Trend Index</p>
                        <div className="flex gap-2 text-[10px] text-slate-600">
                            {["1W", "10W", "1Y"].map((t, i) => (
                                <span key={t} className={i === 1 ? "text-emerald-400 font-semibold" : ""}>{t}</span>
                            ))}
                        </div>
                    </div>
                    <p className="text-base font-semibold text-emerald-400 mt-0.5">
                        +52.7% <span className="text-sm font-normal text-emerald-600">▲ vs last week</span>
                    </p>
                    {/* Fake sparkline */}
                    <svg className="w-full mt-2" height="42" viewBox="0 0 400 56" preserveAspectRatio="none">
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

          
        </div>
    );
}
