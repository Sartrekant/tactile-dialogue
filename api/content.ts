import { readContent } from "./_content.js";

const ALLOWED_ORIGINS = [
  "https://landsvig.com",
  "https://www.landsvig.com",
  "http://localhost:8080",
  "http://localhost:5173",
];

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const content = await readContent();

  return new Response(JSON.stringify(content), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=30, stale-while-revalidate=120",
      ...corsHeaders(req),
    },
  });
}

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
