import {
  BookOpen,
  Braces,
  CalendarClock,
  Clock,
  CodeXml,
  Container,
  Database,
  Eye,
  FileDiff,
  FileImage,
  FileText,
  Fingerprint,
  Frame,
  GitBranch,
  Globe,
  Globe2,
  Grid3X3,
  Hash,
  Image,
  ImageIcon,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  Network,
  Palette,
  PenTool,
  Play,
  QrCode,
  Ratio,
  Regex,
  Scan,
  ShieldCheck,
  ShieldHalf,
  Sparkles,
  Square,
  Table,
  Terminal,
  Wind,
} from "lucide-react";

import { Tool } from "@/types";

// Internal Tools
// These are the functional utilities built into syntax-stash.
export const internalTools: Tool[] = [
  // --- INTERNAL UTILITIES ---
  {
    title: "AI Prompt Enhancer",
    url: "/tools/prompt-enhancer",
    description: "Dynamic templates to generate high-quality AI prompts.",
    category: "Utilities",
    icon: Sparkles,
  },
  {
    title: "Omni-Image Converter",
    url: "/tools/image-converter",
    description: "Convert images locally between WebP, PNG, and JPEG formats.",
    category: "Utilities",
    icon: ImageIcon,
  },
  {
    title: "Universal Document Extractor",
    url: "/tools/document-extractor",
    description: "Extract clean text/markdown from PDF, DOCX, CSV, and TXT files.",
    category: "Utilities",
    icon: FileText,
  },

  {
    title: "Regex Tester",
    url: "/tools/regex-tester",
    description: "Test and debug regular expressions with real-time match highlighting.",
    category: "Utilities",
    icon: Regex,
  },
  {
    title: "Color Space Converter",
    url: "/tools/color-converter",
    description: "Convert colors between HEX, RGB, HSL, OKLCH, and more.",
    category: "Utilities",
    icon: Palette,
  },
  {
    title: "JWT Decoder",
    url: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: "Utilities",
    icon: KeyRound,
  },
  {
    title: "JSON Formatter",
    url: "/tools/json-formatter",
    description: "Format, minify, and validate JSON payloads instantly.",
    category: "Utilities",
    icon: Braces,
  },
  {
    title: "JSON to TS",
    url: "/tools/json-to-ts",
    description: "Convert JSON objects into TypeScript interfaces with full type inference.",
    category: "Utilities",
    icon: Braces,
  },
  {
    title: "Encoder / Decoder",
    url: "/tools/encoder-decoder",
    description: "Convert strings between Base64, URL, and Hex encoding.",
    category: "Utilities",
    icon: ShieldHalf,
  },
  {
    title: "Text Analyzer",
    url: "/tools/text-analyzer",
    description: "Analyze text for word counts, bytes, and estimated LLM tokens.",
    category: "Utilities",
    icon: FileText,
  },
  {
    title: "Cron Translator",
    url: "/tools/cron-translator",
    description: "Convert cron expressions to human-readable text and upcoming dates.",
    category: "Utilities",
    icon: Clock,
  },
  {
    title: "Unix Timestamp Converter",
    url: "/tools/timestamp-converter",
    description: "Convert Unix epoch timestamps to human-readable dates.",
    category: "Utilities",
    icon: Clock,
  },
  {
    title: "Hash Generator",
    url: "/tools/hash-generator",
    description: "Generate secure cryptographic hashes locally.",
    category: "Utilities",
    icon: Fingerprint,
  },
  {
    title: "Mock Data Generator",
    url: "/tools/mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: "Utilities",
    icon: Database,
  },
  {
    title: "Tailwind Shades",
    url: "/tools/tailwind-shades",
    description: "Generate a full 50–950 Tailwind color scale from a single hex.",
    category: "UI & Styling",
    icon: Palette,
  },
  {
    title: "Layout Visualizer",
    url: "/tools/layout-visualizer",
    description: "Explore Tailwind Flex and Grid layout properties interactively.",
    category: "UI & Styling",
    icon: LayoutGrid,
  },
  {
    title: "Glassmorphism Generator",
    url: "/tools/glassmorphism-generator",
    description: "Generate beautiful glassmorphism UI elements with backdrop blur.",
    category: "UI & Styling",
    icon: Layers,
  },
  {
    title: "SVG Optimizer",
    url: "/tools/svg-optimizer",
    description: "Minify and clean bloated SVG files.",
    category: "Images & Assets",
    icon: FileImage,
  },
  {
    title: "SVG Path Viewer",
    url: "/tools/svg-path",
    description: "Preview and edit SVG 'd' paths with real-time visualization.",
    category: "Images & Assets",
    icon: PenTool,
  },
  {
    title: "Base64 Image Decoder",
    url: "/tools/base64-image-decoder",
    description: "Decode and preview base64-encoded images locally.",
    category: "Images & Assets",
    icon: Image,
  },
  {
    title: "QR Generator",
    url: "/tools/qr-generator",
    description: "Generate downloadable QR codes instantly.",
    category: "Other Tools",
    icon: QrCode,
  },
  {
    title: "Code Stash",
    url: "/tools/code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: "Utilities",
    icon: CodeXml,
  },
  {
    title: "WCAG Contrast Checker",
    url: "/tools/contrast-checker",
    description: "Check foreground/background contrast ratios against WCAG AA and AAA standards.",
    category: "UI & Styling",
    icon: Eye,
  },
  {
    title: "Placeholder Generator",
    url: "/tools/placeholder-generator",
    description:
      "Generate custom placeholder images with the Canvas API, entirely in your browser.",
    category: "Images & Assets",
    icon: Frame,
  },
  {
    title: "Open Graph Previewer",
    url: "/tools/og-preview",
    description: "Preview how your link card will appear when shared on Twitter/X and LinkedIn.",
    category: "Utilities",
    icon: Globe,
  },
  {
    title: "Subnet / CIDR Calculator",
    url: "/tools/subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: "Utilities",
    icon: Network,
  },
  {
    title: "MongoDB ObjectId Decoder",
    url: "/tools/mongo-decoder",
    description:
      "Decode a MongoDB ObjectId into its timestamp, machine ID, process ID, and counter.",
    category: "Utilities",
    icon: Hash,
  },
  {
    title: "SQL Formatter",
    url: "/tools/sql-formatter",
    description: "Prettify raw SQL queries with proper indentation and capitalized keywords.",
    category: "Utilities",
    icon: Table,
  },
  {
    title: "CSS Aspect-Ratio Calculator",
    url: "/tools/aspect-ratio",
    description:
      "Calculate CSS aspect-ratio, Tailwind utility, and legacy padding-bottom values for any dimensions.",
    category: "UI & Styling",
    icon: Ratio,
  },
  {
    title: "HTTP Security Header Analyzer",
    url: "/tools/header-analyzer",
    description:
      "Grade your HTTP response headers against OWASP best practices and generate a Next.js config.",
    category: "Utilities",
    icon: ShieldCheck,
  },
  {
    title: "chmod Calculator",
    url: "/tools/chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid, synced across octal and symbolic formats.",
    category: "Utilities",
    icon: Lock,
  },
  {
    title: "Crontab Schedule Visualizer",
    url: "/tools/cron-visualizer",
    description:
      "See exactly when your cron jobs fire with a timeline and table of the next 20 executions.",
    category: "Utilities",
    icon: CalendarClock,
  },
  {
    title: ".env File Diff & Merge",
    url: "/tools/env-diff",
    description:
      "Semantically compare two .env files to find missing keys, extra keys, and value mismatches.",
    category: "Utilities",
    icon: FileDiff,
  },
  {
    title: "ASCII Diagram Editor",
    url: "/tools/ascii-diagram",
    description:
      "Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters.",
    category: "Other Tools",
    icon: Grid3X3,
  },
  {
    title: "Universal Decoder",
    url: "/tools/universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, or Snowflake ID — and decode it instantly.",
    category: "Utilities",
    icon: Scan,
  },
  {
    title: "Tailwind CSS Cheatsheet",
    url: "/tools/tailwind-cheatsheet",
    description:
      "A searchable, filterable reference of the most-used Tailwind utility classes. Click any class to copy it.",
    category: "UI & Styling",
    icon: Wind,
  },
  {
    title: "CSS Animation Builder",
    url: "/tools/animation-builder",
    description:
      "Build CSS @keyframes animations visually with live preview and generated CSS output.",
    category: "UI & Styling",
    icon: Play,
  },
  {
    title: "curl Command Builder",
    url: "/tools/curl-builder",
    description:
      "Build curl commands from a form, or paste a curl command to parse it into structured fields.",
    category: "Utilities",
    icon: Terminal,
  },
  {
    title: "Git Command Cheatsheet",
    url: "/tools/git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: "Utilities",
    icon: GitBranch,
  },
  {
    title: "Regex Pattern Library",
    url: "/tools/regex-library",
    description:
      "A curated library of 30+ production-ready regex patterns with match examples and one-click copy.",
    category: "Utilities",
    icon: BookOpen,
  },
  {
    title: "Docker Compose Builder",
    url: "/tools/docker-compose",
    description:
      "Add services from templates, configure ports, environment variables, and volumes to generate a docker-compose.yml.",
    category: "Utilities",
    icon: Container,
  },
  {
    title: "HTTP Status Reference",
    url: "/tools/http-status",
    description:
      "Every standard HTTP status code with descriptions, use cases, and category colour-coding.",
    category: "Utilities",
    icon: Globe2,
  },
  {
    title: "Border Radius Previewer",
    url: "/tools/border-radius",
    description:
      "Visually configure CSS border-radius with per-corner sliders, presets, and live shape preview.",
    category: "UI & Styling",
    icon: Square,
  },
];

