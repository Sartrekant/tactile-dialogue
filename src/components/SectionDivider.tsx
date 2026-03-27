import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASING } from "./RevealText";

interface SectionDividerProps {
  variant?: "line" | "ornament" | "none";
}

const SectionDivider = ({ variant = "line" }: SectionDividerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex items-center justify-center py-24">
      {variant === "line" && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EASING }}
          className="h-px w-[120px] bg-border origin-center"
        />
      )}
      {variant === "ornament" && (
        <motion.span
          initial={{ opacity: 0, scaleY: 0 }}
          animate={isInView ? { opacity: 0.3, scaleY: 1 } : {}}
          transition={{ duration: 1, ease: EASING }}
          className="font-serif text-2xl text-foreground/30 select-none"
        >
          ·
        </motion.span>
      )}
    </div>
  );
};

export default SectionDivider;
