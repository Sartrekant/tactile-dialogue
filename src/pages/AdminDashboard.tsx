import { useState, useRef, useEffect, useContext, createContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import type { SiteContent, NavStyle, WorkEntry, JournalEntry, NavLink } from "@/lib/content-types";

// ─── Shared helpers ──────────────────────────────────────────────────────────

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const textareaCls =
  "w-full border border-border bg-transparent rounded-sm px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60 resize-none leading-relaxed";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls =
  "font-serif text-xl text-foreground mb-6";

// ─── Save status context ──────────────────────────────────────────────────────

interface SaveStatusCtx {
  notifySaving: () => void;
  notifySaved: () => void;
  notifyError: () => void;
}

const SaveStatusContext = createContext<SaveStatusCtx>({
  notifySaving: () => {},
  notifySaved: () => {},
  notifyError: () => {},
});

async function saveSection(section: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function useSave() {
  const ctx = useContext(SaveStatusContext);
  return {
    save: async (section: string, data: unknown) => {
      ctx.notifySaving();
      const ok = await saveSection(section, data);
      if (ok) ctx.notifySaved(); else ctx.notifyError();
    },
  };
}

function useAutosave(section: string, getData: () => unknown, deps: unknown[]) {
  const { save } = useSave();
  const saveRef = useRef(save);
  const getDataRef = useRef(getData);
  saveRef.current = save;
  getDataRef.current = getData;
  const isFirst = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => saveRef.current(section, getDataRef.current()), 2000);
    return () => clearTimeout(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── Reorder helpers ──────────────────────────────────────────────────────────

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

// ─── Tekster Tab ─────────────────────────────────────────────────────────────

const TeksterTab = ({ content }: { content: SiteContent }) => {
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
        {activeSection === "hero" && <HeroEditor content={content} />}
        {activeSection === "kasper" && <KasperEditor content={content} />}
        {activeSection === "metoden" && <MetodenEditor content={content} />}
        {activeSection === "journal" && <JournalEditor content={content} />}
        {activeSection === "contact" && <ContactEditor content={content} />}
      </div>
    </div>
  );
};

const HeroEditor = ({ content }: { content: SiteContent }) => {
  const [headline, setHeadline] = useState(content.hero.headline);
  const [tagline, setTagline] = useState(content.hero.tagline);
  useAutosave("hero", () => ({ headline, tagline }), [headline, tagline]);

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
            onChange={(e) => setHeadline(e.target.value)}
          />
          <p className="mt-1 font-mono text-[10px] text-foreground/30">Brug linjeskift for at opdele overskriften</p>
        </div>
        <div>
          <label className={labelCls}>Undertekst</label>
          <textarea className={textareaCls} rows={3} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

const KasperEditor = ({ content }: { content: SiteContent }) => {
  const [bio, setBio] = useState<[string, string, string]>([...content.kasper.bio] as [string, string, string]);
  const [details, setDetails] = useState(content.kasper.details);
  useAutosave("kasper", () => ({ ...content.kasper, bio, details }), [bio, details]);

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
                setBio(next);
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

const MetodenEditor = ({ content }: { content: SiteContent }) => {
  const [headline, setHeadline] = useState(content.metoden.headline);
  const [p0, setP0] = useState(content.metoden.paragraphs[0]);
  const [p1, setP1] = useState(content.metoden.paragraphs[1]);
  useAutosave("metoden", () => ({ headline, paragraphs: [p0, p1] }), [headline, p0, p1]);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Metoden</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input className={inputCls} value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Afsnit 1</label>
          <textarea className={textareaCls} rows={4} value={p0} onChange={(e) => setP0(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Afsnit 2</label>
          <textarea className={textareaCls} rows={4} value={p1} onChange={(e) => setP1(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

const JournalEditor = ({ content }: { content: SiteContent }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(content.journal);
  useAutosave("journal", () => entries, [entries]);

  const update = (i: number, field: keyof JournalEntry, value: string) => {
    setEntries(entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };

  const add = () =>
    setEntries([...entries, { number: String(entries.length + 1).padStart(2, "0"), tag: "", title: "", excerpt: "" }]);

  const remove = (i: number) => setEntries(entries.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 className={sectionHeadingCls}>Journalen</h2>
      <div className="space-y-8 max-w-lg">
        {entries.map((entry, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-foreground/40">Indlæg {entry.number}</span>
              <div className="flex items-center gap-2">
                <ReorderButtons entries={entries} index={i} setEntries={setEntries} />
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

const ContactEditor = ({ content }: { content: SiteContent }) => {
  const [headline, setHeadline] = useState(content.contact.headline);
  const [tagline, setTagline] = useState(content.contact.tagline);
  const [email, setEmail] = useState(content.contact.email);
  useAutosave("contact", () => ({ headline, tagline, email }), [headline, tagline, email]);

  return (
    <div>
      <h2 className={sectionHeadingCls}>Kontakt</h2>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className={labelCls}>Overskrift</label>
          <input className={inputCls} value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Undertekst</label>
          <textarea className={textareaCls} rows={3} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

// ─── Projekter Tab ────────────────────────────────────────────────────────────

const ProjekterTab = ({ content }: { content: SiteContent }) => {
  const [entries, setEntries] = useState<WorkEntry[]>(content.work);
  useAutosave("work", () => entries, [entries]);

  const update = (i: number, field: keyof WorkEntry, value: string) => {
    setEntries(entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };

  const add = () =>
    setEntries([...entries, { number: String(entries.length + 1).padStart(2, "0"), title: "", description: "", tag: "" }]);

  const remove = (i: number) =>
    setEntries(entries.filter((_, idx) => idx !== i).map((e, idx) => ({ ...e, number: String(idx + 1).padStart(2, "0") })));

  return (
    <div>
      <h2 className={sectionHeadingCls}>Projekter</h2>
      <div className="space-y-6 max-w-lg">
        {entries.map((entry, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-foreground/40">#{entry.number}</span>
              <div className="flex items-center gap-2">
                <ReorderButtons entries={entries} index={i} setEntries={setEntries} />
                <button onClick={() => remove(i)} className="font-mono text-[10px] text-red-400 hover:text-red-600 transition-colors">
                  Slet
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Titel</label>
              <input className={inputCls} value={entry.title} onChange={(e) => update(i, "title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Beskrivelse</label>
              <textarea className={textareaCls} rows={3} value={entry.description} onChange={(e) => update(i, "description", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tag</label>
              <input className={inputCls} value={entry.tag} onChange={(e) => update(i, "tag", e.target.value)} placeholder="AI-værktøj" />
            </div>
          </div>
        ))}

        <button
          onClick={add}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2.5 w-full"
        >
          + Tilføj projekt
        </button>
      </div>
    </div>
  );
};

// ─── Navigation Tab ───────────────────────────────────────────────────────────

const NAV_STYLES: Array<{ id: NavStyle; label: string; description: string }> = [
  { id: "topbar", label: "Top bar", description: "Klassisk vandrette links i toppen" },
  { id: "floating", label: "Floating pill", description: "Svævende pille der gemmer sig ved scroll" },
  { id: "dots", label: "Dot nav", description: "Punktnavigation i højre side" },
  { id: "siderail", label: "Side rail", description: "Lodret skinne i venstre side" },
  { id: "overlay", label: "Overlay", description: "Ren hamburger → fuldskærmsoverlay" },
];

const NavigationTab = ({ content }: { content: SiteContent }) => {
  const [style, setStyle] = useState<NavStyle>(content.nav.style);
  const [links, setLinks] = useState<NavLink[]>(content.nav.links);
  useAutosave("nav", () => ({ style, links }), [style, links]);

  const updateLink = (i: number, field: "label" | "href" | "to", value: string) => {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const addLink = () => setLinks([...links, { label: "", href: "" }]);
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-lg">
      <h2 className={sectionHeadingCls}>Navigation</h2>

      {/* Style picker */}
      <p className={labelCls}>Navigationstype</p>
      <div className="grid grid-cols-1 gap-2 mb-8">
        {NAV_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`text-left px-4 py-3 border rounded-sm transition-all duration-200 ${
              style === s.id
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <span className="font-mono text-[12px] text-foreground block">{s.label}</span>
            <span className="font-mono text-[10px] text-foreground/40">{s.description}</span>
          </button>
        ))}
      </div>

      {/* Link editor */}
      <p className={labelCls}>Links</p>
      <div className="space-y-3 mb-4">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={`${inputCls} w-28 shrink-0`}
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Label"
            />
            <input
              className={inputCls}
              value={link.href ?? link.to ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v.startsWith("/")) {
                  updateLink(i, "to", v);
                } else {
                  updateLink(i, "href", v);
                }
              }}
              placeholder="#section eller /side"
            />
            <button onClick={() => removeLink(i)} className="font-mono text-[11px] text-red-400 hover:text-red-600 shrink-0 px-1">
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLink}
        className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2 mb-6"
      >
        + Tilføj link
      </button>
    </div>
  );
};

// ─── Aktiver Tab ──────────────────────────────────────────────────────────────

const AktiverTab = ({ content }: { content: SiteContent }) => {
  return (
    <div className="max-w-lg">
      <h2 className={sectionHeadingCls}>Aktiver</h2>
      <div className="space-y-10">
        <AssetUploader
          label="Portræt"
          hint="Bruges i 'Om mig'-sektionen. Anbefalet: 3:4 aspect ratio."
          currentUrl={content.kasper.portraitUrl}
          blobName="portrait.webp"
          section="kasper"
          sectionData={{ ...content.kasper }}
          field="portraitUrl"
        />
        <AssetUploader
          label="Metoden-baggrund"
          hint="Baggrundsbillede til 'Metoden'-sektionen."
          currentUrl={content.metoden.backgroundUrl}
          blobName="metoden-bg.webp"
          section="metoden"
          sectionData={{ ...content.metoden }}
          field="backgroundUrl"
        />
        <AssetUploader
          label="Kontakt-baggrund"
          hint="Baggrundsbillede til kontaktsektionen."
          currentUrl={content.contact.backgroundUrl}
          blobName="contact-bg.webp"
          section="contact"
          sectionData={{ ...content.contact }}
          field="backgroundUrl"
        />
      </div>
    </div>
  );
};

const AssetUploader = ({
  label,
  hint,
  currentUrl,
  blobName,
  section,
  sectionData,
  field,
}: {
  label: string;
  hint: string;
  currentUrl: string;
  blobName: string;
  section: string;
  sectionData: Record<string, unknown>;
  field: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("name", blobName);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload fejlede");
      const { url: newUrl } = await res.json();
      setUrl(newUrl);

      // Persist the URL to the section if field is provided
      if (field && section !== "__assets") {
        await saveSection(section, { ...sectionData, [field]: newUrl });
      }
    } catch {
      setError("Upload fejlede. Prøv igen.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  return (
    <div>
      <p className={labelCls}>{label}</p>
      <p className="font-mono text-[10px] text-foreground/30 mb-3">{hint}</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border rounded-sm p-4 transition-colors duration-200 ${isDragging ? "border-foreground/40 bg-foreground/4" : "border-border"}`}
      >
        {url && (
          <img
            src={url}
            alt=""
            className="w-32 h-40 object-cover rounded-sm border border-border mb-4"
          />
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="font-mono text-[10px] uppercase tracking-[0.15em] border border-border rounded-sm px-4 py-2.5 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-40"
          >
            {uploading ? "Uploader..." : url ? "Skift billede" : "Upload billede"}
          </button>
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-foreground/30 hover:text-foreground transition-colors">
              ↗ Åbn
            </a>
          )}
          {!uploading && (
            <span className="font-mono text-[10px] text-foreground/20">eller træk hertil</span>
          )}
        </div>

        {error && <p className="mt-3 font-mono text-[10px] text-red-400">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ─── Indstillinger Tab ────────────────────────────────────────────────────────

const IndstillingerTab = ({ content }: { content: SiteContent }) => {
  const [availability, setAvailability] = useState(content.settings.availability);
  const [seoTitle, setSeoTitle] = useState(content.settings.seoTitle);
  const [seoDescription, setSeoDescription] = useState(content.settings.seoDescription);
  const [chatPrompt, setChatPrompt] = useState(content.settings.chatPrompt);
  const [github, setGithub] = useState(content.settings.social?.github ?? "");
  const [linkedin, setLinkedin] = useState(content.settings.social?.linkedin ?? "");
  const [twitter, setTwitter] = useState(content.settings.social?.twitter ?? "");
  useAutosave("settings", () => ({
    availability,
    seoTitle,
    seoDescription,
    chatPrompt,
    social: { github, linkedin, twitter },
  }), [availability, seoTitle, seoDescription, chatPrompt, github, linkedin, twitter]);

  const handleExport = async () => {
    const res = await fetch("/api/content");
    if (!res.ok) return;
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <h2 className={sectionHeadingCls}>Indstillinger</h2>
      </div>

      {/* Availability */}
      <div>
        <p className={labelCls}>Tilgængelighed</p>
        <div className="flex gap-3">
          {(["open", "busy"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAvailability(v)}
              className={`font-mono text-[11px] px-4 py-2.5 border rounded-sm transition-all duration-200 ${
                availability === v
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/50 hover:border-foreground/40"
              }`}
            >
              {v === "open" ? "Åben for projekter" : "Optaget"}
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-foreground/30">Vises som et badge i 'Om mig'-sektionen</p>
      </div>

      {/* SEO */}
      <div className="space-y-5">
        <p className={labelCls}>SEO</p>
        <div>
          <label className="block font-mono text-[10px] text-foreground/40 mb-1.5">Sidetitel</label>
          <input className={inputCls} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-foreground/40 mb-1.5">Meta-beskrivelse</label>
          <textarea className={textareaCls} rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
      </div>

      {/* Chat prompt */}
      <div>
        <p className={labelCls}>AI-chat systemprompt</p>
        <textarea
          className={textareaCls}
          rows={8}
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
        />
        <p className="mt-1 font-mono text-[10px] text-foreground/30">Ændringer træder i kraft ved næste chat-besked</p>
      </div>

      {/* Social */}
      <div className="space-y-4">
        <p className={labelCls}>Sociale links</p>
        {[
          { label: "GitHub", value: github, set: setGithub },
          { label: "LinkedIn", value: linkedin, set: setLinkedin },
          { label: "Twitter / X", value: twitter, set: setTwitter },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-foreground/40 w-20 shrink-0">{s.label}</span>
            <input
              className={inputCls}
              value={s.value}
              onChange={(e) => s.set(e.target.value)}
              placeholder="https://..."
            />
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="border-t border-border pt-8">
        <p className={labelCls}>Eksportér indhold</p>
        <p className="font-mono text-[10px] text-foreground/30 mb-4">
          Download det aktuelle indhold som JSON. Kan gemmes i repo som backup.
        </p>
        <button
          onClick={handleExport}
          className="font-mono text-[10px] uppercase tracking-[0.15em] border border-border rounded-sm px-4 py-2.5 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
        >
          ↓ Download content.json
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard Shell ──────────────────────────────────────────────────────────

type Tab = "tekster" | "projekter" | "navigation" | "aktiver" | "indstillinger";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "tekster", label: "Tekster" },
  { id: "projekter", label: "Projekter" },
  { id: "navigation", label: "Navigation" },
  { id: "aktiver", label: "Aktiver" },
  { id: "indstillinger", label: "Indstillinger" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AdminDashboard = () => {
  const { content, loading } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>("tekster");
  const [authChecked, setAuthChecked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/check").then((res) => {
      if (res.status === 401) {
        navigate("/admin/login", { replace: true });
      } else {
        setAuthChecked(true);
      }
    });
  }, [navigate]);

  const ctxValue = useMemo<SaveStatusCtx>(() => ({
    notifySaving: () => setSaveStatus("saving"),
    notifySaved: () => {
      setSaveStatus("saved");
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    },
    notifyError: () => setSaveStatus("error"),
  }), []);

  if (!authChecked) return null;

  const statusLabel =
    saveStatus === "saving" ? "Gemmer..."
    : saveStatus === "saved" ? "Alle ændringer gemt"
    : saveStatus === "error" ? "Gem mislykkedes"
    : null;

  return (
    <SaveStatusContext.Provider value={ctxValue}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top bar */}
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-md">
          <span className="font-serif text-base text-foreground">LANDSVIG Admin</span>
          <div className="flex items-center gap-6">
            {statusLabel && (
              <span className={`font-mono text-[10px] transition-opacity duration-300 ${saveStatus === "error" ? "text-red-400" : "text-foreground/40"}`}>
                {statusLabel}
              </span>
            )}
            <Link
              to="/"
              target="_blank"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors"
            >
              ↗ Åbn side
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                navigate("/admin/login");
              }}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors"
            >
              Log ud
            </button>
          </div>
        </header>

        <div className="flex flex-1 pt-[57px]">
          {/* Sidebar */}
          <aside className="fixed left-0 top-[57px] bottom-0 w-48 border-r border-border bg-background px-4 py-8">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2.5 rounded-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "bg-foreground/8 text-foreground"
                      : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/4"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-48 overflow-y-auto px-10 py-10 min-h-[calc(100vh-57px)]">
            {loading ? (
              <p className="font-mono text-[11px] text-foreground/30">Henter indhold...</p>
            ) : (
              <>
                {activeTab === "tekster" && <TeksterTab content={content} />}
                {activeTab === "projekter" && <ProjekterTab content={content} />}
                {activeTab === "navigation" && <NavigationTab content={content} />}
                {activeTab === "aktiver" && <AktiverTab content={content} />}
                {activeTab === "indstillinger" && <IndstillingerTab content={content} />}
              </>
            )}
          </main>
        </div>
      </div>
    </SaveStatusContext.Provider>
  );
};

export default AdminDashboard;
