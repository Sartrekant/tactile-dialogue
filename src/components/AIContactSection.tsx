import { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import contactBg from "@/assets/contact-bg.webp";
import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface AIContactSectionProps {
  content?: SiteContent["contact"];
}

const AIContactSection = ({ content = DEFAULTS.contact }: AIContactSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });

      if (!res.ok) throw new Error("Submit error");
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="relative min-h-screen overflow-hidden flex items-center" ref={ref}>
      {/* Blur-up placeholder */}
      <div
        className="absolute inset-0 bg-background transition-opacity"
        style={{
          transitionDuration: "1.5s",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: imageLoaded ? 0 : 1,
        }}
      />

      {/* Background image with scroll-scale and blur-up */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <motion.img
          src={content.backgroundUrl || contactBg}
          alt=""
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.04 }}
          animate={imageLoaded ? { scale: 1 } : {}}
          transition={{ duration: 1.8, ease: EASING }}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-background/20" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 py-20 md:py-32">
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
                transition={{ duration: 1, ease: EASING, delay: 0.4 }}
                className="mt-6 md:mt-8 max-w-[380px] font-mono text-[12px] md:text-[13px] leading-[1.8] tracking-wide text-foreground/70"
              >
                {content.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, ease: EASING, delay: 0.6 }}
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

            {/* Right column — simplified form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASING, delay: 0.5 }}
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
                      className="w-full border-b border-border bg-transparent pb-3 font-mono text-[15px] text-foreground outline-none transition-colors duration-700 placeholder:text-foreground/20 focus:border-foreground"
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
                      className="w-full border-b border-border bg-transparent pb-3 font-mono text-[15px] text-foreground outline-none transition-colors duration-700 placeholder:text-foreground/20 focus:border-foreground"
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
                      className="w-full border-b border-border bg-transparent pb-3 font-mono text-[15px] text-foreground outline-none transition-colors duration-700 placeholder:text-foreground/20 focus:border-foreground resize-none"
                      placeholder="Hvad har du på hjertet?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-foreground py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.15)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {submitting ? "Sender..." : "Send besked"}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASING }}
                >
                  <p className="font-serif text-[clamp(1.1rem,2.5vw,1.5rem)] leading-[1.7] text-foreground">
                    Tak. Jeg har modtaget din besked og vender tilbage inden for 24 timer.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIContactSection;
