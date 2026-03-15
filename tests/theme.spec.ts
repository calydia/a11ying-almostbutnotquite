import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("dark mode button is present and has aria-pressed", async ({ page }) => {
    await page.goto("/en/");
    const button = page.locator("#theme-toggle-button");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-pressed");
  });

  test("clicking theme toggle adds dark class to html element", async ({ page }) => {
    await page.goto("/en/");
    const html = page.locator("html");
    const button = page.locator("#theme-toggle-button");

    const isDark = await html.evaluate((el) => el.classList.contains("dark"));
    await button.click();

    if (isDark) {
      await expect(html).not.toHaveClass(/\bdark\b/);
    } else {
      await expect(html).toHaveClass(/\bdark\b/);
    }
  });

  test("theme preference is stored in localStorage", async ({ page }) => {
    await page.goto("/en/");
    await page.locator("#theme-toggle-button").click();

    const darkMode = await page.evaluate(() => localStorage.getItem("darkMode"));
    expect(["enabled", "disabled"]).toContain(darkMode);
  });

  test("stored dark mode preference is respected on reload", async ({ page }) => {
    await page.goto("/en/");

    // Force dark mode via localStorage
    await page.evaluate(() => localStorage.setItem("darkMode", "enabled"));
    await page.reload();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("stored light mode preference is respected on reload", async ({ page }) => {
    await page.goto("/en/");

    await page.evaluate(() => localStorage.setItem("darkMode", "disabled"));
    await page.reload();

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });
});
