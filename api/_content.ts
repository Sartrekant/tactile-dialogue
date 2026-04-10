import { list, put } from "@vercel/blob";
import { DEFAULTS } from "../src/lib/content-types.js";
import type { SiteContent } from "../src/lib/content-types.js";

const BLOB_NAME = "content.json";

export async function readContent(): Promise<SiteContent> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return structuredClone(DEFAULTS);
  try {
    const { blobs } = await list({ prefix: BLOB_NAME, limit: 1 });
    if (blobs.length === 0) return structuredClone(DEFAULTS);
    // Blob URL is public — fetch directly, bypass CDN cache to see latest writes.
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return structuredClone(DEFAULTS);
    const data = (await res.json()) as unknown;
    return deepMerge(structuredClone(DEFAULTS), data) as SiteContent;
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(content), {
    contentType: "application/json",
    access: "public",
    addRandomSuffix: false,
  });
}

// Shallow-deep merge: objects are merged, arrays/primitives are replaced
export function deepMerge(target: unknown, source: unknown): unknown {
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
