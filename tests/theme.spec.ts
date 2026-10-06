import { test, expect } from "@playwright/test";
import { gotoExistingPage, waitForHydration } from "./helpers";

test.describe("Theme toggle", () => {
  test("dark mode button is present and has aria-pressed", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    const button = page.getByRole("button", { name: /Switch to (dark|light) version/ });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-pressed");
  });

  test("clicking the theme toggle switches from light to dark", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("darkMode", "disabled"));
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    const html = page.locator("html");
    const button = page.getByRole("button", { name: "Switch to dark version" });

    await expect(html).toHaveClass(/\blight\b/);
    await button.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(page.getByRole("button", { name: "Switch to light version" })).toHaveAttribute("aria-pressed", "true");
  });

  test("theme preference is stored in localStorage", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("darkMode", "disabled"));
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    await page.getByRole("button", { name: "Switch to dark version" }).click();

    const darkMode = await page.evaluate(() => localStorage.getItem("darkMode"));
    expect(darkMode).toBe("enabled");
  });

  test("stored dark mode preference is respected on reload", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("darkMode", "enabled"));
    await gotoExistingPage(page, "/en/");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("stored light mode preference is respected on reload", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("darkMode", "disabled"));
    await gotoExistingPage(page, "/en/");

    await expect(page.locator("html")).toHaveClass(/\blight\b/);
  });
});
