import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const backendLinks: Tool[] = [
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
    title: "AutoSend",
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
    description:
      "Monitor your servers, websites, Docker containers, and infrastructure with Checkmate. Open-source, self-hosted, and built for teams who value control.",
    subtitle: "Open source infrastructure monitoring",
    url: "https://checkmate.so/",
  },
  {
    title: "Cloudflare",
    category: CATEGORIES.dev,
    description: "Welcome to Cloudflare - Powering the next generation of applications",
    subtitle: "Build for the agent era",
    tags: [TAGS.hosting],
    url: "https://www.cloudflare.com/",
  },
  {
    title: "Cloudflare Pages",
    category: CATEGORIES.dev,
    description: "Build your next application with Cloudflare Pages",
    tags: [TAGS.hosting],
    url: "https://pages.cloudflare.com/",
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
    category: CATEGORIES.dev,
    description:
      "Self-hosting platform with superpowers. Deploy apps, databases & 280+ services to your server. Open-source alternative to Heroku.",
    tags: [TAGS.hosting],
    url: "https://coolify.io/",
  },
  {
    title: "cron-job.org",
    category: CATEGORIES.dev,
    description: "Free cronjobs - from minutely to once a year.",
    favicon:
      "https://raw.githubusercontent.com/pschlan/cron-job.org/master/frontend/public/logo192.png",
    ogImage:
      "https://cron-job.org/_next/image/?url=%2Fimages%2Fconsole-history-shadow-en.png&w=3840&q=75",
    url: "https://cron-job.org/en/",
  },
  {
    title: "Deno Deploy",
    category: CATEGORIES.dev,
    description: "One simple platform for anything that runs with JavaScript or Typescript.",
    url: "https://deno.com/deploy",
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
    title: "Firecrawl Tools",
    author: "Firecrawl",
    category: CATEGORIES.dev,
    description:
      "Free online tools for developers and marketers: extract URLs from any website, summarize articles with AI, and more. No signup required. Powered by Firecrawl.",
    favicon:
      "https://raw.githubusercontent.com/firecrawl/firecrawl/main/apps/test-site/src/assets/firecrawl-logo.svg",
    ogImage: "https://www.firecrawl.dev/og.png",
    subtitle: "Free Web Extraction Tools",
    url: "https://www.firecrawl.dev/tools",
  },
  {
    title: "here.now",
    category: CATEGORIES.dev,
    description:
      "Publish any file or folder to the web in seconds from your AI agent. Free, no sign-up required. Just tell your agent to publish to here.now and get a live URL back instantly.",
    subtitle: "Instant web hosting for agents",
    url: "https://here.now/",
  },
  {
    title: "Hoppscotch",
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
    description:
      "Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.",
    url: "https://github.com/n8n-io/n8n",
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
    category: CATEGORIES.dev,
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
    title: "Render",
    category: CATEGORIES.dev,
    description:
      "Deploy and scale any app or agent from your first user to your billionth. Build faster on intuitive cloud infrastructure for the modern web.",
    subtitle: "The cloud for builders",
    tags: [TAGS.hosting],
    url: "https://render.com/",
  },
  {
    title: "Resend",
    author: "Resend",
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
    description:
      "Shipping web projects should be fast, easy, and low risk. Surge is static web publishing for Front-End Developers, right from the CLI.",
    url: "https://surge.sh/",
  },
  {
    title: "tiiny.host",
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
    description:
      "Trigger.dev is the open source platform for building AI workflows in TypeScript. Long-running tasks with retries, queues, observability, and elastic scaling.",
    subtitle: "Build and deploy fully-managed AI agents and workflows.",
    url: "https://trigger.dev/",
  },
  {
    title: "tunnl.gg",
    category: CATEGORIES.dev,
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
    title: "UserCheck",
    category: CATEGORIES.dev,
    description: "Block disposable emails with our API. Start for free today.",
    favicon: "https://www.usercheck.com/favicon.png",
    ogImage: "https://api.webshot.co/EVWMY5",
    subtitle: "Stop Disposable Emails from Creating Spam Accounts",
    tags: [TAGS.email],
    url: "https://www.usercheck.com/",
  },
  {
    title: "useSend",
    category: CATEGORIES.dev,
    description: "Pay only for what you send, not for storing contacts",
    favicon: "https://usesend.com/logo-squircle.png",
    ogImage: "https://uploads.usesend.com/logos/og.png",
    subtitle: "Open source email platform",
    tags: [TAGS.email],
    url: "https://usesend.com/",
  },
];
