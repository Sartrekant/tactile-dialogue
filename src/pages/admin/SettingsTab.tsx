import { useState, useRef, useContext } from "react";
import type { SiteContent, NavStyle, NavLink } from "@/lib/content-types";

const inputCls =
  "w-full border-b border-border bg-transparent pb-2 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60";

const textareaCls =
  "w-full border border-border bg-transparent rounded-sm px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/20 focus:border-foreground/60 resize-none leading-relaxed";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6 mt-8 first:mt-0";

const collapsibleBtnCls =
  "flex w-full items-center gap-2 font-serif text-lg text-foreground py-4 px-0 border-b border-border/50 hover:bg-foreground/2 transition-colors";

const NAV_STYLES: NavStyle[] = ["topbar", "floating", "dots", "siderail", "overlay"];

interface SettingsTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

type ExpandedSections = Record<string, boolean>;

const SettingsTab = ({ content, onSave }: SettingsTabProps) => {
  const [expanded, setExpanded] = useState<ExpandedSections>({
    assets: true,
    navigation: false,
    settings: false,
  });

  // Local state for each section
  const [navStyle, setNavStyle] = useState(content.nav.style);
  const [navLinks, setNavLinks] = useState(content.nav.links);
  const [availability, setAvailability] = useState(content.settings.availability);
  const [seoTitle, setSeoTitle] = useState(content.settings.seoTitle);
  const [seoDescription, setSeoDescription] = useState(content.settings.seoDescription);
  const [chatPrompt, setChatPrompt] = useState(content.settings.chatPrompt);
  const [social, setSocial] = useState(content.settings.social);
  const [portraitUrl, setPortraitUrl] = useState(content.overview.portraitUrl);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBlur = (section: string, data: unknown) => {
    onSave(section, data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", "portrait");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setPortraitUrl(url);
        handleBlur("overview", { ...content.overview, portraitUrl: url });
        setUploadStatus("success");
        setTimeout(() => setUploadStatus("idle"), 3000);
      } else {
        setUploadStatus("error");
        setTimeout(() => setUploadStatus("idle"), 3000);
      }
    } catch {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-foreground/5");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-foreground/5");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-foreground/5");
    const file = e.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileUpload({ target: fileInputRef.current } as any);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-foreground mb-8">Indstillinger</h1>

      {/* Assets Section */}
      <div>
        <button
          onClick={() => toggleSection("assets")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.assets ? "▼" : "▶"}</span>
          Aktiver
        </button>

        {expanded.assets && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Profilbillede</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-border/50 rounded-sm p-6 text-center transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-[12px] text-foreground/60 hover:text-foreground transition-colors"
                >
                  {uploadStatus === "uploading" && "Uploader..."}
                  {uploadStatus === "success" && "✓ Uploadet"}
                  {uploadStatus === "error" && "✗ Fejl"}
                  {uploadStatus === "idle" && "Klik for at vælge eller træk billede her"}
                </button>
              </div>
              {portraitUrl && (
                <div className="mt-4">
                  <p className="font-mono text-[10px] text-foreground/40 mb-2">Nuværende billede:</p>
                  <img
                    src={portraitUrl}
                    alt="Portrait"
                    className="w-24 h-24 object-cover rounded-sm"
                  />
                  <p className="font-mono text-[10px] text-foreground/60 mt-2 break-all">{portraitUrl}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div>
        <button
          onClick={() => toggleSection("navigation")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.navigation ? "▼" : "▶"}</span>
          Navigation
        </button>

        {expanded.navigation && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Navigationsstil</label>
              <div className="grid grid-cols-2 gap-2">
                {NAV_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setNavStyle(style);
                      handleBlur("nav", { style, links: navLinks });
                    }}
                    className={`border rounded-sm px-3 py-2 font-mono text-[11px] transition-colors ${
                      navStyle === style
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/60"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Navigationlinks</label>
              {navLinks.map((link, i) => (
                <div key={i} className="space-y-2 mb-4 pb-4 border-b border-border/30">
                  <input
                    className={inputCls}
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[i] = { ...link, label: e.target.value };
                      setNavLinks(newLinks);
                    }}
                    onBlur={() => handleBlur("nav", { style: navStyle, links: navLinks })}
                  />
                  <input
                    className={inputCls}
                    placeholder="Target (f.eks. #rummet eller /projekter)"
                    value={link.to}
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[i] = { ...link, to: e.target.value };
                      setNavLinks(newLinks);
                    }}
                    onBlur={() => handleBlur("nav", { style: navStyle, links: navLinks })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div>
        <button
          onClick={() => toggleSection("settings")}
          className={collapsibleBtnCls}
        >
          <span>{expanded.settings ? "▼" : "▶"}</span>
          Generelt
        </button>

        {expanded.settings && (
          <div className="space-y-6 max-w-lg pb-8 pt-4">
            <div>
              <label className={labelCls}>Tilgængelighed</label>
              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value as "open" | "busy");
                  handleBlur("settings", {
                    ...content.settings,
                    availability: e.target.value as "open" | "busy",
                  });
                }}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="open">Åben</option>
                <option value="busy">Optaget</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>SEO Titel</label>
              <input
                className={inputCls}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    seoTitle,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>SEO Beskrivelse</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    seoDescription,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>AI Chat Prompt</label>
              <textarea
                className={textareaCls}
                rows={8}
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    chatPrompt,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>GitHub</label>
              <input
                className={inputCls}
                placeholder="https://github.com/..."
                value={social.github}
                onChange={(e) => {
                  const newSocial = { ...social, github: e.target.value };
                  setSocial(newSocial);
                }}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    social,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>LinkedIn</label>
              <input
                className={inputCls}
                placeholder="https://linkedin.com/in/..."
                value={social.linkedin}
                onChange={(e) => {
                  const newSocial = { ...social, linkedin: e.target.value };
                  setSocial(newSocial);
                }}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    social,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>Twitter</label>
              <input
                className={inputCls}
                placeholder="https://twitter.com/..."
                value={social.twitter}
                onChange={(e) => {
                  const newSocial = { ...social, twitter: e.target.value };
                  setSocial(newSocial);
                }}
                onBlur={() =>
                  handleBlur("settings", {
                    ...content.settings,
                    social,
                  })
                }
              />
            </div>

            <div>
              <label className={labelCls}>Eksport indhold</label>
              <button
                onClick={() => {
                  const json = JSON.stringify(content, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "indhold.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="font-mono text-[11px] uppercase tracking-[0.15em] border border-foreground/30 hover:border-foreground/60 px-3 py-2 rounded-sm transition-colors"
              >
                Download JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
