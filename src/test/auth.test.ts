import { describe, it, expect } from "vitest";
import { createToken, verifyToken } from "../../api/_auth";

const SECRET = "test-secret-key-32-chars-minimum!";

describe("createToken / verifyToken", () => {
  it("creates a token that verifies successfully", async () => {
    const token = await createToken(SECRET);
    expect(token).toContain(".");
    await expect(verifyToken(token, SECRET)).resolves.toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createToken(SECRET);
    await expect(verifyToken(token, "wrong-secret")).resolves.toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await createToken(SECRET);
    const tampered = token.slice(0, -4) + "AAAA";
    await expect(verifyToken(tampered, SECRET)).resolves.toBe(false);
  });

  it("rejects a token with no dot separator", async () => {
    await expect(verifyToken("nodot", SECRET)).resolves.toBe(false);
  });

  it("rejects an expired token", async () => {
    // Forge a token with a timestamp 25 hours in the past
    const oldTs = (Date.now() - 25 * 60 * 60 * 1000).toString();
    // Sign it properly so signature is valid — but timestamp is stale
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(oldTs));
    const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    const expiredToken = `${oldTs}.${b64}`;
    await expect(verifyToken(expiredToken, SECRET)).resolves.toBe(false);
  });
});
