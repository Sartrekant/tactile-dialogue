import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { EASING } from "./RevealText";

const ScrollReveal = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: EASING }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
