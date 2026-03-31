import { useState, useEffect } from "react";
import { DEFAULTS } from "@/lib/content-types";
import type { SiteContent } from "@/lib/content-types";

interface UseContentResult {
  content: SiteContent;
  loading: boolean;
}

export function useContent(): UseContentResult {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteContent | null) => {
        if (!cancelled && data) setContent(data);
      })
      .catch(() => {
        // Silently fall back to defaults
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading };
}
