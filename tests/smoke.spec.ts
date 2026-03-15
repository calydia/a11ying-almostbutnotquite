import { test, expect } from "@playwright/test";

const routes = [
  { path: "/en/", description: "English homepage" },
  { path: "/fi/", description: "Finnish homepage" },
  { path: "/en/wcag/perceivable/text-alternatives/", description: "WCAG example content (EN)" },
  { path: "/en/search/", description: "Search page (EN)" },
  { path: "/fi/haku/", description: "Search page (FI)" },
];

for (const { path, description } of routes) {
  test(`loads ${description} (${path})`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
  });
}

test("unknown route shows 404 page", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
});
