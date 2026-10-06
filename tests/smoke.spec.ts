import { test, expect } from "@playwright/test";
import { gotoExistingPage } from "./helpers";

const routes = [
  { path: "/en/", description: "English homepage", language: "en" as const },
  { path: "/fi/", description: "Finnish homepage", language: "fi" as const },
  { path: "/en/wcag/perceivable/text-alternatives/", description: "WCAG example content (EN)", language: "en" as const },
  { path: "/en/search/", description: "Search page (EN)", language: "en" as const },
  { path: "/fi/haku/", description: "Search page (FI)", language: "fi" as const },
];

for (const { path, description, language } of routes) {
  test(`loads ${description} (${path})`, async ({ page }) => {
    await gotoExistingPage(page, path, { language });
    await expect(page.getByRole("main")).toBeVisible();
  });
}

test("unknown route shows 404 page", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("shared social image metadata uses the A11ying brand image", async ({ page }) => {
  await gotoExistingPage(page, "/en/");

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://wcag.a11y.ing/social-media-share.jpg");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute("content", "image/jpeg");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", "A11ying with Sanna");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "https://wcag.a11y.ing/social-media-share.jpg");
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", "A11ying with Sanna");
});

test("English footer links to the renewed accessibility blog and Testing Lab", async ({ page }) => {
  await gotoExistingPage(page, "/en/");
  const footer = page.locator("footer");

  await expect(footer.getByRole("link", { name: "Accessibility blog" })).toHaveAttribute("href", "https://sanna.a11y.ing/blog/accessibility/");
  await expect(footer.getByRole("link", { name: "Accessibility Testing Lab" })).toHaveAttribute("href", "https://testing.a11y.ing/");
});

test("Finnish footer identifies the Testing Lab as English-language content", async ({ page }) => {
  await gotoExistingPage(page, "/fi/", { language: "fi" });
  const footer = page.locator("footer");
  const testingLabLink = footer.getByRole("link", { name: "Accessibility Testing Lab" });

  await expect(footer.getByRole("link", { name: "Saavutettavuusblogi" })).toHaveAttribute("href", "https://sanna.a11y.ing/blog/accessibility/");
  await expect(testingLabLink).toHaveAttribute("href", "https://testing.a11y.ing/");
  await expect(testingLabLink).toHaveAttribute("hreflang", "en");
  await expect(testingLabLink.locator('[lang="en"]')).toHaveText("Accessibility Testing Lab");
  await expect(footer.getByText("(englanniksi)", { exact: true })).toBeVisible();
});
