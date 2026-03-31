import { put, list } from "@vercel/blob";
import { DEFAULTS } from "../src/lib/content-types";
import type { SiteContent } from "../src/lib/content-types";

const BLOB_NAME = "content.json";

export async function readContent(): Promise<SiteContent> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME, limit: 1 });
    if (blobs.length === 0) return structuredClone(DEFAULTS);
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return structuredClone(DEFAULTS);
    const data = await res.json();
    // Deep merge with defaults so new fields added later are always present
    return deepMerge(structuredClone(DEFAULTS), data) as SiteContent;
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(content), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

// Shallow-deep merge: objects are merged, arrays/primitives are replaced
function deepMerge(target: unknown, source: unknown): unknown {
  if (
    source !== null &&
    typeof source === "object" &&
    !Array.isArray(source) &&
    target !== null &&
    typeof target === "object" &&
    !Array.isArray(target)
  ) {
    const result = { ...(target as Record<string, unknown>) };
    for (const key of Object.keys(source as Record<string, unknown>)) {
      result[key] = deepMerge(
        (target as Record<string, unknown>)[key],
        (source as Record<string, unknown>)[key]
      );
    }
    return result;
  }
  return source !== undefined ? source : target;
}
