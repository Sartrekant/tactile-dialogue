import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import type { PricingItem } from "@/lib/content-types";

interface PricingSectionProps {
  id: string;
  headline: string;
  tagline: string;
  items: PricingItem[];
}

const PricingSection = ({ id, headline, tagline, items }: PricingSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} className="px-4 md:px-6 py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 md:mb-16">
          <RevealText
            as="h2"
            className="font-serif text-3xl md:text-5xl text-foreground"
          >
            {headline}
          </RevealText>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASING, delay: 0.3 }}
            className="mt-6 max-w-[480px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/70"
          >
            {tagline}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.2 + i * 0.1 }}
              className="border border-border rounded-sm p-6 md:p-8 flex flex-col"
            >
              {item.tag && (
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30 mb-4">
                  {item.tag}
                </span>
              )}

              <h3 className="font-serif text-xl md:text-2xl text-foreground leading-[1.25] mb-4">
                {item.title}
              </h3>

              <p className="max-w-[520px] font-mono text-[12px] leading-[1.8] tracking-wide text-foreground/40 mb-6 flex-1">
                {item.description}
              </p>

              <div className="font-serif text-2xl md:text-3xl text-foreground">
                {item.price}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
