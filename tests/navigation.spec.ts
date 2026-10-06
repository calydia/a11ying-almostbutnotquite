import { test, expect } from "@playwright/test";
import { gotoExistingPage, waitForHydration } from "./helpers";

test.describe("Language switcher", () => {
  test("opens language menu on button click", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    const button = page.getByRole("button", { name: /Switch language/ });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Suomi (FI)" })).toBeVisible();
  });

  test("closes language menu when clicking button again", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    const button = page.getByRole("button", { name: /Switch language/ });
    await button.click();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("switches from English to Finnish", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    await page.getByRole("button", { name: /Switch language/ }).click();
    await page.getByRole("link", { name: "Suomi (FI)" }).click();
    await expect(page).toHaveURL(/\/fi\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "fi");
  });

  test("switches from Finnish to English", async ({ page }) => {
    await gotoExistingPage(page, "/fi/", { language: "fi" });
    await waitForHydration(page);
    await page.getByRole("button", { name: /Switch language/ }).click();
    await page.getByRole("link", { name: "English (EN)" }).click();
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("Navigation links", () => {
  test("site logo / home link navigates to homepage", async ({ page }) => {
    await gotoExistingPage(page, "/en/wcag/perceivable/text-alternatives/");
    await page.getByRole("banner").getByRole("link", { name: /Almost, but not quite site front page/ }).click();
    await expect(page).toHaveURL("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("Main navigation escape handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
  });

  test("closes the current nested level first, then the parent level on second Escape", async ({ page }) => {
    const menuToggle = page.getByRole("button", { name: "Navigation" });
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
    const menuToggle = page.getByRole("button", { name: "Navigation" });
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
