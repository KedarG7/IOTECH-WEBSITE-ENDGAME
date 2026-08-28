import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedEventSection from "@/components/sections/FeaturedEventSection";
import DomainsSection from "@/components/sections/DomainsSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturedEventSection />
      <DomainsSection />
      <CTASection />
    </main>
  );
}
