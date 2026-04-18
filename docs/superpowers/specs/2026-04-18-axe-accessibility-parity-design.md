# Axe Accessibility Parity Design

## Context

`wcag-front` has functional accessibility behavior checks and a stable visual suite, but it does not yet have an automated axe scan command like `a11ying-front`. Adding the same kind of gate gives the site a stronger baseline before larger structural refactors or future features.

## Goals

- Add a dedicated axe accessibility suite for representative `wcag-front` pages.
- Keep axe scans separate from the default functional Playwright suite.
- Run axe scans against production preview output.
- Prove the axe suite fails for a temporary accessibility-breaking mutation.
- Keep visual tests unchanged.

## Non-Goals

- Do not replace existing functional accessibility tests.
- Do not add a full-site axe crawl in this pass.
- Do not mock CMS data for `wcag-front` in this pass.
- Do not start structural refactors.

## Approach

1. Add `@axe-core/playwright` as a dev dependency.
2. Add `tests/axe-core.spec.ts` with representative scans:
   - English and Finnish front pages.
   - English and Finnish search pages.
   - A WCAG guideline page.
   - A WCAG criterion page.
3. Add a dedicated Playwright config for axe scans that serves `dist` via `npm run preview`.
4. Add `npm run test:a11y` as `npm run build && playwright test --config playwright.a11y.config.ts`.
5. Exclude `axe-core.spec.ts` from the default functional Playwright config.
6. Update README command documentation.
7. Temporarily break a scanned page, confirm a focused axe test fails, revert the mutation, then rerun the focused and full axe suites.

## Verification

The pass is complete when:

- `npm test` passes.
- `npm run build` passes.
- `npm run test:a11y` passes.
- `npm run test:visual` passes.
- A temporary accessibility-breaking mutation was confirmed to fail a focused axe test and was reverted.

## Risks

- Production build uses live CMS data, so `test:a11y` may be slower or depend on CMS availability.
- Axe catches many automated issues but does not replace manual accessibility review.
- New scanned routes should be representative, not exhaustive.
