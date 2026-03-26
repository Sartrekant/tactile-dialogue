import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASING } from "./RevealText";
import RevealText from "./RevealText";

const companyTypes = ["VVS-virksomhed", "Tømrervirksomhed", "Klinik", "Andet"];
const painPoints = ["tilbudsgivning", "administration", "kundehåndtering"];

const Dropdown = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="border-b-2 border-foreground/30 pb-1 font-serif italic text-foreground transition-colors duration-700 focus:border-foreground focus:outline-none hover:border-foreground"
      >
        {value}
        <span className="ml-1 text-foreground/30">▾</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASING }}
          className="absolute left-0 top-full z-10 mt-2 min-w-[200px] border border-border bg-background p-2 rounded-sm"
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left font-mono text-[12px] tracking-wide text-foreground/70 transition-colors duration-300 hover:text-foreground hover:bg-accent rounded-sm"
            >
              {opt}
            </button>
          ))}
        </motion.div>
      )}
    </span>
  );
};

const ConversationalForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [companyType, setCompanyType] = useState(companyTypes[0]);
  const [painPoint, setPainPoint] = useState(painPoints[0]);
  const [contact, setContact] = useState("");

  const handleSubmit = () => {
    if (!contact) return;
    console.log({ companyType, painPoint, contact });
    // TODO: wire up actual submission
  };

  return (
    <section id="kontakt" className="px-6 py-32" ref={ref}>
      <div className="mx-auto max-w-4xl">
        <RevealText as="div" className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
          Håndtrykket
        </RevealText>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: EASING, delay: 0.3 }}
          className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.5] text-foreground"
        >
          <p>
            Hej Kasper. Jeg driver en{" "}
            <Dropdown options={companyTypes} value={companyType} onChange={setCompanyType} />
            , og vi bruger alt for meget tid på{" "}
            <Dropdown options={painPoints} value={painPoint} onChange={setPainPoint} />
            . Jeg vil gerne høre, hvordan I kan skabe ro.
          </p>
          <p className="mt-6">
            Du kan fange mig på{" "}
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="email eller telefon"
              className="inline-block w-[280px] border-b-2 border-foreground/30 bg-transparent pb-1 font-serif italic text-foreground placeholder:text-foreground/25 transition-colors duration-700 focus:border-foreground focus:outline-none"
            />
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={handleSubmit}
            className="border border-foreground px-8 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.08)] rounded-sm"
          >
            Send beskeden
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversationalForm;
