// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://wcag.a11y.ing/',
  trailingSlash: 'always',
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        fi: 'fi'
      }
    }
  }), tailwind(), react(), icon()],
  redirects: {
    "/en/perceivable": "/en/wcag/perceivable",
    "/en/operable": "/en/wcag/operable",
    "/en/understandable": "/en/wcag/understandable",
    "/en/robust": "/en/wcag/robust",
    "/fi/havaittava": "/fi/wcag/havaittava",
    "/fi/hallittava": "/fi/wcag/hallittava",
    "/fi/ymmarrettava": "/fi/wcag/ymmarrettava",
    "/fi/toimintavarma": "/fi/wcag/toimintavarma",
    "/en/perceivable/text-alternatives": "/en/wcag/perceivable/text-alternatives",
    "/en/perceivable/time-based-media": "/en/wcag/perceivable/time-based-media",
    "/en/perceivable/adaptable": "/en/wcag/perceivable/adaptable",
    "/en/perceivable/distinguishable": "/en/wcag/perceivable/distinguishable",
    "/en/operable/keyboard-accessible": "/en/wcag/operable/keyboard-accessible",
    "/en/operable/enough-time": "/en/wcag/operable/enough-time",
    "/en/operable/seizures-and-physical-reactions": "/en/wcag/operable/seizures-and-physical-reactions",
    "/en/operable/navigable": "/en/wcag/operable/navigable",
    "/en/operable/input-modalities": "/en/wcag/operable/input-modalities",
    "/en/understandable/readable": "/en/wcag/understandable/readable",
    "/en/understandable/predictable": "/en/wcag/understandable/predictable",
    "/en/understandable/input-assistance": "/en/wcag/understandable/input-assistance",
    "/en/robust/compatible": "/en/wcag/robust/compatible",
    "/fi/havaittava/tekstivastineet": "/fi/wcag/havaittava/tekstivastineet",
    "/fi/havaittava/aikasidonnainen-media": "/fi/wcag/havaittava/aikasidonnainen-media",
    "/fi/havaittava/mukautettava": "/fi/wcag/havaittava/mukautettava",
    "/fi/havaittava/erottuva": "/fi/wcag/havaittava/erottuva",
    "/fi/hallittava/kaytettavissa-nappaimistolla": "/fi/wcag/hallittava/kaytettavissa-nappaimistolla",
    "/fi/hallittava/tarpeeksi-aikaa": "/fi/wcag/hallittava/tarpeeksi-aikaa",
    "/fi/hallittava/sairaskohtaukset": "/fi/wcag/hallittava/sairaskohtaukset",
    "/fi/hallittava/navigoitava": "/fi/wcag/hallittava/navigoitava",
    "/fi/hallittava/syotetavat": "/fi/wcag/hallittava/syotetavat",
    "/fi/ymmarrettava/luettava": "/fi/wcag/ymmarrettava/luettava",
    "/fi/ymmarrettava/ennakoitava": "/fi/wcag/ymmarrettava/ennakoitava",
    "/fi/ymmarrettava/syotteen-avustaminen": "/fi/wcag/ymmarrettava/syotteen-avustaminen",
    "/fi/toimintavarma/yhteensopiva": "/fi/wcag/toimintavarma/yhteensopiva",
  }
});

