import { motion } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import heroImage from "@/assets/hero.png";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <motion.img
        src={heroImage}
        alt="LANDSVIG — Struktur. Tid. Ro."
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASING }}
        className="absolute inset-0 h-full w-full object-cover object-right-bottom"
      />

      {/* Subtle overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="max-w-xl">
          <RevealText as="h1" className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-foreground">
            Vi bygger systemet.
            <br />
            Så du kan køre hjem kl. 16.
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
