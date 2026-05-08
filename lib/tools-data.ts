import {

  AsteriskIcon,
  BinaryIcon,
  BookOpenTextIcon,
  BracketsCurlyIcon,

  CircuitryIcon,
  ClockIcon,
  CodeIcon,

  DatabaseIcon,


  FileCssIcon,
  FileCsvIcon,
  FileImageIcon,
  FileJsxIcon,
  FileMdIcon,
  FilesIcon,
  FileSqlIcon,
  FileSvgIcon,
  FileTxtIcon,
  FingerprintIcon,
  FlaskIcon,
  FlowArrowIcon,
  GitBranchIcon,
  GlobeHemisphereEastIcon,
  GlobeIcon,
  GridNineIcon,
  ImageIcon,
  KeyIcon,
  LayoutIcon,
  LinkIcon,
  LockIcon,
  MagicWandIcon,
  MarkdownLogoIcon,
  NetworkIcon,
  PaletteIcon,
  PasswordIcon,
  PlaceholderIcon,

  PlusMinusIcon,
  QrCodeIcon,
  RssIcon,
  ScalesIcon,
  ScanIcon,

  ShieldCheckeredIcon,
  ShieldCheckIcon,
  ShippingContainerIcon,

  SwatchesIcon,
  TerminalWindowIcon,
  TextTIcon,
} from "@phosphor-icons/react/ssr";

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
    highlight: "Converter",
    url: "/tools/unit-converter",
    description:
      "Convert between units of length, weight, data, temperature, speed, area and volume.",
    category: CATEGORIES.calculators,
    icon: ScalesIcon,
  },
  {
    title: "Time Calculator",
    highlight: "Calculator",
    url: "/tools/time-calculator",
    description:
      "Convert Unix timestamps, ISO dates, and local time. Timezone viewer and date arithmetic.",
    category: CATEGORIES.calculators,
    icon: ClockIcon,
  },
  {
    title: "Base Converter",
    highlight: "Converter",
    url: "/tools/base-converter",
    description:
      "Convert between decimal, hex, binary, and octal with a 16-bit toggle grid and bitwise ops.",
    category: CATEGORIES.calculators,
    icon: BinaryIcon,
  },
];

export const dataTools: Tool[] = [
  {
    title: "Base64 Image Decoder",
    url: "/tools/base64-image-decoder",
    description: "Decode and preview base64-encoded images locally.",
    category: CATEGORIES.data,
    icon: FileImageIcon,
  },
  {
    title: "Encoder / Decoder",
    highlight: "Decoder",
    url: "/tools/encoder-decoder",
    description: "Convert strings between Base64, URL-encoded, and Hex encoding.",
    category: CATEGORIES.data,
    icon: ShieldCheckeredIcon,
  },
  {
    title: "Hash Generator",
    highlight: "Generator",
    url: "/tools/hash-generator",
    description:
      "SHA-1, SHA-256, SHA-384, and SHA-512 digests computed locally via the Web Crypto API.",
    category: CATEGORIES.data,
    icon: FingerprintIcon,
  },
  {
    title: "JSON Studio",
    highlight: "Studio",
    url: "/tools/json-studio",
    description: "Format, browse, query, and organize JSON — all in one place.",
    category: CATEGORIES.data,
    icon: BracketsCurlyIcon,
  },
  {
    title: "JWT Decoder",
    highlight: "Decoder",
    url: "/tools/jwt-decoder",
    description: "Decode and inspect JSON Web Tokens locally in your browser.",
    category: CATEGORIES.data,
    icon: KeyIcon,
  },
  {
    title: "Universal Decoder",
    highlight: "Decoder",
    url: "/tools/universal-decoder",
    description:
      "Paste any mystery string — JWT, Unix timestamp, UUID, MongoDB ObjectId, ISO date, or Snowflake ID — and decode it instantly.",
    category: CATEGORIES.data,
    icon: ScanIcon,
  },
];

