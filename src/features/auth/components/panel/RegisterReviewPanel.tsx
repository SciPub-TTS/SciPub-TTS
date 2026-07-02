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
          <p className="font-title-page text-[clamp(3rem,6.5vw,6.8rem)] leading-[0.86] text-black/10">
            REGISTER
          </p>
          <h1 className="mt-[-1.9rem] max-w-xl font-title-page text-[clamp(2.4rem,4.7vw,4.8rem)] leading-[0.88] text-black">
            Build a sharper
            <br />
            <span className="text-[#14532D]">reading system.</span>
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
