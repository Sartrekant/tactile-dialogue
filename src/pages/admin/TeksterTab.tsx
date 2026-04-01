import { useState } from "react";
import type { SiteContent, JournalEntry } from "@/lib/content-types";

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const textareaCls =
  "w-full border border-border bg-transparent rounded-sm px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60 resize-none leading-relaxed";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6";

const reorderBtnCls =
  "font-mono text-[11px] text-foreground/30 hover:text-foreground transition-colors px-1 disabled:opacity-20 disabled:cursor-not-allowed";

function ReorderButtons<T>({
  entries,
  index,
  setEntries,
}: {
  entries: T[];
  index: number;
  setEntries: (next: T[]) => void;
}) {
  const swap = (a: number, b: number) => {
    const next = [...entries];
    [next[a], next[b]] = [next[b], next[a]];
    setEntries(next);
  };
  return (
    <>
      <button
        className={reorderBtnCls}
        disabled={index === 0}
        onClick={() => swap(index - 1, index)}
        title="Flyt op"
      >
        ↑
      </button>
      <button
        className={reorderBtnCls}
        disabled={index === entries.length - 1}
        onClick={() => swap(index, index + 1)}
        title="Flyt ned"
      >
        ↓
      </button>
    </>
  );
}

export interface TeksterTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const HeroEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.hero.headline);
  const [tagline, setTagline] = useState(content.hero.tagline);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Hero</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <textarea
            className={textareaCls}
            rows={3}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              onSave("hero", { headline: e.target.value, tagline });
            }}
          />
          <p className="mt-1 font-mono text-[10px] text-foreground/30">Brug linjeskift for at opdele overskriften</p>
        </div>
        <div>
          <label className={labelCls}>Undertekst</label>
          <textarea
            className={textareaCls}
            rows={3}
            value={tagline}
            onChange={(e) => {
              setTagline(e.target.value);
              onSave("hero", { headline, tagline: e.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const KasperEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [bio, setBio] = useState<[string, string, string]>([...content.kasper.bio] as [string, string, string]);
  const [details, setDetails] = useState(content.kasper.details);

  const updateBio = (next: [string, string, string]) => {
    setBio(next);
    onSave("kasper", { ...content.kasper, bio: next, details });
  };

  const updateDetails = (next: typeof details) => {
    setDetails(next);
    onSave("kasper", { ...content.kasper, bio, details: next });
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Om mig</h2>
      <div className="space-y-6 max-w-lg">
        {bio.map((p, i) => (
          <div key={i}>
            <label className={labelCls}>Afsnit {i + 1}</label>
            <textarea
              className={textareaCls}
              rows={4}
              value={p}
              onChange={(e) => {
                const next = [...bio] as [string, string, string];
                next[i] = e.target.value;
                updateBio(next);
              }}
            />
          </div>
        ))}
        <div className="border-t border-border pt-6">
          <p className={labelCls}>Nøgledata</p>
          <div className="space-y-4">
            {details.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-foreground/40 w-28 shrink-0">{item.label}</span>
                <input
                  className={inputCls}
                  value={item.value}
                  onChange={(e) => {
                    const next = [...details];
                    next[i] = { ...item, value: e.target.value };
                    updateDetails(next);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetodenEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.metoden.headline);
  const [p0, setP0] = useState(content.metoden.paragraphs[0]);
  const [p1, setP1] = useState(content.metoden.paragraphs[1]);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Metoden</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              onSave("metoden", { headline: e.target.value, paragraphs: [p0, p1] });
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Afsnit 1</label>
          <textarea
            className={textareaCls}
            rows={4}
            value={p0}
            onChange={(e) => {
              setP0(e.target.value);
              onSave("metoden", { headline, paragraphs: [e.target.value, p1] });
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Afsnit 2</label>
          <textarea
            className={textareaCls}
            rows={4}
            value={p1}
            onChange={(e) => {
              setP1(e.target.value);
              onSave("metoden", { headline, paragraphs: [p0, e.target.value] });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const JournalEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(content.journal);

  const update = (i: number, field: keyof JournalEntry, value: string) => {
    const next = entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    setEntries(next);
    onSave("journal", next);
  };

  const add = () => {
    const next = [...entries, { number: String(entries.length + 1).padStart(2, "0"), tag: "", title: "", excerpt: "" }];
    setEntries(next);
    onSave("journal", next);
  };

  const remove = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i);
    setEntries(next);
    onSave("journal", next);
  };

  const reorder = (next: JournalEntry[]) => {
    setEntries(next);
    onSave("journal", next);
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Journalen</h2>
      <div className="space-y-8 max-w-lg">
        {entries.map((entry, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-foreground/40">Indlæg {entry.number}</span>
              <div className="flex items-center gap-2">
                <ReorderButtons entries={entries} index={i} setEntries={reorder} />
                <button onClick={() => remove(i)} className="font-mono text-[10px] text-red-400 hover:text-red-600 transition-colors">
                  Slet
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Tag</label>
              <input className={inputCls} value={entry.tag} onChange={(e) => update(i, "tag", e.target.value)} placeholder="Metode" />
            </div>
            <div>
              <label className={labelCls}>Titel</label>
              <input className={inputCls} value={entry.title} onChange={(e) => update(i, "title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Uddrag</label>
              <textarea className={textareaCls} rows={3} value={entry.excerpt} onChange={(e) => update(i, "excerpt", e.target.value)} />
            </div>
          </div>
        ))}

        <button
          onClick={add}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2.5 w-full"
        >
          + Tilføj indlæg
        </button>
      </div>
    </div>
  );
};

const ContactEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.contact.headline);
  const [tagline, setTagline] = useState(content.contact.tagline);
  const [email, setEmail] = useState(content.contact.email);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Kontakt</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              onSave("contact", { headline: e.target.value, tagline, email });
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Undertekst</label>
          <textarea
            className={textareaCls}
            rows={3}
            value={tagline}
            onChange={(e) => {
              setTagline(e.target.value);
              onSave("contact", { headline, tagline: e.target.value, email });
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            className={inputCls}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              onSave("contact", { headline, tagline, email: e.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TeksterTab = ({ content, onSave }: TeksterTabProps) => {
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", label: "Hero" },
    { id: "kasper", label: "Om mig" },
    { id: "metoden", label: "Metoden" },
    { id: "journal", label: "Journalen" },
    { id: "contact", label: "Kontakt" },
  ];

  return (
    <div className="flex gap-0 h-full">
      {/* Sub-navigation */}
      <div className="w-36 shrink-0 border-r border-border pr-4 pt-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`block w-full text-left font-mono text-[11px] uppercase tracking-[0.15em] py-2.5 transition-colors duration-200 ${
              activeSection === s.id
                ? "text-foreground"
                : "text-foreground/35 hover:text-foreground/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 pl-8 overflow-y-auto">
        {activeSection === "hero" && <HeroEditor content={content} onSave={onSave} />}
        {activeSection === "kasper" && <KasperEditor content={content} onSave={onSave} />}
        {activeSection === "metoden" && <MetodenEditor content={content} onSave={onSave} />}
        {activeSection === "journal" && <JournalEditor content={content} onSave={onSave} />}
        {activeSection === "contact" && <ContactEditor content={content} onSave={onSave} />}
      </div>
    </div>
  );
};

export default TeksterTab;
