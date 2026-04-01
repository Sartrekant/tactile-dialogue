import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { EASING } from "@/components/RevealText";
import { useContent } from "@/hooks/useContent";

interface PlaceholderProps {
  title: string;
}

const Placeholder = ({ title }: PlaceholderProps) => {
  const { content } = useContent();
  return (
    <>
      <Navbar nav={content.nav} />
      <main className="pt-[57px] min-h-screen flex items-center">
        <div className="px-4 md:px-6 mx-auto max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASING }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/30 mb-4">
              Under opbygning
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.1]">
              {title}
            </h1>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Placeholder;
