import { readContent, writeContent } from "../_content.js";
import { isAuthenticated, unauthorized } from "../_auth.js";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!(await isAuthenticated(req))) return unauthorized();

  const VALID_SECTIONS = new Set([
    "hero", "kasper", "work", "metoden", "journal", "contact", "nav", "settings", "ressourcer",
  ]);

  const body = await req.json() as Record<string, unknown>;
  let patches: Record<string, unknown>;

  if (typeof body.section === "string") {
    // Single-section form — used by AssetUploader after upload
    if (body.data === undefined) {
      return new Response(
        JSON.stringify({ error: "section og data er påkrævet" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!VALID_SECTIONS.has(body.section)) {
      return new Response(
        JSON.stringify({ error: "Ugyldig sektion" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    patches = { [body.section]: body.data };
  } else if (body.sections !== null && typeof body.sections === "object" && !Array.isArray(body.sections)) {
    // Batch form — used by the save coordinator to flush all dirty sections at once
    const incoming = body.sections as Record<string, unknown>;
    const invalidKey = Object.keys(incoming).find((k) => !VALID_SECTIONS.has(k));
    if (invalidKey) {
      return new Response(
        JSON.stringify({ error: `Ugyldig sektion: ${invalidKey}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    patches = incoming;
  } else {
    return new Response(
      JSON.stringify({ error: "section og data, eller sections, er påkrævet" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const content = await readContent();

  // Patch all sections in one read-modify-write; keys validated against VALID_SECTIONS above
  for (const [key, value] of Object.entries(patches)) {
    (content as unknown as Record<string, unknown>)[key] = value;
  }

  await writeContent(content);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
