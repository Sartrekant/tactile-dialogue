import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import SelectedWorkSection from "@/components/SelectedWorkSection";
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
          <span className="font-mono text-[11px] tracking-[0.15em] text-foreground/30">© 2026</span>
        </div>
      </div>
    </footer>
  );
};

const Projekter = () => {
  const { content } = useContent();
  return (
    <>
      <Navbar nav={content.nav} />
      <main className="pt-[57px]">
        <SelectedWorkSection entries={content.work} />
      </main>
      <AnimatedFooter />
    </>
  );
};

export default Projekter;
