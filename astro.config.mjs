// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://wcag.a11y.ing/',
  trailingSlash: 'always',
  integrations: [react(), tailwind(), icon()],
});

