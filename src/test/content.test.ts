import { describe, it, expect, vi } from "vitest";

// Mock @vercel/blob before importing _content
vi.mock("@vercel/blob", () => ({ put: vi.fn(), list: vi.fn() }));

import { deepMerge } from "../../api/_content";

describe("deepMerge", () => {
  it("merges flat objects", () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 99, c: 3 });
    expect(result).toEqual({ a: 1, b: 99, c: 3 });
  });

  it("merges nested objects recursively", () => {
    const target = { hero: { headline: "old", tagline: "old tagline" } };
    const source = { hero: { headline: "new" } };
    expect(deepMerge(target, source)).toEqual({
      hero: { headline: "new", tagline: "old tagline" },
    });
  });

  it("replaces arrays entirely (does not merge them)", () => {
    const target = { work: [{ title: "A" }, { title: "B" }] };
    const source = { work: [{ title: "C" }] };
    expect(deepMerge(target, source)).toEqual({ work: [{ title: "C" }] });
  });

  it("keeps target keys absent from source", () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("source undefined falls back to target value", () => {
    expect(deepMerge("default", undefined)).toBe("default");
  });

  it("source primitive overrides target", () => {
    expect(deepMerge("old", "new")).toBe("new");
    expect(deepMerge(1, 42)).toBe(42);
  });

  it("preserves new schema fields added to DEFAULTS when source lacks them", () => {
    const defaults = { hero: { headline: "h", tagline: "t" }, newField: "default" };
    const stored = { hero: { headline: "stored" } };
    const result = deepMerge(defaults, stored) as typeof defaults;
    expect(result.newField).toBe("default");
    expect(result.hero.headline).toBe("stored");
    expect(result.hero.tagline).toBe("t");
  });
});
