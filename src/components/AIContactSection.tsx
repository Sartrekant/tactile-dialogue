import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface AIContactSectionProps {
  content?: SiteContent["conversation"];
}

const AIContactSection = ({ content = DEFAULTS.conversation }: AIContactSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || submitting) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });

      if (!res.ok) throw new Error("Submit error");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="px-4 md:px-6 py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-12">
          {/* Left column */}
          <div className="md:col-span-5">
            <RevealText as="h2" className="font-serif text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-foreground">
              {content.headline}
            </RevealText>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.4 }}
              className="mt-6 md:mt-8 max-w-[380px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/70"
            >
              {content.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
              className="mt-10 space-y-3"
            >
              <a
                href={`mailto:${content.email}`}
                className="group flex items-center font-mono text-[13px] tracking-wide text-foreground/50 transition-colors duration-700 hover:text-foreground"
              >
                <span className="relative">
                  {content.email}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-700 group-hover:w-full" />
                </span>
              </a>
            </motion.div>
          </div>

          {/* Right column — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASING, delay: 0.5 }}
            className="md:col-span-6 md:col-start-7"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <label className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                    Dit navn
                  </label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-border bg-transparent pb-3 font-mono text-foreground outline-none transition-all duration-500 placeholder:text-foreground/20 focus:border-b-2 focus:border-foreground"
                    placeholder="Fulde navn"
                    required
                  />
                </div>

                <div>
                  <label className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                    Email eller telefon
                  </label>
                  <input
                    type="text"
                    name="contact"
                    autoComplete="tel email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full border-b border-border bg-transparent pb-3 font-mono text-foreground outline-none transition-all duration-500 placeholder:text-foreground/20 focus:border-b-2 focus:border-foreground"
                    placeholder="Hvordan fanger jeg dig?"
                    required
                  />
                </div>

                <div>
                  <label className="mb-4 block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                    Besked
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border-b border-border bg-transparent pb-3 font-mono text-foreground outline-none transition-all duration-500 placeholder:text-foreground/20 focus:border-b-2 focus:border-foreground resize-none"
                    placeholder="Hvad har du på hjertet?"
                  />
                </div>

                {submitError && (
                  <p className="font-mono text-[11px]" style={{ color: "hsl(0 84% 60%)" }}>
                    Noget gik galt. Prøv igen eller skriv direkte til {content.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-foreground py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(44,46,48,0.15)] rounded-sm disabled:opacity-40 disabled:border disabled:border-dashed disabled:border-foreground/40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? "Sender..." : "Send besked"}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASING }}
              >
                <p className="font-serif text-[clamp(1.1rem,2.5vw,1.5rem)] leading-[1.7] text-foreground">
                  Tak. Jeg har modtaget din besked og vender tilbage inden for 24 timer.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIContactSection;
