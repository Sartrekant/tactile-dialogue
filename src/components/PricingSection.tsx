import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText, { EASING } from "./RevealText";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  index: number;
}

const PricingCard = ({ title, price, features, index }: PricingCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASING, delay: index * 0.15 }}
      className="flex flex-col p-6 md:p-10"
    >
      <h3 className="font-serif text-xl text-foreground">{title}</h3>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none text-foreground">
          {price}
        </span>
        <span className="font-mono text-[11px] tracking-wide text-foreground/40">
          /md
        </span>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50"
          >
            <span className="text-foreground/25 mr-2">—</span>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="#kontakt"
        className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/30 hover:text-foreground/70 transition-colors duration-700"
      >
        Start en samtale →
      </a>
    </motion.div>
  );
};

const PricingSection = () => {
  const bundleRef = useRef(null);
  const bundleInView = useInView(bundleRef, { once: true, margin: "-100px" });

  const plans = [
    {
      title: "Voice-to-Quote",
      price: "1.500 kr.",
      features: [
        "Ubegrænset antal tilbud",
        "PDF direkte til kunden",
        "Integration med dine materialepriser",
      ],
    },
    {
      title: "Telefonagenten",
      price: "2.500 kr.",
      features: [
        "Alle opkald besvaret på dansk",
        "Automatisk booking i din kalender",
        "Daglig opsummering",
      ],
    },
    {
      title: "Snap-to-Bill",
      price: "1.000 kr.",
      features: [
        "Billeder til faktura",
        "Automatisk tillægsregistrering",
        "Sendt direkte fra pladsen",
      ],
    },
  ];

  return (
    <section id="priser" className="px-4 md:px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealText
          as="h2"
          className="mb-4 font-serif text-3xl md:text-5xl text-foreground"
        >
          Faste priser. Ingen overraskelser.
        </RevealText>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASING, delay: 0.3 }}
          className="mb-10 md:mb-16 max-w-md font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50"
        >
          Alt er fast månedspris. Ingen bindingsperiode. Ingen skjulte gebyrer.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {plans.map((plan, i) => (
            <PricingCard key={plan.title} {...plan} index={i} />
          ))}
        </div>

        {/* Bundle card */}
        <motion.div
          ref={bundleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={bundleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASING, delay: 0.45 }}
          className="mt-8 md:mt-12 border border-border p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h3 className="font-serif text-xl text-foreground">Alt-i-en</h3>
            <p className="mt-3 max-w-sm font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50">
              Alle tre systemer. Én pris. Komplet automatisering af tilbud,
              telefon og faktura.
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none text-foreground">
                  4.000 kr.
                </span>
                <span className="font-mono text-[11px] tracking-wide text-foreground/40">
                  /md
                </span>
              </div>
              <span className="mt-1 font-mono text-[11px] tracking-wide text-foreground/40">
                Spar 1.000 kr./md
              </span>
            </div>

            <a
              href="#kontakt"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground transition-colors duration-700 whitespace-nowrap"
            >
              Start en samtale →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
