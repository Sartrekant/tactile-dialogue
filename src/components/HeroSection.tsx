import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";

import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface HeroSectionProps {
  onChatOpen?: () => void;
  content?: SiteContent["overview"];
}

const HeroSection = ({ onChatOpen, content = DEFAULTS.overview }: HeroSectionProps) => {
  const [imageReady, setImageReady] = useState(false);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Blur-up placeholder */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          opacity: imageReady ? 0 : 1,
          transition: "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 1,
        }}
      />

      {/* Scroll-scale container with image */}
      <motion.div
        className="absolute inset-0"
        style={{ scale, willChange: "transform" }}
      >
        <picture>
          <source
            srcSet="/assets/hero-image-1280.webp 1280w, /assets/hero-image-1920.webp 1920w"
            type="image/webp"
          />
          <img
            src="/assets/hero-image-1280.jpg"
            alt=""
            onLoad={() => setImageReady(true)}
            className="h-full w-full object-cover"
            style={{ display: "block" }}
            decoding="async"
          />
        </picture>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-xl">
          <RevealText as="h1" className="font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] text-foreground">
            {content.headline.split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </RevealText>

          <RevealText as="p" delay={0.2} className="mt-6 md:mt-8 max-w-[400px] font-mono text-[12px] md:text-[13px] leading-relaxed tracking-wide text-foreground/70">
            {content.tagline}
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
            className="mt-8 md:mt-12"
          >
            <button
              onClick={onChatOpen}
              className="group inline-flex items-center border border-foreground bg-foreground px-6 py-3.5 md:px-8 md:py-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(44,46,48,0.15)] rounded-sm"
            >
              Start en samtale
            </button>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
