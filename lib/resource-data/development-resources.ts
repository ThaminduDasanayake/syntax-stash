import { Tool } from "@/types";

import { CATEGORIES } from "./categories";
import { TAGS } from "./tags";

export const developmentLinks: Tool[] = [
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
    title: "BORED",
    category: CATEGORIES.dev,
    description:
      "Discover the most fun, interesting and cool websites on the internet. Hundreds of hand-picked funny sites, free games, educational resources and things to do when you're bored.",
    subtitle: "Fun, interesting & cool websites to explore when bored",
    tags: [TAGS.inspiration],
    url: "https://www.bored.com/",
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
    title: "Coolify",
    category: CATEGORIES.dev,
    description:
      "Self-hosting platform with superpowers. Deploy apps, databases & 280+ services to your server. Open-source alternative to Heroku.",
    tags: [TAGS.development],
    url: "https://coolify.io/",
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
    title: "Domainstack",
    category: CATEGORIES.dev,
    description:
      "Instant lookups for WHOIS, DNS, hosting, certificates, SEO and more, plus free domain tracking and change alerts.",
    subtitle: "Domain Intelligence Made Easy",
    tags: [TAGS.tool],
    url: "https://domainstack.io/",
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
    title: "GalaxyBrain",
    category: CATEGORIES.dev,
    description: "An information operating system powered by local files.",
    subtitle: "An information operating system powered by local files",
    tags: [TAGS.tool],
    url: "https://galaxybrain.com/",
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
    title: "IT Tools - Handy online tools for developers",
    category: CATEGORIES.dev,
    description:
      "Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.",
    tags: [TAGS.tool],
    url: "https://it-tools.tech/",
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
    tags: [TAGS.development, TAGS.inspiration],
    url: "https://macfolio.com/",
  },
  {
    title: "MAKE MY DRIVE FUN",
    category: CATEGORIES.dev,
    description: "Enter in two locations to make the drive fun.\n",
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
    title: "Mockaroo",
    category: CATEGORIES.dev,
    description:
      "A free test data generator and API mocking tool - Mockaroo lets you create custom CSV, JSON, SQL, and Excel datasets to test and demo your software.",
    subtitle: "Random Data Generator and API Mocking Tool | JSON / CSV / SQL / Excel",
    tags: [TAGS.tool],
    url: "https://www.mockaroo.com/",
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
    title: "OpenFlowKit",
    category: CATEGORIES.dev,
    description:
      "Open-source, local-first AI diagramming for architecture diagrams, flowcharts, system design, and editable exports. No signup required.",
    tags: [TAGS.development],
    url: "https://openflowkit.com/",
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
    title: "PocketBase",
    category: CATEGORIES.dev,
    description:
      "Open Source backend in 1 file with realtime database, authentication, file storage and admin dashboard",
    subtitle: "Open Source backend in 1 file",
    tags: [TAGS.backend, TAGS.development, TAGS["open-source"]],
    url: "https://pocketbase.io/",
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
    url: "https://readme.so/",
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
    title: "Responsively App",
    category: CATEGORIES.dev,
    description: "A dev-tool that aids faster and precise responsive web development.",
    tags: [TAGS.development],
    url: "https://responsively.app/",
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
    title: "Squoosh",
    category: CATEGORIES.dev,
    description:
      "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser.",
    tags: [TAGS.tool],
    url: "https://squoosh.app/",
  },
  {
    title: "Stirling - PDF Processor",
    category: CATEGORIES.dev,
    description:
      "GitHub's #1 PDF application with 30M+ downloads. The next generation of the PDF Editor - private, open-source, and built to scale.",
    tags: [TAGS.tool],
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
    title: "Surge",
    category: CATEGORIES.dev,
    description:
      "Shipping web projects should be fast, easy, and low risk. Surge is static web publishing for Front-End Developers, right from the CLI.",
    url: "https://surge.sh/",
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
    title: "Typesense",
    category: CATEGORIES.dev,
    description:
      "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
    subtitle: "Open Source Alternative to Algolia + Pinecone",
    url: "https://typesense.org/",
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
    title: "web.dev",
    category: CATEGORIES.dev,
    description: "Guidance to build modern web experiences that work on any browser.",
    tags: [TAGS.development],
    url: "https://web.dev/",
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
