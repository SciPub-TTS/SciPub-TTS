export default function RegisterReviewPanel() {
  return (
    <section className="relative flex h-full min-h-[560px] flex-col justify-between overflow-hidden rounded-[2rem] border border-black bg-[linear-gradient(145deg,#fff7ed_0%,#eff6ff_46%,#ecfdf5_100%)] p-6 text-black shadow-[14px_16px_0_rgba(15,23,42,0.08)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <div className="absolute left-[10%] top-[10%] h-20 w-20 rounded-full border border-black/25" />
        <div className="absolute bottom-[12%] left-[16%] h-px w-40 bg-black/20" />
        <div className="absolute right-[8%] top-[14%] h-28 w-28 rounded-full border border-black/18" />
      </div>

      <div className="relative z-10">
        <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.45em] text-[#0f766e]">
          Register now
        </p>
        <div className="mt-6">
          <p className="font-search-title text-[clamp(3rem,6.5vw,6.8rem)] leading-[0.86] text-black/10">
            SIGNAL
          </p>
          <h1 className="mt-[-1.9rem] max-w-xl font-search-title text-[clamp(2.4rem,4.7vw,4.8rem)] leading-[0.88] text-black">
            Build a sharper
            <br />
            <span className="text-[#14532D]">reading system.</span>
          </h1>
        </div>

      </div>

      <div className="relative z-10 ml-auto w-full max-w-[420px]">
        <div className="rounded-[1.8rem] border border-black bg-white/92 p-4 shadow-[10px_12px_0_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-subtext text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500">
                Onboarding reel
              </p>
              <p className="mt-2 font-title text-lg font-semibold text-black">
                What new users will see
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-[#14532D] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 6l10 6-10 6V6z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-black bg-[linear-gradient(135deg,#14532d_0%,#0f172a_45%,#1d4ed8_100%)] p-4 text-white">
            <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/20 bg-white/8 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/78">
                  Weekly trend
                </span>
                <span className="font-subtext text-xs text-white/68">Preview</span>
              </div>

              <div className="space-y-3">
                <div className="h-16 rounded-[1rem] border border-white/15 bg-black/18" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-xl bg-white/18" />
                  <div className="h-10 rounded-xl bg-white/26" />
                  <div className="h-10 rounded-xl bg-white/14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
