import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASING = [0.22, 1, 0.36, 1] as const;

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

const RevealText = ({ children, delay = 0, className = "", as = "div" }: RevealTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Tag = as;

  // Use <motion.span> with display:block to avoid invalid DOM nesting
  // when Tag is <p> (div cannot be a child of p)
  return (
    <Tag className={`overflow-hidden ${className}`} ref={ref}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : { y: "100%" }}
        transition={{ duration: 1, ease: EASING, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  );
};

export default RevealText;
export { EASING };
