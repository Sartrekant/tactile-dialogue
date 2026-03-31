import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText, { EASING } from "./RevealText";
import type { WorkEntry } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface EntryProps extends WorkEntry {
  index: number;
}

const WorkItem = ({ number, title, description, tag, index }: EntryProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASING, delay: index * 0.1 }}
      className="py-8 md:py-10 border-b border-border last:border-b-0"
    >
      <div className="flex items-start gap-4 md:gap-8">
        <span className="font-mono text-[11px] text-foreground/20 tracking-wider pt-1 min-w-[28px]">
          {number}
        </span>

        <div className="flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30 mb-3 block">
            {tag}
          </span>

          <h3 className="font-serif text-xl md:text-2xl text-foreground leading-[1.25]">
            {title}
          </h3>

          <p className="mt-3 max-w-[520px] font-mono text-[12px] leading-[1.8] tracking-wide text-foreground/40">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

interface SelectedWorkSectionProps {
  entries?: WorkEntry[];
}

const SelectedWorkSection = ({ entries = DEFAULTS.work }: SelectedWorkSectionProps) => (
  <section id="vaerker" className="px-4 md:px-6 py-20 md:py-32">
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 md:mb-16">
        <RevealText
          as="div"
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40"
        >
          Udvalgt arbejde
        </RevealText>
        <RevealText
          as="h2"
          delay={0.1}
          className="font-serif text-3xl md:text-5xl text-foreground"
        >
          Hvad jeg bygger
        </RevealText>
      </div>

      <div className="border-t border-border">
        {entries.map((entry, i) => (
          <WorkItem key={entry.number} {...entry} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default SelectedWorkSection;
