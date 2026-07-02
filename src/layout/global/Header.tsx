import BreadcrumbBar from "./BreadcrumbBar";

export default function MainHeader() {
  return (
    <header className="dynamic-divider-bottom sticky top-0 z-40 border-b border-slate-300 bg-white/95 px-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex min-h-[76px] items-center">
        <BreadcrumbBar />
      </div>
    </header>
  );
}
