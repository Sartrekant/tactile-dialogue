import { put } from "@vercel/blob";
import { isAuthenticated, unauthorized } from "../_auth.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!(await isAuthenticated(req))) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file || !name) {
    return new Response(
      JSON.stringify({ error: "file and name required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Sanitize name — allow only alphanumeric, hyphens, underscores, dots
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
  const path = `assets/${safeName}`;

  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  return new Response(JSON.stringify({ url: blob.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
