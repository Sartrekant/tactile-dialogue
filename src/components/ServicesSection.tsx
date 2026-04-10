import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import type { ServiceItem } from "@/lib/content-types";

interface ServicesSectionProps {
  id: string;
  headline: string;
  tagline: string;
  services: ServiceItem[];
}

const ServicesSection = ({ id, headline, tagline, services }: ServicesSectionProps) => {
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

        <div className="border-t border-border">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.2 + i * 0.1 }}
              className="py-8 md:py-10 border-b border-border last:border-b-0"
            >
              <div className="flex items-start gap-4 md:gap-8">
                <span className="font-mono text-[11px] text-foreground/20 tracking-wider pt-1 min-w-[28px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30 mb-3 block">
                    {service.tag}
                  </span>

                  <h3 className="font-serif text-xl md:text-2xl text-foreground leading-[1.25]">
                    {service.title}
                  </h3>

                  <p className="mt-3 max-w-[520px] font-mono text-[12px] leading-[1.8] tracking-wide text-foreground/40">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
