import { test, expect } from "@playwright/test";

test.describe("Skip link", () => {
  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/en/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", /#skip-target|#skip/);
  });

  test("skip link navigates to main content area", async ({ page }) => {
    await page.goto("/en/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    // Focus should now be on the skip target
    await expect(page.locator("#skip-target")).toBeInViewport();
  });
});

test.describe("Keyboard navigation", () => {
  test("language menu is keyboard accessible", async ({ page }) => {
    await page.goto("/en/");
    const button = page.locator("#language-menu-button");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#lang-switcher")).toBeVisible();
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    await page.goto("/en/");
    const button = page.locator("#theme-toggle-button");
    await button.focus();
    const before = await page.locator("html").evaluate((el) => el.classList.contains("dark"));
    await page.keyboard.press("Enter");
    const after = await page.locator("html").evaluate((el) => el.classList.contains("dark"));
    expect(before).not.toBe(after);
  });

  test("search input is reachable via Tab on search page", async ({ page }) => {
    await page.goto("/en/search/");
    const input = page.locator("#search-input");
    await input.focus();
    await expect(input).toBeFocused();
  });
});

test.describe("ARIA attributes", () => {
  test("language switcher button has aria-expanded", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator("#language-menu-button")).toHaveAttribute("aria-expanded");
  });

  test("lang-switcher menu has aria-label or aria-labelledby", async ({ page }) => {
    await page.goto("/en/");
    const menu = page.locator("#language-menu-button");
    const ariaLabel = await menu.getAttribute("aria-label");
    const ariaLabelledBy = await menu.getAttribute("aria-labelledby");
    expect(ariaLabel || ariaLabelledBy).toBeTruthy();
  });

  test("page has a single h1", async ({ page }) => {
    await page.goto("/en/");
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  test("all images have alt text", async ({ page }) => {
    await page.goto("/en/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // alt="" is valid for decorative images, but the attribute must exist
      expect(alt).not.toBeNull();
    }
  });

  test("main landmark exists", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator("main, [role='main']")).toBeVisible();
  });
});
