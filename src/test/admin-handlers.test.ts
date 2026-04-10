import { describe, it, expect, beforeEach, vi } from "vitest";
import { createToken } from "../../api/_auth";

const SECRET = "test-secret-32-bytes-long-enough";
const PASSWORD = "hunter2";

// ── Helpers ──────────────────────────────────────────────────────────────────

// Vitest's polyfilled FormData serializes to text/plain, not multipart/form-data.
// Build the multipart body manually so req.formData() in the handler parses correctly.
function makeMultipart(fields: Array<{ name: string; content: string; filename?: string; type?: string }>): { body: string; contentType: string } {
  const boundary = "----TestFormBoundary12345";
  const parts = fields.map((f) => {
    const disposition = f.filename
      ? `Content-Disposition: form-data; name="${f.name}"; filename="${f.filename}"\r\nContent-Type: ${f.type ?? "application/octet-stream"}`
      : `Content-Disposition: form-data; name="${f.name}"`;
    return `--${boundary}\r\n${disposition}\r\n\r\n${f.content}`;
  });
  return {
    body: parts.join("\r\n") + `\r\n--${boundary}--\r\n`,
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

async function authedRequest(
  url: string,
  init: RequestInit = {}
): Promise<Request> {
  const token = await createToken(SECRET);
  // Build a temp request first so the runtime can auto-set headers that depend on the
  // body type (e.g. FormData gets Content-Type: multipart/form-data; boundary=...).
  // Clone from temp rather than re-constructing with init.body so the boundary in the
  // Content-Type header and the body always match.
  const temp = new Request(url, init);
  const headers = new Headers(temp.headers);
  headers.set("cookie", `admin_token=${token}`);
  return new Request(temp, { headers });
}

function unauthRequest(url: string, init: RequestInit = {}): Request {
  return new Request(url, init);
}

// ── /api/admin/auth (login) ───────────────────────────────────────────────────

describe("POST /api/admin/auth", () => {
  let handler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.stubEnv("ADMIN_PASSWORD", PASSWORD);
    vi.stubEnv("ADMIN_SECRET", SECRET);
    // Fresh import each test to pick up env stubs
    vi.resetModules();
    handler = (await import("../../api/admin/auth")).default;
  });

  it("returns 200 + Set-Cookie on correct password", async () => {
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password: PASSWORD }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Set-Cookie")).toContain("admin_token=");
    expect(res.headers.get("Set-Cookie")).toContain("HttpOnly");
  });

  it("returns 401 on wrong password", async () => {
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password: "wrong" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 405 for non-POST", async () => {
    const req = new Request("http://localhost/api/admin/auth", { method: "GET" });
    const res = await handler(req);
    expect(res.status).toBe(405);
  });

  it("returns 500 when env vars are not configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("ADMIN_SECRET", "");
    vi.resetModules();
    const { default: h } = await import("../../api/admin/auth");
    const req = new Request("http://localhost/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password: PASSWORD }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await h(req);
    expect(res.status).toBe(500);
  });
});

// ── /api/admin/save ───────────────────────────────────────────────────────────

vi.mock("../../api/_content", () => ({
  readContent: vi.fn().mockResolvedValue({ hero: { title: "Old" } }),
  writeContent: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/admin/save", () => {
  let handler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.stubEnv("ADMIN_SECRET", SECRET);
    vi.resetModules();
    // Re-apply the mock after resetModules
    vi.mock("../../api/_content", () => ({
      readContent: vi.fn().mockResolvedValue({ hero: { title: "Old" } }),
      writeContent: vi.fn().mockResolvedValue(undefined),
    }));
    handler = (await import("../../api/admin/save")).default;
  });

  it("returns 401 without a valid session cookie", async () => {
    const req = unauthRequest("http://localhost/api/admin/save", {
      method: "POST",
      body: JSON.stringify({ section: "hero", data: { title: "New" } }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 and calls writeContent with authed request", async () => {
    const { writeContent } = await import("../../api/_content");
    const req = await authedRequest("http://localhost/api/admin/save", {
      method: "POST",
      body: JSON.stringify({ sections: { nav: { style: "topbar", links: [] } } }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    expect(writeContent).toHaveBeenCalled();
  });

  it("returns 400 when body has no recognised shape", async () => {
    const req = await authedRequest("http://localhost/api/admin/save", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
  });

  it("returns 405 for non-POST", async () => {
    const req = await authedRequest("http://localhost/api/admin/save", {
      method: "GET",
    });
    const res = await handler(req);
    expect(res.status).toBe(405);
  });
});

// ── /api/admin/upload ─────────────────────────────────────────────────────────

vi.mock("@vercel/blob", () => ({
  put: vi.fn().mockResolvedValue({ url: "https://blob.example/assets/photo.webp" }),
}));

describe("POST /api/admin/upload", () => {
  let handler: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.stubEnv("ADMIN_SECRET", SECRET);
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-token");
    vi.resetModules();
    vi.mock("@vercel/blob", () => ({
      put: vi.fn().mockResolvedValue({ url: "https://blob.example/assets/photo.webp" }),
    }));
    handler = (await import("../../api/admin/upload")).default;
  });

  it("returns 401 without a valid session cookie", async () => {
    const { body, contentType } = makeMultipart([
      { name: "file", content: "data", filename: "photo.webp", type: "image/webp" },
      { name: "name", content: "photo.webp" },
    ]);
    const req = unauthRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body,
      headers: { "Content-Type": contentType },
    });
    const res = await handler(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with blob URL on valid upload", async () => {
    const { body, contentType } = makeMultipart([
      { name: "file", content: "data", filename: "photo.webp", type: "image/webp" },
      { name: "name", content: "photo.webp" },
    ]);
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body,
      headers: { "Content-Type": contentType },
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    const resBody = await res.json();
    expect(resBody.url).toBe("https://blob.example/assets/photo.webp");
  });

  it("returns 400 when file is missing", async () => {
    const { body, contentType } = makeMultipart([
      { name: "name", content: "photo.webp" },
    ]);
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body,
      headers: { "Content-Type": contentType },
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
  });

  it("sanitizes filename — strips special characters", async () => {
    const { put } = await import("@vercel/blob");
    const { body, contentType } = makeMultipart([
      { name: "file", content: "data", filename: "my file!@#.webp", type: "image/webp" },
      { name: "name", content: "my file!@#.webp" },
    ]);
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body,
      headers: { "Content-Type": contentType },
    });
    await handler(req);
    expect(put).toHaveBeenCalledWith(
      expect.stringMatching(/^assets\/[a-zA-Z0-9._-]+$/),
      expect.anything(),
      expect.anything()
    );
  });

  it("returns 405 for non-POST", async () => {
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "GET",
    });
    const res = await handler(req);
    expect(res.status).toBe(405);
  });
});
