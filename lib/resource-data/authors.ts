import { AuthorProfile } from "@/lib/authors";

/**
 * Registry of known authors with custom profile metadata and external links.
 * Keyed by the author's slug (e.g. "jasper-bernaers").
 *
 * You can add or edit any author's links (website, github, twitter, blog, linkedin) here.
 * Any author not explicitly defined in this map will automatically have a page generated
 * with any links found in their resource definitions.
 */
export const AUTHORS_REGISTRY: Record<string, AuthorProfile> = {
  "csaba-kissi": {
    links: {
      github: "https://github.com/csaba-kissi",
      twitter: "https://x.com/csaba_kissi",
      website: "https://csaba.page",
    },
    name: "Csaba Kissi",
  },
  fffuel: {
    links: {
      twitter: "https://x.com/fffuel_co",
      website: "https://fffuel.co",
    },
    name: "fffuel",
  },
  firecrawl: {
    links: {
      github: "https://github.com/mendableai/firecrawl",
      twitter: "https://x.com/firecrawl_dev",
      website: "https://firecrawl.dev",
    },
    name: "Firecrawl",
  },
  "hayk-an": {
    links: {
      github: "https://github.com/hayk96",
      twitter: "https://x.com/hayk_an",
      website: "https://hayk.design",
    },
    name: "Hayk An",
  },
  "jasper-bernaers": {
    links: {
      github: "https://github.com/jasperbernaers",
      twitter: "https://x.com/jasperbernaers",
      website: "https://jasperbernaers.com",
    },
    name: "Jasper Bernaers",
  },
  "pablo-stanley": {
    links: {
      twitter: "https://x.com/pablostanley",
      website: "https://pablostanley.com",
    },
    name: "Pablo Stanley",
  },
  vercel: {
    links: {
      github: "https://github.com/vercel",
      twitter: "https://x.com/vercel",
      website: "https://vercel.com",
    },
    name: "Vercel",
  },
  "vijay-verma": {
    links: {
      github: "https://github.com/realvjy",
      twitter: "https://x.com/realvjy",
      website: "https://realvjy.me",
    },
    name: "Vijay Verma",
  },
};
