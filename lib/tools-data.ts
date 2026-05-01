import {
  Atom,
  Binary,
  BookText,
  Braces,
  BrainCircuit,
  CalendarClock,
  Clock,
  CodeXml,
  Container,
  Database,
  Eye,
  FileDiff,
  FileImage,
  FileJson,
  FileText,
  Fingerprint,
  Frame,
  GitBranch,
  Globe,
  Globe2,
  Grid3X3,
  Image,
  ImageDown,
  ImageIcon,
  KeyRound,
  Layers,
  LayoutGrid,
  Link,
  ListFilter,
  ListOrdered,
  Lock,
  Network,
  NotebookPen,
  Palette,
  PenTool,
  Play,
  QrCode,
  Ratio,
  Regex,
  Scale,
  Scan,
  Scissors,
  SearchCode,
  ShieldCheck,
  ShieldHalf,
  Square,
  Table,
  TableProperties,
  Terminal,
  Type,
  Wand2,
  WandSparkles,
  Wifi,
  Wind,
} from "lucide-react";

import { Tool } from "@/types";

export const CATEGORIES = {
  calculators: "Calculators",
  data: "Data & Formats",
  development: "Development & Code",
  devops: "DevOps",
  imagesAssets: "Images & Assets",
  network: "Network & Security",
  schemas: "Schema & Database",
  typography: "Typography & Text",
  uiStyling: "UI & Styling",
} as const;

export const calculatorTools: Tool[] = [
  {
    title: "Unit Converter",
    url: "/tools/unit-converter",
    description:
      "Convert between units of length, weight, data, temperature, speed, area and volume.",
    category: CATEGORIES.calculators,
    icon: Scale,
  },
  {
    title: "Time Calculator",
    url: "/tools/time-calculator",
    description:
      "Convert Unix timestamps, ISO dates, and local time. Timezone viewer and date arithmetic.",
    category: CATEGORIES.calculators,
    icon: Clock,
  },
  {
    title: "Base Converter",
    url: "/tools/base-converter",
    description:
      "Convert between decimal, hex, binary, and octal with a 16-bit toggle grid and bitwise ops.",
    category: CATEGORIES.calculators,
    icon: Binary,
  },
];

export const dataTools: Tool[] = [
  {
    title: "Base64 Image Decoder",
    url: "/tools/base64-image-decoder",
    description: "Decode and preview base64-encoded images locally.",
    category: CATEGORIES.data,
    icon: Image,
  },
  {
    title: "Encoder / Decoder",
    url: "/tools/encoder-decoder",
    description: "Convert strings between Base64, URL, and Hex encoding.",
    category: CATEGORIES.data,
    icon: ShieldHalf,
  },
  {
    title: "Hash Generator",
    url: "/tools/hash-generator",
    description: "Generate secure cryptographic hashes locally.",
    category: CATEGORIES.data,
    icon: Fingerprint,
  },
  {
    title: "JSON Array Organizer",
    url: "/tools/json-array-sorter",
    description: "Sort and filter massive JSON arrays in real-time with dynamic controls.",
    category: CATEGORIES.data,
    icon: ListFilter,
  },
  {
    title: "JSON Formatter",
    url: "/tools/json-formatter",
    description: "Format, minify, and validate JSON payloads instantly.",
    category: CATEGORIES.data,
    icon: Braces,
  },
  {
    title: "JSONPath Sandbox",
    url: "/tools/jsonpath-sandbox",
    description: "Test and evaluate JSONPath queries against any JSON payload in real-time.",
    category: CATEGORIES.data,
    icon: SearchCode,
  },
  {
    title: "JSON Tree Viewer",
    url: "/tools/json-tree-viewer",
    description: "Explore large JSON payloads as a collapsible tree with path copy and search.",
    category: CATEGORIES.data,
    icon: Network,
  },
  {
    title: "JWT Decoder",
    url: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: CATEGORIES.data,
    icon: KeyRound,
  },
  {
    title: "Universal Decoder",
    url: "/tools/universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, or Snowflake ID — and decode it instantly.",
    category: CATEGORIES.data,
    icon: Scan,
  },
];

