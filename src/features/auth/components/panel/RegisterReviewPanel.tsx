export default function RegisterPreviewPanel() {
    return (
        <section className="hidden min-h-full items-center justify-center bg-white px-8 py-10 lg:flex">
            <div className="w-full max-w-[560px]">
                <div className="overflow-hidden rounded-2xl border border-[#E4F2E9] bg-white shadow-[0_24px_70px_rgba(228,242,233,0.95)]">
                <div className="flex items-center justify-between bg-emerald-900 px-5 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-700">
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                                <path
                                    d="M2 10 Q7 2 12 10"
                                    stroke="#fff"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-white">
              Your feed · live preview
            </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        PERSONALIZING
                    </div>
                </div>

                <div className="p-5">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">
                        <span className="mb-0.5 mr-1 inline-block h-1 w-1 rounded-full bg-emerald-500" />
                        Welcome, Researcher
                    </p>

                    <h3 className="mb-1 font-serif text-xl leading-snug text-slate-900">
                        Build your personalized
                        <br />
                        research trend feed.
                    </h3>

                    <p className="mb-4 text-xs text-slate-500">
                        No empty dashboard. We seed your feed from your field and keywords
                        the moment you sign up.
                    </p>

                    <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-400">
                        Tracking signals
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {[
                            "Computer Science",
                            "Mechanistic Interpretability",
                            "Diffusion Models",
                        ].map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-emerald-900 px-2.5 py-1 text-xs font-medium text-emerald-300"
                            >
                {tag}
              </span>
                        ))}
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        {[
                            { label: "MECH. INTERPRETABIL", pct: "+247%" },
                            { label: "DIFFUSION MODELS", pct: "+132%" },
                        ].map((chart) => (
                            <div key={chart.label} className="rounded-lg border border-slate-100 p-3">
                                <div className="mb-2 flex items-center justify-between">
                  <span className="truncate text-[9px] uppercase text-slate-400">
                    {chart.label}
                  </span>
                                    <span className="text-[10px] font-semibold text-emerald-600">
                    {chart.pct}
                  </span>
                                </div>

                                <svg width="100%" height="28" viewBox="0 0 100 28" preserveAspectRatio="none">
                                    <path
                                        d="M0 24 Q25 20 50 14 Q75 8 100 4"
                                        stroke="#059669"
                                        strokeWidth="1.5"
                                        fill="none"
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 rounded-lg border border-slate-100 p-3">
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                    Field Activity · Last 10 weeks
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    Computer Science
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600">
                ↗ +38.4%
              </span>
                        </div>

                        <div className="flex h-10 items-end gap-1">
                            {[40, 48, 55, 52, 62, 70, 68, 78, 85, 95].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 rounded-sm bg-blue-500"
                                    style={{ height: `${height}%`, opacity: 0.7 + index * 0.03 }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2.5 rounded-lg bg-emerald-950 p-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <div>
                            <div className="mb-0.5 flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wide text-slate-500">
                  Sample alert · Tue 09:14
                </span>
                                <span className="ml-auto text-[9px] text-slate-600">AUTO</span>
                            </div>

                            <p className="text-xs text-slate-300">
                                3 new papers on Mechanistic Interpretability posted to arXiv
                                overnight — one already trending.
                            </p>

                            <div className="mt-2 flex gap-2">
                                <button className="rounded bg-emerald-800 px-2.5 py-1 text-[10px] font-medium text-white">
                                    Open feed
                                </button>
                                <button className="rounded bg-white/10 px-2.5 py-1 text-[10px] text-slate-400">
                                    Snooze 1 day
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 px-5 py-3">
                    {[
                        "Personalized feed seeded from your first keyword",
                        "Weekly digest, snoozable per topic",
                        "Export any insight to BibTeX / Zotero",
                    ].map((item) => (
                        <p key={item} className="flex items-center gap-2 text-xs text-slate-500">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="6" cy="6" r="5.5" stroke="#059669" strokeWidth="1" />
                                <path
                                    d="M3.5 6l2 2 3-3"
                                    stroke="#059669"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {item}
                        </p>
                    ))}
                </div>
            </div>

                <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-slate-400">
                    <span className="mb-0.5 mr-1.5 inline-block h-1 w-1 rounded-full bg-slate-300" />
                    Different from a search engine — trends, not paper lists.
                </p>
            </div>
        </section>
    );
}