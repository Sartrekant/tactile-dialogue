import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText, { EASING } from "./RevealText";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    console.log({ name, contact });
  };

  return (
    <section id="kontakt" className="px-6 py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* Left column */}
          <div className="md:col-span-5">
            <RevealText as="h2" className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-tight text-foreground">
              Lad os se på tegningerne.
            </RevealText>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, ease: EASING, delay: 0.4 }}
              className="mt-8 max-w-[380px] font-mono text-[13px] leading-[1.8] tracking-wide text-foreground/70"
            >
              Lad os tage en uforpligtende snak om dit fundament. Ingen lange formularer. Skriv dit nummer, så ringer vi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, ease: EASING, delay: 0.6 }}
              className="mt-10"
            >
              <a
                href="mailto:kasper@landsvig.com"
                className="group inline-flex items-center font-mono text-[13px] tracking-wide text-foreground/50 transition-colors duration-700 hover:text-foreground"
              >
                <span className="relative">
                  kasper@landsvig.com
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-700 group-hover:w-full" />
                </span>
              </a>
            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASING, delay: 0.5 }}
            className="md:col-span-6 md:col-start-7"
          >
            <form onSubmit={handleSubmit} className="space-y-12">
              <div>
                <label className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                  Dit navn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-border bg-transparent pb-3 font-mono text-[15px] text-foreground outline-none transition-colors duration-700 placeholder:text-foreground/20 focus:border-foreground"
                  placeholder="Fulde navn"
                />
              </div>

              <div>
                <label className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                  Telefon eller email
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border-b border-border bg-transparent pb-3 font-mono text-[15px] text-foreground outline-none transition-colors duration-700 placeholder:text-foreground/20 focus:border-foreground"
                  placeholder="Hvordan fanger vi dig?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.15)] rounded-sm"
              >
                Ring mig op
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
