import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import heroImage from "@/assets/hero.jpg";

const HeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  // Subtle scroll-driven scale: 1.0 → 1.05 over entire viewport
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Blur-up placeholder — benhvid base that dissolves */}
      <div
        className="absolute inset-0 bg-background transition-opacity"
        style={{
          transitionDuration: "1.5s",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: imageLoaded ? 0 : 1,
        }}
      />

      {/* Hero background image with scroll-scale and blur-up reveal */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <motion.img
          src={heroImage}
          alt="LANDSVIG — Struktur. Tid. Ro."
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.04 }}
          animate={imageLoaded ? { scale: 1 } : {}}
          transition={{ duration: 1.8, ease: EASING }}
          className="h-full w-full object-cover"
          style={{
            filter: imageLoaded ? "blur(0px)" : "blur(20px)",
            transition: "filter 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </motion.div>

      {/* Gradient overlays for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="max-w-xl">
          <RevealText as="h1" className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-foreground">
            Vi bygger systemet.
            <br />
            Så du kan køre hjem.
          </RevealText>

          <RevealText as="p" delay={0.2} className="mt-8 max-w-[400px] font-mono text-[13px] leading-relaxed tracking-wide text-foreground/70">
            Skræddersyede AI-værktøjer til virksomheder, der lever af fysisk arbejde. Vi behandler prompt engineering som fint dansk snedkerhåndværk.
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASING, delay: 0.6 }}
            className="mt-12"
          >
            <a
              href="#kontakt"
              className="group inline-flex items-center border border-foreground bg-foreground px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.15)] rounded-sm"
            >
              Start en samtale
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
