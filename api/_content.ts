import { DEFAULTS } from "../src/lib/content-types.js";
import type { SiteContent } from "../src/lib/content-types.js";

const BLOB_NAME = "content.json";

// Cached blob URL — avoids paying the blobList() cost on every request within
// the same function instance (cold start pays once, warm calls reuse the URL).
let cachedBlobUrl: string | null = null;

function blobBase(): string {
  return process.env.VERCEL_BLOB_API_URL ?? "https://blob.vercel-storage.com";
}

function blobToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN ?? "";
}

async function blobList(prefix: string): Promise<Array<{ url: string }>> {
  const token = blobToken();
  if (!token) return [];
  const res = await fetch(
    `${blobBase()}/?prefix=${encodeURIComponent(prefix)}&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { blobs?: Array<{ url: string }> };
  return data.blobs ?? [];
}

async function blobPut(pathname: string, body: string | Blob, contentType: string): Promise<{ url: string }> {
  const token = blobToken();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  const res = await fetch(`${blobBase()}/${pathname}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": contentType,
      "x-add-random-suffix": "0",
    },
    // body cast needed: File/Blob/string all valid fetch bodies but TS types vary across runtimes
    body: body as BodyInit,
  });
  if (!res.ok) throw new Error(`Blob write failed: ${res.status}`);
  return (await res.json()) as { url: string };
}

export async function readContent(): Promise<SiteContent> {
  if (!blobToken()) return structuredClone(DEFAULTS);
  try {
    // Use the cached URL when available; only pay the blobList cost once per
    // cold start. If the cached URL returns a non-OK response, clear it and
    // fall through to re-list so a re-uploaded blob is found.
    if (!cachedBlobUrl) {
      const blobs = await blobList(BLOB_NAME);
      if (blobs.length === 0) return structuredClone(DEFAULTS);
      cachedBlobUrl = blobs[0].url;
    }
    const res = await fetch(cachedBlobUrl, { cache: "no-cache" });
    if (!res.ok) {
      // Stale cached URL — clear it and retry with a fresh list next call.
      cachedBlobUrl = null;
      return structuredClone(DEFAULTS);
    }
    const data = (await res.json()) as unknown;
    return deepMerge(structuredClone(DEFAULTS), data) as SiteContent;
  } catch {
    cachedBlobUrl = null;
    return structuredClone(DEFAULTS);
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await blobPut(BLOB_NAME, JSON.stringify(content), "application/json");
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
