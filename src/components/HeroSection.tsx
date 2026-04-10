import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText, { EASING } from "./RevealText";
import heroVideo from "@/assets/hero-video.mp4";

import type { SiteContent } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

interface HeroSectionProps {
  onChatOpen?: () => void;
  content?: SiteContent["overview"];
}

const HeroSection = ({ onChatOpen, content = DEFAULTS.overview }: HeroSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Canvas resize via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Start/restart the rAF draw loop
  const startDrawLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const draw = () => {
      if (!isVisibleRef.current) {
        video.pause();
        return; // stop rAF chain — will be restarted by IntersectionObserver
      }
      if (video.paused && video.readyState >= 2) {
        video.play();
      }
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // Visibility tracking — pause rAF and video when hero scrolls out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;

        // Restart draw loop when becoming visible again
        if (!wasVisible && entry.isIntersecting) {
          startDrawLoop();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startDrawLoop]);

  // Initial draw loop start
  useEffect(() => {
    startDrawLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [startDrawLoop]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Blur-up placeholder */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          opacity: videoReady ? 0 : 1,
          transition: "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 1,
        }}
      />

      {/* Scroll-scale container with canvas */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0"
        style={{ scale, willChange: "transform" }}
      >
        {/* Hidden video source */}
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlayThrough={() => {
            if (videoRef.current) videoRef.current.playbackRate = 0.75;
            setVideoReady(true);
          }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0, pointerEvents: "none" }}
        />
        {/* Visible canvas */}
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover"
          style={{ display: "block" }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6">
        <div className="max-w-xl">
          <RevealText as="h1" className="font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] text-foreground">
            {content.headline.split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </RevealText>

          <RevealText as="p" delay={0.2} className="mt-6 md:mt-8 max-w-[400px] font-mono text-[12px] md:text-[13px] leading-relaxed tracking-wide text-foreground/70">
            {content.tagline}
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASING, delay: 0.6 }}
            className="mt-8 md:mt-12"
          >
            <button
              onClick={onChatOpen}
              className="group inline-flex items-center border border-foreground bg-foreground px-6 py-3.5 md:px-8 md:py-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-background transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(44,46,48,0.15)] rounded-sm"
            >
              Start en samtale
            </button>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
