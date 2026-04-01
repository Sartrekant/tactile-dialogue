import { useState, useEffect } from "react";
import { DEFAULTS } from "@/lib/content-types";
import type { SiteContent } from "@/lib/content-types";

interface UseContentResult {
  content: SiteContent;
  loading: boolean;
  error: boolean;
}

export function useContent(): UseContentResult {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(false);

    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: SiteContent) => {
        if (!cancelled) setContent(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading, error };
}
