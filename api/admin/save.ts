import { writeContent } from "../_content.js";
import { isAuthenticated, unauthorized } from "../_auth.js";
import type { SiteContent } from "../../src/lib/content-types.js";

export const config = { runtime: "edge" };

const VALID_SECTION_KEYS = new Set<keyof SiteContent>([
  "hero", "kasper", "work", "metoden", "journal", "contact", "nav", "settings", "ressourcer",
]);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!(await isAuthenticated(req))) return unauthorized();

  const body = (await req.json()) as { content?: unknown };

  if (!body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
    return new Response(
      JSON.stringify({ error: "Manglende felt: content (fuldt SiteContent-objekt påkrævet)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const incoming = body.content as Record<string, unknown>;

  // Validate that all expected top-level section keys are present.
  for (const key of VALID_SECTION_KEYS) {
    if (!(key in incoming)) {
      return new Response(
        JSON.stringify({ error: `Manglende sektion i content: ${key}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // The client sends the full in-memory content snapshot — write it directly.
  // This eliminates the read-before-write (saves one blobList + one fetch per save).
  // The cast is safe: we've validated all required keys above.
  await writeContent(incoming as SiteContent);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
