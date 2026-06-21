import type { ReactNode } from "react";

type AuthSplitStageProps = {
  panel: ReactNode;
  showcase: ReactNode;
};

export default function AuthSplitStage({
  panel,
  showcase,
}: AuthSplitStageProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-black bg-[#fffdf8]/92 shadow-[16px_18px_0_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div
        className="absolute inset-0 opacity-95"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(34,197,94,0.16), transparent 20%), radial-gradient(circle at 82% 18%, rgba(14,165,233,0.2), transparent 22%), radial-gradient(circle at 74% 76%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 12% 86%, rgba(22,163,74,0.14), transparent 18%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute left-0 right-0 top-0 h-[46%] bg-white/72 lg:hidden" />

      <div className="absolute bottom-0 left-0 right-0 h-[54%] bg-[#f4fbf7]/86 lg:hidden" />

      <div className="absolute bottom-0 left-0 right-0 hidden h-1/2 bg-white/88 lg:block" />
      <div className="absolute left-1/2 top-0 hidden h-full w-[220px] -translate-x-1/2 -skew-x-[-24deg] border-x border-black/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(240,249,255,0.9)_45%,rgba(255,255,255,0.82))] shadow-[0_0_50px_rgba(15,23,42,0.08)] lg:block" />
      <div className="absolute left-[calc(50%-24px)] top-[8%] hidden h-[84%] w-px bg-black/18 lg:block" />
      <div className="absolute left-[calc(50%+24px)] top-[8%] hidden h-[84%] w-px bg-black/10 lg:block" />

      <div className="relative z-10 grid min-h-[780px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex items-center justify-center px-5 py-7 sm:px-7 lg:px-10 lg:py-10">
          <div className="w-full max-w-[617px] lg:w-[617px]">{panel}</div>
        </div>

        <div className="relative flex min-h-[360px] items-stretch justify-center px-5 pb-6 pt-2 sm:px-7 lg:px-8 lg:py-8">
          <div className="w-full max-w-[617px] lg:w-[617px]">{showcase}</div>
        </div>
      </div>
    </section>
  );
}
