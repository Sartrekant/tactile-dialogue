import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("navbar is visible on load", async ({ page }) => {
    await expect(page.locator("nav")).toBeVisible();
  });

  test("navbar contains the four section links", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: "Rummet" })).toBeAttached();
    await expect(nav.getByRole("link", { name: "Værktøjerne" })).toBeAttached();
    await expect(nav.getByRole("link", { name: "Rådgivningen" })).toBeAttached();
    await expect(nav.getByRole("link", { name: "Kontakt" })).toBeAttached();
  });

  test("clicking a nav link scrolls to the target section", async ({ page }) => {
    const nav = page.locator("nav");
    await nav.getByRole("link", { name: "Rummet" }).click();

    // After clicking, #rummet should be close to the top of the viewport
    const section = page.locator("#rummet");
    await expect(section).toBeInViewport({ ratio: 0.1 });
  });

  test("clicking Kontakt scrolls to contact section", async ({ page }) => {
    const nav = page.locator("nav");
    await nav.getByRole("link", { name: "Kontakt" }).click();
    await expect(page.locator("#kontakt")).toBeInViewport({ ratio: 0.1 });
  });

  test("URL hash updates when navigating to a section", async ({ page }) => {
    await page.locator("nav").getByRole("link", { name: "Rådgivningen" }).click();
    await expect(page).toHaveURL(/#raadgivningen/);
  });
});
