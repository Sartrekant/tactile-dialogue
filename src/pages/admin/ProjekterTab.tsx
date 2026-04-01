import { useState } from "react";
import type { SiteContent, WorkEntry } from "@/lib/content-types";

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

export interface ProjekterTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const ProjekterTab = ({ content, onSave }: ProjekterTabProps) => {
  const [entries, setEntries] = useState<WorkEntry[]>(content.work);

  const update = (i: number, field: keyof WorkEntry, value: string) => {
    const next = entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    setEntries(next);
    onSave("work", next);
  };

  const add = () => {
    const next = [...entries, { number: String(entries.length + 1).padStart(2, "0"), title: "", description: "", tag: "" }];
    setEntries(next);
    onSave("work", next);
  };

  const remove = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i).map((e, idx) => ({ ...e, number: String(idx + 1).padStart(2, "0") }));
    setEntries(next);
    onSave("work", next);
  };

  const reorder = (next: WorkEntry[]) => {
    setEntries(next);
    onSave("work", next);
  };

  return (
    <div>
      <h2 className={sectionHeadingCls}>Projekter</h2>
      <div className="space-y-6 max-w-lg">
        {entries.map((entry, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-foreground/40">#{entry.number}</span>
              <div className="flex items-center gap-2">
                <ReorderButtons entries={entries} index={i} setEntries={reorder} />
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

export default ProjekterTab;