export const developmentTools: Tool[] = [
  {
    title: "AI Prompt Studio",
    highlight: "Studio",
    url: "/tools/ai-prompt-studio",
    description:
      "Write, inject variables, minify, and enhance LLM prompts with real-time token tracking.",
    category: CATEGORIES.development,
    icon: FlaskIcon,
  },
  {
    title: "Code Screenshot",
    highlight: "Screenshot",
    url: "/tools/code-screenshot",
    description:
      "Turn any code snippet into a styled screenshot for docs, social posts, or PR reviews. Powered by Shiki.",
    category: CATEGORIES.development,
    icon: ImageIcon,
  },
  {
    title: "Code Stash",
    highlight: "Stash",
    url: "/tools/code-stash",
    description: "A curated library of developer snippets and configurations.",
    category: CATEGORIES.development,
    icon: CodeIcon,
  },
  {
    title: "Diff Viewer",
    highlight: "Viewer",
    url: "/tools/diff-viewer",
    description: "Compare two text blocks and visualize additions, deletions, and changes.",
    category: CATEGORIES.development,
    icon: PlusMinusIcon,
  },
  {
    title: ".gitignore Generator",
    highlight: "Generator",
    url: "/tools/gitignore-generator",
    description:
      "Generate .gitignore files for your project with common patterns for popular stacks.",
    category: CATEGORIES.development,
    icon: GitBranchIcon,
  },
  {
    title: "HTML to JSX",
    highlight: "JSX",
    url: "/tools/html-to-jsx",
    description:
      "Convert HTML to React-ready JSX with renamed attributes, camelCase events, and style objects.",
    category: CATEGORIES.development,
    icon: FileJsxIcon,
  },
  {
    title: "JSDoc / TSDoc Generator",
    highlight: "Generator",
    url: "/tools/jsdoc-generator",
    description:
      "Paste a JavaScript or TypeScript function signature and generate JSDoc or TSDoc with @param, @returns, and @throws stubs.",
    category: CATEGORIES.development,
    icon: FilesIcon,
  },
  {
    title: "Markdown Live Preview",
    highlight: "Preview",
    url: "/tools/markdown-live-preview",
    description:
      "Write markdown with a real-time side-by-side preview. Supports GFM tables, task lists, and more.",
    category: CATEGORIES.development,
    icon: MarkdownLogoIcon,
  },
  {
    title: "Mermaid Live Editor",
    highlight: "Live Editor",
    url: "/tools/mermaid-editor",
    description:
      "Write Mermaid diagrams with a live SVG preview. Supports flowcharts, sequence, ER, and more.",
    category: CATEGORIES.development,
    icon: FlowArrowIcon,
  },
  {
    title: "Mock Data Generator",
    highlight: "Generator",
    url: "/tools/mock-data-generator",
    description: "Generate structured dummy JSON data for testing.",
    category: CATEGORIES.development,
    icon: DatabaseIcon,
  },
  {
    title: "NLP Sandbox",
    highlight: "Sandbox",
    url: "/tools/nlp-sandbox",
    description: "Simulate text cleaning, vectorization, and scaling pipelines with live output.",
    category: CATEGORIES.development,
    icon: CircuitryIcon,
  },
  {
    title: "Regex Studio",
    highlight: "Studio",
    url: "/tools/regex-studio",
    description:
      "Build, visualize, test, and browse a curated library of production-ready regular expressions.",
    category: CATEGORIES.development,
    icon: AsteriskIcon,
  },
  {
    title: "Web Extractor",
    highlight: "Extractor",
    url: "/tools/web-extractor",
    description: "Extract meta tags, headings, and links from any public URL.",
    category: CATEGORIES.development,
    icon: GlobeIcon,
  },
];

export const devopsTools: Tool[] = [
  {
    title: "chmod Calculator",
    url: "/tools/chmod-calculator",
    description:
      "Calculate Unix file permissions with a click-to-toggle grid, synced across octal and symbolic formats.",
    category: CATEGORIES.devops,
    icon: LockIcon,
  },
  {
    title: "Cron Explorer",
    url: "/tools/cron-explorer",
    description:
      "Translate cron expressions to plain English, and visualize upcoming executions on a timeline.",
    category: CATEGORIES.devops,
    icon: PasswordIcon,
  },
  {
    title: "curl Command Builder",
    url: "/tools/curl-builder",
    description:
      "Build curl commands from a form, or paste a curl command to parse it into structured fields.",
    category: CATEGORIES.devops,
    icon: TerminalWindowIcon,
  },
  {
    title: "Docker Compose Studio",
    url: "/tools/docker-compose",
    description:
      "Build compose files visually or convert complex 'docker run' commands into YAML instantly.",
    category: CATEGORIES.devops,
    icon: ShippingContainerIcon,
  },
  {
    title: "Git Command Cheatsheet",
    url: "/tools/git-cheatsheet",
    description:
      "A searchable reference of ~70 git commands, organised by intent with danger-level indicators.",
    category: CATEGORIES.devops,
    icon: GitBranchIcon,
  },
];

export const imageTools: Tool[] = [
  {
    title: "ASCII Studio",
    url: "/tools/ascii-studio",
    description:
      "Generate ASCII banners, folder trees, markdown tables, glitch text, and convert images to ASCII art.",
    category: CATEGORIES.imagesAssets,
    highlight: "Studio",
    icon: TerminalWindowIcon,
  },
  {
    title: "Image Converter",
    url: "/tools/image-converter",
    description: "Batch convert, resize, and process images natively in your browser.",
    category: CATEGORIES.imagesAssets,
    icon: ImageIcon,
  },
  {
    title: "QR Generator",
    url: "/tools/qr-generator",
    description: "Generate downloadable QR codes instantly.",
    category: CATEGORIES.imagesAssets,
    icon: QrCodeIcon,
  },
  {
    title: "SVG Optimizer",
    url: "/tools/svg-optimizer",
    description: "Minify and clean bloated SVG files with multipass optimization..",
    category: CATEGORIES.imagesAssets,
    icon: FileSvgIcon,
  },
  {
    title: "SVG Path Viewer Editor",
    highlight: "Editor",
    url: "/tools/svg-path",
    description:
      "Preview and edit raw SVG 'd' paths with real-time visualization and customizable styling.",
    category: CATEGORIES.imagesAssets,
    icon: FileSvgIcon,
  },
];

