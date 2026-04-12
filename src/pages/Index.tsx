import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChatDrawer from "@/components/ChatDrawer";
import KasperSection from "@/components/KasperSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import HaandvaerketSection from "@/components/HaandvaerketSection";
import AIContactSection from "@/components/AIContactSection";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { EASING } from "@/components/RevealText";
import { useContent } from "@/hooks/useContent";

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
  const [chatOpen, setChatOpen] = useState(false);
  const { content } = useContent();

  useEffect(() => {
    document.title = content.settings.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", content.settings.seoDescription);
  }, [content.settings.seoTitle, content.settings.seoDescription]);

  return (
    <>
      <Navbar nav={content.nav} />
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <main>
        <HeroSection content={content.overview} onChatOpen={() => setChatOpen(true)} />

        <SectionDivider />

        <ServicesSection
          id="rummet"
          headline={content.space.headline}
          tagline={content.space.tagline}
          services={content.space.services}
        />

        <SectionDivider variant="ornament" />

        <ServicesSection
          id="vaerktoejerne"
          headline={content.tools.headline}
          tagline={content.tools.tagline}
          services={content.tools.services}
        />

        <SectionDivider />

        <HaandvaerketSection content={content.advisory} />

        <SectionDivider variant="ornament" />

        <PricingSection
          id="priser"
          headline={((content as unknown as Record<string, unknown>).pricing as Record<string, unknown>)?.headline as string || "Priser"}
          tagline={((content as unknown as Record<string, unknown>).pricing as Record<string, unknown>)?.tagline as string || ""}
          items={((content as unknown as Record<string, unknown>).pricing as Record<string, unknown>)?.items as Array<{title: string; description: string; price: string; tag?: string}> || []}
        />

        <SectionDivider />

        <ScrollReveal>
          <KasperSection content={content.overview} />
        </ScrollReveal>

        <SectionDivider />

        <ScrollReveal>
          <AIContactSection content={content.conversation} />
        </ScrollReveal>
      </main>
      <AnimatedFooter />
    </>
  );
};

export default Index;
