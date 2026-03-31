import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText, { EASING } from "./RevealText";
import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface KasperSectionProps {
  content?: SiteContent["kasper"];
}

const KasperSection = ({ content = DEFAULTS.kasper }: KasperSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="kasper" className="px-4 md:px-6 py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:gap-20 md:grid-cols-12">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: EASING }}
            className="md:col-span-5"
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-foreground/[0.06]">
              {content.portraitUrl ? (
                <img
                  src={content.portraitUrl}
                  alt="Kasper Landsvig"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-foreground/[0.03] to-foreground/[0.08] flex items-center justify-center">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-foreground/20 uppercase">
                    Portræt
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Text content */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <RevealText
              as="div"
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40"
            >
              Om mig
            </RevealText>

            <RevealText
              as="h2"
              delay={0.1}
              className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] text-foreground"
            >
              Kasper Landsvig
            </RevealText>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, ease: EASING, delay: 0.4 }}
              className="mt-6 md:mt-8 space-y-5"
            >
              {content.bio.map((paragraph, i) => (
                <p key={i} className="max-w-[440px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/60">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
              className="mt-10 md:mt-14 space-y-4"
            >
              {content.details.map((item) => (
                <div key={item.label} className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30 min-w-[100px]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[12px] tracking-wide text-foreground/60">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KasperSection;
