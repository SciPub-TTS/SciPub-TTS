type DetailSectionCardProps = {
  children?: any;
  icon?: any;
  title: string;
};

export default function DetailSectionCard(props: DetailSectionCardProps) {
  const { children, icon, title } = props;

  return (
    <article className="rounded-3xl border border-black bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}
