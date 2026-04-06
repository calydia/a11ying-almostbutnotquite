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
    await page.locator("header a[href='/en/']").filter({ has: page.locator(".logo-dark") }).click();
    await expect(page).toHaveURL("/en/");
  });
});

test.describe("Main navigation escape handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/en/");
    await page.waitForLoadState("networkidle");
  });

  test("closes the current nested level first, then the parent level on second Escape", async ({ page }) => {
    const menuToggle = page.locator("#main-menu-toggle");
    const topButton = page.locator(".menu-button").first();
    const nestedToggle = page.locator(".menu-button-ul .mobile-menu-toggle").first();
    const nestedLink = page.locator(".menu-button-ul .menu-lower-level a").first();

    await menuToggle.click();
    await topButton.click();
    await nestedToggle.click();

    await nestedLink.focus();
    await page.keyboard.press("Escape");

    await expect(nestedToggle).toHaveAttribute("aria-expanded", "false");
    await expect(nestedToggle).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(topButton).toHaveAttribute("aria-expanded", "false");
    await expect(topButton).toBeFocused();
  });

  test("closes the open submenu first and the whole menu on second Escape from the top-level button", async ({ page }) => {
    const menuToggle = page.locator("#main-menu-toggle");
    const topButton = page.locator(".menu-button").first();

    await menuToggle.click();
    await topButton.click();
    await topButton.focus();

    await page.keyboard.press("Escape");

    await expect(topButton).toHaveAttribute("aria-expanded", "false");
    await expect(topButton).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
    await expect(menuToggle).toBeFocused();
  });
});
