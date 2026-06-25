import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const backendLinks: Tool[] = [
  {
    title: "Directus",
    category: CATEGORIES.backend,
    description:
      "The collaborative backend and self-hostable headless CMS over any database. No-code interface, REST + GraphQL APIs, and MCP for Claude, ChatGPT, and Cursor.",
    subtitle: "Collaborative Backend & Headless CMS",
    url: "https://directus.com/",
  },

  {
    title: "KeystoneJS",
    category: CATEGORIES.backend,
    description:
      "Build faster and scale further with the programmable open source GraphQL API back-end for structured content projects.",
    url: "https://keystonejs.com/",
  },
  {
    title: "Payload",
    category: CATEGORIES.backend,
    description:
      "Built with TypeScript and React, Payload is an open-source headless CMS and application framework. Build anything.",
    subtitle: "The Next.js Headless CMS and App Framework",
    url: "https://payloadcms.com/",
  },

  {
    title: "Strapi",
    category: CATEGORIES.backend,
    description:
      "Strapi is the next-gen headless CMS, open-source, JavaScript/TypeScript, enabling content-rich experiences to be created, managed and exposed to any digital device.",
    subtitle: "Open-Source TypeScript Headless CMS for Next.js, Astro, Tanstack Start, and Nuxt.js",
    url: "https://strapi.io/",
  },
  {
    title: "TinaCMS",
    category: CATEGORIES.backend,
    description:
      "Combine the power of GitHub and Markdown with TinaCMS for seamless content management. Empower developers and creators to edit, preview, and manage static and dynamic sites effortlessly.",
    url: "https://tina.io/",
  },
];
