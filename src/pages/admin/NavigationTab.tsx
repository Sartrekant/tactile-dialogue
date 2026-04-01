import { useState } from "react";
import type { SiteContent, NavStyle, NavLink } from "@/lib/content-types";

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6";

const NAV_STYLES: Array<{ id: NavStyle; label: string; description: string }> = [
  { id: "topbar", label: "Top bar", description: "Klassisk vandrette links i toppen" },
  { id: "floating", label: "Floating pill", description: "Svævende pille der gemmer sig ved scroll" },
  { id: "dots", label: "Dot nav", description: "Punktnavigation i højre side" },
  { id: "siderail", label: "Side rail", description: "Lodret skinne i venstre side" },
  { id: "overlay", label: "Overlay", description: "Ren hamburger → fuldskærmsoverlay" },
];

export interface NavigationTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const NavigationTab = ({ content, onSave }: NavigationTabProps) => {
  const [style, setStyle] = useState<NavStyle>(content.nav.style);
  const [links, setLinks] = useState<NavLink[]>(content.nav.links);

  const updateStyle = (next: NavStyle) => {
    setStyle(next);
    onSave("nav", { style: next, links });
  };

  const updateLink = (i: number, field: "label" | "href" | "to", value: string) => {
    const next = links.map((l, idx) => idx === i ? { ...l, [field]: value } : l);
    setLinks(next);
    onSave("nav", { style, links: next });
  };

  const addLink = () => {
    const next = [...links, { label: "", href: "" }];
    setLinks(next);
    onSave("nav", { style, links: next });
  };

  const removeLink = (i: number) => {
    const next = links.filter((_, idx) => idx !== i);
    setLinks(next);
    onSave("nav", { style, links: next });
  };

  return (
    <div className="max-w-lg">
      <h2 className={sectionHeadingCls}>Navigation</h2>

      {/* Style picker */}
      <p className={labelCls}>Navigationstype</p>
      <div className="grid grid-cols-1 gap-2 mb-8">
        {NAV_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => updateStyle(s.id)}
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

export default NavigationTab;
