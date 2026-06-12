import {
  Bell,
  Bookmark,
  BookOpen,
  Download,
  Eye,
  FileText,
  LifeBuoy,
  Rss,
  Search,
  Send,
  Settings,
  Sparkles,
  Tags,
  TrendingUp,
  UserPlus,
} from "lucide-react";

const guideSteps = [
  {
    title: "Register or Log In",
    description:
      "Create an account or sign in to access personalized research trend features. A verified academic email unlocks institutional access where available.",
    icon: UserPlus,
  },
  {
    title: "Choose Research Interests",
    description:
      "Select the academic fields, topics, authors, or journals you want to follow. Your interests shape every recommendation across the platform.",
    icon: Tags,
  },
  {
    title: "Explore Research Papers",
    description:
      "Search papers by keyword, author, journal, topic, year, or citation count. Use filters to narrow results to exactly what you need.",
    icon: Search,
  },
  {
    title: "View Paper Details",
    description:
      "Open any paper to see the title, authors, journal, publication year, abstract, keywords, DOI, and citation information in one place.",
    icon: Eye,
  },
  {
    title: "Track Research Trends",
    description:
      "Review publication growth over time, the trend score, topic status, and related keywords to understand how a research area is evolving.",
    icon: TrendingUp,
  },
  {
    title: "Follow Topics, Authors, or Journals",
    description:
      "Follow any topic, author, or journal to be notified when new related papers are published. Manage what you follow at any time.",
    icon: Sparkles,
  },
  {
    title: "Save Bookmarks",
    description:
      "Save papers, keywords, topics, journals, or authors for later use. Bookmarks are organized in your personal library for quick access.",
    icon: Bookmark,
  },
  {
    title: "View Research Feed",
    description:
      "The Research Feed shows newly published papers related to your followed topics, saved keywords, authors, and journals.",
    icon: Rss,
  },
  {
    title: "Generate Reports",
    description:
      "Create a simple analytical report by choosing a topic, keyword, academic field, and time range. The system assembles the report in seconds.",
    icon: FileText,
  },
  {
    title: "Export Data",
    description:
      "Export reports or search results as PDF, CSV, or Excel so you can share findings with colleagues or include them in your own work.",
    icon: Download,
  },
  {
    title: "Manage Notifications",
    description:
      "Receive alerts for new papers, topic growth, journal updates, and report results. Choose email, in-app, or both for each alert type.",
    icon: Bell,
  },
  {
    title: "Update Profile and Settings",
    description:
      "Keep your personal information, research interests, password, and notification preferences up to date from the Settings page.",
    icon: Settings,
  },
];

export default function GuideHelpPage() {
  return (
    <section className="min-h-[calc(100vh-124px)] bg-[#f4f7f5] px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 px-7 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600">
            Getting Started - 12 Steps
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            How to Use the System
          </h1>
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-slate-500">
            Follow these steps in order to get the most out of the platform,
            from creating your account to receiving personalized research
            updates.
          </p>
        </div>

        <div className="px-7 py-5">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[21px] top-5 h-[calc(100%-40px)] w-px bg-emerald-100"
            />

            <ol className="space-y-5">
              {guideSteps.map((step, index) => {
                const Icon = step.icon;
                const stepNumber = String(index + 1).padStart(2, "0");

                return (
                  <li key={step.title} className="relative flex gap-5">
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[12px] font-bold text-white shadow-[0_0_0_5px_rgba(16,185,129,0.12)]">
                      {stepNumber}
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
                        <h2 className="text-sm font-semibold text-slate-950">
                          {step.title}
                        </h2>
                      </div>
                      <p className="mt-1 text-[13px] leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-7 py-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            Last updated - May 21, 2026
          </span>

          <div className="flex items-center gap-4">
            <a
              href="mailto:support@owlreka.local"
              className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Contact support
            </a>
            <a
              href="mailto:feedback@owlreka.local"
              className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
            >
              <Send className="h-3.5 w-3.5" />
              Send feedback
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