// Resource Links
// All external bookmarks — curated developer resources and references.
export const resourceLinks: Tool[] = [
  // --- UI & STYLING ---
  {
    title: "Picular",
    url: "https://picular.co/",
    description: "The color search engine for designers.",
    category: "UI & Styling",
  },
  {
    title: "Ark UI",
    url: "https://ark-ui.com/",
    description: "A headless, accessible UI component library.",
    category: "UI & Styling",
  },
  {
    title: "CSS Loaders",
    url: "https://cssloaders.github.io/",
    description: "A collection of pure CSS loading animations.",
    category: "UI & Styling",
  },
  {
    title: "Mage UI",
    url: "https://www.mageui.live/",
    description: "Modern UI components and blocks.",
    category: "UI & Styling",
  },
  {
    title: "ThemeCN",
    url: "https://themecn.dev/",
    description: "Tailwind CSS components and templates.",
    category: "UI & Styling",
  },
  {
    title: "Gradienty",
    url: "https://gradienty.codes/",
    description: "A vast collection of beautiful gradients.",
    category: "UI & Styling",
  },
  {
    title: "Colorize",
    url: "https://colorize.design/",
    description: "AI-powered color palette generator.",
    category: "UI & Styling",
  },
  {
    title: "Apache ECharts",
    url: "https://echarts.apache.org/en/index.html",
    description: "A powerful, interactive charting and visualization library.",
    category: "UI & Styling",
  },
  {
    title: "React Haiku",
    url: "https://www.reacthaiku.dev/",
    description: "A collection of React hooks and utilities.",
    category: "UI & Styling",
  },
  {
    title: "Smooth UI",
    url: "https://www.smoothui.dev/",
    description: "UI component library for React.",
    category: "UI & Styling",
  },
  {
    title: "Spectrum UI",
    url: "https://ui.spectrumhq.in/",
    description: "Design system and components.",
    category: "UI & Styling",
  },
  {
    title: "Smooothy",
    url: "https://smooothy.vercel.app/",
    description: "Smooth animations and UI components.",
    category: "UI & Styling",
  },
  {
    title: "UV Canvas",
    url: "https://uvcanvas.com/",
    description: "React components for beautiful canvas gradients.",
    category: "UI & Styling",
  },
  {
    title: "CSS Grid Generator",
    url: "https://cssgridgenerator.io/",
    description: "Visual tool to generate CSS grid layouts.",
    category: "UI & Styling",
  },
  {
    title: "WebGradients",
    url: "https://webgradients.com/",
    description: "A free collection of 180 linear gradients.",
    category: "UI & Styling",
  },
  {
    title: "unDraw",
    url: "https://undraw.co/",
    description: "Open-source illustrations for any idea you can imagine.",
    category: "UI & Styling",
  },
  {
    title: "Intent UI",
    url: "https://intentui.com/",
    description: "UI components and design resources.",
    category: "UI & Styling",
  },
  {
    title: "Palette Maker",
    url: "https://palettemaker.com/",
    description: "Create and test color palettes on real designs.",
    category: "UI & Styling",
  },
  {
    title: "Park UI",
    url: "https://park-ui.com/",
    description: "UI components built with Ark UI and Panda CSS.",
    category: "UI & Styling",
  },
  {
    title: "React Bits",
    url: "https://www.reactbits.dev/",
    description: "React patterns, snippets, and components.",
    category: "UI & Styling",
  },
  {
    title: "Magic UI",
    url: "https://magicui.design/",
    description: "Beautiful UI components for React and Next.js.",
    category: "UI & Styling",
  },
  {
    title: "Hypercolor",
    url: "https://hypercolor.dev/",
    description: "Tailwind CSS gradient generator.",
    category: "UI & Styling",
  },
  {
    title: "Cult UI",
    url: "https://www.cult-ui.com/",
    description: "Premium UI components for modern web apps.",
    category: "UI & Styling",
  },

  // --- LEARNING & RESOURCES ---
  {
    title: "Codecademy",
    url: "https://www.codecademy.com/",
    description: "Interactive coding tutorials and courses.",
    category: "Learning",
  },
  {
    title: "NeuralNine",
    url: "https://www.youtube.com/@NeuralNine",
    description: "Python, Machine Learning, and Computer Science tutorials.",
    category: "Learning",
  },
  {
    title: "Code with Mosh",
    url: "https://codewithmosh.com/p/learning-paths",
    description: "Clear, concise programming courses by Mosh Hamedani.",
    category: "Learning",
  },
  {
    title: "MindLuster",
    url: "https://www.mindluster.com/",
    description: "Free online courses with certificates.",
    category: "Learning",
  },
  {
    title: "Mosh React Courses",
    url: "https://hacksnation.com/d/18974-download-codewithmosh-all-react-courses",
    description: "React course resources.",
    category: "Learning",
  },
  {
    title: "Coddy",
    url: "https://coddy.tech/",
    description: "Gamified coding challenges and courses.",
    category: "Learning",
  },
  {
    title: "Codédex",
    url: "https://www.codedex.io/",
    description: "Learn to code in a fantasy RPG environment.",
    category: "Learning",
  },
  {
    title: "Roadmap.sh",
    url: "https://roadmap.sh/",
    description: "Step-by-step developer roadmaps and guides.",
    category: "Learning",
  },
  {
    title: "DeepWiki",
    url: "https://deepwiki.com/",
    description: "Deep tech and software engineering wiki.",
    category: "Learning",
  },
  {
    title: "QuickRef",
    url: "https://quickref.me/index.html",
    description: "Cheat sheets for programming languages and tools.",
    category: "Learning",
  },
  {
    title: "Dev Quizzes",
    url: "https://quizzes.madza.dev/",
    description: "Test your programming knowledge.",
    category: "Learning",
  },
  {
    title: "Web Skills",
    url: "https://andreasbm.github.io/web-skills/",
    description: "A visual overview of useful skills to learn as a web developer.",
    category: "Learning",
  },
  {
    title: "Learn Anything",
    url: "https://learn-anything.xyz/",
    description: "Organize knowledge and discover resources.",
    category: "Learning",
  },
  {
    title: "Bilibili Tutorial",
    url: "https://www.bilibili.com/video/BV1Ph4y1V7jF/?p=4",
    description: "Video tutorial resource.",
    category: "Learning",
  },
  {
    title: "YouTube ML Video",
    url: "https://www.youtube.com/watch?v=fOUng7fMQ1Y",
    description: "Machine learning/programming tutorial.",
    category: "Learning",
  },

  // --- MACHINE LEARNING & AI ---
  {
    title: "Stanford Sentiment Dataset",
    url: "https://ai.stanford.edu/~amaas/data/sentiment/",
    description: "Large Movie Review Dataset for sentiment analysis.",
    category: "Machine Learning",
  },
  {
    title: "YOLOv8 Object Tracking",
    url: "https://github.com/MuhammadMoinFaisal/YOLOv8-DeepSORT-Object-Tracking",
    description: "Object tracking using YOLOv8 and DeepSORT.",
    category: "Machine Learning",
  },
  {
    title: "Ultralytics YOLO",
    url: "https://github.com/ultralytics/ultralytics/blob/main/README.md",
    description: "State-of-the-art YOLOv8 object detection.",
    category: "Machine Learning",
  },
  {
    title: "OpenML",
    url: "https://www.openml.org/",
    description: "Machine learning dataset and model repository.",
    category: "Machine Learning",
  },
  {
    title: "Google Dataset Search",
    url: "https://datasetsearch.research.google.com/",
    description: "Search engine for datasets across the web.",
    category: "Machine Learning",
  },

  // --- APIS & DATA ---
  {
    title: "Public APIs",
    url: "https://github.com/public-apis/public-apis",
    description: "A collective list of free APIs for use in software and web development.",
    category: "APIs & Data",
  },
  {
    title: "Free Public APIs",
    url: "https://www.freepublicapis.com/",
    description: "Curated list of free APIs.",
    category: "APIs & Data",
  },
  {
    title: "PublicAPIs.dev",
    url: "https://publicapis.dev/",
    description: "Directory of public APIs for developers.",
    category: "APIs & Data",
  },
  {
    title: "Apify",
    url: "https://apify.com/?fpr=i6ouv&gad_campaignid=22544677876&gbraid=0AAAAADGdQwxm_XhH9hQNusnyQy48tjNqd",
    description: "Web scraping and data extraction platform.",
    category: "APIs & Data",
  },
  {
    title: "MCP Servers",
    url: "https://github.com/modelcontextprotocol/servers",
    description: "Model Context Protocol servers for AI integrations.",
    category: "APIs & Data",
  },

  // --- OPEN SOURCE & GITHUB ---
  {
    title: "App Ideas",
    url: "https://github.com/florinpop17/app-ideas",
    description: "A Collection of application ideas to improve your coding skills.",
    category: "Open Source",
  },
  {
    title: "Simple ML Examples",
    url: "https://github.com/chribsen/simple-machine-learning-examples/tree/master",
    description: "Basic implementations of ML algorithms.",
    category: "Open Source",
  },
  {
    title: "33 JS Concepts",
    url: "https://github.com/leonardomso/33-js-concepts",
    description: "33 Concepts Every JavaScript Developer Should Know.",
    category: "Open Source",
  },
  {
    title: "JavaScript Questions",
    url: "https://github.com/lydiahallie/javascript-questions",
    description: "A long list of (advanced) JavaScript questions.",
    category: "Open Source",
  },
  {
    title: "You Don't Know JS",
    url: "https://github.com/getify/You-Dont-Know-JS",
    description: "Book series diving deep into the core mechanisms of JavaScript.",
    category: "Open Source",
  },
  {
    title: "Airbnb JS Guide",
    url: "https://github.com/airbnb/javascript",
    description: "A mostly reasonable approach to JavaScript.",
    category: "Open Source",
  },
  {
    title: "Awesome JavaScript",
    url: "https://github.com/sorrycc/awesome-javascript",
    description: "A collection of awesome browser-side JS libraries and resources.",
    category: "Open Source",
  },
  {
    title: "Build Your Own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description: "Recreate popular technologies from scratch.",
    category: "Open Source",
  },
  {
    title: "Project Based Learning",
    url: "https://github.com/practical-tutorials/project-based-learning",
    description: "Learn to code by building projects.",
    category: "Open Source",
  },
  {
    title: "Awesome LeetCode",
    url: "https://github.com/ashishps1/awesome-leetcode-resources",
    description: "Resources for mastering LeetCode and DSA.",
    category: "Open Source",
  },
  {
    title: "Awesome Lists",
    url: "https://github.com/sindresorhus/awesome",
    description: "Awesome lists about all kinds of interesting topics.",
    category: "Open Source",
  },
  {
    title: "Idealist",
    url: "https://github.com/yoheinakajima/idealist",
    description: "Open source projects and ideas.",
    category: "Open Source",
  },
  {
    title: "Thamindu's GitHub",
    url: "https://github.com/ThaminduDasanayake",
    description: "My personal GitHub profile.",
    category: "Open Source",
  },
  {
    title: "CeraFlaw Website",
    url: "https://github.com/SithumRaigamage/CeraFlaw-Website",
    description: "Frontend repository for the CeraFlaw project.",
    category: "Open Source",
  },
  {
    title: "CeraFlaw Models",
    url: "https://github.com/SithumRaigamage/CeraFlaw",
    description: "Core repository for the CeraFlaw project.",
    category: "Open Source",
  },

  // --- UTILITIES & TOOLS ---
  {
    title: "CSV Vis Tool",
    url: "https://csvistool.com/",
    description: "Tool for visualizing CSV data.",
    category: "Utilities",
  },
  {
    title: "DhiWise",
    url: "https://www.dhiwise.com/",
    description: "Programming automation platform for React and Flutter.",
    category: "Utilities",
  },
  {
    title: "GitDocify",
    url: "https://gitdocify.com/readme/Coding-Challenge-Generator#top",
    description: "Generate beautiful READMEs and documentation.",
    category: "Utilities",
  },
  {
    title: "Frimousse",
    url: "https://frimousse.liveblocks.io/",
    description: "Collaborative canvas and design tool.",
    category: "Utilities",
  },
  {
    title: "VisGL Google Maps",
    url: "https://visgl.github.io/react-google-maps/",
    description: "React components for Google Maps.",
    category: "Utilities",
  },
  {
    title: "Omatsuri",
    url: "https://omatsuri.app/",
    description: "Open source browser tools for everyday use.",
    category: "Utilities",
  },
  {
    title: "Database.build",
    url: "https://database.build/",
    description: "Visual database schema builder.",
    category: "Utilities",
  },
  {
    title: "TinyWow",
    url: "https://tinywow.com/",
    description: "Free tools to solve your file problems.",
    category: "Utilities",
  },
  {
    title: "Game Hub",
    url: "https://game-hub-vert-three.vercel.app/",
    description: "React project deployment.",
    category: "Utilities",
  },
  {
    title: "Liam Bx",
    url: "https://liambx.com/",
    description: "Personal portfolio/tools site.",
    category: "Utilities",
  },
  {
    title: "Code with Mosh Downloads",
    url: "https://hacksnation.com/d/278-download-code-with-mosh-all-courses",
    description: "Download resources for courses.",
    category: "Utilities",
  },
];

// ─── Derived ─────────────────────────────────────────────────────────────────
export const resourceCategories: string[] = [
  ...new Set(resourceLinks.map((t) => t.category)),
].sort();

// Backward-compat alias — anything still importing `tools` keeps working.
export const tools: Tool[] = [...internalTools, ...resourceLinks];

// Legacy categories list (kept for any existing consumers)
export const categories = [
  "All",
  "UI & Styling",
  "Machine Learning",
  "Learning",
  "APIs & Data",
  "Utilities",
  "Open Source",
];
