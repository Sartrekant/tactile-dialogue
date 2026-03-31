import { createToken, cookieHeader } from "../_auth";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return new Response(
      JSON.stringify({ error: "Admin not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { password } = await req.json();

  if (password !== adminPassword) {
    return new Response(
      JSON.stringify({ error: "Forkert adgangskode" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = await createToken(adminSecret);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieHeader(token),
    },
  });
}
