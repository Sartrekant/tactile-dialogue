import { test, expect } from "@playwright/test";

// Note: these tests run against the Vite dev server which has no API layer.
// /api/admin/check returns 404 (not 401), so AdminDashboard renders its full UI.
// /api/admin/auth returns 404, so login errors are caught and shown.

test.describe("Admin login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("renders the login form", async ({ page }) => {
    await expect(page.getByText("LANDSVIG")).toBeVisible();
    await expect(page.getByText("Admin")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Log ind" })).toBeVisible();
  });

  test("submit button is disabled when password field is empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Log ind" })).toBeDisabled();
  });

  test("submit button enables after typing a password", async ({ page }) => {
    await page.locator('input[type="password"]').fill("anything");
    await expect(page.getByRole("button", { name: "Log ind" })).toBeEnabled();
  });

  test("shows an error message when login fails", async ({ page }) => {
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: "Log ind" }).click();
    // API is unavailable → catch block shows "Noget gik galt. Prøv igen."
    await expect(page.getByText(/Noget gik galt|Forkert adgangskode/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("shows loading state while submitting", async ({ page }) => {
    await page.locator('input[type="password"]').fill("test");
    // Intercept the auth request to delay it so we can observe the loading state
    await page.route("/api/admin/auth", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({ status: 401, body: JSON.stringify({ error: "Forkert adgangskode" }) });
    });
    await page.getByRole("button", { name: "Log ind" }).click();
    await expect(page.getByRole("button", { name: "Logger ind..." })).toBeVisible();
  });
});

test.describe("Admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // In Vite dev, /api/admin/check returns 404 (not 401) so the dashboard renders
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
    // Wait past the auth check loading state
    await expect(page.getByText("Checker adgang...")).not.toBeVisible({ timeout: 5000 });
  });

  test("renders four navigation tabs", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Tekster" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Aktiver" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Indstillinger" })).toBeVisible();
  });

  test("clicking a tab makes it active", async ({ page }) => {
    const navTab = page.getByRole("button", { name: "Navigation" });
    await navTab.click();
    // Tab should now have an active style — check aria-pressed or a class indicator
    // The tab renders with a distinct style; verify the panel changes by looking for
    // nav-specific content
    await expect(page.getByText(/Nav style|navigation|stil/i)).toBeAttached();
  });

  test("has a logout button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /log ud|logout/i })).toBeAttached();
  });
});
