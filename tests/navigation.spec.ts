import { test, expect } from "@playwright/test";

test.describe("Language switcher", () => {
  test("opens language menu on button click", async ({ page }) => {
    await page.goto("/en/");
    const button = page.locator("#language-menu-button");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#lang-switcher")).toBeVisible();
  });

  test("closes language menu when clicking button again", async ({ page }) => {
    await page.goto("/en/");
    const button = page.locator("#language-menu-button");
    await button.click();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("switches from English to Finnish", async ({ page }) => {
    await page.goto("/en/");
    await page.locator("#language-menu-button").click();
    await page.locator("#lang-switcher a[hreflang='fi']").click();
    await expect(page).toHaveURL(/\/fi\//);
  });

  test("switches from Finnish to English", async ({ page }) => {
    await page.goto("/fi/");
    await page.locator("#language-menu-button").click();
    await page.locator("#lang-switcher a[hreflang='en']").click();
    await expect(page).toHaveURL(/\/en\//);
  });
});

test.describe("Navigation links", () => {
  test("site logo / home link navigates to homepage", async ({ page }) => {
    await page.goto("/en/wcag/");
    await page.locator("a[href='/en/']").first().click();
    await expect(page).toHaveURL("/en/");
  });
});
