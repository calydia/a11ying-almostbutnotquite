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

test("shared social image metadata uses the A11ying brand image", async ({ page }) => {
  await page.goto("/en/");

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://wcag.a11y.ing/social-media-share.jpg");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute("content", "image/jpeg");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", "A11ying with Sanna");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "https://wcag.a11y.ing/social-media-share.jpg");
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", "A11ying with Sanna");
});
