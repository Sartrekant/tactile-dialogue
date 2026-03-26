import { motion } from "framer-motion";
import RevealText, { EASING } from "./RevealText";

const HeroSection = () => {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-3xl">
        <RevealText as="h1" className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-foreground">
          Vi bygger systemet.
          <br />
          Så du kan køre hjem kl. 16.
        </RevealText>

        <RevealText as="p" delay={0.2} className="mt-8 max-w-[400px] font-mono text-[13px] leading-relaxed tracking-wide text-foreground/60">
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
            className="group inline-flex items-center border border-foreground px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.08)] rounded-sm"
          >
            Start en samtale
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
