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

export const CATEGORIES = {
  data: "Data & Formats",
  development: "Development & Code",
  devops: "DevOps",
  imagesAssets: "Images & Assets",
  network: "Network & Security",
  system: "System & OS",
  typography: "Typography & Text",
  uiStyling: "UI & Styling",
} as const;

export const dataTools: Tool[] = [
  {
    title: "JWT Decoder",
    url: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: CATEGORIES.data,
    icon: KeyRound,
  },
  {
    title: "JSON Formatter",
    url: "/tools/json-formatter",
    description: "Format, minify, and validate JSON payloads instantly.",
    category: CATEGORIES.data,
    icon: Braces,
  },
  {
    title: "JSON to TS",
    url: "/tools/json-to-ts",
    description: "Convert JSON objects into TypeScript interfaces with full type inference.",
    category: CATEGORIES.data,
    icon: Braces,
  },
  {
    title: "SQL Formatter",
    url: "/tools/sql-formatter",
    description: "Prettify raw SQL queries with proper indentation and capitalized keywords.",
    category: CATEGORIES.data,
    icon: Table,
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
    title: "Base64 Image Decoder",
    url: "/tools/base64-image-decoder",
    description: "Decode and preview base64-encoded images locally.",
    category: CATEGORIES.data,
    icon: Image,
  },
  {
    title: "Universal Decoder",
    url: "/tools/universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, or Snowflake ID — and decode it instantly.",
    category: CATEGORIES.data,
    icon: Scan,
  },
  {
    title: "MongoDB ObjectId Decoder",
    url: "/tools/mongo-decoder",
    description:
      "Decode a MongoDB ObjectId into its timestamp, machine ID, process ID, and counter.",
    category: CATEGORIES.data,
    icon: Hash,
  },
];

export const developmentTools: Tool[] = [
  {
    title: "AI Prompt Enhancer",
    url: "/tools/prompt-enhancer",
    description: "Dynamic templates to generate high-quality AI prompts.",
    category: "Utilities",
    icon: Sparkles,
  },
  {
    title: "Code Stash",
    url: "/tools/code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: "Utilities",
    icon: CodeXml,
  },
  {
    title: "Mock Data Generator",
    url: "/tools/mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: "Utilities",
    icon: Database,
  },
  {
    title: "Regex Tester",
    url: "/tools/regex-tester",
    description: "Test and debug regular expressions with real-time match highlighting.",
    category: "Utilities",
    icon: Regex,
  },
  {
    title: "Regex Pattern Library",
    url: "/tools/regex-library",
    description:
      "A curated library of 30+ production-ready regex patterns with match examples and one-click copy.",
    category: "Utilities",
    icon: BookOpen,
  },
];

export const devopsTools: Tool[] = [
  {
    title: "Docker Compose Builder",
    url: "/tools/docker-compose",
    description:
      "Add services from templates, configure ports, environment variables, and volumes to generate a docker-compose.yml.",
    category: CATEGORIES.devops,
    icon: Container,
  },
  {
    title: "Git Command Cheatsheet",
    url: "/tools/git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: CATEGORIES.devops,
    icon: GitBranch,
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
    title: ".env File Diff & Merge",
    url: "/tools/env-diff",
    description:
      "Semantically compare two .env files to find missing keys, extra keys, and value mismatches.",
    category: CATEGORIES.devops,
    icon: FileDiff,
  },
];

export const imageTools: Tool[] = [
  {
    title: "Omni-Image Converter",
    url: "/tools/image-converter",
    description: "Convert images locally between WebP, PNG, and JPEG formats.",
    category: CATEGORIES.imagesAssets,
    icon: ImageIcon,
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
    title: "Subnet / CIDR Calculator",
    url: "/tools/subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: CATEGORIES.network,
    icon: Network,
  },
  {
    title: "Open Graph Previewer",
    url: "/tools/og-preview",
    description: "Preview how your link card will appear when shared on Twitter/X and LinkedIn.",
    category: CATEGORIES.network,
    icon: Globe,
  },
];

export const systemTools: Tool[] = [
  {
    title: "chmod Calculator",
    url: "/tools/chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid, synced across octal and symbolic formats.",
    category: CATEGORIES.system,
    icon: Lock,
  },
  {
    title: "Crontab Schedule Visualizer",
    url: "/tools/cron-visualizer",
    description:
      "See exactly when your cron jobs fire with a timeline and table of the next 20 executions.",
    category: CATEGORIES.system,
    icon: CalendarClock,
  },
  {
    title: "Cron Translator",
    url: "/tools/cron-translator",
    description: "Convert cron expressions to human-readable text and upcoming dates.",
    category: CATEGORIES.system,
    icon: Clock,
  },
  {
    title: "Unix Timestamp Converter",
    url: "/tools/timestamp-converter",
    description: "Convert Unix epoch timestamps to human-readable dates.",
    category: CATEGORIES.system,
    icon: Clock,
  },
];

export const typographyTools: Tool[] = [
  {
    title: "Universal Document Extractor",
    url: "/tools/document-extractor",
    description: "Extract clean text/markdown from PDF, DOCX, CSV, and TXT files.",
    category: CATEGORIES.typography,
    icon: FileText,
  },
  {
    title: "Text Analyzer",
    url: "/tools/text-analyzer",
    description: "Analyze text for word counts, bytes, and estimated LLM tokens.",
    category: CATEGORIES.typography,
    icon: FileText,
  },

  {
    title: "ASCII Diagram Editor",
    url: "/tools/ascii-diagram",
    description:
      "Draw boxes and add text on a character grid. Outputs clean ASCII art using Unicode box-drawing characters.",
    category: CATEGORIES.typography,
    icon: Grid3X3,
  },
];

export const uiStyling: Tool[] = [
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
    title: "Color Space Converter",
    url: "/tools/color-converter",
    description: "Convert colors between HEX, RGB, HSL, OKLCH, and more.",
    category: CATEGORIES.uiStyling,
    icon: Palette,
  },
  {
    title: "Glassmorphism Generator",
    url: "/tools/glassmorphism-generator",
    description: "Generate beautiful glassmorphism UI elements with backdrop blur.",
    category: CATEGORIES.uiStyling,
    icon: Layers,
  },
  {
    title: "WCAG Contrast Checker",
    url: "/tools/contrast-checker",
    description: "Check foreground/background contrast ratios against WCAG AA and AAA standards.",
    category: CATEGORIES.uiStyling,
    icon: Eye,
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
    title: "Layout Visualizer",
    url: "/tools/layout-visualizer",
    description: "Explore Tailwind Flex and Grid layout properties interactively.",
    category: CATEGORIES.uiStyling,
    icon: LayoutGrid,
  },
  {
    title: "Border Radius Previewer",
    url: "/tools/border-radius",
    description:
      "Visually configure CSS border-radius with per-corner sliders, presets, and live shape preview.",
    category: CATEGORIES.uiStyling,
    icon: Square,
  },
];

// Internal Tools
export const internalTools: Tool[] = [
  ...dataTools,
  ...developmentTools,
  ...devopsTools,
  ...imageTools,
  ...networkTools,
  ...systemTools,
  ...typographyTools,
  ...uiStyling,
];
