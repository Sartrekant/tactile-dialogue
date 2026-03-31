import { readContent } from "./_content";
import { DEFAULTS } from "../src/lib/content-types";


const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
  "Access-Control-Allow-Origin": "*",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  // If Blob token isn't configured (local dev without env), return defaults
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(JSON.stringify(DEFAULTS), { headers: CORS_HEADERS });
  }

  const content = await readContent();
  return new Response(JSON.stringify(content), { headers: CORS_HEADERS });
}
