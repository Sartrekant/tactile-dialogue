import { useState } from "react";
import type { SiteContent, Availability } from "@/lib/content-types";

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const textareaCls =
  "w-full border border-border bg-transparent rounded-sm px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60 resize-none leading-relaxed";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6";

export interface IndstillingerTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const IndstillingerTab = ({ content, onSave }: IndstillingerTabProps) => {
  const [availability, setAvailability] = useState<Availability>(content.settings.availability);
  const [seoTitle, setSeoTitle] = useState(content.settings.seoTitle);
  const [seoDescription, setSeoDescription] = useState(content.settings.seoDescription);
  const [chatPrompt, setChatPrompt] = useState(content.settings.chatPrompt);
  const [github, setGithub] = useState(content.settings.social?.github ?? "");
  const [linkedin, setLinkedin] = useState(content.settings.social?.linkedin ?? "");
  const [twitter, setTwitter] = useState(content.settings.social?.twitter ?? "");

  const save = (overrides: Partial<{
    availability: Availability;
    seoTitle: string;
    seoDescription: string;
    chatPrompt: string;
    github: string;
    linkedin: string;
    twitter: string;
  }> = {}) => {
    onSave("settings", {
      availability: overrides.availability ?? availability,
      seoTitle: overrides.seoTitle ?? seoTitle,
      seoDescription: overrides.seoDescription ?? seoDescription,
      chatPrompt: overrides.chatPrompt ?? chatPrompt,
      social: {
        github: overrides.github ?? github,
        linkedin: overrides.linkedin ?? linkedin,
        twitter: overrides.twitter ?? twitter,
      },
    });
  };

  // Use the in-memory content prop to export — avoids a redundant /api/content fetch.
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
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
              onClick={() => {
                setAvailability(v);
                save({ availability: v });
              }}
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
          <input
            className={inputCls}
            value={seoTitle}
            onChange={(e) => {
              setSeoTitle(e.target.value);
              save({ seoTitle: e.target.value });
            }}
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-foreground/40 mb-1.5">Meta-beskrivelse</label>
          <textarea
            className={textareaCls}
            rows={3}
            value={seoDescription}
            onChange={(e) => {
              setSeoDescription(e.target.value);
              save({ seoDescription: e.target.value });
            }}
          />
        </div>
      </div>

      {/* Chat prompt */}
      <div>
        <p className={labelCls}>AI-chat systemprompt</p>
        <textarea
          className={textareaCls}
          rows={8}
          value={chatPrompt}
          onChange={(e) => {
            setChatPrompt(e.target.value);
            save({ chatPrompt: e.target.value });
          }}
        />
        <p className="mt-1 font-mono text-[10px] text-foreground/30">Ændringer træder i kraft ved næste chat-besked</p>
      </div>

      {/* Social */}
      <div className="space-y-4">
        <p className={labelCls}>Sociale links</p>
        {[
          { label: "GitHub", value: github, key: "github" as const, set: (v: string) => { setGithub(v); save({ github: v }); } },
          { label: "LinkedIn", value: linkedin, key: "linkedin" as const, set: (v: string) => { setLinkedin(v); save({ linkedin: v }); } },
          { label: "Twitter / X", value: twitter, key: "twitter" as const, set: (v: string) => { setTwitter(v); save({ twitter: v }); } },
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

export default IndstillingerTab;
