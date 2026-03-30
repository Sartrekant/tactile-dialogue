import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText, { EASING } from "./RevealText";

const KasperSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="kasper" className="px-4 md:px-6 py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:gap-20 md:grid-cols-12">
          {/* Portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: EASING }}
            className="md:col-span-5"
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm">
              <div className="h-full w-full bg-foreground/[0.06] flex items-end justify-center">
                {/* Placeholder — replace with portrait photo */}
                <div className="w-full h-full bg-gradient-to-b from-foreground/[0.03] to-foreground/[0.08] flex items-center justify-center">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-foreground/20 uppercase">
                    Portræt
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <RevealText
              as="div"
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40"
            >
              Håndværkeren
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
              <p className="max-w-[440px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/60">
                Jeg bygger skræddersyede AI-værktøjer til virksomheder, der lever af fysisk arbejde. Hvert system designes med præcision og tålmodighed — som fint snedkerhåndværk.
              </p>
              <p className="max-w-[440px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/60">
                Ingen skabeloner. Ingen buzzwords. Kun solide løsninger, der giver dig din eftermiddag tilbage.
              </p>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
              className="mt-10 md:mt-14 space-y-4"
            >
              {[
                { label: "Tilgang", value: "Struktur, tid og ro" },
                { label: "Værktøj", value: "Prompt engineering & automatisering" },
                { label: "Sted", value: "Danmark" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30 min-w-[80px]">
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
