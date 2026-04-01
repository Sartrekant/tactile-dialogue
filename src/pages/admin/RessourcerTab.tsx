import { useState } from "react";
import type { SiteContent, RessourceEntry } from "@/lib/content-types";

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

const EMPTY_RESSOURCE: RessourceEntry = {
  id: "",
  type: "article",
  title: "",
  excerpt: "",
  tag: "",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
};

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/(^-|-$)/g, "").replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa");

export interface RessourcerTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const RessourceForm = ({
  entry,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  entry: RessourceEntry;
  onChange: (next: RessourceEntry) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) => (
  <div className="border border-border rounded-sm p-4 space-y-4 bg-foreground/2">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Type</label>
        <select
          className={inputCls}
          value={entry.type}
          onChange={(e) => onChange({ ...entry, type: e.target.value as RessourceEntry["type"] })}
        >
          <option value="article">Artikel</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Dato</label>
        <input
          className={inputCls}
          type="date"
          value={entry.date}
          onChange={(e) => onChange({ ...entry, date: e.target.value })}
        />
      </div>
    </div>
    <div>
      <label className={labelCls}>Titel</label>
      <input
        className={inputCls}
        value={entry.title}
        onChange={(e) => {
          const title = e.target.value;
          onChange({ ...entry, title, id: entry.id || toSlug(title) });
        }}
      />
    </div>
    <div>
      <label className={labelCls}>ID (slug)</label>
      <input
        className={inputCls}
        value={entry.id}
        onChange={(e) => onChange({ ...entry, id: e.target.value })}
        placeholder="auto-genereres fra titel"
      />
    </div>
    <div>
      <label className={labelCls}>Uddrag</label>
      <textarea
        className={textareaCls}
        rows={2}
        value={entry.excerpt}
        onChange={(e) => onChange({ ...entry, excerpt: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Tag</label>
        <input
          className={inputCls}
          value={entry.tag}
          onChange={(e) => onChange({ ...entry, tag: e.target.value })}
          placeholder="Metode"
        />
      </div>
      <div className="flex items-end pb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.featured}
            onChange={(e) => onChange({ ...entry, featured: e.target.checked })}
            className="w-3 h-3"
          />
          <span className="font-mono text-[11px] text-foreground/50">Fremhævet</span>
        </label>
      </div>
    </div>
    {entry.type === "article" && (
      <div>
        <label className={labelCls}>Indhold (markdown)</label>
        <textarea
          className={textareaCls}
          rows={10}
          value={entry.content ?? ""}
          onChange={(e) => onChange({ ...entry, content: e.target.value })}
          placeholder="# Overskrift&#10;&#10;Skriv artiklens indhold i markdown..."
        />
      </div>
    )}
    {entry.type === "audio" && (
      <div>
        <label className={labelCls}>Lyd-URL (Vercel Blob)</label>
        <input
          className={inputCls}
          value={entry.audioUrl ?? ""}
          onChange={(e) => onChange({ ...entry, audioUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>
    )}
    {entry.type === "video" && (
      <div>
        <label className={labelCls}>YouTube Video ID</label>
        <input
          className={inputCls}
          value={entry.videoId ?? ""}
          onChange={(e) => onChange({ ...entry, videoId: e.target.value })}
          placeholder="dQw4w9WgXcQ"
        />
      </div>
    )}
    <div>
      <label className={labelCls}>Forsidebillede URL (valgfrit)</label>
      <input
        className={inputCls}
        value={entry.coverUrl ?? ""}
        onChange={(e) => onChange({ ...entry, coverUrl: e.target.value })}
        placeholder="https://..."
      />
    </div>
    <div className="flex gap-3 pt-2">
      <button
        onClick={onSubmit}
        disabled={!entry.title}
        className="font-mono text-[10px] uppercase tracking-[0.15em] border border-foreground/40 rounded-sm px-4 py-2.5 text-foreground/70 hover:text-foreground hover:border-foreground transition-colors disabled:opacity-30"
      >
        {submitLabel}
      </button>
      <button
        onClick={onCancel}
        className="font-mono text-[10px] text-foreground/30 hover:text-foreground transition-colors"
      >
        Annuller
      </button>
    </div>
  </div>
);

const RessourcerTab = ({ content, onSave }: RessourcerTabProps) => {
  const [entries, setEntries] = useState<RessourceEntry[]>(content.ressourcer);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<RessourceEntry>({ ...EMPTY_RESSOURCE });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<RessourceEntry | null>(null);

  const commitAdd = () => {
    const entry = { ...draft, id: draft.id || toSlug(draft.title) };
    const next = [...entries, entry];
    setEntries(next);
    onSave("ressourcer", next);
    setDraft({ ...EMPTY_RESSOURCE });
    setAdding(false);
  };

  const commitEdit = () => {
    if (editIndex === null || !editDraft) return;
    const next = entries.map((e, i) => (i === editIndex ? editDraft : e));
    setEntries(next);
    onSave("ressourcer", next);
    setEditIndex(null);
    setEditDraft(null);
  };

  const remove = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i);
    setEntries(next);
    onSave("ressourcer", next);
  };

  const reorder = (next: RessourceEntry[]) => {
    setEntries(next);
    onSave("ressourcer", next);
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Ressourcer</h2>
      <div className="space-y-4 max-w-2xl">
        {entries.map((entry, i) => (
          <div key={entry.id || i}>
            {editIndex === i && editDraft ? (
              <RessourceForm
                entry={editDraft}
                onChange={setEditDraft}
                onSubmit={commitEdit}
                onCancel={() => { setEditIndex(null); setEditDraft(null); }}
                submitLabel="Gem ændringer"
              />
            ) : (
              <div className="border border-border rounded-sm p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/30">{entry.type}</span>
                    {entry.featured && <span className="font-mono text-[9px] text-foreground/20 border border-foreground/15 rounded-sm px-1.5">fremhævet</span>}
                  </div>
                  <p className="font-serif text-sm text-foreground truncate">{entry.title || "(ingen titel)"}</p>
                  <p className="font-mono text-[10px] text-foreground/30">{entry.date} · {entry.tag}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ReorderButtons entries={entries} index={i} setEntries={reorder} />
                  <button
                    onClick={() => { setEditIndex(i); setEditDraft({ ...entry }); setAdding(false); }}
                    className="font-mono text-[10px] text-foreground/40 hover:text-foreground transition-colors"
                  >
                    Redigér
                  </button>
                  <button onClick={() => remove(i)} className="font-mono text-[10px] text-red-400 hover:text-red-600 transition-colors">
                    Slet
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {adding ? (
          <RessourceForm
            entry={draft}
            onChange={setDraft}
            onSubmit={commitAdd}
            onCancel={() => { setAdding(false); setDraft({ ...EMPTY_RESSOURCE }); }}
            submitLabel="Tilføj indlæg"
          />
        ) : (
          <button
            onClick={() => { setAdding(true); setEditIndex(null); setEditDraft(null); }}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2.5 w-full"
          >
            + Tilføj indlæg
          </button>
        )}
      </div>
    </div>
  );
};

export default RessourcerTab;
