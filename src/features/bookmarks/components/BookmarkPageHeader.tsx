interface BookmarkPageHeaderProps {
  totalBookmarks: number;
}

export function BookmarkPageHeader({
  totalBookmarks: _totalBookmarks,
}: BookmarkPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="rounded-[1.75rem] border border-black bg-white px-8 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <h1 className="font-title text-[2rem] leading-tight text-black">
          Your <span className="italic text-[#F37021]">bookmark</span>{" "}
          <span className="text-[#00AEEF]">library</span>,
        </h1>
        <h1 className="font-title text-[2rem] leading-tight text-black">
          organized for <span className="text-[#7AC143]">research</span>.
        </h1>
        <p className="font-subtext mt-4 max-w-2xl text-sm leading-6 text-black/65">
          Keep papers, notes, and source trails in one place with a brighter
          visual hierarchy that makes the library feel more alive and easier to
          scan.
        </p>
      </div>
    </div>
  );
}
