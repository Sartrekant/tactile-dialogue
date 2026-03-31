import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { X, Send } from "lucide-react";
import { EASING } from "./RevealText";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({ api: "/api/stream" });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASING }}
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASING }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="font-serif text-base text-foreground">
                  Start en samtale
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                  LANDSVIG AI
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center text-foreground/40 transition-colors duration-300 hover:text-foreground"
                aria-label="Luk"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="max-w-[240px] text-center font-mono text-[11px] leading-relaxed tracking-wide text-foreground/40">
                    Hvad kan vi hjælpe dig med? Spørg om tilbud, fakturaer, telefon­agenten — eller hvad du ellers har på hjertet.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-sm px-4 py-3 font-mono text-[12px] leading-relaxed tracking-wide ${
                        m.role === "user"
                          ? "bg-foreground text-background"
                          : "border border-border bg-background text-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-sm border border-border bg-background px-4 py-3 font-mono text-[12px] leading-relaxed tracking-wide text-foreground/50">
                      Noget gik galt. Prøv igen.
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block h-1 w-1 rounded-full bg-foreground/40"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border px-6 py-4">
              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Skriv her…"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as React.FormEvent);
                    }
                  }}
                  className="flex-1 resize-none rounded-sm border border-border bg-background px-4 py-3 font-mono text-[12px] leading-relaxed tracking-wide text-foreground placeholder:text-foreground/30 outline-none transition-colors duration-700 focus:border-foreground/60"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-foreground bg-foreground text-background transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-30 disabled:translate-y-0"
                  aria-label="Send"
                >
                  <Send size={13} />
                </button>
              </form>
              <p className="mt-2 font-mono text-[10px] tracking-wide text-foreground/25">
                Enter sender · Shift+Enter ny linje
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;
