import { readContent, writeContent } from "../_content";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { section, data } = await req.json();

  if (!section || data === undefined) {
    return new Response(
      JSON.stringify({ error: "section and data required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const content = await readContent();

  // Patch the specific section
  (content as Record<string, unknown>)[section] = data;

  await writeContent(content);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
