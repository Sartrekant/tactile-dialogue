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

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Storage ikke konfigureret" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Sanitize name — allow only alphanumeric, hyphens, underscores, dots
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
  const path = `assets/${safeName}`;
  const blobBase = process.env.VERCEL_BLOB_API_URL ?? "https://blob.vercel-storage.com";

  const res = await fetch(`${blobBase}/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": file.type || "application/octet-stream",
      "x-add-random-suffix": "0",
    },
    // File is a Blob — valid fetch body in both Edge and Node.js runtimes
    body: file as unknown as BodyInit,
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: "Upload fejlede" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const { url } = (await res.json()) as { url: string };

  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
