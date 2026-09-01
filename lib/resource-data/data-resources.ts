import { Resource } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const dataLinks: Resource<typeof CATEGORIES.data>[] = [
  {
    title: "actuallyEXPLAIN",
    category: CATEGORIES.data,
    description:
      "A visualizer that helps you understand complex PostgreSQL queries in a diagram and dictionarized form. Paste your code and check.",
    favicon: "https://actuallyexplain.vercel.app/ae-logo.svg",
    gitHubLink: "https://github.com/freenandes/actuallyexplain",
    ogImage: "https://actuallyexplain.vercel.app/preview.png",
    subtitle: "Visual SQL Logic Mapper",
    url: "https://actuallyexplain.vercel.app/",
  },
  {
    title: "Apify",
    author: "Apify",
    category: CATEGORIES.data,
    description:
      "Thousands of tools to automate your business. Get real-time web data, track competitors, generate leads, and integrate your apps and AI agents.",
    favicon: "https://apify.com/icon0.svg",
    ogImage: "https://apify.com/og-image?title=Thousands+of+tools%0Afor+your+AI",
    subtitle: "The largest marketplace of trusted tools for AI",
    tags: [TAGS.data],
    url: "https://apify.com/",
  },
  {
    title: "APILayer",
    category: CATEGORIES.data,
    description:
      "APILayer is a unified API marketplace with 40+ production-ready APIs for finance, geolocation, weather, data, and AI. Trusted by 2.2M+ developers.",
    favicon: "https://apilayer.com/wp-content/themes/hello-theme-child/assets/favicon.ico",
    gitHubLink: "https://github.com/public-apis/public-apis",
    ogImage: "https://apilayer.com/wp-content/uploads/2026/03/logo.png",
    subtitle: "40+ Production-Ready APIs, One Account, One Key",
    tags: [TAGS.data],
    url: "https://apilayer.com/",
  },
  {
    title: "Awesome Public Datasets",
    author: "AwesomeData",
    category: CATEGORIES.data,
    description: "A topic-centric list of HQ open datasets.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/2a61ea1664906fccb0fa2862cc615c2f83984f50a103821992f695485c350967/awesomedata/awesome-public-datasets",
    tags: [TAGS.data],
    url: "https://github.com/awesomedata/awesome-public-datasets",
  },
  {
    title: "Azure Naming Convention Generator",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free Azure naming convention generator following the Microsoft Cloud Adoption Framework. 200+ resource types with official CAF abbreviations, real per-resource length and character rules, 47 regions, org and project segments, batch validation, and export to Terraform, Bicep, ARM, PowerShell, Azure CLI, Markdown, CSV and Azure Policy. 100% client-side.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/azurenamingconvention/og-image.png",
    subtitle: "CAF Abbreviations, Rules & Policy",
    url: "https://jasperbernaers.com/azurenamingconvention/",
  },
  {
    title: "Behind the Email",
    category: CATEGORIES.data,
    description:
      "Instantly find career history, education, and public profile signals from any email address. Professional OSINT for lead research and verification.",
    favicon: "https://behindtheemail.com/icon.svg",
    ogImage: "https://behindtheemail.com/opengraph-image",
    subtitle: "Public Profile & Career Search",
    tags: [TAGS.data],
    url: "https://behindtheemail.com/",
  },
  {
    title: "ByteByteGo",
    category: CATEGORIES.data,
    description: "Everything you need to take your system design skill to the next level",
    favicon: "https://bytebytego.com/apple-touch-icon.png",
    ogImage: "https://bytebytego.com/social2.png",
    subtitle: "Technical Interview Prep",
    url: "https://bytebytego.com/",
  },
  {
    title: "Env File Editor",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free online .env file editor: syntax highlighting, 30 lint rules, a secret audit covering 40+ token formats (AWS, GitHub, Stripe, OpenAI), environment diff and export to 16 formats including Docker Compose, Kubernetes, GitHub Actions and env.d.ts. 100% client-side — your secrets never leave the browser.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/env-editor/og-image.png",
    subtitle: "Free Online .env Editor, Linter & Secret Auditor",
    url: "https://jasperbernaers.com/env-editor/",
  },
  {
    title: "Free Fake Data Generator",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free online fake data generator. Build a schema from 123 field types, pick a locale, and generate up to 50,000 rows of realistic test data with valid Luhn cards, mod-97 IBANs and check-digit barcodes. Export CSV, Excel CSV, TSV, JSON, NDJSON, SQL, YAML, XML, Markdown or HTML. Seeded and reproducible, 100% in your browser.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/fake-data/og-image.png",
    subtitle: "123 Field Types, CSV, JSON, SQL, NDJSON & XML | Mockaroo Alternative",
    url: "https://jasperbernaers.com/fake-data/",
  },
  {
    title: "Free Public APIs",
    category: CATEGORIES.data,
    description:
      "A collection of Free Public APIs for Students and Developers. Tested every single day.",
    favicon: "https://www.freepublicapis.com/favicon.ico",
    tags: [TAGS.data],
    url: "https://www.freepublicapis.com/",
  },
  {
    title: "Hoppscotch",
    category: CATEGORIES.data,
    description: "Helps you create requests faster, saving precious time on development.",
    favicon: "https://hoppscotch.io/icon.png",
    ogImage: "https://hoppscotch.io/banner.png",
    subtitle: "Open source API development ecosystem",
    tags: [TAGS.tool],
    url: "https://hoppscotch.io/",
  },
  {
    title: "JSON For You",
    category: CATEGORIES.data,
    description:
      "Online JSON view, format, minify, validate and compare. It also provides graph view to preview JSON data, semantic comparing two JSON diffs, convert JSON to CSV or CSV to JSON and support jq online.",
    favicon: "https://json4u.com/icon.svg",
    gitHubLink: "https://github.com/loggerhead/json4u",
    ogImage: "https://json4u.com/example/graph.webp",
    subtitle: "The best online JSON tool",
    url: "https://json4u.com/",
  },
  {
    title: "JSON Hero",
    author: "Trigger.dev",
    category: CATEGORIES.data,
    description:
      "JSON Hero makes reading and understand JSON files easy by giving you a clean and beautiful UI packed with extra features.",
    favicon: "https://jsonhero.io/favicon.ico",
    gitHubLink: "https://github.com/triggerdotdev/jsonhero-web",
    ogImage: "https://jsonhero.io/build/_assets/opengraph-P6EWTI3J.png",
    subtitle: "A beautiful JSON viewer for the web",
    tags: [TAGS.tool],
    url: "https://jsonhero.io/",
  },
  {
    title: "Jsonify",
    category: CATEGORIES.data,
    description:
      "Transform XLSX/CSV translation files into structured JSON. Simplify multilingual website and app localization. Convert excel/csv language data to JSON objects effortlessly.",
    favicon: "https://www.jsonify.net/images/seo-logo.svg",
    ogImage: "https://jsonify.net/_next/static/media/og-image.834f1293.webp",
    subtitle: "Free JSON generator",
    tags: [TAGS.tool],
    url: "https://www.jsonify.net/",
  },
  {
    title: "Link Preview API",
    author: "Microlink HQ",
    category: CATEGORIES.data,
    description:
      "Link preview API that turns any URL into a custom preview card. Normalized metadata (Open Graph, Twitter Cards, JSON-LD, oEmbed) in one JSON call. Free tier, proxy rotation for URLs behind Cloudflare and CAPTCHAs. Built for developers.",
    favicon: "https://cdn.microlink.io/logo/favicon.svg",
    ogImage: "https://microlink.io/images/og/link-preview.png",
    subtitle: "URL Unfurling & Open Graph Metadata",
    tags: [TAGS.data],
    url: "https://microlink.io/link-preview",
  },
  {
    title: "Lorem Ipsum Alternative",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free developer placeholder text generator — a Lorem Ipsum alternative with 24 themes (git commits, terminal logs, API responses, legal copy, UI microcopy). Export to Markdown, HTML, JSX, JSON, CSV, YAML, XML or SQL, with seeded, reproducible output. No signup.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/lore-gen/og-image.png",
    subtitle: "Free Developer Placeholder Text Generator",
    url: "https://jasperbernaers.com/lore-gen/",
  },
  {
    title: "MCP Servers",
    category: CATEGORIES.data,
    description:
      "Official and community Model Context Protocol server implementations for AI tool integrations.",
    favicon:
      "https://modelcontextprotocol.io/mintlify-assets/_mintlify/favicons/mcp/ebiVJzri-bsiCfVZ/_generated/favicon/android-chrome-192x192.png",
    gitHubLink: "https://github.com/modelcontextprotocol/servers",
    ogImage:
      "https://raw.githubusercontent.com/modelcontextprotocol/docs/2eb6171ddbfeefde349dc3b8d5e2b87414c26250/images/og-image.png",
    tags: [TAGS.data],
    url: "https://modelcontextprotocol.io/",
  },
  {
    title: "Microlink",
    author: "Microlink HQ",
    category: CATEGORIES.data,
    description:
      "A single API for turning any URL into data. Built for apps, agents, and AI. Powered by real browsers. Try it, no signup.",
    favicon: "https://cdn.microlink.io/logo/favicon.svg",
    gitHubLink: "https://github.com/microlinkhq",
    ogImage: "https://microlink.io/images/og/home.png",
    subtitle: "The web, transformed",
    tags: [TAGS.data],
    url: "https://microlink.io/",
  },
  {
    title: "Product Hunt",
    category: CATEGORIES.data,
    description:
      "Product Hunt is a curation of the best new products, every day. Discover the latest mobile apps, websites, and technology products that everyone's talking about.",
    favicon: "https://ph-static.imgix.net/ph-favicon-brand-500.ico",
    ogImage: "https://ph-static.imgix.net/ph-logo-1.png",
    subtitle: "The best new products in tech.",
    tags: [TAGS.data],
    url: "https://www.producthunt.com/",
  },
  {
    title: "PublicAPIs.dev",
    author: "Marcel Cruz",
    category: CATEGORIES.data,
    description:
      "A collection of public APIs for developers, categorized and crowdsourced. Animals, books, cryptocurrencies, development, music, weather and much more.",
    favicon: "https://publicapis.dev/favicon-pa/safari-pinned-tab.svg",
    gitHubLink: "https://github.com/marcelscruz/public-apis",
    ogImage: "https://publicapis.dev/og",
    subtitle: "A Collaborative List Of 1400+ Public APIs For Developers",
    tags: [TAGS.data],
    url: "https://publicapis.dev/",
  },
  {
    title: "Website Screenshot API",
    author: "Microlink HQ",
    category: CATEGORIES.data,
    description:
      "Capture pixel-perfect website screenshots with one API call. Free to start. Sub-second responses, full headless browser control, device emulation & ad-blocking.",
    favicon: "https://cdn.microlink.io/logo/favicon.svg",
    ogImage: "https://microlink.io/images/og/screenshot.png",
    subtitle: "Convert URL to Image",
    tags: [TAGS.data],
    url: "https://microlink.io/screenshot",
  },
];
