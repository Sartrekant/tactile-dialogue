import { useState } from "react";
import type { SiteContent, ServiceItem } from "@/lib/content-types";

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

const OverviewEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.overview.headline);
  const [tagline, setTagline] = useState(content.overview.tagline);
  const [bio, setBio] = useState(content.overview.bio);
  const [details, setDetails] = useState(content.overview.details);

  const save = (overrides: Partial<SiteContent["overview"]> = {}) => {
    onSave("overview", { ...content.overview, headline, tagline, bio, details, ...overrides });
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Oversigt</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <textarea
            className={textareaCls}
            rows={3}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              save({ headline: e.target.value });
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
              save({ tagline: e.target.value });
            }}
          />
        </div>
        {bio.map((p, i) => (
          <div key={i}>
            <label className={labelCls}>Bio — afsnit {i + 1}</label>
            <textarea
              className={textareaCls}
              rows={4}
              value={p}
              onChange={(e) => {
                const next = [...bio];
                next[i] = e.target.value;
                setBio(next);
                save({ bio: next });
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
                    setDetails(next);
                    save({ details: next });
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

const ServicesEditor = ({
  sectionKey,
  label,
  content,
  onSave,
}: {
  sectionKey: "space" | "tools";
  label: string;
  content: SiteContent;
  onSave: TeksterTabProps["onSave"];
}) => {
  const section = content[sectionKey];
  const [headline, setHeadline] = useState(section.headline);
  const [tagline, setTagline] = useState(section.tagline);
  const [services, setServices] = useState<ServiceItem[]>(section.services);

  const save = (overrides: Partial<SiteContent["space"]> = {}) => {
    onSave(sectionKey, { headline, tagline, services, ...overrides });
  };

  const updateService = (i: number, field: keyof ServiceItem, value: string) => {
    const next = services.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setServices(next);
    save({ services: next });
  };

  const addService = () => {
    const next = [...services, { title: "", description: "", tag: "" }];
    setServices(next);
    save({ services: next });
  };

  const removeService = (i: number) => {
    const next = services.filter((_, idx) => idx !== i);
    setServices(next);
    save({ services: next });
  };

  const reorder = (next: ServiceItem[]) => {
    setServices(next);
    save({ services: next });
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>{label}</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              save({ headline: e.target.value });
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
              save({ tagline: e.target.value });
            }}
          />
        </div>

        {services.map((service, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-foreground/40">Ydelse {i + 1}</span>
              <div className="flex items-center gap-2">
                <ReorderButtons entries={services} index={i} setEntries={reorder} />
                <button onClick={() => removeService(i)} className="font-mono text-[10px] text-red-400 hover:text-red-600 transition-colors">
                  Slet
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Titel</label>
              <input className={inputCls} value={service.title} onChange={(e) => updateService(i, "title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Beskrivelse</label>
              <textarea className={textareaCls} rows={3} value={service.description} onChange={(e) => updateService(i, "description", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tag</label>
              <input className={inputCls} value={service.tag} onChange={(e) => updateService(i, "tag", e.target.value)} placeholder="Oplevelser" />
            </div>
          </div>
        ))}

        <button
          onClick={addService}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2.5 w-full"
        >
          + Tilføj ydelse
        </button>
      </div>
    </div>
  );
};

const AdvisoryEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.advisory.headline);
  const [paragraphs, setParagraphs] = useState(content.advisory.paragraphs);

  const save = (overrides: Partial<SiteContent["advisory"]> = {}) => {
    onSave("advisory", { headline, paragraphs, ...overrides });
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Rådgivningen</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              save({ headline: e.target.value });
            }}
          />
        </div>
        {paragraphs.map((p, i) => (
          <div key={i}>
            <label className={labelCls}>Afsnit {i + 1}</label>
            <textarea
              className={textareaCls}
              rows={4}
              value={p}
              onChange={(e) => {
                const next = [...paragraphs];
                next[i] = e.target.value;
                setParagraphs(next);
                save({ paragraphs: next });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ConversationEditor = ({ content, onSave }: { content: SiteContent; onSave: TeksterTabProps["onSave"] }) => {
  const [headline, setHeadline] = useState(content.conversation.headline);
  const [tagline, setTagline] = useState(content.conversation.tagline);
  const [email, setEmail] = useState(content.conversation.email);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Samtalen</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              onSave("conversation", { headline: e.target.value, tagline, email });
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
              onSave("conversation", { headline, tagline: e.target.value, email });
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
              onSave("conversation", { headline, tagline, email: e.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TeksterTab = ({ content, onSave }: TeksterTabProps) => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Oversigt" },
    { id: "space", label: "Rummet" },
    { id: "tools", label: "Værktøjerne" },
    { id: "advisory", label: "Rådgivningen" },
    { id: "conversation", label: "Samtalen" },
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
        {activeSection === "overview" && <OverviewEditor content={content} onSave={onSave} />}
        {activeSection === "space" && <ServicesEditor sectionKey="space" label="Rummet" content={content} onSave={onSave} />}
        {activeSection === "tools" && <ServicesEditor sectionKey="tools" label="Værktøjerne" content={content} onSave={onSave} />}
        {activeSection === "advisory" && <AdvisoryEditor content={content} onSave={onSave} />}
        {activeSection === "conversation" && <ConversationEditor content={content} onSave={onSave} />}
      </div>
    </div>
  );
};

export default TeksterTab;
