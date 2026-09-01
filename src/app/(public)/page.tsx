import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { EfficiencySection } from "@/components/sections/EfficiencySection";
import { AppPreviewSection } from "@/components/sections/AppPreviewSection";
import { ControlSection } from "@/components/sections/ControlSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="flex-1 flex flex-col items-center w-full bg-background overflow-hidden">
        <HeroSection />
        <FeaturesGrid />
        <EfficiencySection />
        <AppPreviewSection />
        <ControlSection />
        <CtaSection />
      </main>
    </SmoothScrollProvider>
  );
}
