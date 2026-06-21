export default function LoginPreviewPanel() {
  return (
    <section className="relative flex h-full min-h-[560px] flex-col justify-between overflow-hidden rounded-[2rem] border border-black bg-[linear-gradient(145deg,#ecfdf5_0%,#eff6ff_48%,#fff7ed_100%)] p-6 text-black shadow-[14px_16px_0_rgba(15,23,42,0.08)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <div className="absolute left-[8%] top-[8%] h-24 w-24 rounded-full border border-black/30" />
        <div className="absolute bottom-[10%] right-[8%] h-28 w-28 rounded-full border border-black/20" />
        <div className="absolute inset-x-[12%] top-[16%] h-px bg-black/20" />
      </div>

      <div className="relative z-10">
        <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.45em] text-[#8B5E34]">
          Login portal
        </p>
        <div className="mt-6">
          <p className="font-search-title text-[clamp(3.3rem,7vw,7.2rem)] leading-[0.86] text-black/10">
            LOGIN
          </p>
          <h1 className="mt-[-1.9rem] max-w-xl font-search-title text-[clamp(2.5rem,4.8vw,4.9rem)] leading-[0.88] text-black">
            Return to your
            <br />
            <span className="text-[#059669]">research orbit.</span>
          </h1>
        </div>

      </div>

      <div className="relative z-10 ml-auto w-full max-w-[420px]">
        <div className="rounded-[1.8rem] border border-black bg-white/92 p-4 shadow-[10px_12px_0_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-subtext text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500">
                Video frame
              </p>
              <p className="mt-2 font-title text-lg font-semibold text-black">
                Research reel placeholder
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-[#10b981] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 6l10 6-10 6V6z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-black bg-[linear-gradient(135deg,#0f172a_0%,#14532d_48%,#0f766e_100%)] p-4 text-white">
            <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/20 bg-white/8 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/78">
                  Discover feed
                </span>
                <span className="font-subtext text-xs text-white/68">00:24</span>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-4/5 rounded-full bg-white/70" />
                <div className="h-3 w-2/3 rounded-full bg-white/45" />
                <div className="h-20 rounded-[1rem] border border-white/15 bg-black/18" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
