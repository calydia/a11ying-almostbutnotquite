import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { path: '/fi/', description: 'Finnish front page' },
  { path: '/en/', description: 'English front page' },
  { path: '/fi/haku/', description: 'Finnish search page' },
  { path: '/en/search/', description: 'English search page' },
  {
    path: '/en/wcag/perceivable/text-alternatives/',
    description: 'WCAG guideline page',
  },
  {
    path: '/en/wcag/perceivable/text-alternatives/non-text-content/',
    description: 'WCAG criterion page',
  },
];

test.describe('Automatically detectable accessibility issues', () => {
  for (const { path, description } of pages) {
    test(`${description} should not have any axe violations`, async ({ page }) => {
      await page.goto(path);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
