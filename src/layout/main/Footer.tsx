import {
  BarChart3,
  CalendarClock,
  Database,
  GraduationCap,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const systemStatusItems = [
  {
    icon: Database,
    label: "Data Source:",
    value: "OpenAlex",
    labelClassName: "text-blue-600",
  },
  {
    icon: RefreshCcw,
    label: "Sync:",
    value: "Admin",
  },
  {
    icon: CalendarClock,
    label: "Update Mode:",
    value: "Weekly",
  },
];

const projectItems = [
  {
    icon: GraduationCap,
    text: "Academic Project",
  },
  {
    icon: ShieldCheck,
    text: "Version 1.0",
  },
  {
    icon: BarChart3,
    text: "Research Trend Analysis",
  },
];

export default function MainFooter() {
  return (
    <footer className="dynamic-divider-top border-t border-slate-200 bg-slate-50 px-6 text-xs text-slate-500 shadow-[0_-10px_30px_rgba(15,23,42,0.04)]">
      <div className="mx-auto grid max-w-7xl gap-10 py-8 md:grid-cols-[1.6fr_1fr_1fr]">
        <section>
          <h2 className="text-sm font-bold text-slate-900">
            Scientific Journal Publication Trend Tracking System
          </h2>
          <p className="mt-3 max-w-md leading-5 text-slate-600">
            A publication trend intelligence platform for researchers, lecturers,
            and students. Built in Vietnam, FPT University
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Status
          </h3>
          <div className="space-y-3">
            {systemStatusItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span
                    className={`font-semibold ${
                      item.labelClassName ?? "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Project
          </h3>
          <div className="space-y-3">
            {projectItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="dynamic-divider-top border-t border-slate-200 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-slate-500">
            &copy; 2026 SJPTTS &mdash; For academic review and demonstration
            purposes.
          </p>
          <div className="flex items-center gap-2 font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
