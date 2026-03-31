import { isAuthenticated, unauthorized } from "../_auth.js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!(await isAuthenticated(req))) return unauthorized();

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
