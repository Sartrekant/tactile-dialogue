import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KasperSection from "@/components/KasperSection";
import WorkshopGrid from "@/components/WorkshopGrid";
import HaandvaerketSection from "@/components/HaandvaerketSection";
import PricingSection from "@/components/PricingSection";
import JournalenSection from "@/components/JournalenSection";
import AIContactSection from "@/components/AIContactSection";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASING } from "@/components/RevealText";

const AnimatedFooter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer className="px-4 md:px-6 pb-8 md:pb-12 pt-20 md:pt-32">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EASING }}
          className="h-px w-full bg-border origin-left mb-12"
        />
        <div className="flex items-center justify-between">
          <span className="font-serif text-sm text-foreground/40">LANDSVIG</span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-foreground/30">
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <SectionDivider />

        <ScrollReveal>
          <KasperSection />
        </ScrollReveal>

        <SectionDivider variant="ornament" />

        <ScrollReveal>
          <WorkshopGrid />
        </ScrollReveal>

        <SectionDivider />

        <HaandvaerketSection />

        <SectionDivider variant="ornament" />

        <ScrollReveal>
          <PricingSection />
        </ScrollReveal>

        <SectionDivider />

        <ScrollReveal>
          <JournalenSection />
        </ScrollReveal>

        <SectionDivider variant="ornament" />

        <ScrollReveal>
          <AIContactSection />
        </ScrollReveal>
      </main>
      <AnimatedFooter />
    </>
  );
};

export default Index;