export const networkTools: Tool[] = [
  {
    title: "HTTP Security Header Analyzer",
    url: "/tools/http-security-header-analyzer",
    description:
      "Grade your HTTP response headers against OWASP best practices and generate a Next.js config.",
    category: CATEGORIES.network,
    icon: ShieldCheckIcon,
  },
  {
    title: "HTTP Status Reference",
    url: "/tools/http-status",
    description:
      "Every standard HTTP status code with descriptions, use cases, and category colour-coding.",
    category: CATEGORIES.network,
    icon: GlobeHemisphereEastIcon,
  },
  {
    title: "Subnet / CIDR Calculator",
    url: "/tools/subnet-calculator",
    description:
      "Calculate network address, broadcast, subnet mask, and host ranges from CIDR notation.",
    category: CATEGORIES.network,
    icon: NetworkIcon,
  },
  {
    title: "URL Parser & Builder",
    url: "/tools/url-parser",
    description: "Parse, analyze, and rebuild URLs with editable query parameters.",
    category: CATEGORIES.network,
    icon: LinkIcon,
  },
];

export const schemaTools: Tool[] = [
  {
    title: "Drizzle Schema Studio",
    highlight: "Studio",
    url: "/tools/drizzle-schema-studio",
    description:
      "Convert SQL CREATE TABLE statements or Prisma schema models into Drizzle ORM schemas.",
    category: CATEGORIES.schemas,
    icon: DatabaseIcon,
  },
  {
    title: "JSON Schema Studio",
    highlight: "Studio",
    url: "/tools/json-schema-studio",
    description:
      "Convert JSON payloads into strict TypeScript interfaces, Zod schemas, Pydantic models, and generic JSON Schemas.",
    category: CATEGORIES.schemas,
    icon: BracketsCurlyIcon,
  },
  {
    title: "Mongo Aggregation Pipeline Builder",
    highlight: "Builder",
    url: "/tools/mongo-pipeline-builder",
    description: "Visually scaffold complex MongoDB aggregation pipelines with live JSON output.",
    category: CATEGORIES.schemas,
    icon: DatabaseIcon,
  },
  {
    title: "SQL Query Formatter",
    highlight: "Formatter",
    url: "/tools/sql-formatter",
    description:
      "Prettify and format raw SQL queries with proper indentation and capitalized keywords.",
    category: CATEGORIES.schemas,
    icon: FileSqlIcon,
  },
];

export const typographyTools: Tool[] = [
  {
    title: "CSV to Markdown Table",
    url: "/tools/csv-to-markdown",
    description: "Convert CSV and spreadsheet data into beautifully formatted Markdown tables.",
    category: CATEGORIES.typography,
    icon: FileCsvIcon,
  },
  {
    title: "String Case Converter",
    url: "/tools/string-case-converter",
    description: "Convert text between different naming conventions and typographical styles.",
    category: CATEGORIES.typography,
    icon: TextTIcon,
  },
  {
    title: "Text Analyzer",
    url: "/tools/text-analyzer",
    description: "Analyze text for word counts, bytes, and estimated LLM tokens.",
    category: CATEGORIES.typography,
    icon: FileTxtIcon,
  },
  {
    title: "Document Extractor",
    url: "/tools/document-extractor",
    description:
      "Extract clean text or LLM-ready Markdown from PDF, DOCX, HTML, CSV, and text files. Optional rich editor, YAML frontmatter, and .md download.",
    category: CATEGORIES.typography,
    icon: BookOpenTextIcon,
  },
];

export const uiStyling: Tool[] = [
  {
    title: "Color Studio",
    url: "/tools/color-studio",
    description:
      "Convert between HEX/RGB/HSL/OKLCH, generate harmonic palettes, and check WCAG contrast — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: PaletteIcon,
  },
  {
    title: "CSS Aspect-Ratio Calculator",
    highlight: "Calculator",
    url: "/tools/aspect-ratio",
    description:
      "Calculate CSS aspect-ratio, Tailwind utility, and legacy padding-bottom values for any dimensions.",
    category: CATEGORIES.uiStyling,
    icon: FileCssIcon,
  },
  {
    title: "CSS Studio",
    url: "/tools/css-studio",
    description:
      "Border-radius, box-shadow, glassmorphism, cubic-bezier, CSS keyframes, and GSAP animations — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: MagicWandIcon,
  },
  {
    title: "Layout Visualizer",
    url: "/tools/layout-visualizer",
    description: "Explore Tailwind Flex and Grid layout properties interactively.",
    category: CATEGORIES.uiStyling,
    icon: LayoutIcon,
  },
  {
    title: "Tailwind Studio",
    url: "/tools/tailwind-studio",
    description:
      "Search Tailwind utilities, extract JSX classes into @apply CSS, and generate 50–950 color scales — all in one tabbed studio.",
    category: CATEGORIES.uiStyling,
    icon: SwatchesIcon,
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
