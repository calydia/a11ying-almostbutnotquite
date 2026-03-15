import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test("renders search input", async ({ page }) => {
    await page.goto("/en/search/");
    await expect(page.locator("#search-input")).toBeVisible();
  });

  test("search input has accessible label", async ({ page }) => {
    await page.goto("/en/search/");
    const input = page.locator("#search-input");
    // Label is associated via htmlFor="search-input"
    const label = page.locator('label[for="search-input"]');
    await expect(label).toBeVisible();
  });

  test("typing in search input updates the value", async ({ page }) => {
    await page.goto("/en/search/");
    const input = page.locator("#search-input");
    await input.fill("contrast");
    await expect(input).toHaveValue("contrast");
  });

  test("search returns results for a known term", async ({ page }) => {
    await page.goto("/en/search/");
    await page.locator("#search-input").fill("contrast");
    // Wait for results to appear (React async update)
    await expect(page.locator("[role='search'] li, [role='search'] a").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("search shows empty state for nonsense query", async ({ page }) => {
    await page.goto("/en/search/");
    await page.locator("#search-input").fill("zzzzzzz-no-results-xyzabc");
    // Should not show any result items
    await page.waitForTimeout(500);
    const results = page.locator("[role='search'] li");
    await expect(results).toHaveCount(0);
  });

  test("search form has role=search", async ({ page }) => {
    await page.goto("/en/search/");
    await expect(page.locator("#site-search")).toHaveAttribute("role", "search");
  });
});
