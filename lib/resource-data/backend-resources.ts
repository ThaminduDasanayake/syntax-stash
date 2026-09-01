import { Resource } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const backendLinks: Resource<typeof CATEGORIES.backend>[] = [
  {
    title: "Appwrite",
    author: "Appwrite",
    category: CATEGORIES.backend,
    description:
      "Build like a team of hundreds with Appwrite's all-in-one, open-source infrastructure. Launch in minutes, use any framework, and scale affordably with Auth, Database, Storage, Functions, Realtime, Messaging, and Sites for static sites, SSR, and CSR frontends.",
    favicon: "https://appwrite.io/images/logos/logo.svg",
    ogImage: "https://appwrite.io/images/open-graph/website.avif",
    subtitle: "Build faster and scale bigger than ever",
    tags: [TAGS.backend],
    url: "https://appwrite.io/",
  },
  {
    title: "Arcjet",
    category: CATEGORIES.backend,
    description:
      "Arcjet is the runtime security platform that ships in your AI code. Detect prompt injection, authorize agent tool calls, redact sensitive data, and block bots and abuse. Real-time security building blocks you call inside your app, before an action happens.",
    favicon: "https://arcjet.com/favicon.png",
    ogImage: "https://arcjet.com/social/arcjet-og-image.png",
    subtitle: "AI agent runtime security",
    tags: [TAGS.security],
    url: "https://arcjet.com/",
  },
  {
    title: "AutoSend",
    category: CATEGORIES.backend,
    description:
      "AutoSend is a lightweight SendGrid alternative for transactional and marketing emails. Simple, modern, and built to scale.",
    favicon: "https://autosend.com/favicon_32.png",
    ogImage: "https://dqy38fnwh4fqs.cloudfront.net/autosend/website/landing/autosend-og.webp",
    subtitle: "Email for Developers and Marketers",
    tags: [TAGS.email],
    url: "https://autosend.com/",
  },
  {
    title: "Browserless",
    category: CATEGORIES.backend,
    className: "bg-foreground border-paper",
    description:
      "Give your AI agents a real cloud browser that won't crash or get blocked. Connect over MCP, Puppeteer, or Playwright with stealth and Authenticated Profiles built in.",
    favicon: "https://www.browserless.io/favicon.svg",
    ogImage:
      "https://cdn.prod.website-files.com/65cb4923a3a6b08fe1124094/6601a7a5b8508b353addd84f_social-preview.jpg",
    subtitle: "The Browser Your AI Agents Run On",
    url: "https://www.browserless.io/",
  },
  {
    title: "Checkmate",
    category: CATEGORIES.backend,
    description:
      "Monitor your servers, websites, Docker containers, and infrastructure with Checkmate. Open-source, self-hosted, and built for teams who value control.",
    subtitle: "Open source infrastructure monitoring",
    url: "https://checkmate.so/",
  },
  {
    title: "Cloudflare",
    category: CATEGORIES.backend,
    description: "Welcome to Cloudflare - Powering the next generation of applications",
    subtitle: "Build for the agent era",
    tags: [TAGS.hosting],
    url: "https://www.cloudflare.com/",
  },
  {
    title: "Cloudflare Pages",
    category: CATEGORIES.backend,
    description: "Build your next application with Cloudflare Pages",
    tags: [TAGS.hosting],
    url: "https://pages.cloudflare.com/",
  },
  {
    title: "CodeRabbit",
    category: CATEGORIES.backend,
    description:
      "AI-first pull request reviewer with context-aware feedback, line-by-line code suggestions, and real-time chat.",
    favicon: "https://www.coderabbit.ai/apple-touch-icon.png",
    ogImage: "https://www.coderabbit.ai/content/assets/agentic-change-management-og.png",
    subtitle: "AI Code Reviews",
    url: "https://www.coderabbit.ai/",
  },
  {
    title: "Convex",
    category: CATEGORIES.backend,
    description:
      "All gas, no breakages. Convex is the reactive backend platform that keeps up with you and your agents.",
    favicon: "https://dashboard.convex.dev/convex-logo-only.svg",
    ogImage: "https://www.convex.dev/og-home.png",
    subtitle: "All gas, no breakages",
    tags: [TAGS.backend],
    url: "https://www.convex.dev/",
  },
  {
    title: "Coolify",
    category: CATEGORIES.backend,
    description:
      "Self-hosting platform with superpowers. Deploy apps, databases & 280+ services to your server. Open-source alternative to Heroku.",
    tags: [TAGS.hosting],
    url: "https://coolify.io/",
  },
  {
    title: "cron-job.org",
    category: CATEGORIES.backend,
    description: "Free cronjobs - from minutely to once a year.",
    favicon:
      "https://raw.githubusercontent.com/pschlan/cron-job.org/master/frontend/public/logo192.png",
    ogImage:
      "https://cron-job.org/_next/image/?url=%2Fimages%2Fconsole-history-shadow-en.png&w=3840&q=75",
    url: "https://cron-job.org/en/",
  },
  {
    title: "Deno Deploy",
    category: CATEGORIES.backend,
    description: "One simple platform for anything that runs with JavaScript or Typescript.",
    url: "https://deno.com/deploy",
  },
  {
    title: "DigitalPlat Domain",
    category: CATEGORIES.backend,
    description:
      "DigitalPlat Domain is a nonprofit stewarding free, public-benefit namespaces for people and organizations everywhere.",
    tags: [TAGS.tool],
    url: "https://domain.digitalplat.org/",
  },
  {
    title: "Directus",
    category: CATEGORIES.backend,
    description:
      "The collaborative backend and self-hostable headless CMS over any database. No-code interface, REST + GraphQL APIs, and MCP for Claude, ChatGPT, and Cursor.",
    subtitle: "Collaborative Backend & Headless CMS",
    tags: [TAGS.backend],
    url: "https://directus.com/",
  },
  {
    title: "Domain Digger",
    category: CATEGORIES.backend,
    description:
      "Domain Digger is the full open-source toolkit for next-level domain analysis, providing detailed DNS, IP, WHOIS data, and SSL/TLS history in a user-friendly, no-install interface.",
    favicon:
      "https://raw.githubusercontent.com/wotschofsky/domain-digger/main/assets/logo-dark.svg",
    ogImage: "https://digger.tools/opengraph-image-1jdwle",
    subtitle: "DNS Lookup, WHOIS Lookup & more",
    tags: [TAGS.tool],
    url: "https://digger.tools/",
  },
  {
    title: "Domainstack",
    category: CATEGORIES.backend,
    className: "bg-foreground border-paper",
    description:
      "Instant lookups for WHOIS, DNS, hosting, certificates, SEO and more, plus free domain tracking and change alerts.",
    favicon: "https://domainstack.io/icon.svg",
    ogImage: "https://github.com/user-attachments/assets/15754f3d-82d1-4b8d-9b13-616c3ab9dd53",
    subtitle: "Domain Intelligence Made Easy",
    tags: [TAGS.tool],
    url: "https://domainstack.io/",
  },
  {
    title: "Doppler",
    category: CATEGORIES.backend,
    description:
      "Doppler's secrets management platform helps teams secure, sync, and automate secrets across cloud and on-prem environments with security and developer-friendly workflows.",
    favicon:
      "https://cdn.sanity.io/images/q3zajrd2/production/01ad0eb786c8260c4daa709fe8a6f57fb063655e-101x100.svg",
    ogImage:
      "https://cdn.sanity.io/images/q3zajrd2/production/d19dd120622b42ec12c9dd5e4f1cd00b92c698e3-2400x1260.png",
    subtitle: "Secrets management for humans and AI agents",
    tags: [TAGS.security],
    url: "https://www.doppler.com/",
  },
  {
    title: "Downdetector",
    category: CATEGORIES.backend,
    description:
      "Check if services are down based on real-time user reports. Downdetector shows live status updates and outages people are experiencing.",
    favicon: "https://downdetector.com/icons/apple-touch-icon.png",
    ogImage: "https://downdetector.com/images/open-graph/banner.png",
    subtitle: "Check real-time service problems and outages US",
    tags: [TAGS.tool],
    url: "https://downdetector.com/",
  },
  {
    title: "Find Great Domain Names",
    category: CATEGORIES.backend,
    description:
      "Each day, millions of expired domains are up for auction. You will miss golden opportunities.",
    favicon: "https://yournextdomain.com/public/logo.svg",
    url: "https://yournextdomain.com/",
  },
  {
    title: "Firecrawl",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Firecrawl is the context API to search, scrape, and interact with the web at scale. Turn any source into clean Markdown or structured data your agents can ship with.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    subtitle: "The context API to search, scrape, and interact with the web at scale. 🔥",
    url: "https://www.firecrawl.dev/",
  },
  {
    title: "Free AI Article Summarizer",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free AI article summarizer: paste any URL and get a concise summary in seconds. No signup required. Works on JavaScript-heavy pages, blogs, news, and reports. Need it at scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/article-summarizer",
  },
  {
    title: "Free AI Visibility Audit (AEO + GEO)",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "AI visibility audit: paste a URL and get AEO + GEO scores for how well AI answer engines (ChatGPT, Perplexity, Gemini, AI Overviews) can crawl, read, trust, and cite your page, with prioritized fixes. Powered by Firecrawl.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/ai-visibility-audit",
  },
  {
    title: "Free PDF to JSON Converter",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free PDF to JSON converter: paste any PDF URL and get clean, structured JSON instantly. No signup required. Extracts titles, sections, and key points from reports, invoices, and docs. Need it at scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/pdf-to-json",
  },
  {
    title: "Free Product Data Extractor",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Product data extraction from any URL: paste a product page and get structured JSON with price, variants, availability, images, SKU, and sale pricing, plus schema.org Product JSON-LD. Powered by Firecrawl.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/product-data-extractor",
  },
  {
    title: "Free URL Extractor",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free URL extractor: paste any website URL and get every link in seconds. No signup, no limits. Copy to clipboard or download CSV. Need scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/url-extractor",
  },
  {
    title: "Free URL to JSON Converter",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free URL to JSON converter: paste any website URL and get structured JSON instantly. No signup required. Works on JavaScript-heavy pages, blogs, docs, and product pages. Need it at scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/url-to-json",
  },
  {
    title: "Free Website to Markdown Converter",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free website to markdown converter: paste any URL and get clean markdown instantly. No signup required. Works on JavaScript-heavy pages, blogs, docs, and articles. Need it at scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/website-to-markdown",
  },
  {
    title: "Free Website to Text Converter",
    author: "Firecrawl",
    category: CATEGORIES.backend,
    description:
      "Free website to text converter: paste any URL and get clean plain text instantly. No signup required. Works on JavaScript-heavy pages, blogs, docs, and articles. Need it at scale? Use the Firecrawl API.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    url: "https://www.firecrawl.dev/tools/website-to-text",
  },
  {
    title: "here.now",
    category: CATEGORIES.backend,
    description:
      "Publish any file or folder to the web in seconds from your AI agent. Free, no sign-up required. Just tell your agent to publish to here.now and get a live URL back instantly.",
    subtitle: "Instant web hosting for agents",
    url: "https://here.now/",
  },
  {
    title: "Hoppscotch",
    category: CATEGORIES.backend,
    className: "bg-foreground border-paper",
    description:
      "Hoppscotch is an open-source API development ecosystem that helps you create and test your API requests saving precious time in development.",
    favicon: "https://hoppscotch.com/images/logo.svg",
    ogImage: "https://hoppscotch.com/banner.png",
    subtitle: "Make better APIs",
    url: "https://hoppscotch.com/",
  },
  {
    title: "itty.dev",
    category: CATEGORIES.backend,
    description: "Ultra-small, powerful helpers for modern serverless APIs.",
    favicon: "https://itty.dev/itty-square.256.png",
    url: "https://itty.dev/",
  },
  {
    title: "KeystoneJS",
    category: CATEGORIES.backend,
    description:
      "Build faster and scale further with the programmable open source GraphQL API back-end for structured content projects.",
    tags: [TAGS.backend],
    url: "https://keystonejs.com/",
  },
  {
    title: "Liam ERD",
    category: CATEGORIES.backend,
    description:
      "Automatically generates beautiful and easy-to-read ER diagrams from your database.",
    tags: [TAGS.backend],
    url: "https://liambx.com/",
  },
  {
    title: "Maily",
    category: CATEGORIES.backend,
    description:
      "Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.",
    favicon: "https://maily.to/brand/logo.svg",
    ogImage: "https://maily.to/og-image.png",
    subtitle: "Open-source editor for crafting emails",
    tags: [TAGS.email],
    url: "https://maily.to/",
  },
  {
    title: "n8n-io/n8n",
    category: CATEGORIES.backend,
    description:
      "Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.",
    url: "https://github.com/n8n-io/n8n",
  },
  {
    title: "namae",
    category: CATEGORIES.backend,
    description: "Check availability of your new app name for major registries at once.",
    favicon: "https://namae.dev/apple-touch-icon.png",
    ogImage: "https://namae.dev/social.png",
    subtitle: "Grab a slick name for your new project",
    tags: [TAGS.tool],
    url: "https://namae.dev/",
  },
  {
    title: "Payload",
    category: CATEGORIES.backend,
    description:
      "Built with TypeScript and React, Payload is an open-source headless CMS and application framework. Build anything.",
    subtitle: "The Next.js Headless CMS and App Framework",
    tags: [TAGS.backend],
    url: "https://payloadcms.com/",
  },
  {
    title: "PinMe",
    author: "Glitter Network",
    category: CATEGORIES.backend,
    description:
      "Publish a frontend in seconds. Great for AI generated pages, demos, and landing sites.",
    favicon: "https://pinme.eth.limo/favicon.ico",
    ogImage: "https://pinme.eth.limo/pinme.jpg",
    subtitle: "Publish Sites in Seconds",
    tags: [TAGS.hosting],
    url: "https://pinme.eth.limo/",
  },
  {
    title: "PocketBase",
    category: CATEGORIES.backend,
    description:
      "Open Source backend in 1 file with realtime database, authentication, file storage and admin dashboard",
    subtitle: "Open Source backend in 1 file",
    tags: [TAGS.backend, TAGS.development, TAGS["open-source"]],
    url: "https://pocketbase.io/",
  },
  {
    title: "Postgres Sandbox",
    category: CATEGORIES.backend,
    description: "In-browser Postgres sandbox with AI assistance",
    tags: [TAGS.backend],
    url: "https://database.build/",
  },
  {
    title: "Puter.js",
    author: "Puter",
    category: CATEGORIES.backend,
    description:
      "Puter.js is the backend for AI-generated apps. Use your existing AI coding tool to build production-ready apps with up to 90% fewer AI tokens. Auth, cloud storage, database, OpenAI, Claude, Gemini, Grok, Kimi, DeepSeek, and more, all through a single JavaScript library. No API keys. Zero setup.",
    favicon: "https://developer.puter.com/favicons/apple-icon.png",
    ogImage: "https://developer.puter.com/card.png",
    subtitle: "The Backend for AI-Generated Apps",
    url: "https://developer.puter.com/",
  },
  {
    title: "Render",
    category: CATEGORIES.backend,
    description:
      "Deploy and scale any app or agent from your first user to your billionth. Build faster on intuitive cloud infrastructure for the modern web.",
    subtitle: "The cloud for builders",
    tags: [TAGS.hosting],
    url: "https://render.com/",
  },
  {
    title: "Resend",
    author: "Resend",
    category: CATEGORIES.backend,
    description:
      "The best way to reach humans instead of spam folders. Deliver transactional and marketing emails at scale.",
    favicon: "https://resend.com/static/favicons/favicon-marketing@144x144.png",
    ogImage: "https://resend.com/static/cover.png",
    subtitle: "Email for developers",
    tags: [TAGS.email],
    url: "https://resend.com/",
  },
  {
    title: "ScrapingBee",
    category: CATEGORIES.backend,
    description:
      "ScrapingBee is the best web scraping API that handles proxies and headless browsers for you — so you can focus on extracting the data you need.",
    favicon: "https://www.scrapingbee.com/images/favico.svg",
    ogImage: "https://www.scrapingbee.com/images/cover.jpg",
    subtitle: "The Best Web Scraping API",
    url: "https://www.scrapingbee.com/",
  },
  {
    title: "Scrapling",
    author: "D4Vinci",
    category: CATEGORIES.backend,
    description:
      "🕷️ An adaptive Web Scraping framework that handles everything from a single request to a full-scale crawl!",
    favicon: "/github.svg",
    url: "https://github.com/d4vinci/Scrapling",
  },
  {
    title: "Servercn",
    author: "akkaldhami",
    category: CATEGORIES.backend,
    description:
      "servercn is a component registry for building production-ready node.js backends, inspired by shadcn/ui.",
    tags: [TAGS.backend],
    url: "https://servercn.vercel.app/",
  },
  {
    title: "Strapi",
    category: CATEGORIES.backend,
    description:
      "Strapi is the next-gen headless CMS, open-source, JavaScript/TypeScript, enabling content-rich experiences to be created, managed and exposed to any digital device.",
    subtitle: "Open-Source TypeScript Headless CMS for Next.js, Astro, Tanstack Start, and Nuxt.js",
    tags: [TAGS.backend],
    url: "https://strapi.io/",
  },
  {
    title: "Surge",
    category: CATEGORIES.backend,
    description:
      "Shipping web projects should be fast, easy, and low risk. Surge is static web publishing for Front-End Developers, right from the CLI.",
    url: "https://surge.sh/",
  },
  {
    title: "tiiny.host",
    category: CATEGORIES.backend,
    description: "Tiiny Host is the simplest way to share your work online.",
    url: "https://tiiny.host/",
  },
  {
    title: "TinaCMS",
    category: CATEGORIES.backend,
    description:
      "Combine the power of GitHub and Markdown with TinaCMS for seamless content management. Empower developers and creators to edit, preview, and manage static and dynamic sites effortlessly.",
    tags: [TAGS.backend],
    url: "https://tina.io/",
  },
  {
    title: "Trigger.dev",
    author: "Trigger.dev",
    category: CATEGORIES.backend,
    description:
      "Trigger.dev is the open source platform for building AI workflows in TypeScript. Long-running tasks with retries, queues, observability, and elastic scaling.",
    gitHubLink: "https://github.com/triggerdotdev/trigger.dev",
    subtitle: "Build and deploy fully-managed AI agents and workflows.",
    url: "https://trigger.dev/",
  },
  {
    title: "tunnl.gg",
    category: CATEGORIES.backend,
    description:
      "Instant public URLs for your local web server. No installation required, just use SSH. Secure, fast, and developer-friendly reverse tunneling.",
    favicon: "https://tunnl.gg/favicon.svg",
    ogImage: "https://tunnl.gg/og-image.png",
    subtitle: "The easiest way to expose localhost to the internet",
    url: "https://tunnl.gg/",
  },
  {
    title: "Typesense",
    category: CATEGORIES.backend,
    description:
      "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
    subtitle: "Open Source Alternative to Algolia + Pinecone",
    tags: [TAGS.backend],
    url: "https://typesense.org/",
  },
  {
    title: "Umami",
    category: CATEGORIES.backend,
    description:
      "Understand traffic, campaigns, behavior, conversions, and revenue in one privacy-first, open-source analytics platform. Self-host or use Umami Cloud.",
    favicon: "https://raw.githubusercontent.com/umami-software/umami/master/src/assets/logo.svg",
    ogImage: "https://umami.is/opengraph-image-j8qpfc.png",
    subtitle: "Privacy-First Analytics Platform",
    tags: [TAGS.analytics, TAGS.selfHosted],
    url: "https://umami.is/",
  },
  {
    title: "UserCheck",
    category: CATEGORIES.backend,
    description: "Block disposable emails with our API. Start for free today.",
    favicon: "https://www.usercheck.com/favicon.png",
    ogImage: "https://api.webshot.co/EVWMY5",
    subtitle: "Stop Disposable Emails from Creating Spam Accounts",
    tags: [TAGS.email],
    url: "https://www.usercheck.com/",
  },
  {
    title: "useSend",
    category: CATEGORIES.backend,
    description: "Pay only for what you send, not for storing contacts",
    favicon: "https://usesend.com/logo-squircle.png",
    ogImage: "https://uploads.usesend.com/logos/og.png",
    subtitle: "Open source email platform",
    tags: [TAGS.email],
    url: "https://usesend.com/",
  },
];
