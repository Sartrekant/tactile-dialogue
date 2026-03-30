import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText, { EASING } from "./RevealText";

interface EntryProps {
  number: string;
  title: string;
  excerpt: string;
  tag: string;
  index: number;
}

const JournalEntry = ({ number, title, excerpt, tag, index }: EntryProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASING, delay: index * 0.12 }}
      className="group cursor-pointer py-8 md:py-10 border-b border-border last:border-b-0 transition-colors duration-700"
    >
      <div className="flex items-start gap-4 md:gap-8">
        {/* Entry number */}
        <span className="font-mono text-[11px] text-foreground/20 tracking-wider pt-1 min-w-[28px]">
          {number}
        </span>

        <div className="flex-1">
          {/* Tag */}
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30 mb-3 block">
            {tag}
          </span>

          {/* Title */}
          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-[1.25] transition-colors duration-700 group-hover:text-foreground/70">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="mt-3 max-w-[520px] font-mono text-[12px] leading-[1.8] tracking-wide text-foreground/40 transition-colors duration-700 group-hover:text-foreground/55">
            {excerpt}
          </p>
        </div>

        {/* Arrow */}
        <motion.span
          className="font-mono text-[13px] text-foreground/15 pt-1 transition-all duration-700 group-hover:text-foreground/40 group-hover:translate-x-1"
        >
          →
        </motion.span>
      </div>
    </motion.article>
  );
};

const JournalenSection = () => {
  const ref = useRef(null);

  const entries = [
    {
      number: "01",
      tag: "Slow Tech",
      title: "Hvorfor vi ikke kalder det AI",
      excerpt:
        "Ordene vi bruger former den virkelighed, vi bygger i. Når vi dropper buzzwords, begynder det rigtige arbejde.",
    },
    {
      number: "02",
      tag: "Værktøj",
      title: "En dagseddel, der skriver sig selv",
      excerpt:
        "Fra rå tidsregistreringer til et klart overblik — uden at nogen rører et tastatur.",
    },
    {
      number: "03",
      tag: "Håndværk",
      title: "Prompt engineering som snedkerarbejde",
      excerpt:
        "Det handler ikke om at skrive den perfekte sætning. Det handler om at forstå materialet.",
    },
  ];

  return (
    <section id="journalen" className="px-4 md:px-6 py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <RevealText
              as="div"
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40"
            >
              Journalen
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="font-serif text-3xl md:text-5xl text-foreground"
            >
              Tanker om håndværket
            </RevealText>
          </div>
        </div>

        {/* Newspaper-style entry list */}
        <div className="border-t border-border">
          {entries.map((entry, i) => (
            <JournalEntry key={entry.number} {...entry} index={i} />
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASING, delay: 0.4 }}
          className="mt-10 md:mt-14"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40 transition-colors duration-700 hover:text-foreground"
          >
            <span>Alle indlæg</span>
            <span className="transition-transform duration-700 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default JournalenSection;
