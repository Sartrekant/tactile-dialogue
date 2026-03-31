import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import heroImage from "@/assets/hero.webp";
import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface HaandvaerketSectionProps {
  content?: SiteContent["metoden"];
}

const HaandvaerketSection = ({ content = DEFAULTS.metoden }: HaandvaerketSectionProps) => {
  const ref = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      id="metoden"
      ref={ref}
      className="relative min-h-screen overflow-hidden flex items-center"
    >
      {/* Blur-up placeholder */}
      <div
        className="absolute inset-0 bg-background transition-opacity"
        style={{
          transitionDuration: "1.5s",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: imageLoaded ? 0 : 1,
        }}
      />

      {/* Background image with scroll-scale and blur-up */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <motion.img
          src={content.backgroundUrl || heroImage}
          alt=""
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.04 }}
          animate={imageLoaded ? { scale: 1 } : {}}
          transition={{ duration: 1.8, ease: EASING }}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-background/20" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <RevealText as="h2" className="font-serif text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-foreground">
              {content.headline}
            </RevealText>

            {content.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: EASING, delay: 0.4 + i * 0.2 }}
                className={`${i === 0 ? "mt-6 md:mt-8" : "mt-6"} max-w-[420px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/70`}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HaandvaerketSection;