export const developmentTools: Tool[] = [
  {
    title: "AI Prompt Studio",
    url: "/tools/prompt-studio",
    description:
      "Write, inject variables, minify, and enhance LLM prompts with real-time token tracking.",
    category: CATEGORIES.development,
    icon: WandSparkles,
  },
  {
    title: "Code Screenshot",
    url: "/tools/code-screenshot",
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews.",
    category: CATEGORIES.development,
    icon: ImageDown,
  },
  {
    title: "Code Stash",
    url: "/tools/code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: CATEGORIES.development,
    icon: CodeXml,
  },
  {
    title: "Diff Viewer",
    url: "/tools/diff-viewer",
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    category: CATEGORIES.development,
    icon: FileDiff,
  },
  {
    title: "HTML to JSX",
    url: "/tools/html-to-jsx",
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    category: CATEGORIES.development,
    icon: Atom,
  },
  {
    title: ".gitignore Generator",
    url: "/tools/gitignore-generator",
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    category: CATEGORIES.development,
    icon: FileText,
  },
  {
    title: "JSDoc / TSDoc Generator",
    url: "/tools/jsdoc-generator",
    description:
      "Paste a TypeScript function signature and generate JSDoc or TSDoc with @param and @returns stubs.",
    category: CATEGORIES.development,
    icon: BookText,
  },
  {
    title: "Markdown Live Preview",
    url: "/tools/markdown-live-preview",
    description:
      "Write markdown with a side-by-side preview, view the generated HTML, and export to .md or .html.",
    category: CATEGORIES.development,
    icon: NotebookPen,
  },
  {
    title: "Markdown Table of Contents",
    url: "/tools/markdown-toc-generator",
    description:
      "Generate a nested Table of Contents from your Markdown document with automatic anchor links.",
    category: CATEGORIES.development,
    icon: ListOrdered,
  },
  {
    title: "Mermaid Live Editor",
    url: "/tools/mermaid-editor",
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    category: CATEGORIES.development,
    icon: GitBranch,
  },
  {
    title: "Mock Data Generator",
    url: "/tools/mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: CATEGORIES.development,
    icon: Database,
  },
  {
    title: "NLP Sandbox",
    url: "/tools/nlp-sandbox",
    description: "Simulate text cleaning, vectorization, and scaling pipelines with live output.",
    category: CATEGORIES.development,
    icon: BrainCircuit,
  },
  {
    title: "Regex Studio",
    url: "/tools/regex-studio",
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    category: CATEGORIES.development,
    icon: Regex,
  },
  {
    title: "Web Extractor",
    url: "/tools/web-extractor",
    description: "Extract meta tags, headings, and links from any public URL.",
    category: CATEGORIES.development,
    icon: Globe,
  },
];

export const devopsTools: Tool[] = [
  {
    title: "chmod Calculator",
    url: "/tools/chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid, synced across octal and symbolic formats.",
    category: CATEGORIES.devops,
    icon: Lock,
  },
  {
    title: "Cron Explorer",
    url: "/tools/cron-explorer",
    description:
      "Translate cron expressions to plain English, and visualize upcoming executions on a timeline.",
    category: CATEGORIES.devops,
    icon: CalendarClock,
  },
  {
    title: "curl Command Builder",
    url: "/tools/curl-builder",
    description:
      "Build curl commands from a form, or paste a curl command to parse it into structured fields.",
    category: CATEGORIES.devops,
    icon: Terminal,
  },
  {
    title: "Docker Compose Studio",
    url: "/tools/docker-compose",
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    category: CATEGORIES.devops,
    icon: Container,
  },
  {
    title: ".env File Diff & Merge",
    url: "/tools/env-diff",
    description:
      "Semantically compare two .env files to find missing keys, extra keys, and value mismatches.",
    category: CATEGORIES.devops,
    icon: FileDiff,
  },
  {
    title: "Git Command Cheatsheet",
    url: "/tools/git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: CATEGORIES.devops,
    icon: GitBranch,
  },
];

