import { Tool } from "@/types";

import { CATEGORIES } from "./categories";

export const dataLinks: Tool[] = [
  {
    title: "Public APIs",
    url: "https://github.com/public-apis/public-apis",
    favicon: "/github.svg",
    description: "A collective list of free APIs.",
    category: CATEGORIES.data,
  },
  {
    title: "Free Public APIs",
    url: "https://www.freepublicapis.com/",
    description:
      "A collection of Free Public APIs for Students and Developers. Tested every single day.",
    category: CATEGORIES.data,
  },
  {
    title: "PublicAPIs.dev",
    url: "https://publicapis.dev/",
    description:
      "A collection of public APIs for developers, categorized and crowdsourced. Animals, books, cryptocurrencies, development, music, weather and much more.",
    category: CATEGORIES.data,
  },
  {
    title: "Apify",
    url: "https://apify.com/",
    description:
      "Cloud platform for web scraping, browser automation, AI agents, and data for AI. Use 35,000+ ready-made tools, code templates, or order a custom solution.",
    category: CATEGORIES.data,
  },
  {
    title: "Product Hunt",
    url: "https://github.com/modelcontextprotocol/servers",
    favicon: "/github.svg",
    description:
      "Product Hunt is a curation of the best new products, every day. Discover the latest mobile apps, websites, and technology products that everyone's talking about.",
    category: CATEGORIES.data,
  },
  {
    title: "MCP Servers",
    url: "https://www.producthunt.com/",
    description:
      "Official and community Model Context Protocol server implementations for AI tool integrations.",
    category: CATEGORIES.data,
  },
  {
    title: "Microlink",
    url: "https://microlink.io/",
    description:
      "Turn any URL into structured data. The all-in-one API for browser automation: screenshots, PDFs, scraping, and link previews. No infrastructure to manage.",
    category: CATEGORIES.data,
  },
];
