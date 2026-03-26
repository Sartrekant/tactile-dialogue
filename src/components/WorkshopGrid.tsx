import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, FileText, Calculator } from "lucide-react";
import RevealText, { EASING } from "./RevealText";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const ToolCard = ({ title, description, icon, index }: ToolCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASING, delay: index * 0.15 }}
      className="group flex flex-col p-8 md:p-10 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.08)]"
    >
      {/* Dark placeholder image */}
      <div className="mb-8 aspect-[4/3] w-full rounded-sm bg-foreground flex items-center justify-center border border-foreground/80">
        <div className="text-primary-foreground/30">
          {icon}
        </div>
      </div>

      <h3 className="font-serif text-xl text-foreground">{title}</h3>
      <p className="mt-3 font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50">
        {description}
      </p>
    </motion.div>
  );
};

const WorkshopGrid = () => {
  const tools = [
    {
      title: "Timer & Materialer",
      description: "Automatiseret registrering, der eliminerer tastefejl og sparer timer hver uge.",
      icon: <Clock size={32} strokeWidth={1} />,
    },
    {
      title: "Den Automatiske Dagseddel",
      description: "Dagens overblik genereret fra rå data. Klart, præcist, uden manuelt arbejde.",
      icon: <FileText size={32} strokeWidth={1} />,
    },
    {
      title: "Tilbudsmotoren",
      description: "Præcise, kalkulerede tilbud på sekunder, ikke timer. Færre fejl, flere opgaver.",
      icon: <Calculator size={32} strokeWidth={1} />,
    },
  ];

  return (
    <section id="vaerkstedet" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <RevealText as="h2" className="mb-16 font-serif text-4xl md:text-5xl text-foreground">
          Digitale Redskaber
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {tools.map((tool, i) => (
            <ToolCard key={tool.title} {...tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopGrid;
