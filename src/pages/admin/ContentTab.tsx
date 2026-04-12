import { useState, useEffect } from "react";
import type { SiteContent, ServiceItem } from "@/lib/content-types";

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const textareaCls =
  "w-full border border-border bg-transparent rounded-sm px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60 resize-none leading-relaxed";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6 mt-8 first:mt-0";

const collapsibleBtnCls =
  "flex w-full items-center gap-2 font-serif text-lg text-foreground py-4 px-0 border-b border-border/50 hover:bg-foreground/2 transition-colors";

interface ContentTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

type ExpandedSections = Record<string, boolean>;

const ContentTab = ({ content, onSave }: ContentTabProps) => {
  const [expanded, setExpanded] = useState<ExpandedSections>({
    overview: true,
    space: false,
    tools: false,
    advisory: false,
    conversation: false,
    pricing: false,
  });

  // Local state for each section — only saved on blur
  const [overview, setOverview] = useState(content.overview);
  const [space, setSpace] = useState(content.space);
  const [tools, setTools] = useState(content.tools);
  const [advisory, setAdvisory] = useState(content.advisory);
  const [conversation, setConversation] = useState(content.conversation);
  const [pricing, setPricing] = useState<SiteContent["pricing"] | undefined>(
    (content as any).pricing || { headline: "", tagline: "", items: [] }
  );

  // Sync state when content changes from API
  useEffect(() => {
    setOverview(content.overview);
    setSpace(content.space);
    setTools(content.tools);
    setAdvisory(content.advisory);
    setConversation(content.conversation);
    setPricing((content as any).pricing || { headline: "", tagline: "", items: [] });
  }, [content]);

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBlur = (section: string, data: unknown) => {
    onSave(section, data);
  };

  const reorderArray = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...arr];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-foreground mb-8">Indhold</h1>

      {/* Overview Section */}
      <div>
        <button
          onClick={() => toggleSection("overview")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.overview ? "▼" : "▶"}</span>
          Oversigt
        </button>

        {expanded.overview && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={overview.headline}
                onChange={(e) => setOverview({ ...overview, headline: e.target.value })}
                onBlur={() => handleBlur("overview", overview)}
              />
            </div>
            <div>
              <label className={labelCls}>Undertekst</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={overview.tagline}
                onChange={(e) => setOverview({ ...overview, tagline: e.target.value })}
                onBlur={() => handleBlur("overview", overview)}
              />
            </div>
            {overview.bio.map((p, i) => (
              <div key={i}>
                <label className={labelCls}>Bio — afsnit {i + 1}</label>
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const newBio = [...overview.bio];
                    newBio[i] = e.target.value;
                    setOverview({ ...overview, bio: newBio });
                  }}
                  onBlur={() => handleBlur("overview", overview)}
                />
              </div>
            ))}
            {overview.details.map((detail, i) => (
              <div key={i}>
                <label className={labelCls}>Detail {i + 1}: Label</label>
                <input
                  className={inputCls}
                  value={detail.label}
                  onChange={(e) => {
                    const newDetails = [...overview.details];
                    newDetails[i] = { ...detail, label: e.target.value };
                    setOverview({ ...overview, details: newDetails });
                  }}
                  onBlur={() => handleBlur("overview", overview)}
                />
                <label className={`${labelCls} mt-4`}>Detail {i + 1}: Værdi</label>
                <input
                  className={inputCls}
                  value={detail.value}
                  onChange={(e) => {
                    const newDetails = [...overview.details];
                    newDetails[i] = { ...detail, value: e.target.value };
                    setOverview({ ...overview, details: newDetails });
                  }}
                  onBlur={() => handleBlur("overview", overview)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Space Section */}
      <div>
        <button
          onClick={() => toggleSection("space")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.space ? "▼" : "▶"}</span>
          Rummet
        </button>

        {expanded.space && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <input
                className={inputCls}
                value={space.headline}
                onChange={(e) => setSpace({ ...space, headline: e.target.value })}
                onBlur={() => handleBlur("space", space)}
              />
            </div>
            <div>
              <label className={labelCls}>Undertekst</label>
              <input
                className={inputCls}
                value={space.tagline}
                onChange={(e) => setSpace({ ...space, tagline: e.target.value })}
                onBlur={() => handleBlur("space", space)}
              />
            </div>
            {space.services.map((service, i) => (
              <div key={i} className="border-l-2 border-border/30 pl-4">
                <label className={labelCls}>Service {i + 1}: Titel</label>
                <input
                  className={inputCls}
                  value={service.title}
                  onChange={(e) => {
                    const newServices = [...space.services];
                    newServices[i] = { ...service, title: e.target.value };
                    setSpace({ ...space, services: newServices });
                  }}
                  onBlur={() => handleBlur("space", space)}
                />
                <label className={`${labelCls} mt-4`}>Service {i + 1}: Beskrivelse</label>
                <textarea
                  className={textareaCls}
                  rows={2}
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...space.services];
                    newServices[i] = { ...service, description: e.target.value };
                    setSpace({ ...space, services: newServices });
                  }}
                  onBlur={() => handleBlur("space", space)}
                />
                <label className={`${labelCls} mt-4`}>Service {i + 1}: Tag</label>
                <input
                  className={inputCls}
                  value={service.tag}
                  onChange={(e) => {
                    const newServices = [...space.services];
                    newServices[i] = { ...service, tag: e.target.value };
                    setSpace({ ...space, services: newServices });
                  }}
                  onBlur={() => handleBlur("space", space)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div>
        <button
          onClick={() => toggleSection("tools")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.tools ? "▼" : "▶"}</span>
          Værktøjerne
        </button>

        {expanded.tools && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <input
                className={inputCls}
                value={tools.headline}
                onChange={(e) => setTools({ ...tools, headline: e.target.value })}
                onBlur={() => handleBlur("tools", tools)}
              />
            </div>
            <div>
              <label className={labelCls}>Undertekst</label>
              <input
                className={inputCls}
                value={tools.tagline}
                onChange={(e) => setTools({ ...tools, tagline: e.target.value })}
                onBlur={() => handleBlur("tools", tools)}
              />
            </div>
            {tools.services.map((service, i) => (
              <div key={i} className="border-l-2 border-border/30 pl-4">
                <label className={labelCls}>Service {i + 1}: Titel</label>
                <input
                  className={inputCls}
                  value={service.title}
                  onChange={(e) => {
                    const newServices = [...tools.services];
                    newServices[i] = { ...service, title: e.target.value };
                    setTools({ ...tools, services: newServices });
                  }}
                  onBlur={() => handleBlur("tools", tools)}
                />
                <label className={`${labelCls} mt-4`}>Service {i + 1}: Beskrivelse</label>
                <textarea
                  className={textareaCls}
                  rows={2}
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...tools.services];
                    newServices[i] = { ...service, description: e.target.value };
                    setTools({ ...tools, services: newServices });
                  }}
                  onBlur={() => handleBlur("tools", tools)}
                />
                <label className={`${labelCls} mt-4`}>Service {i + 1}: Tag</label>
                <input
                  className={inputCls}
                  value={service.tag}
                  onChange={(e) => {
                    const newServices = [...tools.services];
                    newServices[i] = { ...service, tag: e.target.value };
                    setTools({ ...tools, services: newServices });
                  }}
                  onBlur={() => handleBlur("tools", tools)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisory Section */}
      <div>
        <button
          onClick={() => toggleSection("advisory")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.advisory ? "▼" : "▶"}</span>
          Rådgivningen
        </button>

        {expanded.advisory && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <input
                className={inputCls}
                value={advisory.headline}
                onChange={(e) => setAdvisory({ ...advisory, headline: e.target.value })}
                onBlur={() => handleBlur("advisory", advisory)}
              />
            </div>
            {advisory.paragraphs.map((p, i) => (
              <div key={i}>
                <label className={labelCls}>Afsnit {i + 1}</label>
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const newParagraphs = [...advisory.paragraphs];
                    newParagraphs[i] = e.target.value;
                    setAdvisory({ ...advisory, paragraphs: newParagraphs });
                  }}
                  onBlur={() => handleBlur("advisory", advisory)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Section */}
      <div>
        <button
          onClick={() => toggleSection("conversation")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.conversation ? "▼" : "▶"}</span>
          Samtalen
        </button>

        {expanded.conversation && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <input
                className={inputCls}
                value={conversation.headline}
                onChange={(e) => setConversation({ ...conversation, headline: e.target.value })}
                onBlur={() => handleBlur("conversation", conversation)}
              />
            </div>
            <div>
              <label className={labelCls}>Undertekst</label>
              <input
                className={inputCls}
                value={conversation.tagline}
                onChange={(e) => setConversation({ ...conversation, tagline: e.target.value })}
                onBlur={() => handleBlur("conversation", conversation)}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                className={inputCls}
                value={conversation.email}
                onChange={(e) => setConversation({ ...conversation, email: e.target.value })}
                onBlur={() => handleBlur("conversation", conversation)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div>
        <button
          onClick={() => toggleSection("pricing")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.pricing ? "▼" : "▶"}</span>
          Priser
        </button>

        {expanded.pricing && pricing && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Overskrift</label>
              <input
                className={inputCls}
                value={pricing.headline}
                onChange={(e) => setPricing({ ...pricing, headline: e.target.value })}
                onBlur={() => handleBlur("pricing", pricing)}
              />
            </div>
            <div>
              <label className={labelCls}>Undertekst</label>
              <input
                className={inputCls}
                value={pricing.tagline}
                onChange={(e) => setPricing({ ...pricing, tagline: e.target.value })}
                onBlur={() => handleBlur("pricing", pricing)}
              />
            </div>
            {pricing.items.map((item, i) => (
              <div key={i} className="border-l-2 border-border/30 pl-4">
                <label className={labelCls}>Prispunkt {i + 1}: Titel</label>
                <input
                  className={inputCls}
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...pricing.items];
                    newItems[i] = { ...item, title: e.target.value };
                    setPricing({ ...pricing, items: newItems });
                  }}
                  onBlur={() => handleBlur("pricing", pricing)}
                />
                <label className={`${labelCls} mt-4`}>Prispunkt {i + 1}: Beskrivelse</label>
                <textarea
                  className={textareaCls}
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...pricing.items];
                    newItems[i] = { ...item, description: e.target.value };
                    setPricing({ ...pricing, items: newItems });
                  }}
                  onBlur={() => handleBlur("pricing", pricing)}
                />
                <label className={`${labelCls} mt-4`}>Prispunkt {i + 1}: Pris</label>
                <input
                  className={inputCls}
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...pricing.items];
                    newItems[i] = { ...item, price: e.target.value };
                    setPricing({ ...pricing, items: newItems });
                  }}
                  onBlur={() => handleBlur("pricing", pricing)}
                />
                {item.tag && (
                  <>
                    <label className={`${labelCls} mt-4`}>Prispunkt {i + 1}: Tag</label>
                    <input
                      className={inputCls}
                      value={item.tag}
                      onChange={(e) => {
                        const newItems = [...pricing.items];
                        newItems[i] = { ...item, tag: e.target.value };
                        setPricing({ ...pricing, items: newItems });
                      }}
                      onBlur={() => handleBlur("pricing", pricing)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTab;
