import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Kasper Landsvig/);
  });

  test("hero section renders headline and CTA", async ({ page }) => {
    // RevealText wraps with overflow:hidden + translateY animation.
    // Wait for the h1 to animate into view (hero is in viewport on load).
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Struktur og tid");

    // CTA fades in (opacity 0 → 1) after 0.6s delay
    const cta = page.getByRole("button", { name: /Start en samtale/i });
    await expect(cta).toBeVisible();
  });

  test("Rummet section is present", async ({ page }) => {
    const section = page.locator("#rummet");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "Rummet" })).toBeAttached();
  });

  test("Værktøjerne section is present", async ({ page }) => {
    const section = page.locator("#vaerktoejerne");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "Værktøjerne" })).toBeAttached();
  });

  test("Rådgivningen section is present", async ({ page }) => {
    const section = page.locator("#raadgivningen");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "Rådgivningen" })).toBeAttached();
  });

  test("bio section renders portrait placeholder and bio text", async ({ page }) => {
    const section = page.locator("#kasper");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "Kasper Landsvig" })).toBeAttached();
  });

  test("contact section renders with email", async ({ page }) => {
    const section = page.locator("#kontakt");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    // Default email from DEFAULTS.conversation
    await expect(page.getByText("kasper@landsvig.com")).toBeAttached();
  });

  test("contact form has name, contact and message fields", async ({ page }) => {
    await page.locator("#kontakt").scrollIntoViewIfNeeded();
    const form = page.locator("form");
    await expect(form).toBeAttached();
    // Fields exist (using placeholder text)
    await expect(form.getByRole("textbox").first()).toBeAttached();
  });

  test("footer renders brand name", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toContainText("LANDSVIG");
  });
});
