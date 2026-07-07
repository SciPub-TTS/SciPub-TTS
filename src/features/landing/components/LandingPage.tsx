import { DashboardPreview } from "./DashboardPreview";
import { Features } from "./Features";
import { FinalCTA, Footer } from "./FinalCTA";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Metrics } from "./Metrics";
import { Scope } from "./Scope";
import { Workflow } from "./Workflow";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E1EFE6] text-[#0F172A]">
      <Header />
      <main>
        <Hero />
        <Metrics />
        <Scope />
        <Features />
        <Workflow />
        <DashboardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
