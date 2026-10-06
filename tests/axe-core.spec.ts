import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoExistingPage } from './helpers';

const pages = [
  { path: '/fi/', description: 'Finnish front page', language: 'fi' as const },
  { path: '/en/', description: 'English front page', language: 'en' as const },
  { path: '/fi/haku/', description: 'Finnish search page', language: 'fi' as const },
  { path: '/en/search/', description: 'English search page', language: 'en' as const },
  {
    path: '/en/wcag/perceivable/text-alternatives/',
    description: 'WCAG guideline page',
    language: 'en' as const,
  },
  {
    path: '/en/wcag/perceivable/text-alternatives/non-text-content/',
    description: 'WCAG criterion page',
    language: 'en' as const,
  },
];

test.describe('Automatically detectable accessibility issues', () => {
  for (const { path, description, language } of pages) {
    test(`${description} should not have any axe violations`, async ({ page }) => {
      await gotoExistingPage(page, path, { language });

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
