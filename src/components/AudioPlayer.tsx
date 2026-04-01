import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASING } from "@/components/RevealText";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onClose: () => void;
}

const AudioPlayer = ({ audioUrl, title, onClose }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <motion.div
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 64, opacity: 0 }}
      transition={{ duration: 0.5, ease: EASING }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(249, 248, 244, 0.80)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid hsl(36 16% 87%)",
      }}
    >
      <audio ref={audioRef} src={audioUrl} preload="none" />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center gap-6">
        {/* Play/pause */}
        <button
          onClick={togglePlay}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors duration-500 min-w-[48px]"
        >
          {playing ? "Pause" : "Afspil"}
        </button>

        {/* Title */}
        <span className="font-mono text-[11px] text-foreground/40 flex-1 truncate hidden md:block">
          {title}
        </span>

        {/* Progress bar */}
        <div
          className="flex-1 md:flex-none md:w-48 h-px bg-border cursor-pointer relative group"
          onClick={seek}
          role="slider"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-label="Afspilningsposition"
          tabIndex={0}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.currentTime + 5, duration);
            if (e.key === "ArrowLeft") audio.currentTime = Math.max(audio.currentTime - 5, 0);
          }}
        >
          <div
            className="absolute top-0 left-0 h-px bg-foreground/60 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-foreground/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ left: `${progress * 100}%`, transform: "translate(-50%, -50%)" }}
          />
        </div>

        {/* Time */}
        <span className="font-mono text-[10px] text-foreground/30 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Close */}
        <button
          onClick={onClose}
          className="font-mono text-[11px] text-foreground/25 hover:text-foreground/50 transition-colors duration-500"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
