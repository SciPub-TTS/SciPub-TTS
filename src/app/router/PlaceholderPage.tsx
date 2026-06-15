type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage(props: PlaceholderPageProps) {
  const { title } = props;

  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This page is being built.</p>
    </section>
  );
}
