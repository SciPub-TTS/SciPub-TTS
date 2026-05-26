import {
  ArrowRight,
  BookOpen,
  LineChart,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import heroImage from "@/assets/images/hero.png";
import logoImage from "@/assets/images/logo.png";
import MainFooter from "@/layout/main/Footer";

const highlights = [
  {
    icon: Search,
    title: "Search academic papers",
    description:
      "Find papers by topic, author, institution, and publication trend.",
  },
  {
    icon: LineChart,
    title: "Track research movement",
    description:
      "Follow emerging fields and compare publication signals over time.",
  },
  {
    icon: BookOpen,
    title: "Save your library",
    description:
      "Keep important papers and reports organized for later review.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Research Trend"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-base font-semibold">Owlreka</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link to={ROUTES.SEARCH} className="hover:text-emerald-700">
              Search
            </Link>
            <Link to={ROUTES.DASHBOARD} className="hover:text-emerald-700">
              Dashboard
            </Link>
            <Link to={ROUTES.GUIDE} className="hover:text-emerald-700">
              Guide
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Publication trend intelligence
              </div>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
                Discover, track, and organize scientific publication trends.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Research Trend helps students, lecturers, and researchers
                explore academic papers, monitor topic momentum, and keep useful
                work in one focused workspace.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={ROUTES.SEARCH}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Start searching
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  View dashboard
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-emerald-100" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <img
                  src={heroImage}
                  alt="Scientific research workspace"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
