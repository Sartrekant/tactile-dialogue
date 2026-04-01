import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AudioPlayer from "@/components/AudioPlayer";
import { EASING } from "@/components/RevealText";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
};

const RessourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content, loading } = useContent();
  const [audioOpen, setAudioOpen] = useState(false);

  const entry = content.ressourcer.find((e) => e.id === id);

  useEffect(() => {
    if (!loading && !entry) {
      navigate("/ressourcer", { replace: true });
    }
  }, [loading, entry, navigate]);

  useEffect(() => {
    if (entry) document.title = `${entry.title} — Kasper Landsvig`;
  }, [entry]);

  if (!entry) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASING }}
        className="pt-32 pb-32 px-4 md:px-6 max-w-3xl mx-auto"
      >
        {/* Back link */}
        <Link
          to="/ressourcer"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/30 hover:text-foreground/60 transition-colors duration-300 inline-block mb-12"
        >
          ← Ressourcer
        </Link>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASING, delay: 0.1 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30 block mb-3">
            {entry.tag}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-4">
            {entry.title}
          </h1>
          <span className="font-mono text-[10px] text-foreground/20 block mb-8">
            {formatDate(entry.date)}
          </span>
          <div className="h-px bg-border mb-12" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASING, delay: 0.2 }}
        >
          {entry.type === "article" && (
            <MarkdownRenderer content={entry.content ?? ""} />
          )}

          {entry.type === "audio" && (
            <div className="space-y-8">
              <p className="font-mono text-[13px] text-foreground/60 leading-relaxed">
                {entry.excerpt}
              </p>
              {entry.audioUrl ? (
                <button
                  onClick={() => setAudioOpen(true)}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground border border-border hover:border-foreground/30 px-6 py-3 transition-colors duration-300"
                >
                  Afspil lydoversigt
                </button>
              ) : (
                <p className="font-mono text-[11px] text-foreground/25">Lydindhold kommer snart.</p>
              )}
            </div>
          )}

          {entry.type === "video" && (
            <div className="space-y-8">
              <p className="font-mono text-[13px] text-foreground/60 leading-relaxed">
                {entry.excerpt}
              </p>
              {entry.videoId ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${entry.videoId}`}
                    title={entry.title}
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <p className="font-mono text-[11px] text-foreground/25">Videoindhold kommer snart.</p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Audio player — mounted outside main flow, fixed bottom */}
      <AnimatePresence>
        {audioOpen && entry.type === "audio" && entry.audioUrl && (
          <AudioPlayer
            audioUrl={entry.audioUrl}
            title={entry.title}
            onClose={() => setAudioOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RessourceDetail;
