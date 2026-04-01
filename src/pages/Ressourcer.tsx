import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Headphones, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import ScrollReveal from "@/components/ScrollReveal";
import { EASING } from "@/components/RevealText";
import type { RessourceEntry } from "@/lib/content-types";

type FilterType = "alle" | "article" | "audio" | "video";

const TYPE_LABELS: Record<FilterType, string> = {
  alle: "Alle",
  article: "Artikler",
  audio: "Audio",
  video: "Video",
};

const TypeIcon = ({ type }: { type: RessourceEntry["type"] }) => {
  if (type === "article") return <FileText size={14} strokeWidth={1.5} />;
  if (type === "audio") return <Headphones size={14} strokeWidth={1.5} />;
  return <Play size={14} strokeWidth={1.5} />;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
};

const RessourceCard = ({ entry }: { entry: RessourceEntry }) => (
  <Link
    to={`/ressourcer/${entry.id}`}
    className="group flex flex-col gap-3 p-6 border border-border hover:border-foreground/20 transition-colors duration-500"
    style={entry.featured ? { borderLeft: "2px solid hsl(var(--foreground) / 0.25)" } : undefined}
  >
    {entry.coverUrl && (
      <img
        src={entry.coverUrl}
        alt=""
        className="w-full aspect-video object-cover"
        loading="lazy"
        decoding="async"
      />
    )}
    <div className="flex items-center gap-2 text-foreground/30">
      <TypeIcon type={entry.type} />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{entry.tag}</span>
    </div>
    <h2 className="font-serif text-lg leading-snug text-foreground group-hover:text-foreground/70 transition-colors duration-300">
      {entry.title}
    </h2>
    <p className="font-mono text-[12px] leading-relaxed text-foreground/50 flex-1">{entry.excerpt}</p>
    <span className="font-mono text-[10px] text-foreground/25">{formatDate(entry.date)}</span>
  </Link>
);

const Ressourcer = () => {
  const { content } = useContent();
  const [filter, setFilter] = useState<FilterType>("alle");

  useEffect(() => {
    document.title = "Ressourcer — Kasper Landsvig";
  }, []);

  const sorted = [...content.ressourcer].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = filter === "alle" ? sorted : sorted.filter((e) => e.type === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
        <ScrollReveal>
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/30 hover:text-foreground/60 transition-colors duration-300 inline-block mb-12"
          >
            ← Landsvig
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Ressourcer</h1>
          <p className="font-mono text-[13px] text-foreground/50 max-w-md">
            Artikler, lydoverskrifter og videoer om AI, produktudvikling og håndværk.
          </p>
        </ScrollReveal>

        {/* Filter tabs */}
        <div className="flex gap-6 mt-10 border-b border-border">
          {(Object.keys(TYPE_LABELS) as FilterType[]).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className="relative font-mono text-[11px] uppercase tracking-[0.2em] pb-3 transition-colors duration-300"
              style={{ color: filter === f ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ ease: EASING, duration: 0.3 }}
            >
              {TYPE_LABELS[f]}
              {filter === f && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                  transition={{ ease: EASING, duration: 0.4 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6 max-w-6xl mx-auto pb-24">
        {filtered.length === 0 ? (
          <ScrollReveal>
            <p className="font-mono text-[12px] text-foreground/30 py-16">Ingen indhold endnu.</p>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {filtered.map((entry) => (
                <div key={entry.id} className="bg-background">
                  <RessourceCard entry={entry} />
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Ressourcer;
