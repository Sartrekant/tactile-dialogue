import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface HaandvaerketSectionProps {
  content?: SiteContent["advisory"];
}

const HaandvaerketSection = ({ content = DEFAULTS.advisory }: HaandvaerketSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="raadgivningen"
      ref={ref}
      className="px-4 md:px-6 py-20 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <RevealText as="h2" className="font-serif text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-foreground">
            {content.headline}
          </RevealText>

          {content.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.4 + i * 0.2 }}
              className={`${i === 0 ? "mt-6 md:mt-8" : "mt-6"} max-w-[420px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/70`}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HaandvaerketSection;
