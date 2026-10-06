import { test, expect } from "@playwright/test";
import { gotoExistingPage, waitForHydration } from "./helpers";

test.describe("Skip link", () => {
  test("skip link is the first focusable element", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("skip link moves the viewport to main content", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const target = page.locator("#skip-target");
    await expect(target).toBeInViewport();
    await expect(target).toBeFocused();
  });
});

test.describe("Keyboard navigation", () => {
  test("language menu is keyboard accessible", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    const button = page.getByRole("button", { name: /Switch language/ });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Suomi (FI)" })).toBeVisible();
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await waitForHydration(page);
    const button = page.getByRole("button", { name: /Switch to (dark|light) version/ });
    await button.focus();
    const before = await page.locator("html").evaluate((el) => el.classList.contains("dark"));
    await page.keyboard.press("Enter");
    const after = await page.locator("html").evaluate((el) => el.classList.contains("dark"));
    expect(before).not.toBe(after);
  });

  test("search input is reachable via Tab on search page", async ({ page }) => {
    await gotoExistingPage(page, "/en/search/");
    await waitForHydration(page);
    const input = page.getByRole("textbox", { name: "Search for content" });
    for (let attempt = 0; attempt < 50 && !(await input.evaluate((element) => element === document.activeElement)); attempt += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(input).toBeFocused();
  });
});

test.describe("ARIA attributes", () => {
  test("language switcher button has aria-expanded", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await expect(page.getByRole("button", { name: /Switch language/ })).toHaveAttribute("aria-expanded", "false");
  });

  test("language switcher button has a descriptive accessible name", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await expect(page.getByRole("button", { name: /Current language: English \(EN\)/ })).toHaveAccessibleName(
      "Switch language/Vaihda kieltä. Current language: English (EN)",
    );
  });

  test("page has a single h1", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("all images have alt text", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // alt="" is valid for decorative images, but the attribute must exist
      expect(alt).not.toBeNull();
    }
  });

  test("main landmark exists", async ({ page }) => {
    await gotoExistingPage(page, "/en/");
    await expect(page.getByRole("main")).toBeVisible();
  });
});
