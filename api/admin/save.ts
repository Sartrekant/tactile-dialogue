import { readContent, writeContent } from "../_content.js";
import { isAuthenticated, unauthorized } from "../_auth.js";


export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!(await isAuthenticated(req))) return unauthorized();

  const VALID_SECTIONS = new Set([
    "hero", "kasper", "work", "metoden", "journal", "contact", "nav", "settings",
  ]);

  const { section, data } = await req.json();

  if (!section || data === undefined) {
    return new Response(
      JSON.stringify({ error: "section and data required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!VALID_SECTIONS.has(section)) {
    return new Response(
      JSON.stringify({ error: "Invalid section" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const content = await readContent();

  // Patch the specific section
  (content as unknown as Record<string, unknown>)[section] = data;

  await writeContent(content);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
