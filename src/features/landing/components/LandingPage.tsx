import { Header } from "./Header";
import { LandingFooter, LandingMainSections } from "./LandingSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E1EFE6] text-[#0F172A]">
      <Header />
      <main>
        <LandingMainSections />
      </main>
      <LandingFooter />
    </div>
  );
}
