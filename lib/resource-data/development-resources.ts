import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const developmentLinks: Tool[] = [
  {
    title: "10 Minute Mail",
    author: "Devon Hillard",
    category: CATEGORIES.dev,
    description:
      "Free temp mail that self-destructs in 10 minutes. The original temp email and disposable email service since 2006. No signup needed. Get your free temporary email address instantly.",
    favicon:
      "https://10minutemail.com/img/icons/apple-touch-icon-180x180-17053118f766d4b08f0abf1a090d3ac1.png",
    ogImage: "https://10minutemail.com/img/10minutemail-og-image.jpg",
    subtitle:
      "Free Temp Mail & Temporary Email Service - 10 Minute Mail - Free Anonymous Temporary email",
    tags: [TAGS.tool],
    url: "https://10minutemail.com/",
  },
  {
    title: "10x",
    category: CATEGORIES.dev,
    description:
      "10x is an AI-powered iOS app builder for macOS. Describe the app you want, and 10x generates SwiftUI code, an Xcode project, and a simulator preview.",
    subtitle: "App Builder",
    tags: [TAGS.development],
    url: "https://www.10x.app/",
  },
  {
    title: "Accept: text/markdown",
    category: CATEGORIES.dev,
    description:
      "Serve Markdown to AI agents and LLMs via the Accept: text/markdown header. Browsers get HTML, agents get clean Markdown.",
    subtitle: "Serve Markdown to AI Agents with Accept Headers",
    tags: [TAGS.markdown, TAGS.tool],
    url: "https://acceptmarkdown.com/",
  },
  {
    title: "AdGuard Ad Blocker",
    category: CATEGORIES.dev,
    description:
      "AdGuard is the best way to get rid of annoying ads and online tracking and protect your computer from malware. Make your web surfing fast, safe and ad-free",
    favicon: "https://st2.adguardcdn.com/favicons/adguard/favicon.svg",
    ogImage: "https://cdn.adguardcdn.com/website/adguard.com/video/meta/agnar_en.png",
    subtitle: "Block ads, popups, and trackers",
    tags: [TAGS.tool],
    url: "https://adguard.com/",
  },
  {
    title: "Alexandrie",
    author: "Alexandrie Team",
    category: CATEGORIES.dev,
    description:
      "Alexandrie is a modern note-taking and knowledge base application built for students & creators. Write, organize and render beautiful notes using extended Markdown in a fast, clean and distraction-free interface. Self-hostable with Docker.",
    subtitle: "Modern Markdown Note-Taking & Knowledge Base App",
    url: "https://alexandrie-hub.fr/",
  },
  {
    title: "almostnode",
    author: "Macaly",
    category: CATEGORIES.dev,
    description:
      "zA lightweight JavaScript library that runs Node.js, Next.js, Vite, and Express entirely in the browser. ~250KB gzipped, instant startup, no server required.",
    subtitle: "Node.js in your browser",
    url: "https://almostnode.dev/",
  },
  {
    title: "annyang!",
    category: CATEGORIES.dev,
    description:
      "annyang is a JavaScript SpeechRecognition library that makes adding voice commands to your site super-easy. Let your users control your site with their voice.",
    subtitle: "Easily add speech recognition to your site",
    tags: [TAGS.tool],
    url: "https://www.talater.com/annyang/",
  },
  {
    title: "Anytype",
    category: CATEGORIES.dev,
    description:
      "Create notes, tasks, databases, and chats that only you can access. Your data stays on your device — fully owned, secure, and private. Free to start.",
    subtitle: "A safe haven for digital collaboration",
    url: "https://anytype.io/",
  },
  {
    title: "Appwrite",
    author: "Appwrite",
    category: CATEGORIES.dev,
    description:
      "Build like a team of hundreds with Appwrite's all-in-one, open-source infrastructure. Launch in minutes, use any framework, and scale affordably with Auth, Database, Storage, Functions, Realtime, Messaging, and Sites for static sites, SSR, and CSR frontends.",
    favicon: "/github.svg",
    subtitle: "Build faster and scale bigger than ever",
    tags: [TAGS.backend, TAGS.development],
    url: "https://appwrite.io/",
  },
  {
    title: "Arnis",
    category: CATEGORIES.dev,
    description:
      "Generate Minecraft worlds from real-world locations. Free, open-source tool to recreate your hometown, city, or any place on Earth in Minecraft.",
    tags: [TAGS.map],
    url: "https://arnismc.com/",
  },
  {
    title: "ASCII Art Generator",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Free ASCII art generator — the easiest ascii pictures generator and ascii text maker online. Convert any image or photo to ASCII art, or transform text into ASCII art fonts (like Patorjk TAAG). 50+ FIGlet fonts, color mode, multiple character sets. Download as TXT or PNG. No upload, no sign-up, 100% private.",
    subtitle: "Text to ASCII Art Maker & Braille Art | No Upload | Patorjk Alternative",
    tags: [TAGS.ascii, TAGS.tool],
    url: "https://jasperbernaers.com/ASCII-generator/",
  },
  {
    title: "ASCII Webcam",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Turn your webcam into live ASCII art — real-time camera to text conversion in your browser. Multiple character sets (Blocks, Braille, Detailed, Binary), color mode, adjustable FPS & resolution. Record GIFs, take snapshots. 100% private, no upload, no sign-up.",
    subtitle: "Live Camera to ASCII Art in Real-Time | No Upload | jasperbernaers.com",
    tags: [TAGS.ascii, TAGS.tool],
    url: "https://jasperbernaers.com/ascii-webcam/",
  },
  {
    title: "AutoSend",
    category: CATEGORIES.dev,
    description:
      "AutoSend is a lightweight SendGrid alternative for transactional and marketing emails. Simple, modern, and built to scale.",
    favicon: "https://autosend.com/favicon_32.png",
    ogImage: "https://dqy38fnwh4fqs.cloudfront.net/autosend/website/landing/autosend-og.webp",
    subtitle: "Email for Developers and Marketers",
    tags: [TAGS.email, TAGS.tool],
    url: "https://autosend.com/",
  },
  {
    title: "Awesome OSS Alternatives",
    author: "RunaCapital",
    category: CATEGORIES.dev,
    description: "Awesome list of open-source startup alternatives to well-known SaaS products 🚀.",
    favicon: "/github.svg",
    tags: [TAGS.tool],
    url: "https://github.com/RunaCapital/awesome-oss-alternatives",
  },
  {
    title: "Barcode Generator Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.design,
    description:
      "Create barcodes online free — Code 128, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14, GS1-128, Code 39, MSI, Codabar & Pharmacode. Live preview, custom size & colors, download PNG or SVG. No signup, no watermark, 100% in your browser.",
    subtitle: "EAN-13, UPC-A, Code 128 & 15+ Formats (PNG/SVG)",
    tags: [TAGS.tool],
    url: "https://jasperbernaers.com/online-free-barcode-generator/",
  },
  {
    title: "BestAlternative",
    category: CATEGORIES.dev,
    description:
      "Find the best self-hosted, privacy-friendly, free, and local-first open-source alternatives to popular software, with migration guidance and practical evaluation details.",
    subtitle: "Best Open Source Alternatives",
    tags: [TAGS.tool],
    url: "https://www.bestalternative.dev/en",
  },
  {
    title: "Better-T-Stack",
    category: CATEGORIES.dev,
    description:
      "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
    favicon: "https://better-t-stack.dev/favicon/favicon.svg",
    ogImage: "https://better-t-stack.dev/og/site/home.png",
    subtitle: "Free Online Design Tools for Developers & Designers",
    tags: [TAGS.tool],
    url: "https://better-t-stack.dev/",
  },
  {
    title: "BORED",
    category: CATEGORIES.dev,
    description:
      "Discover the most fun, interesting and cool websites on the internet. Hundreds of hand-picked funny sites, free games, educational resources and things to do when you're bored.",
    subtitle: "Fun, interesting & cool websites to explore when bored",
    url: "https://www.bored.com/",
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
    tags: [TAGS.backend],
    url: "https://www.browserless.io/",
  },
  {
    title: "Bundlephobia",
    category: CATEGORIES.dev,
    description:
      "Bundlephobia helps you find the performance impact of npm packages. Find the size of any javascript package and its effect on your frontend bundle.",
    subtitle: "Size of npm dependencies",
    tags: [TAGS.tool],
    url: "https://bundlephobia.com/",
  },
  {
    title: "Bytes",
    category: CATEGORIES.dev,
    description:
      "The most entertaining (and informative) JavaScript newsletter. Delivered twice a week, for free.",
    subtitle: "The Best JavaScript Newsletter",
    tags: [TAGS.tool],
    url: "https://bytes.dev/",
  },
  {
    title: "Cadmapper",
    category: CATEGORIES.dev,
    description:
      "Cadmapper lets anyone create 3D CAD files of any area in the world within minutes. Worldwide map files for any design program.",
    tags: [TAGS.map],
    url: "https://cadmapper.com/",
  },
  {
    title: "Cal.com",
    category: CATEGORIES.dev,
    description:
      "A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.",
    subtitle: "Scheduling Software for Online Bookings",
    tags: [TAGS.tool],
    url: "https://cal.com/",
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
    title: "City Roads",
    category: CATEGORIES.dev,
    description:
      "This website allows you to select a city and then draws every single road on a screen.",
    tags: [TAGS.map],
    url: "https://anvaka.github.io/city-roads/",
  },
  {
    title: "Cityweft",
    category: CATEGORIES.dev,
    description:
      "Generate clean, editable 3D site context for any location on Earth — ready for your CAD, BIM, or generative-design workflow.",
    tags: [TAGS.map],
    url: "https://cityweft.com/",
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
    url: "https://pages.cloudflare.com/",
  },
  {
    title: "cobalt",
    category: CATEGORIES.dev,
    description:
      "cobalt lets you save what you love without ads, tracking, paywalls or other nonsense. just paste the link and you're ready to rock!",
    url: "https://cobalt.tools/",
  },
  {
    title: "Coddy",
    category: CATEGORIES.dev,
    description:
      "A growing collection of free online developer tools. Format JSON and SQL, test regex, decode JWT and Base64, generate UUIDs and passwords, compare text,.",
    subtitle: "Free Online Developer Tools",
    tags: [TAGS.tool],
    url: "https://coddy.tech/tools",
  },
  {
    title: "Code Diagram",
    category: CATEGORIES.dev,
    description: "A diagram tool that lives inside VS Code",
    favicon: "https://www.codediagram.io/assets/logo-big-square.png",
    ogImage: "https://www.codediagram.io/assets/img/twitter-url-main.png",
    tags: [TAGS.tool],
    url: "https://www.codediagram.io/",
  },
  {
    title: "CodeFlow",
    category: CATEGORIES.dev,
    description:
      "Visualize any GitHub repository's architecture in seconds. See dependencies, blast radius, code ownership, security issues, and design patterns. No installation required.",
    subtitle: "Open Source Architecture Intelligence",
    url: "https://codeflow-five.vercel.app/",
  },
  {
    title: "comimi",
    category: CATEGORIES.dev,
    description:
      "comimi is a TypeScript/JavaScript library that allows you to embed a manga viewer into websites.",
    tags: [TAGS.development],
    url: "https://yui540.com/comimi",
  },
  {
    title: "Context.dev Free Tools",
    category: CATEGORIES.dev,
    description: "Free tools for developers and SEOs",
    tags: [TAGS.tool],
    url: "https://www.context.dev/free-tools",
  },
  {
    title: "Convert to it!",
    category: CATEGORIES.dev,
    description:
      "Truly universal online file converter. Private, on-device conversion across mediums.",
    url: "https://p2r3.github.io/convert/",
  },
  {
    title: "Convex",
    category: CATEGORIES.dev,
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
    tags: [TAGS.development],
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
    tags: [TAGS.tool],
    url: "https://cron-job.org/en/",
  },
  {
    title: "CSS Grid Generator",
    category: CATEGORIES.dev,
    description:
      "A user-friendly tool designed for web developers to effortlessly create customizable CSS grids for seamless web development.",
    tags: [TAGS.development],
    url: "https://cssgridgenerator.io/",
  },
  {
    title: "CSS Unit Converter",
    category: CATEGORIES.dev,
    description:
      "Easily convert pixels to CSS units like Rems, Ems, Inches and more with CSS Unit Converter tools. Get accurate results, fast!",
    ogImage: "https://cssunitconverter.com/uploads/css-unit-converter-social-og.png",
    subtitle: "Effortless, Fast and 100% Accurate",
    tags: [TAGS.tool],
    url: "https://cssunitconverter.com/",
  },
  {
    title: "delphitools",
    category: CATEGORIES.dev,
    description:
      "A collection of small, low stakes and low effort tools. No logins, no registration, no data collection. Everything runs locally in your browser.",
    subtitle: "privacy-first browser tools",
    tags: [TAGS.tool],
    url: "https://delphi.tools/",
  },
  {
    title: "Deno Deploy",
    category: CATEGORIES.dev,
    description: "One simple platform for anything that runs with JavaScript or Typescript.",
    url: "https://deno.com/deploy",
  },
  {
    title: "DEV Community",
    category: CATEGORIES.dev,
    description:
      "A space to discuss and keep up software development and manage your software career",
    tags: [TAGS.social, TAGS.tool],
    url: "https://dev.to/",
  },
  {
    title: "DevDocs API Documentation",
    category: CATEGORIES.dev,
    description:
      "Fast, offline, and free documentation browser for developers. Search 100+ docs in one web app: HTML, CSS, JavaScript, PHP, Ruby, Python, Go, C, C++…",
    tags: [TAGS.tool],
    url: "https://devdocs.io/",
  },
  {
    title: "Devhints",
    author: "Rico Sta. Cruz",
    category: CATEGORIES.dev,
    description: "A ridiculous collection of web development cheatsheets",
    subtitle: "TL;DR for developer documentation",
    tags: [TAGS.development, TAGS.education],
    url: "https://devhints.io/",
  },
  {
    title: "Dev Resources",
    author: "Marcel Cruz",
    category: CATEGORIES.dev,
    description:
      "A collection of resources for developers, categorized and crowdsourced. Learn programming, UI inspiration, job boards, images, icons and much more.",
    favicon: "https://devresourc.es/favicon-dr/safari-pinned-tab.svg",
    ogImage: "https://devresourc.es/og",
    subtitle: "A Collaborative List Of 800+ Resources For Developers",
    tags: [TAGS.tool],
    url: "https://devresourc.es/",
  },
  {
    title: "DevToolLab",
    author: "DevToolLab Team",
    category: CATEGORIES.dev,
    description:
      "Free online developer tools for JSON, XML, CSS formatting, conversion, minification and encoding. No registration required.",
    favicon: "https://devtoollab.com/favicon.svg",
    ogImage: "https://devtoollab.com/og-image.svg",
    subtitle: "Free Online Developer Tools",
    tags: [TAGS.tool],
    url: "https://devtoollab.com/",
  },
  {
    title: "Dev Tools",
    author: "Hitarth Shah",
    category: CATEGORIES.dev,
    description:
      "Free online developer tools including JSON viewer, Base64 converter, UUID generator, JWT decoder, and more. All tools work offline for privacy and speed. No registration required.",
    favicon: "https://dev-tool.dev/favicon.ico",
    subtitle: "Your Ultimate Developer Toolkit | Free Online Tools",
    tags: [TAGS.tool],
    url: "https://dev-tool.dev/",
  },
  {
    title: "Dev Utilities",
    author: "Jam",
    category: CATEGORIES.dev,
    description:
      "Jam exists to make developers lives easier. Here are fast, free, open source, ad-free tools. Simplify your coding tasks with utilities like Base64 encode/decode, URL encode/decode, HEX to RGB converter, Timestamp to Date converter, and more.",
    favicon:
      "https://raw.githubusercontent.com/jamdotdev/jam-dev-utilities/main/public/icons/icon.svg",
    subtitle: "Open Source Developer Tools | Free Utilities",
    tags: [TAGS.tool],
    url: "https://jam.dev/utilities",
  },
  {
    title: "Diffs, from Pierre",
    author: "The Pierre Computer Co.",
    category: CATEGORIES.dev,
    description:
      "@pierre/diffs is an open source diff and code rendering library. Built on Shiki for syntax highlighting and theming, super customizable, and packed with features.",
    favicon: "https://diffs.com/diffs-brand/icon.svg",
    ogImage: "https://diffs.com/diffs-brand/opengraph-image.png",
    tags: [TAGS.tool],
    url: "https://diffs.com/",
  },
  {
    title: "DigitalPlat Domain",
    category: CATEGORIES.dev,
    description:
      "DigitalPlat Domain is a nonprofit stewarding free, public-benefit namespaces for people and organizations everywhere.",
    tags: [TAGS.tool],
    url: "https://domain.digitalplat.org/",
  },
  {
    title: "Directus",
    category: CATEGORIES.dev,
    description:
      "The collaborative backend and self-hostable headless CMS over any database. No-code interface, REST + GraphQL APIs, and MCP for Claude, ChatGPT, and Cursor.",
    subtitle: "Collaborative Backend & Headless CMS",
    tags: [TAGS.backend],
    url: "https://directus.com/",
  },
  {
    title: "Ditto",
    author: "ion.design",
    category: CATEGORIES.dev,
    description:
      "Point Ditto at any public URL and get a byte-stable copy as clean, componentized Next.js or Vite code in minutes — deterministic, no LLM guesswork, fidelity preserved. Open source, with a hosted REST API and MCP server.",
    favicon: "https://ditto.site/assets/ditto.svg",
    ogImage: "https://ditto.site/assets/og.png",
    subtitle: "Clone any website",
    tags: [TAGS.tool],
    url: "https://ditto.site/",
  },
  {
    title: "docmd",
    category: CATEGORIES.dev,
    description:
      "The zero-config documentation engine that starts instantly and scales with you, fast, SEO-friendly, and AI-ready by default.",
    subtitle: "Build production-ready documentation from Markdown in seconds",
    url: "https://docmd.io/",
  },
  {
    title: "docsify",
    category: CATEGORIES.dev,
    description: "A magical documentation generator.",
    favicon: "https://docsify.js.org/_media/icon.svg",
    url: "https://docsify.js.org/#/",
  },
  {
    title: "Domain Digger",
    category: CATEGORIES.dev,
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
    category: CATEGORIES.dev,
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
    title: "Downdetector",
    category: CATEGORIES.dev,
    description:
      "Check if services are down based on real-time user reports. Downdetector shows live status updates and outages people are experiencing.",
    favicon: "https://downdetector.com/icons/apple-touch-icon.png",
    ogImage: "https://downdetector.com/images/open-graph/banner.png",
    subtitle: "Check real-time service problems and outages US",
    tags: [TAGS.tool],
    url: "https://downdetector.com/",
  },
  {
    title: "Dub",
    author: "Dub Inc",
    category: CATEGORIES.dev,
    description:
      "Dub is the modern link attribution platform for short links, conversion tracking, and affiliate programs. Loved by world-class marketing teams like Framer, Perplexity, Superhuman, Twilio, Buffer and more.",
    favicon: "/github.svg",
    subtitle: "The Modern Link Attribution Platform",
    tags: [TAGS.development, TAGS.tool],
    url: "https://github.com/dubinc/dub",
  },
  {
    title: "emailmd",
    category: CATEGORIES.dev,
    description:
      "Turn markdown into responsive, email-safe HTML that renders perfectly across every client.",
    subtitle: "Responsive Emails, Written in Markdown",
    tags: [TAGS.markdown, TAGS.tool],

    url: "https://www.emailmd.dev/",
  },
  {
    title: "explainx.ai Tools",
    category: CATEGORIES.dev,
    description:
      "Discover and compare AI tools — search by task, filter by category, and read community reviews.",
    tags: [TAGS.tool],
    url: "https://explainx.ai/tools",
  },
  {
    title: "Find Great Domain Names",
    category: CATEGORIES.dev,
    description:
      "Each day, millions of expired domains are up for auction. You will miss golden opportunities.",
    favicon: "https://yournextdomain.com/public/logo.svg",
    url: "https://yournextdomain.com/",
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
    tags: [TAGS.tool],
    url: "https://www.firecrawl.dev/tools",
  },
  {
    title: "FliiipBook",
    author: "FliiipBook",
    category: CATEGORIES.dev,
    description:
      "Draw frame-by-frame animations and create GIFs directly in your browser. Simple, fun, and powerful animation tool with onion skinning, timeline controls, and instant GIF export.",
    favicon: "https://www.fliiipbook.com/favicon.ico",
    ogImage: "https://www.fliiipbook.com/og-image.png",
    tags: [TAGS.animation, TAGS.tool],
    url: "https://www.fliiipbook.com/",
  },
  {
    title: "Flority",
    category: CATEGORIES.dev,
    description: "Your Online Flower Arrangement App",
    url: "https://flority.digital/",
  },
  {
    title: "FluidCAD",
    category: CATEGORIES.dev,
    description: "FluidCAD — write CAD models in JavaScript. See the result in real time.",
    subtitle: "Parametric CAD for everyone",
    tags: [TAGS.cad, TAGS.tool, TAGS["3D"]],
    url: "https://fluidcad.io/",
  },
  {
    title: "Free for Developers",
    category: CATEGORIES.dev,
    description:
      "Developers and Open Source authors now have a massive amount of services offering free tiers, but it can be hard to find them all to make informed decisions.",
    tags: [TAGS.tool],
    url: "https://free-for.dev/",
  },
  {
    title: "Fumadocs",
    category: CATEGORIES.dev,
    description: "The React.js documentation framework.",
    favicon: "https://www.fumadocs.dev/icon.png",
    ogImage: "https://www.fumadocs.dev/banner.png",
    url: "https://www.fumadocs.dev/",
  },
  {
    title: "GalaxyBrain",
    category: CATEGORIES.dev,
    description: "An information operating system powered by local files.",
    tags: [TAGS.tool],
    url: "https://galaxybrain.com/",
  },
  {
    title: "gists.sh",
    category: CATEGORIES.dev,
    description: "Gists, but beautiful",
    favicon: "https://gists.sh/icon.svg?icon.4926590c.svg",
    ogImage: "https://gists.sh/opengraph-image?9c823d7c5fa882a6",
    tags: [TAGS.tool],
    url: "https://gists.sh/",
  },
  {
    title: "GitButler",
    category: CATEGORIES.dev,
    description:
      "GitButler is a modern Git-based version control interface with both a GUI and CLI built from the ground up for AI-powered workflows.",
    favicon: "https://gitbutler.com/favicon/favicon.svg",
    ogImage: "https://gitbutler.com/og-image.png",
    subtitle: "Git, but better",
    tags: [TAGS.git],
    url: "https://gitbutler.com/",
  },
  {
    title: "GitDiagram",
    category: CATEGORIES.dev,
    description:
      "Turn any GitHub repository into an interactive architecture diagram for quick codebase understanding.",
    subtitle: "Visualize Any GitHub Repository",
    tags: [TAGS.tool],
    url: "https://gitdiagram.com/",
  },
  {
    title: "GitDocify",
    category: CATEGORIES.dev,
    description:
      "Turn any GitHub repository into structured, source-grounded documentation with GitDocify..",
    tags: [TAGS.development],
    url: "https://gitdocify.com/",
  },
  {
    title: "Git Explorer",
    author: "summitech",
    category: CATEGORIES.dev,
    description: "Find the right git commands without digging through the web.",
    tags: [TAGS.development, TAGS.tool],
    url: "https://git.gaozih.com/",
  },
  {
    title: "gitinspect.com",
    author: "Jeremy Osih",
    category: CATEGORIES.dev,
    description: "Chat with any github repo",
    tags: [TAGS.git, TAGS.tool, TAGS["ai-agent"]],
    url: "https://www.gitinspect.com/",
  },
  {
    title: "GitMCP",
    category: CATEGORIES.dev,
    description: "Instantly create an MCP server for any GitHub project",
    tags: [TAGS.git],
    url: "https://gitmcp.io/",
  },
  {
    title: "GitReverse",
    category: CATEGORIES.dev,
    description:
      "Steal any code and make it your own. Paste a GitHub URL and get a plain-language coding agent prompt you can build from.",
    tags: [TAGS.ai, TAGS.development],
    url: "https://www.gitreverse.com/",
  },
  {
    title: "GitToSkill",
    category: CATEGORIES.dev,
    description:
      "Turn any GitHub profile into an installable coding skill by analyzing the profile, repo lineup, and real code style.",
    subtitle: "Visualize Any GitHub Repository",
    url: "https://www.gittoskill.com/",
  },
  {
    title: "Glance",
    author: "Glance",
    category: CATEGORIES.dev,
    description: "A self-hosted dashboard that puts all your feeds in one place",
    favicon: "/github.svg",
    ogImage:
      "https://repository-images.githubusercontent.com/github-production-repository-image-32fea6/792861139/5aa82f46-2f6d-4773-a4f3-b42e136f453f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T163537Z&X-Amz-Expires=300&X-Amz-Signature=d417d27b4293fd15e931da798a25bce1ab2c9a069aa4712316bd771378ced265&X-Amz-SignedHeaders=host&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoiaHR0cHM6Ly9yZXBvc2l0b3J5LWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vIiwia2V5Ijoia2V5MSIsImV4cCI6MTc4NTY4ODgzNywibmJmIjoxNzg1Njg4NTM3LCJwYXRoIjoicmVwb3NpdG9yeS1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIn0.LiTuiIdZoV0a4idqfl5G1STknJsbvorrOatWcx2mKs8",
    url: "https://github.com/glanceapp/glance",
  },
  {
    title: "Good Design Tools",
    category: CATEGORIES.dev,
    description:
      "Good Design Tools is a collection of over 400+ of the best tools and resources for UI designers, UX designers, digital designers and graphic designers.",
    favicon:
      "https://cdn.prod.website-files.com/67210aff9949540f7d0b7e68/6721f8223a09e7f42ee940c2_icon.png",
    ogImage:
      "https://cdn.prod.website-files.com/67210aff9949540f7d0b7e68/6723d0df6547c7442e02af2c_668d6476333bccde98b6bada_GDT%20OG.png",
    subtitle: "The best tools and resources for designers",
    tags: [TAGS.tool],
    url: "https://www.gooddesign.tools/",
  },
  {
    title: "Grep",
    author: "Vercel",
    category: CATEGORIES.dev,
    description:
      "Effortlessly search for code, files, and paths across a million GitHub repositories.",
    favicon: "https://grep.app/icon.png",
    // ogImage: "https://gists.sh/opengraph-image?9c823d7c5fa882a6",
    subtitle: "Code Search",
    tags: [TAGS.tool],
    url: "https://grep.app/",
  },
  {
    title: "HEIC to JPG Converter",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Convert HEIC to JPG online for free — drop your iPhone photos and they convert instantly, in batch, right in your browser. No upload to any server, no watermark, no signup, no limits. Also HEIC to PNG and WebP, quality control and ZIP download. Works on Windows 10/11, Android, Mac and Linux.",
    subtitle: "Free, Batch, No Upload (Windows, Android, Mac) | jasperbernaers.com",
    tags: [TAGS.tool],
    url: "https://jasperbernaers.com/free-heic-to-jpg-converter/",
  },
  {
    title: "here.now",
    category: CATEGORIES.dev,
    description:
      "Publish any file or folder to the web in seconds from your AI agent. Free, no sign-up required. Just tell your agent to publish to here.now and get a live URL back instantly.",
    subtitle: "Instant web hosting for agents",
    tags: [TAGS.tool],
    url: "https://here.now/",
  },
  {
    title: "High Scalability",
    category: CATEGORIES.dev,
    description: "Building bigger, faster, more reliable websites.",
    tags: [TAGS.development, TAGS.education],
    url: "https://highscalability.com/",
  },
  {
    title: "Home Assistant",
    author: "Home Assistant",
    category: CATEGORIES.dev,
    description:
      "Open source home automation that puts local control and privacy first. Powered by a worldwide community of tinkerers and DIY enthusiasts. Perfect to run on a...",
    favicon: "https://www.home-assistant.io/images/favicon-192x192.png",
    ogImage: "https://www.home-assistant.io/images/default-social.png",
    tags: [TAGS.tool],
    url: "https://www.home-assistant.io/",
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
    tags: [TAGS.backend],
    url: "https://hoppscotch.com/",
  },
  {
    title: "Hoppscotch",
    category: CATEGORIES.dev,
    description: "Helps you create requests faster, saving precious time on development.",
    subtitle: "Open source API development ecosystem",
    tags: [TAGS.tool],
    url: "https://hoppscotch.io/",
  },
  {
    title: "ilovecreatives",
    category: CATEGORIES.dev,
    description:
      "The Digital Trade School for Slashies looking to stack their creative skills alongside a good vibes community. Take an online course, connect with creatives, find creative jobs and events.",
    tags: [TAGS.design, TAGS.education],
    url: "https://ilovecreatives.com/",
  },
  {
    title: "iLovePDF",
    category: CATEGORIES.dev,
    description:
      "iLovePDF is an online service to work with PDF files completely free and easy to use. Merge PDF, split PDF, compress PDF, office to PDF, PDF to JPG and more!",
    favicon: "https://www.ilovepdf.com/img/app-icon.png",
    ogImage: "https://www.ilovepdf.com/img/ilovepdf/social/en-US/ilovepdf.png",
    subtitle: "Online PDF tools for PDF lovers",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://www.ilovepdf.com/",
  },
  {
    title: "Image to ASCII Converter",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Free image to ASCII converter — turn any PNG, JPG or WebP photo into ASCII art instantly. One-tap styles, braille dot art, color ASCII, dithering. Copy, share, download TXT or PNG. No upload, no signup, 100% in your browser.",
    subtitle: "PNG, JPG & SVG to ASCII Art Online Free | jasperbernaers.com",
    tags: [TAGS.ascii, TAGS.tool],
    url: "https://jasperbernaers.com/image-to-ascii/",
  },
  {
    title: "Image Tools Pro",
    category: CATEGORIES.dev,
    description:
      "Transform your photos with ease using imagetoolspro.com. Edit, crop, resize, and customize your images effortlessly with our advanced editing features.",
    favicon: "https://imagetoolspro.com/picture.webp",
    ogImage: "https://imagetoolspro.com/img/logo.svg",
    subtitle: "Online Image Tools — Edit & Enhance Photos with imagetoolspro",
    tags: [TAGS.tool],
    url: "https://imagetoolspro.com/",
  },
  {
    title: "IMG.LY SDK",
    category: CATEGORIES.dev,
    description:
      "IMG.LY's video, photo and creative SDK brings beautiful creative editing to your applications. Powering 500+ million creations per month.",
    subtitle: "Bring Photo, Video, and Design Editing into Your App",
    tags: [TAGS.tool],
    url: "https://img.ly/",
  },
  {
    title: "Immich",
    category: CATEGORIES.dev,
    description:
      "Self-hosted photo and video management solution. Easily back up, organize, and manage your photos on your own server. Immich helps you browse, search and organize your photos and videos with ease, without sacrificing your privacy.",
    url: "https://immich.app/",
  },
  {
    title: "InputOutput",
    category: CATEGORIES.dev,
    description: "Simple web tools with no popups, no cookies, no tracking.",
    favicon: "https://inputoutput.dev/favicon.ico",
    tags: [TAGS.tool],
    url: "https://inputoutput.dev/",
  },
  {
    title: "Invoice Builder",
    author: "piratuks",
    category: CATEGORIES.dev,
    description:
      "Invoice and quotation builder desktop app with PDF export, designed for small businesses and freelancers. Create, manage, and export invoices and quotes easily using a local database in an Electron-based app.",
    favicon: "/github.svg",
    ogImage:
      "https://opengraph.githubassets.com/f50c07ae3a04dedde35800ded790b1ed85d154e313f6e136a5cc3c7e256c5d65/piratuks/invoice-builder",
    url: "https://github.com/piratuks/invoice-builder",
  },
  {
    title: "IT Tools - Handy online tools for developers",
    category: CATEGORIES.dev,
    description:
      "Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.",
    tags: [TAGS.tool],
    url: "https://it-tools.tech/",
  },
  {
    title: "itty.dev",
    category: CATEGORIES.dev,
    description: "Ultra-small, powerful helpers for modern serverless APIs.",
    favicon: "https://itty.dev/itty-square.256.png",
    tags: [TAGS.development],
    url: "https://itty.dev/",
  },
  {
    title: "JSON For You",
    category: CATEGORIES.dev,
    description:
      "Online JSON view, format, minify, validate and compare. It also provides graph view to preview JSON data, semantic comparing two JSON diffs, convert JSON to CSV or CSV to JSON and support jq online.",
    subtitle: "The best online JSON tool",
    url: "https://json4u.com/",
  },
  {
    title: "JSON Hero",
    category: CATEGORIES.dev,
    description:
      "JSON Hero makes reading and understand JSON files easy by giving you a clean and beautiful UI packed with extra features.",
    subtitle: "A beautiful JSON viewer for the web",
    tags: [TAGS.tool],
    url: "https://jsonhero.io/",
  },
  {
    title: "Jsonify",
    category: CATEGORIES.dev,
    description:
      "Transform XLSX/CSV translation files into structured JSON. Simplify multilingual website and app localization. Convert excel/csv language data to JSON objects effortlessly.",
    favicon: "https://www.jsonify.net/images/seo-logo.svg",
    ogImage: "https://jsonify.net/_next/static/media/og-image.834f1293.webp",
    subtitle: "Free JSON generator",
    tags: [TAGS.tool],
    url: "https://www.jsonify.net/",
  },
  {
    title: "Just Delete Me",
    category: CATEGORIES.dev,
    description: "A directory of direct links to delete your account from web services.",
    url: "https://justdeleteme.xyz/",
  },
  {
    title: "Karakeep",
    category: CATEGORIES.dev,
    description:
      "Karakeep is the open-source bookmark manager for links, notes, and images. Automatically organize and tag your bookmarks with AI. Self-hostable, with apps for iOS, Android, Chrome, and Firefox.",
    favicon: "https://karakeep.app/icons/logo-icon.svg",
    ogImage: "https://karakeep.app/opengraph-image.png",
    subtitle: "The Bookmark Everything App | Save, Organize & Tag with AI",
    tags: [TAGS.tool],
    url: "https://karakeep.app/",
  },
  {
    title: "KeystoneJS",
    category: CATEGORIES.dev,
    description:
      "Build faster and scale further with the programmable open source GraphQL API back-end for structured content projects.",
    tags: [TAGS.backend],
    url: "https://keystonejs.com/",
  },
  {
    title: "Koefo",
    category: CATEGORIES.dev,
    description: "Instagram Carousel Splitter",
    tags: [TAGS.tool],
    url: "https://www.koefo.com/",
  },
  {
    title: "Liam ERD",
    category: CATEGORIES.dev,
    description:
      "Automatically generates beautiful and easy-to-read ER diagrams from your database.",
    tags: [TAGS.development],
    url: "https://liambx.com/",
  },
  {
    title: "Macfolio",
    category: CATEGORIES.dev,
    description:
      "Discover the best software, hardware, workspace setups, books, videos, and posts for the Mac ecosystem.",
    subtitle: "Curated Mac Discoveries",
    url: "https://macfolio.com/",
  },
  {
    title: "Maily",
    category: CATEGORIES.dev,
    description:
      "Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.",
    favicon: "https://maily.to/brand/logo.svg",
    ogImage: "https://maily.to/og-image.png",
    subtitle: "Open-source editor for crafting emails",
    tags: [TAGS.tool],
    url: "https://maily.to/",
  },
  {
    title: "MAKE MY DRIVE FUN",
    category: CATEGORIES.dev,
    description: "Enter in two locations to make the drive fun.",
    tags: [TAGS.map],
    url: "https://makemydrivefun.com/",
  },
  {
    title: "Markdown Editor Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Free online Markdown editor with instant live preview — GitHub-style preview, README & blog templates, visual table generator, Mermaid diagrams, math, share links, export to HTML/MD/PDF. Auto-saves in your browser. No sign-up, no upload.",
    subtitle: "Live Preview, GitHub Style, Templates & HTML/PDF Export | jasperbernaers.com",
    tags: [TAGS.markdown, TAGS.tool],
    url: "https://jasperbernaers.com/markdown-live-editor/",
  },
  {
    title: "Material for MkDocs",
    author: "Martin Donath",
    category: CATEGORIES.dev,
    description:
      "Write your documentation in Markdown and create a professional static site in minutes – searchable, customizable, in 60+ languages, for all devices",
    tags: [TAGS.markdown, TAGS.tool],
    url: "https://squidfunk.github.io/mkdocs-material/",
  },
  {
    title: "Mintlify",
    category: CATEGORIES.dev,
    description: "Self-updating documentation for startups, enterprises, and agents.",
    favicon: "https://raw.githubusercontent.com/mintlify/starter/main/favicon.svg",
    ogImage: "https://www.mintlify.com/_next/static/media/og.28576e75.png",
    subtitle: "The Knowledge Platform Built for Agents",
    tags: [TAGS.tool],
    url: "https://www.mintlify.com/",
  },
  {
    title: "Mockaroo",
    category: CATEGORIES.dev,
    description:
      "A free test data generator and API mocking tool - Mockaroo lets you create custom CSV, JSON, SQL, and Excel datasets to test and demo your software.",
    subtitle: "Random Data Generator and API Mocking Tool | JSON / CSV / SQL / Excel",
    tags: [TAGS.tool],
    url: "https://www.mockaroo.com/",
  },
  {
    title: "Mux",
    category: CATEGORIES.dev,
    description:
      "Mux helps teams ship high-performance and cost-effective video in minutes, not months. Build better video into anything from websites to platforms to AI workflows.",
    favicon: "https://www.mux.com/icon-pwu6ef.svg",
    ogImage: "https://www.mux.com/api/og",
    subtitle: "Video API for developers",
    tags: [TAGS.tool],
    url: "https://www.mux.com/",
  },
  {
    title: "n8n-io/n8n",
    category: CATEGORIES.dev,
    description:
      "Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.",
    tags: [TAGS.tool],
    url: "https://github.com/n8n-io/n8n",
  },
  {
    title: "namae",
    category: CATEGORIES.dev,
    description: "Check availability of your new app name for major registries at once.",
    favicon: "https://namae.dev/apple-touch-icon.png",
    ogImage: "https://namae.dev/social.png",
    subtitle: "Grab a slick name for your new project",
    tags: [TAGS.tool],
    url: "https://namae.dev/",
  },
  {
    title: "nomnoml",
    category: CATEGORIES.dev,
    description:
      "A tool for drawing sassy UML diagrams based on syntax. Provides instant feedback and has a customizable styling.",
    subtitle: "Supercharge your boxes and arrows.",
    url: "https://www.nomnoml.com/",
  },
  {
    title: "NoSignups",
    category: CATEGORIES.dev,
    description:
      "NoSignups (formerly FckSignups) is an open-source directory of no-signup, in-browser, open-source tools.",
    subtitle: "Open Source Tools. Zero Bullsh*t. (formerly FckSignups)",
    url: "https://nosignups.net/",
  },
  {
    title: "Nub",
    category: CATEGORIES.dev,
    description:
      "Nub is a TypeScript-first toolkit for Node.js: run TypeScript files on stock Node, a faster npm run, a pnpm-compatible package manager, and a built-in Node version manager. No lock-in.",
    subtitle: "An all-in-one toolkit for Node.js",
    tags: [TAGS.tool],
    url: "https://nubjs.com/",
  },
  {
    title: "Omatsuri",
    category: CATEGORIES.dev,
    description: "Progressive Web Application with 12 open source frontend focused tools",
    tags: [TAGS.development],
    url: "https://omatsuri.app/",
  },
  {
    title: "OmniVoice Studio",
    author: "Palash Debnath",
    category: CATEGORIES.dev,
    description:
      "A cinematic audio dubbing, cloning and voice generation studio. Enterprise-grade processing with AI-powered voice synthesis, 600+ language support, and self-hosted deployment.",
    subtitle: "Cinematic audio dubbing, cloning & voice generation | palash.dev",
    url: "https://palash.dev/omnivoice/",
  },
  {
    title: "Online converter",
    category: CATEGORIES.dev,
    description:
      "Convert files like images, video, documents, audio and more to other formats with this free and fast online converter.",
    favicon: "https://www.online-convert.com/assets/favicon/apple-touch-icon.png",
    ogImage:
      "https://www.online-convert.com/assets/social-share-image/en/www-online-convert-com.png",
    subtitle: "Convert video, images, audio and documents for free",
    tags: [TAGS.tool],
    url: "https://www.online-convert.com/",
  },
  {
    title: "OpenFlowKit",
    category: CATEGORIES.dev,
    description:
      "Open-source, local-first AI diagramming for architecture diagrams, flowcharts, system design, and editable exports. No signup required.",
    tags: [TAGS.development],
    url: "https://openflowkit.com/",
  },
  {
    title: "OpenGraph",
    category: CATEGORIES.dev,
    className: "bg-foreground border-paper",
    description: "The #1 og:image scanner and generator on the web.",
    favicon: "https://www.opengraph.xyz/icon0.svg",
    ogImage: "https://www.opengraph.xyz/favicons/og.png",
    tags: [TAGS.tool],
    url: "https://www.opengraph.xyz/",
  },
  {
    title: "Open Source Alternatives to Popular Software",
    category: CATEGORIES.dev,
    description:
      "A curated collection of the best open source alternatives to everyday SaaS products. Save money with reliable tools hand-picked for you.",
    tags: [TAGS.tool],
    url: "https://openalternative.co/",
  },
  {
    title: "Oualator",
    category: CATEGORIES.dev,
    description:
      "Oualator - A collection of needful generators, converters, unit exchangers, measuring tools, and many more. Use our online tools to increase your productivity.",
    subtitle: "Convert, Measure & Generate in Seconds",
    tags: [TAGS.tool],
    url: "https://oualator.com/",
  },
  {
    title: "OverAPI.com",
    category: CATEGORIES.dev,
    description: "OverAPI.com is a site collecting all the cheatsheets,all!",
    subtitle: "Collecting all the cheat sheets",
    tags: [TAGS.development, TAGS.education],
    url: "https://overapi.com/",
  },
  {
    title: "Paperless-ngx",
    author: "the Paperless-ngx team",
    category: CATEGORIES.dev,
    description: "Documentation for the Paperless-ngx document management system software.",
    favicon:
      "https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/dev/docs/assets/logo_leaf.svg",
    ogImage:
      "https://opengraph.githubassets.com/e41f9417cd92968ecb63476d01b5e01def7f1a1b63698286415859dd4cd2770f/paperless-ngx/paperless-ngx",
    tags: [TAGS.tool],
    url: "https://docs.paperless-ngx.com/",
  },
  {
    title: "patorjk.com",
    category: CATEGORIES.dev,
    description:
      "Welcome! My name is Pat. I am a software developer and amateur photographer. Here you'll find an array of web apps, programming tutorials, and random projects.",
    tags: [TAGS.tool],
    url: "https://patorjk.com/",
  },
  {
    title: "Payload",
    category: CATEGORIES.dev,
    description:
      "Built with TypeScript and React, Payload is an open-source headless CMS and application framework. Build anything.",
    subtitle: "The Next.js Headless CMS and App Framework",
    tags: [TAGS.backend],
    url: "https://payloadcms.com/",
  },
  {
    title: "PDFCraft",
    category: CATEGORIES.dev,
    description:
      "Free, Private & Browser-Based. Merge, edit, and edit PDF files online without uploading to servers.",
    subtitle: "Professional PDF Tools",
    url: "https://pdfcraft.devtoolcafe.com/en/",
  },
  {
    title: "PDF Tools Online",
    author: "Jasper Bernaers",
    category: CATEGORIES.dev,
    description:
      "Free online PDF tools — merge PDF files into one, split PDF by pages, compress PDF size by 80%, convert PDF to JPG images, convert JPG to PDF, rotate and organize pages. 100% browser-based with no file upload to any server. No watermarks, no daily limits, no registration. Best free alternative to SmallPDF, iLovePDF, PDF24, Sejda and Adobe Acrobat online. Works on Windows, Mac, Linux, iPhone and Android.",
    subtitle: "Merge, Split, Compress, Convert PDF to JPG | No Upload, No Watermark, No Sign‑Up",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://jasperbernaers.com/pdf/",
  },
  {
    title: "Photoroom - AI Photo Editor",
    category: CATEGORIES.dev,
    description:
      "Enhance your photos with our AI photo editor. Create stunning images in seconds with AI-powered technology and our powerful tools.",
    tags: [TAGS.tool],
    url: "https://www.photoroom.com/tools",
  },
  {
    title: "Physically Based",
    category: CATEGORIES.dev,
    description: "A database of physically based values for CG artists",
    subtitle: "The PBR values database",
    tags: [TAGS.color, TAGS.tool],
    url: "https://physicallybased.info/",
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
    tags: [TAGS.tool],
    url: "https://pinme.eth.limo/",
  },
  {
    title: "pkg.vc",
    category: CATEGORIES.dev,
    className: "bg-foreground border-paper",
    description:
      "Preview, test, and share npm packages instantly. Install npm package builds from pull requests before merge.",
    favicon: "https://pkg.vc/logo.svg",
    ogImage: "https://pkg.vc/_app/immutable/assets/og.BZXjwXhn.png",
    subtitle: "Install npm Packages from Pull Requests",
    tags: [TAGS.tool],
    url: "https://pkg.vc/",
  },
  {
    title: "PocketBase",
    category: CATEGORIES.dev,
    description:
      "Open Source backend in 1 file with realtime database, authentication, file storage and admin dashboard",
    subtitle: "Open Source backend in 1 file",
    tags: [TAGS.backend, TAGS.development, TAGS["open-source"]],
    url: "https://pocketbase.io/",
  },
  {
    title: "Pointilliser",
    category: CATEGORIES.dev,
    description: "Tools for generating neo-pointillist graphics",
    favicon: "https://pointilliser.elwyn.co/meta/apple-touch-icon.png",
    ogImage: "https://pointilliser.elwyn.co/meta/og-image.jpg",
    tags: [TAGS.tool],
    url: "https://pointilliser.com/",
  },
  {
    title: "Postgres Sandbox",
    category: CATEGORIES.dev,
    description: "In-browser Postgres sandbox with AI assistance",
    tags: [TAGS.development],
    url: "https://database.build/",
  },
  {
    title: "Quarkdown",
    category: CATEGORIES.dev,
    description:
      "Quarkdown is a modern, open-source, Markdown-based typesetting system for creating papers, presentations, knowledge bases and static websites.",
    subtitle: "Markdown with superpowers",
    tags: [TAGS.development],
    url: "https://quarkdown.com/",
  },
  {
    title: "RayonMaps",
    category: CATEGORIES.dev,
    description:
      "Export OpenStreetMap Data to DXF. Get the CAD geometry of any site on Earth — in just 3 steps.",
    tags: [TAGS.map],
    url: "https://maps.rayon.design/",
  },
  {
    title: "readme.so",
    category: CATEGORIES.dev,
    description:
      "Use readme.so's markdown editor and templates to easily create a ReadMe for your projects",
    favicon: "https://readme.so/readme.svg",
    ogImage: "https://readme.so/screenshot.png",
    url: "https://readme.so/",
  },
  {
    title: "Reflag",
    category: CATEGORIES.dev,
    className: "bg-foreground border-paper",
    description: "TypeScript feature management that gets you back to building, faster.",
    favicon:
      "https://cdn.prod.website-files.com/68a872edf3df6064de547670/68b8414134c540f12c2928bc_reflag-dynamic-favicon.svg",
    ogImage:
      "https://cdn.prod.website-files.com/68a872edf3df6064de547670/68e674a70f2a92f3a26d3296_reflag-og-home%20(2)-min.png",
    subtitle: "Feature flags on autopilot",
    tags: [TAGS.tool],
    url: "https://reflag.com/",
  },
  {
    title: "regex101",
    author: "Firas Dib",
    category: CATEGORIES.dev,
    description:
      "Online regex tester and debugger. Test, explain, benchmark, and generate code for PCRE2, JavaScript, Python, Go, Java, .NET, and Rust.",
    favicon: "https://regex101.com/static/assets/icons/favicon-196.png",
    ogImage: "https://regex101.com/preview/",
    subtitle: "build, test, and debug regex",
    tags: [TAGS.tool],
    url: "https://regex101.com/",
  },
  {
    title: "relic",
    category: CATEGORIES.dev,
    description:
      "Manage and share secrets. Encrypted on your device, never exposed to anyone else. Not even us.",
    subtitle: "The secrets layer developers actually trust",
    tags: [TAGS.development, TAGS.tool],
    url: "https://relic.so/",
  },
  {
    title: "Render",
    category: CATEGORIES.dev,
    description:
      "Deploy and scale any app or agent from your first user to your billionth. Build faster on intuitive cloud infrastructure for the modern web.",
    subtitle: "The cloud for builders",
    url: "https://render.com/",
  },
  {
    title: "replacements.fyi",
    category: CATEGORIES.dev,
    description:
      "Find more performant and safer replacements for outdated or unnecessary npm packages.",
    subtitle: "performant, safer npm package alternatives",
    tags: [TAGS.development],
    url: "https://replacements.fyi/",
  },
  {
    title: "Replit",
    category: CATEGORIES.dev,
    description:
      "Build and deploy software collaboratively with the power of AI without spending a second on setup.",
    tags: [TAGS.development],
    url: "https://replit.com/",
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
    tags: [TAGS.email, TAGS.tool],
    url: "https://resend.com/",
  },
  {
    title: "Responsively App",
    category: CATEGORIES.dev,
    description: "A dev-tool that aids faster and precise responsive web development.",
    tags: [TAGS.development],
    url: "https://responsively.app/",
  },
  {
    title: "ScrapingBee",
    category: CATEGORIES.dev,
    description:
      "ScrapingBee is the best web scraping API that handles proxies and headless browsers for you — so you can focus on extracting the data you need.",
    favicon: "https://www.scrapingbee.com/images/favico.svg",
    ogImage: "https://www.scrapingbee.com/images/cover.jpg",
    subtitle: "The Best Web Scraping API",
    tags: [TAGS.backend],
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
    title: "SEOStudio",
    category: CATEGORIES.dev,
    description:
      "SEOStudio is a cutting-edge, user-friendly online platform that offers comprehensive suite of free SEO, YouTube, Text, Programming, Webmaster, and Miscellaneous tools.",
    subtitle: "100% Free Online Tools Collection",
    tags: [TAGS.development],
    url: "https://seostudio.tools/",
  },
  {
    title: "Servercn",
    author: "akkaldhami",
    category: CATEGORIES.dev,
    description:
      "servercn is a component registry for building production-ready node.js backends, inspired by shadcn/ui.",
    tags: [TAGS.backend],
    url: "https://servercn.vercel.app/",
  },
  {
    title: "Sesame",
    category: CATEGORIES.dev,
    description: "A Creative Tool Purpose-built for Brand Expression built by Athletics",
    favicon: "https://framerusercontent.com/images/WJWI673zK3jnxT1D0uBh7inaRA.png",
    ogImage: "https://framerusercontent.com/images/2KmY3qRaki1ljnz5ojnGOaNt4.jpg",
    tags: [TAGS.tool],
    url: "https://sesame.design/",
  },
  {
    title: "Shape Divider App",
    category: CATEGORIES.dev,
    description: "Create fully responsive shape dividers for your next web project",
    tags: [TAGS.tool],
    url: "https://www.shapedivider.app/",
  },
  {
    title: "SHRTCTS",
    category: CATEGORIES.dev,
    description:
      "Know your shortcuts. An interactive 3D keyboard for learning the keyboard shortcuts of the apps you use every day. Pick a tool, hover a shortcut, watch the keys light up.",
    subtitle: "Know your shortcuts",
    tags: [TAGS.tool],
    url: "https://shrtcts.click/",
  },
  {
    title: "Site Critique",
    author: "Brutally Human",
    category: CATEGORIES.dev,
    description:
      "Your website gets judged in seconds. We show you what those seconds are saying. Get honest feedback on how clients and recruiters really perceive your site.",
    favicon: "https://sitecritique.app/apple-touch-icon.png",
    ogImage: "https://sitecritique.app/og-image.png",
    subtitle: "See Your Website The Way Others Do",
    tags: [TAGS.tool],
    url: "https://sitecritique.app/",
  },
  {
    title: "SitePoint",
    category: CATEGORIES.dev,
    description:
      "Learn Web Design & Development with SitePoint tutorials, courses and books - HTML5, CSS3, JavaScript, PHP, mobile app development, Responsive Web Design",
    subtitle: "Learn HTML, CSS, JavaScript, PHP, Ruby & Responsive Design",
    tags: [TAGS.design, TAGS.development, TAGS.education],
    url: "https://www.sitepoint.com/",
  },
  {
    title: "SkySend",
    category: CATEGORIES.dev,
    description:
      "Minimalist, end-to-end encrypted, self-hostable file and note sharing. Zero-knowledge server - files and notes are encrypted in the browser before upload. No accounts, no telemetry, built for speed and security.",
    subtitle: "Encrypted File & Note Sharing",
    url: "https://skysend.app/",
  },
  {
    title: "Slidev",
    author: "Anthony Fu",
    category: CATEGORIES.dev,
    description: "Presentation slides for developers",
    favicon: "https://sli.dev/logo.svg",
    ogImage: "https://sli.dev/og-image.png",
    url: "https://sli.dev/",
  },
  {
    title: "Squoosh",
    category: CATEGORIES.dev,
    description:
      "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser.",
    tags: [TAGS.tool],
    url: "https://squoosh.app/",
  },
  {
    title: "Stirling",
    category: CATEGORIES.dev,
    description:
      "GitHub's #1 PDF application with 30M+ downloads. The next generation of the PDF Editor - private, open-source, and built to scale.",
    favicon:
      "https://raw.githubusercontent.com/Stirling-Tools/Stirling-PDF/main/frontend/editor/src/core/assets/brand/branding-logo/logo-mark.svg",
    ogImage:
      "https://raw.githubusercontent.com/Stirling-Tools/Stirling-PDF/main/frontend/editor/src/core/assets/brand/modern-logo/Firstpage.png",
    subtitle: "PDF Processor",
    tags: [TAGS.pdf, TAGS.tool],
    url: "https://stirling.com/",
  },
  {
    title: "Strapi",
    category: CATEGORIES.dev,
    description:
      "Strapi is the next-gen headless CMS, open-source, JavaScript/TypeScript, enabling content-rich experiences to be created, managed and exposed to any digital device.",
    subtitle: "Open-Source TypeScript Headless CMS for Next.js, Astro, Tanstack Start, and Nuxt.js",
    tags: [TAGS.backend],
    url: "https://strapi.io/",
  },
  {
    title: "Styleframe",
    category: CATEGORIES.dev,
    description:
      "Styleframe turns your design system into a type-safe TypeScript source of truth and compiles it to CSS — one engine behind tokens, themes, utilities, and recipes.",
    favicon: "https://www.styleframe.dev/logo.svg",
    ogImage: "https://www.styleframe.dev/_og/s/o_nwvl3e.png",
    subtitle: "The Design Systems Styling Engine",
    tags: [TAGS.social, TAGS.tool],
    url: "https://www.styleframe.dev/",
  },
  {
    title: "Super Designer",
    category: CATEGORIES.dev,
    description:
      "30+ free online design tools — generate backgrounds, gradients, CSS patterns, 3D shapes, color palettes & more. No signup, instant PNG/SVG/CSS export.",
    favicon: "https://superdesigner.co/logo.svg",
    ogImage: "https://superdesigner.co/og/og.png",
    subtitle: "Free Online Design Tools for Developers & Designers",
    tags: [TAGS.design, TAGS.tool],
    url: "https://superdesigner.co/",
  },
  {
    title: "Surge",
    category: CATEGORIES.dev,
    description:
      "Shipping web projects should be fast, easy, and low risk. Surge is static web publishing for Front-End Developers, right from the CLI.",
    url: "https://surge.sh/",
  },
  {
    title: "Table Format Converter",
    author: "Durandal GmbH",
    category: CATEGORIES.dev,
    description:
      "Free online tool to convert your table data to CSV, HTML, JSON, Markdown and more. No registration required, works offline, and keeps your data private.",
    favicon: "https://www.tableformatconverter.com/apple-icon.png",
    ogImage: "https://www.tableformatconverter.com/opengraph-image.png",
    subtitle: "The Best Free Online Table Converter",
    tags: [TAGS.tool],
    url: "https://www.tableformatconverter.com/",
  },
  {
    title: "Takumi",
    author: "Kane Wang",
    category: CATEGORIES.dev,
    description: "JSX to pixels in Rust. Node, Workers, browser. No headless Chrome.",
    ogImage:
      "https://raw.githubusercontent.com/kane50613/takumi/master/example/twitter-images/output/og-image.png",
    subtitle: "Render JSX to images. Skip the browser.",
    url: "https://takumi.kane.tw/",
  },
  {
    title: "Templates - Vercel",
    author: "Vercel",
    category: CATEGORIES.dev,
    description:
      "Jumpstart your app development process with pre-built solutions from Vercel and our community.",
    url: "https://vercel.com/templates",
  },
  {
    title: "Temp Mail",
    category: CATEGORIES.dev,
    description:
      "Keep spam out of your mail and stay safe - just use a disposable temporary email address! Protect your personal email address from spam with Temp-mail",
    favicon: "https://temp-mail.org/images/tm_mobile_icon@2x.png",
    ogImage: "https://temp-mail.org/images/brand-logo.png",
    subtitle: "Disposable Temporary Email",
    tags: [TAGS.tool],
    url: "https://temp-mail.org/",
  },
  {
    title: "Termino.js",
    author: "Marketing Pipeline",
    category: CATEGORIES.dev,
    description:
      "Create a web based terminal on any website - great for games, animations and real world apps!",
    favicon: "./github.svg",
    ogImage:
      "https://opengraph.githubassets.com/c7149c48dc2e09be2ce2a7b28403989870676ccd875e94170feb99d80f33e687/MarketingPipeline/Termino.js",
    subtitle: "Live Demo",
    tags: [TAGS.tool],
    url: "https://marketingpipeline.github.io/Termino.js/demo",
  },
  {
    title: "Terraink",
    category: CATEGORIES.dev,
    description:
      "Free online map poster and wallpaper generator. Design custom, print-ready map art for any city or location — export as PNG, PDF, or SVG. No sign-up required.",
    tags: [TAGS.map],
    url: "https://terraink.app/",
  },
  {
    title: "tiiny.host",
    category: CATEGORIES.dev,
    description: "Tiiny Host is the simplest way to share your work online.",
    url: "https://tiiny.host/",
  },
  {
    title: "TinaCMS",
    category: CATEGORIES.dev,
    description:
      "Combine the power of GitHub and Markdown with TinaCMS for seamless content management. Empower developers and creators to edit, preview, and manage static and dynamic sites effortlessly.",
    tags: [TAGS.backend],
    url: "https://tina.io/",
  },
  {
    title: "TinEye",
    category: CATEGORIES.dev,
    description:
      "Search billions of images with TinEye reverse image search and find where images appear online.",
    favicon: "https://tineye.com/assets/touch_icons/touch-icon-192x192.webp",
    subtitle: "Reverse Image Search",
    tags: [TAGS.tool],
    url: "https://tineye.com/",
  },
  {
    title: "TinyWow",
    category: CATEGORIES.dev,
    description: "Free AI Writing, PDF, Image, and other Online Tools",
    tags: [TAGS.development],
    url: "https://tinywow.com/",
  },
  {
    title: "tldraw",
    category: CATEGORIES.dev,
    description:
      "A free and instant virtual whiteboarding with online collaboration. No signup required. Works on all devices: mobile, tablets, and desktop.",
    favicon: "https://www.tldraw.com/favicon.svg",
    ogImage: "https://www.tldraw.com/social-og.png",
    subtitle: "Very good free whiteboard",
    url: "https://www.tldraw.com/",
  },
  {
    title: "Tolgee",
    category: CATEGORIES.dev,
    description:
      "Open-source localization platform developers enjoy working with. With in-app translation, seamless integrations, and collaborative tools, scaling multilingual apps becomes easy. Sign up for free. ",
    subtitle: "Translate your app",
    url: "https://tolgee.io/",
  },
  {
    title: "ToolMateX",
    category: CATEGORIES.dev,
    description: "Fast, free online tools for designers, developers, and creators.",
    subtitle: "Free Online Tools for Designers & Developers",
    url: "https://toolmatex.com/",
  },
  {
    title: "Tooooools.app",
    author: "Daniil Sukhovskoy",
    category: CATEGORIES.dev,
    description:
      "Apply lo-fi effects to your images and videos: dithering, halftone, gradients, patterns and more. Free, no sign-up required.",
    favicon: "https://www.tooooools.app/favicon.ico",
    ogImage: "https://www.tooooools.app/open-graph.jpg",
    tags: [TAGS.tool],
    url: "https://www.tooooools.app/",
  },
  {
    title: "Toptal Utilities",
    category: CATEGORIES.dev,
    description:
      "Toptal Utilities is a collection of helpful tools and resources for online professionals curated and created by our community. Get started for free now.",
    favicon: "https://frontier-assets.toptal.com/992e7e6ce32e8969.svg",
    ogImage:
      "https://bs-uploads.toptal.io/blackfish-uploads/components/open_graph_image/8895819/og_image/optimized/Toptal_Global-d8a07ef18d5947fb64312399cd375efb.png",
    subtitle: "Tools & Resources Developers, Designers",
    tags: [TAGS.tool],
    url: "https://www.toptal.com/utilities-tools",
  },
  {
    title: "ToS;DR",
    category: CATEGORIES.dev,
    description:
      "'I have read and agree to the Terms' is the biggest lie on the web. Together, we can fix that.",
    tags: [TAGS.tool],
    url: "https://tosdr.org/en",
  },
  {
    title: "Transfer.zip",
    category: CATEGORIES.dev,
    description:
      "Free sharing of photos, videos and documents. Send large files instantly with a link or email. Simple, fast and secure file sharing with Transfer.zip.",
    subtitle: "Quick & Easy File Transfer - Send Files",
    tags: [TAGS.tool],
    url: "https://transfer.zip/",
  },
  {
    title: "Transmute",
    category: CATEGORIES.dev,
    description:
      "Transmute is a free, open-source, self-hosted file converter and compressor. Convert and compress images, video, audio, data, documents, and 3D models on your own hardware with no file size limits, no watermarks, and full privacy.",
    subtitle: "Self-Hosted File Converter & Compressor for Images, Video, Audio & More",
    tags: [TAGS.selfHosted, TAGS.tool],
    url: "https://transmute.sh/",
  },
  {
    title: "Trigger.dev",
    category: CATEGORIES.dev,
    description:
      "Trigger.dev is the open source platform for building AI workflows in TypeScript. Long-running tasks with retries, queues, observability, and elastic scaling.",
    subtitle: "Build and deploy fully-managed AI agents and workflows.",
    tags: [TAGS.ai, TAGS.backend, TAGS.development],
    url: "https://trigger.dev/",
  },
  {
    title: "TUIStudio",
    category: CATEGORIES.dev,
    description:
      "A Figma-like visual editor for TUI applications. Drag-and-drop components, edit properties in real-time, and export to 6 frameworks with one click.",
    favicon: "https://tui.studio/assets/favicon_dark.svg",
    subtitle: "Design Terminal UIs. Visually.",
    url: "https://tui.studio/",
  },
  {
    title: "tunnl.gg",
    category: CATEGORIES.dev,
    description:
      "Instant public URLs for your local web server. No installation required, just use SSH. Secure, fast, and developer-friendly reverse tunneling.",
    favicon: "https://tunnl.gg/favicon.svg",
    ogImage: "https://tunnl.gg/og-image.png",
    subtitle: "The easiest way to expose localhost to the internet",
    tags: [TAGS.tool],
    url: "https://tunnl.gg/",
  },
  {
    title: "Typesense",
    category: CATEGORIES.dev,
    description:
      "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
    subtitle: "Open Source Alternative to Algolia + Pinecone",
    url: "https://typesense.org/",
  },
  {
    title: "Unicorn Studio",
    category: CATEGORIES.dev,
    description:
      "Create enchanting WebGL effects, motion, and interactivity — in minutes, not hours. Unicorn Studio makes WebGL easy for designers to embed in Framer, Webflow, or any website.",
    ogImage: "https://www.unicorn.studio/images/ogg2.png",
    subtitle: "No-code WebGL Tool",
    tags: [TAGS.noCode, TAGS.tool],
    url: "https://www.unicorn.studio/",
  },
  {
    title: "URL to Any",
    category: CATEGORIES.dev,
    description:
      "URL to Any provides free URL conversion tools to transform web content into Markdown, PDF, images, text, JSON, XML, QR codes, extracted metadata, IP records, and AI summaries.",
    subtitle: "All-in-one URL Conversion Tool",
    tags: [TAGS.tool],
    url: "https://urltoany.com/",
  },
  {
    title: "UserCheck",
    category: CATEGORIES.dev,
    description: "Block disposable emails with our API. Start for free today.",
    favicon: "https://www.usercheck.com/favicon.png",
    ogImage: "https://api.webshot.co/EVWMY5",
    subtitle: "Stop Disposable Emails from Creating Spam Accounts",
    tags: [TAGS.backend],
    url: "https://www.usercheck.com/",
  },
  {
    title: "useSend",
    category: CATEGORIES.dev,
    description: "Pay only for what you send, not for storing contacts",
    favicon: "https://usesend.com/logo-squircle.png",
    ogImage: "https://uploads.usesend.com/logos/og.png",
    subtitle: "Open source email platform",
    tags: [TAGS.email, TAGS.tool],
    url: "https://usesend.com/",
  },
  {
    title: "Vault andzn",
    category: CATEGORIES.dev,
    description:
      "Explore Vault andzn’s collection of free online design tools, including an ASCII art generator, color palette generator and more. Fast, browser-based, no downloads or sign-ups required.",
    subtitle: "Free Online Design Tools — ASCII Generator, Color Palette Maker & More",
    tags: [TAGS.tool],
    url: "https://vaultandzn.com/pages/all-tools",
  },
  {
    title: "vid2ascii",
    category: CATEGORIES.dev,
    description: "Convert videos to ASCII.",
    tags: [TAGS.tool],
    url: "https://www.vid2ascii.com/",
  },
  {
    title: "VisuAlgo",
    category: CATEGORIES.dev,
    description:
      "VisuAlgo was conceptualised in 2011 by Associate Professor Steven Halim (NUS School of Computing) as a tool to help his students better understand data structures and algorithms, by allowing them to learn the basics on their own and at their own pace. Together with his students from the National University of Singapore, a series of visualizations were developed and consolidated, from simple sorting algorithms to complex graph data structures. Though specifically designed for the use of NUS students taking various data structure and algorithm classes (CS1010/equivalent, CS2040/equivalent (inclusive of IT5003)), CS3230, CS3233, and CS4234), as advocators of online learning, we hope that curious minds around the world will find these visualizations useful as well.",
    subtitle: "Visualising data structures and algorithms through animation",
    url: "https://visualgo.net/en",
  },
  {
    title: "Visual Studio Code for the Web",
    category: CATEGORIES.dev,
    description: "Build with Visual Studio Code, anywhere, anytime, entirely in your browser.",
    tags: [TAGS.tool],
    url: "https://vscode.dev/",
  },
  {
    title: "Voicebox",
    category: CATEGORIES.dev,
    description:
      "Near-perfect voice cloning with multiple TTS engines. Desktop app for Mac, Windows, and Linux. Multi-sample support, smart caching, local or remote inference.",
    subtitle: "Open Source Voice Cloning Desktop App",
    url: "https://voicebox.sh/",
  },
  {
    title: "Web Apps by 123apps",
    category: CATEGORIES.dev,
    description: "Online Tools for Video, Audio, PDF, and File Conversion.",
    tags: [TAGS.development],
    url: "https://123apps.com/",
  },
  {
    title: "Web Check",
    category: CATEGORIES.dev,
    description:
      "Web Check is the all-in-one OSINT and security tool, for revealing the inner workings of any website",
    tags: [TAGS.tool],
    url: "https://web-check.xyz",
  },
  {
    title: "WinWinKit",
    category: CATEGORIES.dev,
    description:
      "A purpose-built tool for running powerful affiliate, referral and promo campaigns. Designed for iOS, Android and desktop apps.",
    subtitle: "Grow your app on Autopilot",
    tags: [TAGS.tool],
    url: "https://winwinkit.com/",
  },
  {
    title: "Wolfram|Alpha",
    category: CATEGORIES.dev,
    description:
      "Compute answers using Wolfram's breakthrough technology & knowledgebase, relied on by millions of students & professionals. For math, science, nutrition, history, geography, engineering, mathematics, linguistics, sports, finance, music...",
    favicon:
      "https://www.wolframalpha.com/_next/static/images/favicon_b48d893b991ff67016124a4d51822e63.ico",
    ogImage:
      "https://www.wolframalpha.com/_next/static/images/share_9016222d6b2fadaacc58b484cb3edace.png",
    subtitle: "Computational Intelligence",
    tags: [TAGS.tool],
    url: "https://www.wolframalpha.com/",
  },
  {
    title: "Workout Cool",
    category: CATEGORIES.dev,
    description:
      "Create free workout routines with our comprehensive exercise database. Track your progress and achieve your fitness goals. 🏋️",
    subtitle: "Build Your Perfect Workout",
    tags: [TAGS.inspiration],
    url: "https://www.workout.cool/en",
  },
  {
    title: "yt-dlp/yt-dlp",
    category: CATEGORIES.dev,
    description: "A feature-rich command-line audio/video downloader.",
    tags: [TAGS.tool],
    url: "https://github.com/yt-dlp/yt-dlp",
  },
];
