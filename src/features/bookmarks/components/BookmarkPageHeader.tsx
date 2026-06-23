export function BookmarkPageHeader() {
  return (
    <div className="mb-6">
      <div className="rounded-[1.9rem] border border-black bg-[radial-gradient(circle_at_top_left,_rgba(243,112,33,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(0,174,239,0.16),_transparent_40%),white] px-8 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <h1 className="font-title text-[2rem] leading-tight text-black sm:text-[2.2rem]">
              Your <span className="italic text-[#F37021]">bookmark</span>{" "}
              <span className="text-[#00AEEF]">library</span>,
            </h1>
            <h1 className="font-title text-[2rem] leading-tight text-black sm:text-[2.2rem]">
              organized into <span className="text-[#7AC143]">collections</span>.
            </h1>
          </div>
        </div>

        <p className="font-subtext mt-4 max-w-2xl text-[15px] leading-7 text-black/70">
          Search faster, group papers into named collections, and scan work
          metadata with a roomier reading rhythm.
        </p>
      </div>
    </div>
  );
}