export const imageTools: Tool[] = [
  {
    title: "ASCII Diagram Editor",
    url: "/tools/ascii-diagram",
    description:
      "Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters.",
    category: CATEGORIES.imagesAssets,
    icon: Grid3X3,
  },
  {
    title: "Image Converter",
    url: "/tools/image-converter",
    description: "Batch convert, resize, and process images natively in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: ImageIcon,
  },
  {
    title: "Placeholder Generator",
    url: "/tools/placeholder-generator",
    description:
      "Generate custom placeholder images with the Canvas API, entirely in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: Frame,
  },
  {
    title: "QR Generator",
    url: "/tools/qr-generator",
    description: "Generate downloadable QR codes instantly.",
    category: CATEGORIES.imagesAssets,
    icon: QrCode,
  },
  {
    title: "SVG Optimizer",
    url: "/tools/svg-optimizer",
    description: "Minify and clean bloated SVG files.",
    category: CATEGORIES.imagesAssets,
    icon: FileImage,
  },
  {
    title: "SVG Path Viewer",
    url: "/tools/svg-path",
    description: "Preview and edit SVG 'd' paths with real-time visualization.",
    category: CATEGORIES.imagesAssets,
    icon: PenTool,
  },
];

export const networkTools: Tool[] = [
  {
    title: "HTTP Security Header Analyzer",
    url: "/tools/header-analyzer",
    description:
      "Grade your HTTP response headers against OWASP best practices and generate a Next.js config.",
    category: CATEGORIES.network,
    icon: ShieldCheck,
  },
  {
    title: "HTTP Status Reference",
    url: "/tools/http-status",
    description:
      "Every standard HTTP status code with descriptions, use cases, and category colour-coding.",
    category: CATEGORIES.network,
    icon: Globe2,
  },
  {
    title: "MAC Address Vendor Lookup",
    url: "/tools/mac-vendor-lookup",
    description: "Look up MAC address vendors by OUI with support for multiple formats.",
    category: CATEGORIES.network,
    icon: Wifi,
  },
  {
    title: "Open Graph Previewer",
    url: "/tools/og-preview",
    description: "Preview how your link card will appear when shared on Twitter/X and LinkedIn.",
    category: CATEGORIES.network,
    icon: Globe,
  },
  {
    title: "Subnet / CIDR Calculator",
    url: "/tools/subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: CATEGORIES.network,
    icon: Network,
  },
  {
    title: "URL Parser & Builder",
    url: "/tools/url-parser",
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    category: CATEGORIES.network,
    icon: Link,
  },
];

export const schemaTools: Tool[] = [
  {
    title: "Drizzle Schema Studio",
    url: "/tools/drizzle-schema-studio",
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    category: CATEGORIES.schemas,
    icon: Database,
  },
  {
    title: "JSON Schema Studio",
    url: "/tools/json-schema-studio",
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    category: CATEGORIES.schemas,
    icon: FileJson,
  },
  {
    title: "Mongo Aggregation Builder",
    url: "/tools/mongo-pipeline-builder",
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    category: CATEGORIES.schemas,
    icon: Layers,
  },
  {
    title: "SQL Formatter",
    url: "/tools/sql-formatter",
    description: "Prettify raw SQL queries with proper indentation and capitalized keywords.",
    category: CATEGORIES.schemas,
    icon: Table,
  },
];

export const typographyTools: Tool[] = [
  {
    title: "CSV to Markdown Table",
    url: "/tools/csv-to-markdown",
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    category: CATEGORIES.typography,
    icon: TableProperties,
  },
  {
    title: "String Case Converter",
    url: "/tools/string-case-converter",
    description: "Convert text between different naming conventions and typographical styles.",
    category: CATEGORIES.typography,
    icon: Type,
  },
  {
    title: "Text Analyzer",
    url: "/tools/text-analyzer",
    description: "Analyze text for word counts, bytes, and estimated LLM tokens.",
    category: CATEGORIES.typography,
    icon: FileText,
  },
  {
    title: "Document Extractor",
    url: "/tools/document-extractor",
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files. Optional rich editor, YAML frontmatter, and .md download.",
    category: CATEGORIES.typography,
    icon: FileText,
  },
];

