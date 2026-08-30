import { Resource } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const dataLinks: Resource[] = [
  {
    title: "actuallyEXPLAIN",
    category: CATEGORIES.data,
    description:
      "A visualizer that helps you understand complex PostgreSQL queries in a diagram and dictionarized form. Paste your code and check.",
    subtitle: "Visual SQL Logic Mapper",
    url: "https://actuallyexplain.vercel.app/",
  },
  {
    title: "Apify",
    category: CATEGORIES.data,
    description:
      "Cloud platform for web scraping, browser automation, AI agents, and data for AI. Use 35,000+ ready-made tools, code templates, or order a custom solution.",
    tags: [TAGS.data],
    url: "https://apify.com/",
  },
  {
    title: "Awesome Public Datasets",
    category: CATEGORIES.data,
    description: "A topic-centric list of HQ open datasets.",
    favicon: "/github.svg",
    tags: [TAGS.data],
    url: "https://github.com/awesomedata/awesome-public-datasets",
  },
  {
    title: "Azure Naming Convention Generator",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Generate Azure resource names following Microsoft Cloud Adoption Framework (CAF) conventions. 85+ resource types, live validation, Terraform & Bicep export. Free, no signup.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/azurenamingconvention/og-image.png",
    subtitle: "CAF Compliant, Free",
    url: "https://jasperbernaers.com/azurenamingconvention/",
  },
  {
    title: "Behind the Email",
    category: CATEGORIES.data,
    description:
      "Instantly find career history, education, and public profile signals from any email address. Professional OSINT for lead research and verification.",
    subtitle: "Public Profile & Career Search",
    tags: [TAGS.data],
    url: "https://behindtheemail.com/",
  },
  {
    title: "ByteByteGo",
    category: CATEGORIES.data,
    description: "Everything you need to take your system design skill to the next level",
    subtitle: "Technical Interview Prep",
    url: "https://bytebytego.com/",
  },
  {
    title: "Env File Editor",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free online .env file editor — create, edit, validate & compare environment files. Syntax highlighting, duplicate detection, secret masking, multi-env diff, export .env/.json/.yaml. No signup, 100% client-side. Your secrets never leave your browser.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/env-editor/og-image.png",
    subtitle: "Edit .env Files Online Free",
    url: "https://jasperbernaers.com/env-editor/",
  },
  {
    title: "Free Fake Data Generator Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free fake data generator — create realistic test data with 45+ field types: names, emails, addresses, IBANs, IPs, UUIDs, dates, slugs, user agents, coordinates. Generate up to 1000 rows. Export to CSV, JSON, SQL, TSV, YAML or XML. Build custom schemas. No sign-up, no upload, 100% in-browser. GDPR safe. Free Mockaroo alternative.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/fake-data/og-image.png",
    subtitle: "Generate Test Data in CSV, JSON, SQL, YAML & XML | Mockaroo Alternative",
    url: "https://jasperbernaers.com/fake-data/",
  },
  {
    title: "Free Lorem Ipsum Alternative",
    author: "Jasper Bernaers",
    category: CATEGORIES.data,
    description:
      "Free developer-themed placeholder text generator. Replace boring Lorem Ipsum with git commits, terminal logs, API responses, error messages, code comments, and more. Copy or download instantly.",
    favicon: "https://jasperbernaers.com/favicon.svg",
    ogImage: "https://jasperbernaers.com/lore-gen/og-image.png",
    subtitle: "Developer Placeholder Text Generator",
    url: "https://jasperbernaers.com/lore-gen/",
  },
  {
    title: "Free Public APIs",
    category: CATEGORIES.data,
    description:
      "A collection of Free Public APIs for Students and Developers. Tested every single day.",
    tags: [TAGS.data],
    url: "https://www.freepublicapis.com/",
  },
  {
    title: "Hoppscotch",
    category: CATEGORIES.data,
    description: "Helps you create requests faster, saving precious time on development.",
    subtitle: "Open source API development ecosystem",
    tags: [TAGS.tool],
    url: "https://hoppscotch.io/",
  },
  {
    title: "JSON For You",
    category: CATEGORIES.data,
    description:
      "Online JSON view, format, minify, validate and compare. It also provides graph view to preview JSON data, semantic comparing two JSON diffs, convert JSON to CSV or CSV to JSON and support jq online.",
    subtitle: "The best online JSON tool",
    url: "https://json4u.com/",
  },
  {
    title: "JSON Hero",
    category: CATEGORIES.data,
    description:
      "JSON Hero makes reading and understand JSON files easy by giving you a clean and beautiful UI packed with extra features.",
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
    title: "MCP Servers",
    category: CATEGORIES.data,
    description:
      "Official and community Model Context Protocol server implementations for AI tool integrations.",
    tags: [TAGS.data],
    url: "https://www.producthunt.com/",
  },
  {
    title: "Microlink",
    category: CATEGORIES.data,
    description:
      "Turn any URL into structured data. The all-in-one API for browser automation: screenshots, PDFs, scraping, and link previews. No infrastructure to manage.",
    tags: [TAGS.data],
    url: "https://microlink.io/",
  },
  {
    title: "Mockaroo",
    category: CATEGORIES.data,
    description:
      "A free test data generator and API mocking tool - Mockaroo lets you create custom CSV, JSON, SQL, and Excel datasets to test and demo your software.",
    subtitle: "Random Data Generator and API Mocking Tool | JSON / CSV / SQL / Excel",
    tags: [TAGS.tool],
    url: "https://www.mockaroo.com/",
  },
  {
    title: "Product Hunt",
    category: CATEGORIES.data,
    description:
      "Product Hunt is a curation of the best new products, every day. Discover the latest mobile apps, websites, and technology products that everyone's talking about.",
    favicon: "/github.svg",
    tags: [TAGS.data],
    url: "https://github.com/modelcontextprotocol/servers",
  },
  {
    title: "Public APIs",
    category: CATEGORIES.data,
    description: "A collective list of free APIs.",
    favicon: "/github.svg",
    tags: [TAGS.data],
    url: "https://github.com/public-apis/public-apis",
  },
  {
    title: "PublicAPIs.dev",
    category: CATEGORIES.data,
    description:
      "A collection of public APIs for developers, categorized and crowdsourced. Animals, books, cryptocurrencies, development, music, weather and much more.",
    tags: [TAGS.data],
    url: "https://publicapis.dev/",
  },
];
