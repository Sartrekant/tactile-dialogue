import { useState, useRef } from "react";
import type { SiteContent } from "@/lib/content-types";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-2";

const sectionHeadingCls = "font-serif text-xl text-foreground mb-6";

export interface AktiverTabProps {
  content: SiteContent;
  onSave: (section: string, data: unknown) => void;
}

const AssetUploader = ({
  label,
  hint,
  currentUrl,
  blobName,
  section,
  sectionData,
  field,
  onSave,
}: {
  label: string;
  hint: string;
  currentUrl: string;
  blobName: string;
  section: string;
  sectionData: Record<string, unknown>;
  field: string;
  onSave: (section: string, data: unknown) => void;
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
      const { url: newUrl } = (await res.json()) as { url: string };
      setUrl(newUrl);

      if (field && section !== "__assets") {
        onSave(section, { ...sectionData, [field]: newUrl });
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

const AktiverTab = ({ content, onSave }: AktiverTabProps) => {
  return (
    <div className="max-w-lg">
      <h2 className={sectionHeadingCls}>Aktiver</h2>
      <div className="space-y-10">
        <AssetUploader
          label="Portræt"
          hint="Bruges i 'Om mig'-sektionen. Anbefalet: 3:4 aspect ratio."
          currentUrl={content.overview.portraitUrl}
          blobName="portrait.webp"
          section="overview"
          sectionData={{ ...content.overview }}
          field="portraitUrl"
          onSave={onSave}
        />
      </div>
    </div>
  );
};

export default AktiverTab;
