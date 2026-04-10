import { describe, it, expect, beforeEach, vi } from "vitest";
import { createToken } from "../../api/_auth";

const SECRET = "test-secret-32-bytes-long-enough";
const PASSWORD = "hunter2";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function authedRequest(
  url: string,
  init: RequestInit = {}
): Promise<Request> {
  const token = await createToken(SECRET);
  const headers = new Headers(init.headers);
  headers.set("cookie", `admin_token=${token}`);
  return new Request(url, { ...init, headers });
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
    // The new API accepts a full SiteContent snapshot in the `content` field.
    const fullContent = {
      hero: { headline: "Test", tagline: "Test tagline" },
      kasper: { bio: ["a", "b", "c"], details: [], portraitUrl: "" },
      work: [],
      metoden: { headline: "M", paragraphs: ["p1", "p2"], backgroundUrl: "" },
      journal: [],
      contact: { headline: "C", tagline: "CT", email: "e@e.com", backgroundUrl: "" },
      nav: { style: "topbar", links: [] },
      settings: { availability: "open", seoTitle: "T", seoDescription: "D", chatPrompt: "P", social: { github: "", linkedin: "", twitter: "" } },
      ressourcer: [],
    };
    const req = await authedRequest("http://localhost/api/admin/save", {
      method: "POST",
      body: JSON.stringify({ content: fullContent }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    expect(writeContent).toHaveBeenCalled();
  });

  it("returns 400 when content field is missing", async () => {
    const req = await authedRequest("http://localhost/api/admin/save", {
      method: "POST",
      body: JSON.stringify({ section: "hero", data: { title: "New" } }),
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
    vi.resetModules();
    vi.mock("@vercel/blob", () => ({
      put: vi.fn().mockResolvedValue({ url: "https://blob.example/assets/photo.webp" }),
    }));
    handler = (await import("../../api/admin/upload")).default;
  });

  it("returns 401 without a valid session cookie", async () => {
    const formData = new FormData();
    formData.append("file", new File(["data"], "photo.webp", { type: "image/webp" }));
    formData.append("name", "photo.webp");
    const req = unauthRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const res = await handler(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with blob URL on valid upload", async () => {
    const formData = new FormData();
    formData.append("file", new File(["data"], "photo.webp", { type: "image/webp" }));
    formData.append("name", "photo.webp");
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://blob.example/assets/photo.webp");
  });

  it("returns 400 when file is missing", async () => {
    const formData = new FormData();
    formData.append("name", "photo.webp");
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
  });

  it("sanitizes filename — strips special characters", async () => {
    const { put } = await import("@vercel/blob");
    const formData = new FormData();
    formData.append("file", new File(["data"], "my file!@#.webp", { type: "image/webp" }));
    formData.append("name", "my file!@#.webp");
    const req = await authedRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
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
