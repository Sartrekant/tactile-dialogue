import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mic, Phone, Camera, ArrowRight, Check, Clock } from "lucide-react";
import RevealText, { EASING } from "./RevealText";

/* ── Placeholder mockups ── */

const VoiceToQuotePlaceholder = () => (
  <div className="relative h-full w-full flex flex-col items-center justify-center gap-5 px-6">
    {/* Voice waveform */}
    <div className="flex items-end gap-[3px] h-8">
      {[0.3, 0.6, 1, 0.7, 0.9, 1, 0.5, 0.8, 1, 0.6, 0.4, 0.7, 0.9, 0.5, 0.3, 0.6, 0.8, 1, 0.7, 0.4].map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-primary-foreground/20"
          initial={{ height: 4 }}
          animate={{ height: `${h * 28}px` }}
          transition={{ duration: 0.6, delay: i * 0.05, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      ))}
    </div>
    <Mic size={16} className="text-primary-foreground/30" />
    {/* Arrow flow */}
    <ArrowRight size={14} className="text-primary-foreground/15" />
    {/* Mini quote preview */}
    <div className="w-3/4 max-w-[160px] rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 p-3">
      <div className="h-[3px] w-1/2 rounded-full bg-primary-foreground/20 mb-2" />
      <div className="space-y-[3px]">
        <div className="flex justify-between">
          <div className="h-[2px] w-2/3 rounded-full bg-primary-foreground/12" />
          <div className="h-[2px] w-1/5 rounded-full bg-primary-foreground/12" />
        </div>
        <div className="flex justify-between">
          <div className="h-[2px] w-1/2 rounded-full bg-primary-foreground/12" />
          <div className="h-[2px] w-1/5 rounded-full bg-primary-foreground/12" />
        </div>
        <div className="flex justify-between">
          <div className="h-[2px] w-3/5 rounded-full bg-primary-foreground/12" />
          <div className="h-[2px] w-1/5 rounded-full bg-primary-foreground/12" />
        </div>
        <div className="border-t border-primary-foreground/10 mt-1 pt-1 flex justify-between">
          <div className="h-[2px] w-1/4 rounded-full bg-primary-foreground/25" />
          <div className="h-[2px] w-1/4 rounded-full bg-primary-foreground/25" />
        </div>
      </div>
      <div className="mt-2 text-[7px] font-mono text-primary-foreground/20 tracking-wider">PDF TILBUD</div>
    </div>
  </div>
);

const PhoneAgentPlaceholder = () => (
  <div className="relative h-full w-full flex flex-col items-center justify-center gap-4 px-6">
    {/* Incoming call indicator */}
    <div className="flex items-center gap-2">
      <motion.div
        className="w-2 h-2 rounded-full bg-green-400/40"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="font-mono text-[9px] text-primary-foreground/30 tracking-wider">INDKOMMENDE OPKALD</span>
    </div>
    <Phone size={16} className="text-primary-foreground/30" />
    {/* Call summary card */}
    <div className="w-3/4 max-w-[180px] rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <Check size={8} className="text-primary-foreground/25" />
        <div className="h-[2px] w-2/3 rounded-full bg-primary-foreground/15" />
      </div>
      <div className="flex items-center gap-1.5">
        <Check size={8} className="text-primary-foreground/25" />
        <div className="h-[2px] w-1/2 rounded-full bg-primary-foreground/15" />
      </div>
      <div className="flex items-center gap-1.5">
        <Clock size={8} className="text-primary-foreground/15" />
        <div className="h-[2px] w-3/4 rounded-full bg-primary-foreground/10" />
      </div>
      <div className="border-t border-primary-foreground/10 pt-1.5 mt-1">
        <div className="text-[7px] font-mono text-primary-foreground/20 tracking-wider">DAGLIG OPSUMMERING</div>
        <div className="mt-1 flex gap-3">
          <div className="text-center">
            <div className="text-[14px] font-serif text-primary-foreground/25">7</div>
            <div className="text-[6px] font-mono text-primary-foreground/15 tracking-wider">OPKALD</div>
          </div>
          <div className="text-center">
            <div className="text-[14px] font-serif text-primary-foreground/25">3</div>
            <div className="text-[6px] font-mono text-primary-foreground/15 tracking-wider">BOOKET</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SnapToBillPlaceholder = () => (
  <div className="relative h-full w-full flex flex-col items-center justify-center gap-4 px-6">
    {/* Photo grid */}
    <div className="grid grid-cols-3 gap-1 w-3/4 max-w-[140px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="aspect-square rounded-[2px] bg-primary-foreground/8 border border-primary-foreground/10 flex items-center justify-center">
          <Camera size={8} className="text-primary-foreground/15" />
        </div>
      ))}
    </div>
    <ArrowRight size={14} className="text-primary-foreground/15" />
    {/* Invoice preview */}
    <div className="w-3/4 max-w-[160px] rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="h-[3px] w-1/3 rounded-full bg-primary-foreground/20" />
        <div className="text-[7px] font-mono text-green-400/40 tracking-wider">BETALT</div>
      </div>
      <div className="space-y-[3px]">
        <div className="flex justify-between">
          <div className="h-[2px] w-3/5 rounded-full bg-primary-foreground/12" />
          <div className="h-[2px] w-1/5 rounded-full bg-primary-foreground/12" />
        </div>
        <div className="flex justify-between">
          <div className="h-[2px] w-1/2 rounded-full bg-primary-foreground/12" />
          <div className="h-[2px] w-1/5 rounded-full bg-primary-foreground/12" />
        </div>
        <div className="flex justify-between items-center opacity-60">
          <div className="h-[2px] w-2/5 rounded-full bg-primary-foreground/15" />
          <div className="text-[6px] font-mono text-primary-foreground/20">+TILLÆG</div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-1.5 pt-1.5 flex justify-between">
        <div className="h-[2px] w-1/4 rounded-full bg-primary-foreground/25" />
        <div className="h-[3px] w-1/4 rounded-full bg-primary-foreground/25" />
      </div>
      <div className="mt-2 text-[7px] font-mono text-primary-foreground/20 tracking-wider">FAKTURA</div>
    </div>
  </div>
);

