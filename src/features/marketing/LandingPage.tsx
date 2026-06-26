import { SiteFooter, SiteHeader } from "@/global/components/shared";

import { CtaSection } from "./components/CtaSection";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { StatsRow } from "./components/StatsRow";
import { TemplateShowcase } from "./components/TemplateShowcase";

/**
 * Marketing landing page for resumeforge. Composed of static, mostly-server
 * sections wrapped in the shared site chrome.
 */
export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        {/* StatsRow lifts up slightly to overlap the hero's lower edge. */}
        <div className="-mt-8 sm:-mt-10">
          <StatsRow />
        </div>

        <div className="py-16 sm:py-24">
          <Features />
        </div>

        <div className="pb-16 sm:pb-24">
          <TemplateShowcase />
        </div>

        <div className="pb-16 sm:pb-24">
          <CtaSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
