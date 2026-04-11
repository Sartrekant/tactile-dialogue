import { test, expect } from "@playwright/test";

test.describe("Additional pages", () => {
  test("/projekter renders without crashing", async ({ page }) => {
    await page.goto("/projekter");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("main, section").first()).toBeAttached();
  });

  test("/vaerktoejer renders placeholder with title", async ({ page }) => {
    await page.goto("/vaerktoejer");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByText(/Værktøjer/i)).toBeAttached();
  });

  test("/faq renders placeholder with title", async ({ page }) => {
    await page.goto("/faq");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByText(/FAQ/i)).toBeAttached();
  });

  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/dette-findes-ikke");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText("Siden findes ikke")).toBeVisible();
  });

  test("404 page has a link back to the frontpage", async ({ page }) => {
    await page.goto("/dette-findes-ikke");
    await page.waitForLoadState("domcontentloaded");
    const homeLink = page.getByRole("link", { name: /Tilbage til forsiden/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL("/");
  });
});