const placeholders: Record<string, React.ReactNode> = {
  "Voice-to-Quote": <VoiceToQuotePlaceholder />,
  "Telefonagenten": <PhoneAgentPlaceholder />,
  "Snap-to-Bill": <SnapToBillPlaceholder />,
};

/* ── Card + Grid ── */

interface ToolCardProps {
  title: string;
  description: string;
  detail: string;
  replaces: string;
  icon: React.ReactNode;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ToolCard = ({ title, description, detail, replaces, icon, index, isExpanded, onToggle }: ToolCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASING, delay: index * 0.15 }}
      className={`group flex flex-col p-6 md:p-10 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(44,46,48,0.08)] ${isExpanded ? "ring-1 ring-foreground/10" : ""}`}
    >
      {/* Placeholder mockup */}
      <div className="mb-8 aspect-[4/3] w-full rounded-sm bg-foreground flex items-center justify-center border border-foreground/80 overflow-hidden">
        {placeholders[title] || (
          <div className="text-primary-foreground/30">{icon}</div>
        )}
      </div>

      <h3 className="font-serif text-xl text-foreground">{title}</h3>
      <p className="mt-3 font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50">
        {description}
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASING }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-6 border-t border-border mt-6">
              <p className="font-mono text-[12px] leading-relaxed tracking-wide text-foreground/70">
                {detail}
              </p>
              <p className="mt-4 font-mono text-[11px] tracking-wide text-foreground/40">
                Erstatter: {replaces}
              </p>
              <a
                href="#kontakt"
                className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground transition-colors duration-500"
              >
                Start en samtale →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onToggle}
        className="mt-6 text-left font-mono text-[11px] tracking-[0.15em] text-foreground/30 hover:text-foreground/70 transition-colors duration-500"
      >
        {isExpanded ? "Luk ↑" : "Lær mere ↓"}
      </button>
    </motion.div>
  );
};

const WorkshopGrid = () => {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const tools = [
    {
      title: "Voice-to-Quote",
      description: "Gå rundt på pladsen. Tal. Tilbuddet er sendt inden du starter bilen.",
      detail: "Du taler naturligt om opgaven — AI'en lytter, forstår omfanget, slår dine materialepriser op og sender et professionelt PDF-tilbud til kunden. Ingen formular. Ingen laptop. Bare din stemme.",
      replaces: "Timer ved skrivebordet med Excel og email",
      icon: <Mic size={32} strokeWidth={1} />,
    },
    {
      title: "Telefonagenten",
      description: "Din virksomheds telefon besvares altid. Uanset om du er på taget.",
      detail: "En AI-agent tager alle indkommende opkald på dansk, registrerer opgavens detaljer, booker tid i din kalender og sender en bekræftelses-SMS til kunden. Du modtager et dagligt overblik over alle opkald.",
      replaces: "Tabte leads og ubesvarede opkald",
      icon: <Phone size={32} strokeWidth={1} />,
    },
    {
      title: "Snap-to-Bill",
      description: "Et billede. En faktura. Betalt inden du pakker varebilen.",
      detail: "Tag 3–5 billeder af det færdige arbejde og tilføj en stemmebemærkning. AI'en sammenholder med det originale tilbud, identificerer tillægsydelser og sender en professionel faktura med billederne vedlagt — direkte fra pladsen.",
      replaces: "Aftenfakturering og forglemt tillægsarbejde",
      icon: <Camera size={32} strokeWidth={1} />,
    },
  ];

  return (
    <section id="vaerkstedet" className="px-4 md:px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealText as="h2" className="mb-10 md:mb-16 font-serif text-3xl md:text-5xl text-foreground">
          AI der arbejder mens du arbejder
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {tools.map((tool, i) => (
            <ToolCard
              key={tool.title}
              {...tool}
              index={i}
              isExpanded={expandedTool === tool.title}
              onToggle={() => setExpandedTool(expandedTool === tool.title ? null : tool.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopGrid;
