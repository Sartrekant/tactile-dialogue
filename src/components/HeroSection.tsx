import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import heroVideo from "@/assets/hero-video.mp4";
import { Slider } from "@/components/ui/slider";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [speed, setSpeed] = useState(100);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed / 100;
    }
  }, [speed]);

  const entryScale = useTransform(
    () => videoReady ? 1 : 1.04
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Blur-up placeholder — blur lives here, never on the video */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          opacity: videoReady ? 0 : 1,
          transition: "opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 1,
        }}
      />

      {/* Single motion.div for scroll-scale — no nested transforms */}
      <motion.div
        className="absolute inset-0"
        style={{ scale, willChange: "transform" }}
      >
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-xl">
          <RevealText as="h1" className="font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] text-foreground">
            Vi bygger systemet.
            <br />
            Så du kan køre hjem.
          </RevealText>

          <RevealText as="p" delay={0.2} className="mt-6 md:mt-8 max-w-[400px] font-mono text-[12px] md:text-[13px] leading-relaxed tracking-wide text-foreground/70">
            Skræddersyede AI-værktøjer til virksomheder, der lever af fysisk arbejde. Vi behandler prompt engineering som fint dansk snedkerhåndværk.
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASING, delay: 0.6 }}
            className="mt-8 md:mt-12"
          >
            <a
              href="#kontakt"
              className="group inline-flex items-center border border-foreground bg-foreground px-6 py-3.5 md:px-8 md:py-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.15)] rounded-sm"
            >
              Start en samtale
            </a>
          </motion.div>
        </div>
      </div>

      {/* Speed control slider — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={videoReady ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: EASING, delay: 1 }}
        className="absolute bottom-6 right-4 md:bottom-10 md:right-8 z-20 flex items-center gap-3"
      >
        <Slider
          value={[speed]}
          onValueChange={(v) => setSpeed(v[0])}
          min={10}
          max={200}
          step={10}
          className="w-24 md:w-32"
        />
        <span className="font-mono text-[11px] tracking-wider text-foreground/50 min-w-[3ch] text-right">
          {speed}%
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
