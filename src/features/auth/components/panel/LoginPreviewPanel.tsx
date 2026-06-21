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
          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-black bg-white shadow-[10px_12px_0_rgba(15,23,42,0.06)]">
            <img
              src="/trending.png"
              alt="Trending preview"
              className="h-[320px] w-full object-cover object-center"
            />
          </div>
        </div>
    </section>
  );
}
