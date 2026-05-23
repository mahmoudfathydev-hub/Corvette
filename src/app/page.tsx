import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ImageSequence from "@/components/ImageSequence";
import {
  HeroSection,
  PerformanceSection,
  InteriorSection,
  TechnologySection,
  FinalCTASection,
} from "@/components/Sections";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="relative z-0">
        <ImageSequence />
        
        <div className="relative z-10 -mt-[700vh]">
          <HeroSection />
          <div className="h-[50vh]" />
          <PerformanceSection />
          <div className="h-[50vh]" />
          <InteriorSection />
          <div className="h-[50vh]" />
          <TechnologySection />
          <div className="h-[50vh]" />
          <FinalCTASection />
        </div>

      </main>
    </SmoothScroll>
  );
}

