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

Its role in the site family is criterion-focused guidance: WCAG principles,
guidelines, success criteria, terminology, and related European requirements.
Broader accessibility education belongs in `a11ying-front`; hands-on testing
skills and practice environments belong in `a11y-testing-astro`.

The main runtime input is `PUBLIC_PAYLOAD_URL`. Tests use the configured
Playwright environment and committed fixtures/snapshots.
Astro 7 requires Node.js 22.12 or newer; use a compatible Node 22 release for
local development, CI, and production builds.

## Related Repositories

The sibling repositories normally live under the same `projects` directory:

| Repository | Role |
| --- | --- |
| `../wcag-front` | This specialized WCAG guide site. |
| `../a11ying-front` | The broader accessibility content site. |
| `../a11y-testing-astro` | The English hands-on accessibility testing lab. |
| `../sanna` | The bilingual personal/professional site and English blog for Sanna. |
| `../a11ying-ui` | Shared tokens for all sites plus React components and global styles used here and by A11ying. |

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
- After a React component or complete-style change in `a11ying-ui`, verify the
  affected behavior in both full consumer sites before considering it complete.
  After a token change, verify every affected site.
- Visual similarity alone is not a reason to share a component. Testing Lab
  and Sanna use only `a11ying-ui/tokens` and keep their Astro components local.

## Commit and Push Authority

Agents may implement and verify changes in this repository, but must not commit
or push them. Leave all changes uncommitted for human review. Only the sibling
`a11ying-ui` package permits agent commits and pushes as part of its approved
tagged-release workflow.

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

Playwright builds the static site and runs browser tests against `astro
preview`; it does not use the Astro development server. The suites retain their
configured Payload data source, and a build or CMS failure must fail the suite
rather than fall back to another source.

Run this repository's and `a11ying-front`'s browser quality gates sequentially:
both use port 4321, and `a11ying-front` also uses port 4010. Do not leave a
separate dev or preview server on those ports while running the tests.

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
4. Update `a11ying-ui` in every affected consumer.
5. Run focused consumer tests, then each affected site's quality gate.
6. Leave this repository's changes uncommitted for human review.

Use the TypeScript declarations published by `a11ying-ui`. Do not recreate a
local ambient module shim; fix missing or incorrect public types in the design
system package and update both full React consumers together.
