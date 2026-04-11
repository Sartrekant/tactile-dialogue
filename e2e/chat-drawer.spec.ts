import { test, expect } from "@playwright/test";

test.describe("Chat Drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the CTA to animate in (opacity 0→1 with 0.6s delay + 0.8s duration)
    await expect(page.getByRole("button", { name: "Start en samtale" })).toBeVisible();
  });

  test("chat drawer is hidden on initial load", async ({ page }) => {
    // Drawer is conditionally rendered — aside element should not exist yet
    await expect(page.locator("aside")).not.toBeAttached();
  });

  test("clicking the CTA opens the chat drawer", async ({ page }) => {
    await page.getByRole("button", { name: "Start en samtale" }).click();
    // Drawer slides in as a <motion.aside>
    await expect(page.locator("aside")).toBeVisible({ timeout: 2000 });
    // Header of the drawer
    await expect(page.getByText("LANDSVIG AI")).toBeVisible();
  });

  test("chat drawer has a text input for messages", async ({ page }) => {
    await page.getByRole("button", { name: "Start en samtale" }).click();
    await expect(page.locator("aside")).toBeVisible({ timeout: 2000 });
    await expect(page.locator("aside textarea")).toBeVisible();
  });

  test("chat drawer closes when the Luk button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Start en samtale" }).click();
    await expect(page.locator("aside")).toBeVisible({ timeout: 2000 });

    await page.getByRole("button", { name: "Luk" }).click();

    await expect(page.locator("aside")).not.toBeAttached({ timeout: 2000 });
  });

  test("chat drawer closes when the backdrop is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Start en samtale" }).click();
    await expect(page.locator("aside")).toBeVisible({ timeout: 2000 });

    // Backdrop is behind the drawer — click top-left corner where aside does not cover
    await page.mouse.click(50, 50);

    await expect(page.locator("aside")).not.toBeAttached({ timeout: 2000 });
  });
});
