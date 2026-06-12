# AGENTS.md

## Project

`wcag-front` is the Astro frontend for the bilingual **A11ying with Sanna -
Almost, but not quite** WCAG guide at `https://wcag.a11y.ing/`.

The site:

- renders English and Finnish content from a Payload CMS API;
- presents WCAG principles, guidelines, and success criteria through dedicated
  nested routes;
- uses Astro for routing and page composition;
- uses React islands and shared styles from `a11ying-ui`;
- treats accessibility, keyboard behavior, light/dark themes, and responsive
  rendering as release requirements.

The main runtime input is `PUBLIC_PAYLOAD_URL`. Tests use the configured
Playwright environment and committed fixtures/snapshots.

## Related Repositories

The sibling repositories normally live under the same `projects` directory:

| Repository | Role |
| --- | --- |
| `../wcag-front` | This specialized WCAG guide site. |
| `../a11ying-front` | The broader accessibility content site. |
| `../a11ying-ui` | The shared React component and design-token package used by both sites. |

This repository consumes `a11ying-ui` from a tagged GitHub dependency, not
directly from the sibling checkout. A change in `../a11ying-ui` does not affect
this site until the package is built, released/tagged, and the dependency and
lockfile are updated here.

Use these ownership boundaries:

- Put reusable components, shared interaction behavior, brand tokens,
  typography, colors, and broadly applicable styles in `a11ying-ui`.
- Keep WCAG data modeling, WCAG route hierarchy, Payload requests, redirects,
  page composition, and site-specific navigation in this repository.
- Compare `a11ying-front` when changing duplicated site-shell behavior. Do not
  copy a fix blindly; decide whether it belongs in both sites or in
  `a11ying-ui`.
- After an `a11ying-ui` change, verify the affected behavior in both consumer
  sites before considering the shared change complete.

## Repository Map

- `src/pages/`: localized routes, search pages, and nested WCAG routes for
  principles, guidelines, and criteria.
- `src/layouts/Layout.astro`: shared document shell, metadata, theme setup,
  shared package imports, and global site styles.
- `src/components/`: site-specific Astro components, including WCAG listings
  and navigation.
- `src/lib/payload.ts`: Payload CMS request construction and WCAG collection
  sorting.
- `src/i18n/`: English/Finnish UI strings and translation helpers.
- `src/interfaces/`: CMS, page, terminology, and WCAG data contracts.
- `src/types/a11ying-ui.d.ts`: temporary local declarations for the package.
- `tests/`: Playwright functional, accessibility, and visual test suites.
- `docs/testing.md`: detailed test policy and shared-design-system guidance.

## Working Rules

- Preserve semantic HTML, focus visibility, keyboard operation, accessible
  names, heading hierarchy, and correct language metadata.
- Check behavior in English and Finnish. WCAG slugs, redirects, labels, and
  hierarchy differ by locale and are part of the public contract.
- Keep principle, guideline, and criterion relationships intact when changing
  data fetching or route generation.
- Check light and dark themes when changing visual or interactive UI.
- Keep Astro components responsible for server-rendered site composition.
  Use React islands for shared interactive components already owned by
  `a11ying-ui`.
- Do not hide CMS failures. `fetchApi` intentionally throws useful endpoint
  and status context.
- Preserve trailing-slash URL behavior and review canonical, alternate,
  redirect, and sitemap effects when changing routes.
- Treat `dist/`, `.astro/`, `test-results/`, and `playwright-report/` as
  generated output.
- Do not update visual snapshots until the rendered change has been reviewed
  and confirmed intentional.

## Commands

Run commands from this repository root:

```bash
npm install
npm run dev
npm run build
npm run check
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run quality
```

Use the smallest relevant test while iterating. Run `npm run quality` for
changes to the layout, shared site shell, WCAG hierarchy, navigation, styling
foundations, shared-component integration, or other broad behavior.

For intentional visual changes:

```bash
npm run test:visual:update
npm run test:visual
```

## Cross-Repository Changes

For a change originating in `a11ying-ui`:

1. Implement and document it with a Storybook story.
2. Run the design-system build and Storybook test suite.
3. Release/tag the package as appropriate.
4. Update `a11ying-ui` in this repository and `a11ying-front`.
5. Run focused consumer tests, then each affected site's quality gate.

The two site repositories currently carry a local `a11ying-ui` declaration
shim. Keep it aligned with imported package APIs until the package build
reliably publishes TypeScript declarations; remove it only as a coordinated
consumer change.
