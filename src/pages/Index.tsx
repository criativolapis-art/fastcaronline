import { HeroSection } from "@/components/HeroSection";
import { SpecsSection } from "@/components/SpecsSection";
import { GallerySection } from "@/components/GallerySection";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SpecsSection />
      <GallerySection />
      <CTASection />
    </main>
  );
};

export default Index;
