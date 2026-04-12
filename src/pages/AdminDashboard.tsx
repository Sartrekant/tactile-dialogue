import React, { useState, useRef, useEffect, useContext, createContext, useMemo, useCallback, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import type { SiteContent } from "@/lib/content-types";

// ─── Lazy tab imports ─────────────────────────────────────────────────────────

const ContentTab = React.lazy(() => import("./admin/ContentTab"));
const SettingsTab = React.lazy(() => import("./admin/SettingsTab"));

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

// ─── Autosave: single debounced serialized save ───────────────────────────────
//
// Instead of 8 independent per-section timers (which could race and cause data
// loss), we maintain a single content ref that merges all section patches.
// A 2-second debounce fires a single POST with the full SiteContent snapshot.
// An in-flight lock ensures concurrent saves never race: if a save is already
// running when the debounce fires, a queued flag is set and the save retries
// once the current one resolves.

function useDebouncedSave(
  contentRef: React.MutableRefObject<SiteContent>,
  ctx: SaveStatusCtx
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  // true while a fetch is in-flight
  const inFlightRef = useRef(false);
  // true if a save was requested while one was already in-flight
  const queuedRef = useRef(false);

  const executeSave = useCallback(async () => {
    if (inFlightRef.current) {
      // Another save is running — queue this one.
      queuedRef.current = true;
      return;
    }
    inFlightRef.current = true;
    ctx.notifySaving();
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send all sections as a batch — compatible with the { sections } API shape.
        body: JSON.stringify({ sections: contentRef.current }),
      });
      if (res.ok) {
        ctx.notifySaved();
      } else {
        ctx.notifyError();
      }
    } catch {
      ctx.notifyError();
    } finally {
      inFlightRef.current = false;
      if (queuedRef.current) {
        queuedRef.current = false;
        // Fire immediately — the debounce already waited.
        void executeSave();
      }
    }
  // executeSave is stable: refs never change identity, ctx is from useMemo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  const scheduleSave = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void executeSave(), 2000);
  }, [executeSave]);

  // Clean up on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return scheduleSave;
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────

type Tab = "indhold" | "indstillinger";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "indhold", label: "Indhold" },
  { id: "indstillinger", label: "Indstillinger" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AdminDashboard = () => {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>("indhold");
  const [authChecked, setAuthChecked] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  // Mutable ref holding the latest merged content state.
  // Tab components call onSave(section, data) which patches this ref, then
  // the debounced save sends the whole object.
  const contentRef = useRef<SiteContent>(content);
  // Keep ref in sync when useContent resolves.
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

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

  const scheduleSave = useDebouncedSave(contentRef, ctxValue);

  // Callback passed to every tab. Merges the section patch into the content
  // ref and schedules a debounced save of the full snapshot.
  const handleSave = useCallback((section: string, data: unknown) => {
    contentRef.current = {
      ...contentRef.current,
      [section]: data,
    };
    scheduleSave();
  }, [scheduleSave]);

  if (!authChecked) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-mono text-[11px] text-foreground/30">Checker adgang...</p>
    </div>
  );

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

          {/* Main content — render immediately with DEFAULTS, update when content loads */}
          <main className="flex-1 ml-48 overflow-y-auto px-10 py-10 min-h-[calc(100vh-57px)]">
            <Suspense fallback={<div />}>
              {activeTab === "indhold" && <ContentTab content={content} onSave={handleSave} />}
              {activeTab === "indstillinger" && <SettingsTab content={content} onSave={handleSave} />}
            </Suspense>
          </main>
        </div>
      </div>
    </SaveStatusContext.Provider>
  );
};

export default AdminDashboard;