export const uiStyling: Tool[] = [
  {
    title: "Border Radius Previewer",
    url: "/tools/border-radius",
    description:
      "Visually configure CSS border-radius with per-corner sliders, presets, and live shape preview.",
    category: CATEGORIES.uiStyling,
    icon: Square,
  },
  {
    title: "Color Palette Generator",
    url: "/tools/color-palette-generator",
    description:
      "Generate complementary, analogous, triadic, and monochromatic palettes from a base color.",
    category: CATEGORIES.uiStyling,
    icon: Palette,
  },
  {
    title: "Color Space Converter",
    url: "/tools/color-converter",
    description: "Convert colors between HEX, RGB, HSL, OKLCH, and more.",
    category: CATEGORIES.uiStyling,
    icon: Palette,
  },
  {
    title: "CSS Animation Builder",
    url: "/tools/animation-builder",
    description:
      "Build CSS @keyframes animations visually with live preview and generated CSS output.",
    category: CATEGORIES.uiStyling,
    icon: Play,
  },
  {
    title: "CSS Aspect-Ratio Calculator",
    url: "/tools/aspect-ratio",
    description:
      "Calculate CSS aspect-ratio, Tailwind utility, and legacy padding-bottom values for any dimensions.",
    category: CATEGORIES.uiStyling,
    icon: Ratio,
  },
  {
    title: "Cubic Bezier Editor",
    url: "/tools/cubic-bezier",
    description:
      "Design custom CSS easing curves with draggable control points and a live preview.",
    category: CATEGORIES.uiStyling,
    icon: PenTool,
  },
  {
    title: "Glassmorphism Generator",
    url: "/tools/glassmorphism-generator",
    description: "Generate beautiful glassmorphism UI elements with backdrop blur.",
    category: CATEGORIES.uiStyling,
    icon: Layers,
  },
  {
    title: "GSAP Builder",
    url: "/tools/gsap-builder",
    description: "Visually build GSAP animations and generate optimized React 19 boilerplate.",
    category: CATEGORIES.uiStyling,
    icon: Wand2,
  },
  {
    title: "Layout Visualizer",
    url: "/tools/layout-visualizer",
    description: "Explore Tailwind Flex and Grid layout properties interactively.",
    category: CATEGORIES.uiStyling,
    icon: LayoutGrid,
  },
  {
    title: "Shadow Builder",
    url: "/tools/box-shadow-builder",
    description: "Visually generate CSS box-shadow styles with live preview.",
    category: CATEGORIES.uiStyling,
    icon: Square,
  },
  {
    title: "Tailwind Extractor Studio",
    url: "/tools/tailwind-extractor",
    description:
      "Extract inline Tailwind classes from JSX into @apply-based semantic CSS components.",
    category: CATEGORIES.uiStyling,
    icon: Scissors,
  },
  {
    title: "Tailwind CSS Cheatsheet",
    url: "/tools/tailwind-cheatsheet",
    description:
      "A searchable, filterable reference of the most-used Tailwind utility classes. Click any class to copy it.",
    category: CATEGORIES.uiStyling,
    icon: Wind,
  },
  {
    title: "Tailwind Shades",
    url: "/tools/tailwind-shades",
    description: "Generate a full 50–950 Tailwind color scale from a single hex.",
    category: CATEGORIES.uiStyling,
    icon: Palette,
  },
  {
    title: "WCAG Contrast Checker",
    url: "/tools/contrast-checker",
    description: "Check foreground/background contrast ratios against WCAG AA and AAA standards.",
    category: CATEGORIES.uiStyling,
    icon: Eye,
  },
];

// Internal Tools
export const internalTools: Tool[] = [
  ...calculatorTools,
  ...dataTools,
  ...developmentTools,
  ...devopsTools,
  ...imageTools,
  ...networkTools,
  ...schemaTools,
  ...typographyTools,
  ...uiStyling,
];
