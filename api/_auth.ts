const COOKIE_NAME = "admin_token";
const MAX_AGE_MS = 86400_000; // 24 hours

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function createToken(secret: string): Promise<string> {
  const ts = Date.now().toString();
  const sig = await hmacSign(ts, secret);
  return `${ts}.${sig}`;
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (Date.now() - parseInt(ts, 10) > MAX_AGE_MS) return false;
  const expected = await hmacSign(ts, secret);
  return expected === sig;
}

export function cookieHeader(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_MS / 1000}; Path=/`;
}

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;
}

export function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[1] : null;
}

export async function isAuthenticated(req: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const token = getTokenFromRequest(req);
  if (!token) return false;
  return verifyToken(token, secret);
}

export function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
